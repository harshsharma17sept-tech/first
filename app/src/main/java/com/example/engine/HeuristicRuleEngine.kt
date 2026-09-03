package com.example.engine

import com.example.model.HeuristicDetection
import com.example.model.UrlAnalysis
import java.net.URI
import java.util.regex.Pattern

object HeuristicRuleEngine {

    private val URL_REGEX = Pattern.compile(
        "(?i)\\b(?:https?://|www\\.)[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]"
    )

    private val BARE_DOMAIN_REGEX = Pattern.compile(
        "(?i)\\b[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.(?:com|org|net|xyz|top|info|biz|club|work|click|loan|live|tk|ml|ga|cf|gq|cc|ru|cn)(?:/[^\\s]*)?"
    )

    private val EMAIL_REGEX = Pattern.compile(
        "(?i)\\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})\\b"
    )

    private val FREE_WEBMAIL_DOMAINS = listOf(
        "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "protonmail.com"
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

    private val GOVERNMENT_IMPERSONATION_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(irs|internal revenue service|tax authority|unpaid tax|social security|arrest warrant|court subpoena|police warrant)\\b")
    )

    private val UNUSUAL_PAYMENT_PATTERNS = listOf(
        Pattern.compile("(?i)\\b(gift card|gift cards|itunes card|google play card|steam card|crypto|bitcoin|wire transfer|zelle transfer|western union)\\b")
    )

    fun extractUrls(text: String): List<String> {
        val urls = mutableListOf<String>()
        val matcher = URL_REGEX.matcher(text)
        while (matcher.find()) {
            val u = matcher.group()
            if (!urls.contains(u)) urls.add(u)
        }

        // Also capture bare domains or URLs when input is URL mode or single domain token
        val domainMatcher = BARE_DOMAIN_REGEX.matcher(text)
        while (domainMatcher.find()) {
            val d = domainMatcher.group()
            if (!urls.any { it.contains(d) }) {
                urls.add(d)
            }
        }

        // Also capture email domains for analysis
        val emailMatcher = EMAIL_REGEX.matcher(text)
        while (emailMatcher.find()) {
            val domain = emailMatcher.group(1)
            if (domain != null && !urls.any { it.contains(domain) }) {
                urls.add("https://$domain")
            }
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
                val targetedBrands = listOf(
                    "paypal", "chase", "wellsfargo", "bankofamerica", "citibank", "netflix",
                    "apple", "amazon", "google", "microsoft", "meta", "facebook", "usps",
                    "fedex", "dhl", "irs", "coinbase", "binance"
                )
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

        // Check Government & Institutional Impersonation
        for (pattern in GOVERNMENT_IMPERSONATION_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Government / Authority Impersonation",
                        description = "Impersonation of tax agencies, law enforcement, or official bodies.",
                        severityPoints = 30
                    )
                )
                break
            }
        }

        // Check Unusual Payment Methods (Gift Cards, Crypto, etc.)
        for (pattern in UNUSUAL_PAYMENT_PATTERNS) {
            if (pattern.matcher(message).find()) {
                detections.add(
                    HeuristicDetection(
                        triggerName = "Untraceable / Coerced Payment Demand",
                        description = "Demand for gift cards, cryptocurrency, or wire transfers to resolve urgent issues.",
                        severityPoints = 35
                    )
                )
                break
            }
        }

        // Check Email Phishing: Official Banking or Authority from free public webmail
        val hasOfficialClaim = detections.any { 
            it.triggerName.contains("Banking", ignoreCase = true) || 
            it.triggerName.contains("Government", ignoreCase = true) 
        }
        if (hasOfficialClaim) {
            val emailMatcher = EMAIL_REGEX.matcher(message)
            while (emailMatcher.find()) {
                val domain = emailMatcher.group(1)?.lowercase() ?: ""
                if (FREE_WEBMAIL_DOMAINS.any { domain.contains(it) }) {
                    detections.add(
                        HeuristicDetection(
                            triggerName = "Public Webmail Spoofing",
                            description = "Official institutional notice originating from public free webmail address ($domain).",
                            severityPoints = 35
                        )
                    )
                    break
                }
            }
        }

        return detections
    }
}
