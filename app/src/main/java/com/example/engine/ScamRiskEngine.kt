package com.example.engine

import com.example.BuildConfig
import com.example.model.RiskLevel
import com.example.model.ScamAnalysisResult
import com.example.model.UrlAnalysis
import com.example.network.Content
import com.example.network.GeminiRequest
import com.example.network.GeminiScamAnalysisJson
import com.example.network.GenerationConfig
import com.example.network.Part
import com.example.network.RetrofitClient
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ScamRiskEngine {

    private val moshi: Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()
    private val analysisAdapter = moshi.adapter(GeminiScamAnalysisJson::class.java)

    suspend fun analyzeMessage(rawInput: String): ScamAnalysisResult = withContext(Dispatchers.IO) {
        val sanitized = rawInput.trim()
        require(sanitized.isNotEmpty()) { "Message cannot be empty." }

        // Step 1: Run deterministic Heuristic Rule Engine
        val heuristicDetections = HeuristicRuleEngine.runDetections(sanitized)
        val extractedUrls = HeuristicRuleEngine.extractUrls(sanitized)
        val urlAnalyses = HeuristicRuleEngine.analyzeUrls(extractedUrls)

        var heuristicScore = 0
        val heuristicSignals = mutableListOf<String>()
        for (detection in heuristicDetections) {
            heuristicScore += detection.severityPoints
            heuristicSignals.add("${detection.triggerName}: ${detection.description}")
        }
        if (urlAnalyses.any { it.suspicious }) {
            heuristicScore += 25
            heuristicSignals.add("Suspicious Link: One or more URLs show evasive or spoofing structure.")
        }
        heuristicScore = heuristicScore.coerceIn(0, 100)

        // Step 2: Attempt AI Analysis via Gemini API
        val aiResult: GeminiScamAnalysisJson? = queryGemini(sanitized, extractedUrls)

        // Step 3: Calibrate & Fuse Heuristic + AI output
        fuseAndCalibrate(
            sanitized = sanitized,
            heuristicScore = heuristicScore,
            heuristicSignals = heuristicSignals,
            heuristicDetections = heuristicDetections,
            urlAnalyses = urlAnalyses,
            aiResult = aiResult
        )
    }

    private suspend fun queryGemini(message: String, urls: List<String>): GeminiScamAnalysisJson? {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return null
        }

        val systemPrompt = """
            You are ScamShield AI, an expert cybersecurity fraud detection analyst.
            Analyze the following message for scam risk.
            Return ONLY a valid JSON object matching this schema:
            {
              "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
              "risk_score": 0 to 100,
              "category": "e.g. Banking / Phishing, Delivery Scam, Job Offer Fraud, Lottery / Advance Fee, Impersonation, Legitimate / Low Risk",
              "summary": "Brief 1-sentence objective summary of the analysis.",
              "red_flags": ["concise point 1", "concise point 2", "concise point 3"],
              "recommended_action": "Clear, actionable safety advice for the user."
            }
            Do not provide false certainty. Do not claim messages are 100% safe or 100% scam.
        """.trimIndent()

        val userPrompt = """
            Analyze this message for scam and social engineering risks:
            <message_to_analyze>
            $message
            </message_to_analyze>
            Detected URLs: ${urls.joinToString(", ")}
        """.trimIndent()

        val request = GeminiRequest(
            contents = listOf(Content(parts = listOf(Part(text = userPrompt)))),
            systemInstruction = Content(parts = listOf(Part(text = systemPrompt))),
            generationConfig = GenerationConfig(temperature = 0.2f, responseMimeType = "application/json")
        )

        return try {
            val response = RetrofitClient.service.generateContent(apiKey, request)
            val jsonText = response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text
            if (!jsonText.isNullOrBlank()) {
                val cleanedJson = jsonText.trim().removePrefix("```json").removePrefix("```").removeSuffix("```").trim()
                analysisAdapter.fromJson(cleanedJson)
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }

    private fun fuseAndCalibrate(
        sanitized: String,
        heuristicScore: Int,
        heuristicSignals: List<String>,
        heuristicDetections: List<com.example.model.HeuristicDetection>,
        urlAnalyses: List<UrlAnalysis>,
        aiResult: GeminiScamAnalysisJson?
    ): ScamAnalysisResult {
        val aiScore = aiResult?.riskScore ?: heuristicScore

        // Weighted fusion: Heuristics 40% + AI 60% if AI exists, else 100% Heuristics
        var fusedScore = if (aiResult != null) {
            (heuristicScore * 0.4 + aiScore * 0.6).toInt()
        } else {
            heuristicScore
        }

        // Hard security ceilings & floors
        val hasOtpRequest = heuristicDetections.any { it.triggerName.contains("OTP", ignoreCase = true) }
        val hasBankingThreat = heuristicDetections.any { it.triggerName.contains("Banking", ignoreCase = true) }
        val hasSuspiciousUrl = urlAnalyses.any { it.suspicious }

        if (hasOtpRequest || (hasBankingThreat && hasSuspiciousUrl)) {
            // Absolute floor: credential/OTP theft cannot be scored low or medium
            fusedScore = fusedScore.coerceAtLeast(85)
        } else if (heuristicDetections.isEmpty() && !hasSuspiciousUrl && (aiResult?.riskScore ?: 0) < 30) {
            // Absence of triggers puts low ceiling
            fusedScore = fusedScore.coerceAtMost(25)
        }
        fusedScore = fusedScore.coerceIn(0, 100)

        // Classify Risk Level
        val riskLevel = when {
            fusedScore >= 90 -> RiskLevel.CRITICAL
            fusedScore >= 70 -> RiskLevel.HIGH
            fusedScore >= 30 -> RiskLevel.MEDIUM
            else -> RiskLevel.LOW
        }

        // Resolve Category
        val category = if (!aiResult?.category.isNullOrBlank()) {
            aiResult!!.category!!
        } else when {
            hasOtpRequest -> "Credential & OTP Phishing"
            hasBankingThreat -> "Banking & Financial Fraud"
            hasSuspiciousUrl -> "Malicious / Deceptive Link"
            heuristicScore >= 30 -> "Suspicious Solicitations"
            else -> "Personal or Standard Communication"
        }

        // Aggregate Red Flags (avoiding empty or duplicates)
        val redFlags = mutableListOf<String>()
        if (aiResult?.redFlags != null && aiResult.redFlags.isNotEmpty()) {
            redFlags.addAll(aiResult.redFlags)
        }
        for (det in heuristicDetections) {
            val summaryText = "${det.triggerName}: ${det.description}"
            if (redFlags.none { it.contains(det.triggerName, ignoreCase = true) }) {
                redFlags.add(summaryText)
            }
        }
        for (urlAn in urlAnalyses.filter { it.suspicious }) {
            redFlags.add("Suspicious Link Pattern: ${urlAn.reason}")
        }
        if (redFlags.isEmpty()) {
            redFlags.add("No immediate deceptive patterns, credential requests, or urgent lures detected.")
        }

        // Recommended Action
        val recommendedAction = if (!aiResult?.recommendedAction.isNullOrBlank()) {
            aiResult!!.recommendedAction!!
        } else when (riskLevel) {
            RiskLevel.CRITICAL -> "DO NOT click any link or send any OTP/credentials. Block this sender and contact your official institution directly."
            RiskLevel.HIGH -> "Treat with high caution. Do not use phone numbers or links within the message. Verify via official websites or apps."
            RiskLevel.MEDIUM -> "Exercise caution. Do not share personal details without independently verifying the sender's identity."
            RiskLevel.LOW -> "No major scam indicators detected. Practice standard cyber vigilance when clicking links or responding."
        }

        val summary = if (!aiResult?.summary.isNullOrBlank()) {
            aiResult!!.summary!!
        } else {
            when (riskLevel) {
                RiskLevel.CRITICAL -> "Extremely suspicious message requesting confidential security credentials or immediate financial action."
                RiskLevel.HIGH -> "High probability of social engineering or phishing intended to solicit actions under pressure."
                RiskLevel.MEDIUM -> "Contains some suspicious indicators or unverified links warranting caution."
                RiskLevel.LOW -> "Appears to be standard conversational or transactional text with no obvious scam indicators."
            }
        }

        return ScamAnalysisResult(
            riskLevel = riskLevel,
            estimatedRiskScore = fusedScore,
            category = category,
            summary = summary,
            redFlags = redFlags.take(7),
            recommendedAction = recommendedAction,
            detectedUrls = urlAnalyses,
            heuristicSignals = heuristicSignals
        )
    }
}
