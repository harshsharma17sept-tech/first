package com.example

import com.example.engine.HeuristicRuleEngine
import com.example.engine.ScamRiskEngine
import com.example.model.RiskLevel
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ScamShieldHeuristicsTest {

    private val riskEngine = ScamRiskEngine()

    @Test
    fun testOtpBankingScam_detectedAsCriticalOrHigh() = runTest {
        val message = "URGENT! Your bank account will be blocked today. Verify your account immediately using this link and send your OTP to complete verification."
        val result = riskEngine.analyzeMessage(message)

        assertTrue("Expected score >= 85 for OTP/banking scam, got ${result.estimatedRiskScore}", result.estimatedRiskScore >= 85)
        assertTrue("Expected HIGH or CRITICAL risk level", result.riskLevel == RiskLevel.HIGH || result.riskLevel == RiskLevel.CRITICAL)
        assertTrue("Red flags should note OTP", result.redFlags.any { it.contains("OTP", ignoreCase = true) })
    }

    @Test
    fun testLegitimatePersonalMessage_detectedAsLow() = runTest {
        val message = "Hey Mom, I'm heading over to the grocery store now. Do you need milk or bread for breakfast tomorrow?"
        val result = riskEngine.analyzeMessage(message)

        assertTrue("Expected score <= 30 for benign personal message, got ${result.estimatedRiskScore}", result.estimatedRiskScore <= 30)
        assertEquals(RiskLevel.LOW, result.riskLevel)
        org.junit.Assert.assertFalse("Benign message must have isFraud = false", result.isFraud)
    }

    @Test
    fun testFraudFlagCalculation() = runTest {
        val scamMessage = "IRS Urgent Notice: Final demand for unpaid tax. Gift cards required immediately."
        val scamResult = riskEngine.analyzeMessage(scamMessage)
        assertTrue("Scam must have isFraud = true", scamResult.isFraud)

        val safeMessage = "Meeting moved to 3 PM tomorrow in Conference Room B."
        val safeResult = riskEngine.analyzeMessage(safeMessage)
        org.junit.Assert.assertFalse("Safe message must have isFraud = false", safeResult.isFraud)
    }

    @Test
    fun testUrlExtractionAndSuspiciousStructure() {
        val message = "Claim prize at http://192.168.1.1/login or visit https://apple.id-security-update.top"
        val urls = HeuristicRuleEngine.extractUrls(message)
        assertEquals(2, urls.size)

        val analysis = HeuristicRuleEngine.analyzeUrls(urls)
        assertEquals(2, analysis.size)
        assertTrue("IP url should be flagged suspicious", analysis[0].suspicious)
        assertTrue("Suspicious TLD/brand spoofing should be flagged", analysis[1].suspicious)
    }
}
