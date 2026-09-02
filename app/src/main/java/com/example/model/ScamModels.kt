package com.example.model

enum class RiskLevel(val label: String) {
    LOW("LOW RISK"),
    MEDIUM("MEDIUM RISK"),
    HIGH("HIGH RISK"),
    CRITICAL("CRITICAL RISK")
}

data class UrlAnalysis(
    val url: String,
    val suspicious: Boolean,
    val reason: String
)

data class HeuristicDetection(
    val triggerName: String,
    val description: String,
    val severityPoints: Int
)

data class ScamAnalysisResult(
    val riskLevel: RiskLevel,
    val estimatedRiskScore: Int, // 0 - 100
    val category: String,
    val summary: String,
    val redFlags: List<String>,
    val recommendedAction: String,
    val detectedUrls: List<UrlAnalysis> = emptyList(),
    val heuristicSignals: List<String> = emptyList()
) {
    // True if fraud/scam detected (risk score >= 50% or High/Critical risk)
    val isFraud: Boolean
        get() = estimatedRiskScore >= 50 || riskLevel == RiskLevel.HIGH || riskLevel == RiskLevel.CRITICAL

    val riskPercentageString: String
        get() = "$estimatedRiskScore%"

    val verdictLabel: String
        get() = if (isFraud) "FRAUD DETECTED" else "SAFE / VERIFIED"
}

data class ScanHistoryItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val timestamp: Long = System.currentTimeMillis(),
    val messageSnippet: String,
    val fullMessage: String,
    val result: ScamAnalysisResult
)
