package com.example.engine

import com.example.model.HeuristicDetection
import com.example.model.UrlAnalysis
import java.net.URI
import java.util.regex.Pattern

object HeuristicRuleEngine {

    private val URL_REGEX = Pattern.compile(
        "(?i)\\b(?:https?://|www\\.)[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"
    )

    // Keywords and expressions by threat category
    private val OTP_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(otp|one[ -]?time[ -]?password|verification[ -]?code|2fa|security[ -]?code)\\b"),
        Pattern.compile("(?i)\\b(send|share|reply with|provide)\\b.*\\b(otp|code|pin|password)\\b")
    )

    private val BANKING_CREDENTIALS = listOf(
        Pattern.compile("(?i)\\b(cvv|card number|atm pin|netbanking|bank login|password|passcode)\\b"),
        Pattern.compile("(?i)\\b(bank account|debit card|credit card)\\b.*\\b(blocked|suspended|compromised|expire)\\b")
    )

    private val URGENCY_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(urgent|immediately|act now|within 24 hours|within 2 hours|account blocked today|suspended today|final notice)\\b"),
        Pattern.compile("(?i)\\b(legal action|arrest warrant|police complaint|court order)\\b")
    )

    private val PRIZE_LOTTERY_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(you have won|congratulations! you won|cash prize|claim your reward|lottery|lucky winner)\\b"),
        Pattern.compile("(?i)\\b(claim\\s+\\$\\d+|win\\s+\\$\\d+|free gift card)\\b")
    )

    private val SUSPICIOUS_ACTION_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(verify your account|update kyc|reactivate account|avoid penalty)\\b"),
        Pattern.compile("(?i)\\b(install anydesk|download teamviewer|install quicksupport|remote access)\\b"),
        Pattern.compile("(?i)\\b(unpaid parcel|delivery failed|customs fee|redelivery)\\b")
    )

    fun extractUrls(text: String): List<String> {
        val urls = mutableListOf<String>()
        val matcher = URL_REGEX.matcher(text)
        while (matcher.find()) {
            urls.add(matcher.group())
        }
        return urls
    }

    fun analyzeUrls(urls: List<String>): List<UrlAnalysis> {
        val analyses = mutableListOf<UrlAnalysis>()
        for (rawUrl in urls) {
            val formatted = if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
                "https://$rawUrl"
            } else rawUrl

            var isSuspicious = false
            val reasons = mutableListOf<String>()

            try {
                val uri = URI(formatted)
                val host = uri.host?.lowercase() ?: ""

                // 1. IP address host check (e.g. http://192.168.1.1/login)
                val ipPattern = Pattern.compile("^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$")
                if (ipPattern.matcher(host).matches()) {
                    isSuspicious = true
                    reasons.add("Numeric IP host instead of domain name")
                }

                // 2. Suspicious / free / risky TLDs or URL shorteners
                val knownShorteners = listOf("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "rb.gy", "shorturl.at")
                if (knownShorteners.any { host.contains(it) }) {
                    isSuspicious = true
                    reasons.add("Obfuscated or shortened URL masking destination")
                }

                val riskyTlds = listOf(".xyz", ".top", ".club", ".work", ".click", ".loan", ".racing", ".live", ".tk", ".ml", ".ga", ".cf", ".gq")
                if (riskyTlds.any { host.endsWith(it) }) {
                    isSuspicious = true
                    reasons.add("Unusual or frequently abused top-level domain ($host)")
                }

                // 3. Deceptive subdomain spoofing (e.g. paypal.security-update.com)
                val targetedBrands = listOf("paypal", "chase", "wellsfargo", "bankofamerica", "netflix", "apple", "amazon", "google", "usps", "fedex", "dhl")
                for (brand in targetedBrands) {
                    if (host.contains(brand) && !host.endsWith(".$brand.com") && host != "$brand.com") {
                        isSuspicious = true
                        reasons.add("Brand spoofing pattern detected (mimicking $brand)")
                    }
                }

                // 4. Excessive hyphens or digits
                val hyphenCount = host.count { it == '-' }
                if (hyphenCount >= 3) {
                    isSuspicious = true
                    reasons.add("Unusually complex domain with multiple hyphens")
                }

            } catch (e: Exception) {
                isSuspicious = true
                reasons.add("Malformed or unparseable URL structure")
            }

            if (!isSuspicious) {
                reasons.add("URL structure appears standard. Direct domain lookup not verified.")
            }

            analyses.add(
                UrlAnalysis(
                    url = rawUrl,
                    suspicious = isSuspicious,
                    reason = reasons.joinToString("; ")
                )
            )
        }
        return analyses
    }

    fun runDetections(message: String): List<HeuristicDetection> {
        val detections = mutableListOf<HeuristicDetection>()

        // Check OTP
        for (pattern in OTP_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "OTP / Verification Code Request",
                        description = "Direct request or solicitation of one-time security codes.",
                        severityPoints = 40
                    )
                )
                break
            }
        }

        // Check Banking / Credentials
        for (pattern in BANKING_CREDENTIALS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Banking Credentials or Account Threat",
                        description = "Reference to account blocking, card suspension, or confidential credentials.",
                        severityPoints = 35
                    )
                )
                break
            }
        }

        // Check Urgency & Threats
        for (pattern in URGENCY_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Artificial Urgency & Fear Pressure",
                        description = "Time-pressure tactic designed to induce panic and bypass critical thinking.",
                        severityPoints = 25
                    )
                )
                break
            }
        }

        // Check Rewards / Lottery
        for (pattern in PRIZE_LOTTERY_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Unsolicited Prize / Reward Lure",
                        description = "Classic advance-fee or lottery hook offering unearned rewards.",
                        severityPoints = 25
                    )
                )
                break
            }
        }

        // Check Action & Verification
        for (pattern in SUSPICIOUS_ACTION_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Suspicious Action / Remote Tool Demands",
                        description = "Requests to verify identity, pay delivery fees, or download remote tools.",
                        severityPoints = 25
                    )
                )
                break
            }
        }

        return detections
    }
}
