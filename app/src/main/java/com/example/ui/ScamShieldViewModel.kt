package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.engine.ScamRiskEngine
import com.example.model.RiskLevel
import com.example.model.ScamAnalysisResult
import com.example.model.ScanHistoryItem
import com.example.model.UrlAnalysis
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface ScamUiState {
    object Idle : ScamUiState
    object Loading : ScamUiState
    data class Success(val result: ScamAnalysisResult) : ScamUiState
    data class Error(val message: String) : ScamUiState
}

enum class AnalysisTab {
    OVERVIEW, GRAPH, TIMELINE, HISTORY
}

data class SampleMessagePreset(
    val title: String,
    val categoryBadge: String,
    val content: String,
    val preview: String
)

class ScamShieldViewModel(
    private val riskEngine: ScamRiskEngine = ScamRiskEngine()
) : ViewModel() {

    companion object {
        private fun initialHistory(): List<ScanHistoryItem> {
            return listOf(
                ScanHistoryItem(
                    id = "hist-1",
                    timestamp = System.currentTimeMillis() - 14 * 60 * 1000,
                    messageSnippet = "URGENT from Chase Alert: Your checking account was temporarily frozen due to irregular $1,420...",
                    fullMessage = "URGENT from Chase Alert: Your checking account was temporarily frozen due to irregular $1,420.50 charge. Confirm identity & verify OTP immediately: http://chase-security-restore.com/login",
                    result = ScamAnalysisResult(
                        riskLevel = RiskLevel.CRITICAL,
                        estimatedRiskScore = 92,
                        category = "Bank Impersonation",
                        summary = "High-severity smishing attack impersonating Chase Bank. Employs artificial urgency, account freeze coercion, and an evasive lookalike credential harvesting link.",
                        redFlags = listOf(
                            "Severe psychological pressure ('account temporarily frozen')",
                            "Demands OTP & identity verification via unverified channel",
                            "Unregistered lookalike domain 'chase-security-restore.com'"
                        ),
                        recommendedAction = "Do NOT click the link or supply credentials. Delete the message and check Chase via official app.",
                        detectedUrls = listOf(
                            UrlAnalysis(
                                url = "http://chase-security-restore.com/login",
                                suspicious = true,
                                reason = "Typosquatting imitation of official Chase banking domain"
                            )
                        ),
                        heuristicSignals = listOf("Urgent Banking Keyword", "OTP Credential Phish", "Unsecured HTTP Link")
                    )
                ),
                ScanHistoryItem(
                    id = "hist-2",
                    timestamp = System.currentTimeMillis() - 3 * 3600 * 1000,
                    messageSnippet = "Hey Mom, I'm heading over to the grocery store now. Do you need milk or sourdough bread...",
                    fullMessage = "Hey Mom, I'm heading over to the grocery store now. Do you need milk or sourdough bread for breakfast tomorrow morning? Let me know!",
                    result = ScamAnalysisResult(
                        riskLevel = RiskLevel.LOW,
                        estimatedRiskScore = 4,
                        category = "Safe Personal Message",
                        summary = "No indicators of social engineering, coercion, urgency tactics, or credential harvesting detected. Verified as standard personal communication.",
                        redFlags = emptyList(),
                        recommendedAction = "No safety risk detected. Safe to respond normally.",
                        detectedUrls = emptyList(),
                        heuristicSignals = listOf("Normal Tone", "No External Links", "No Threat Language")
                    )
                ),
                ScanHistoryItem(
                    id = "hist-3",
                    timestamp = System.currentTimeMillis() - 8 * 3600 * 1000,
                    messageSnippet = "USPS Notice: Your parcel #940011189956 could not be delivered. Pay $1.99 redelivery fee...",
                    fullMessage = "USPS Notice: Your parcel #940011189956 could not be delivered due to an incorrect house address. Update your address and pay the $1.99 fee within 12h: http://usps-parcel-redelivery.xyz",
                    result = ScamAnalysisResult(
                        riskLevel = RiskLevel.HIGH,
                        estimatedRiskScore = 86,
                        category = "Postal Delivery Spoof",
                        summary = "Postal redelivery scam requesting credit card details under the guise of an unpaid $1.99 fee with a suspicious .xyz top-level domain.",
                        redFlags = listOf(
                            "Fabricated urgency window ('within 12h')",
                            "Demands payment card details for parcel release",
                            "Suspicious generic .xyz TLD outside official usps.com infrastructure"
                        ),
                        recommendedAction = "Do not enter credit card data. Track only on official usps.com.",
                        detectedUrls = listOf(
                            UrlAnalysis(
                                url = "http://usps-parcel-redelivery.xyz",
                                suspicious = true,
                                reason = "Evasive non-governmental TLD (.xyz)"
                            )
                        ),
                        heuristicSignals = listOf("Postal Smishing", "Micro-Fee Payment Hook", "Urgency Constraint")
                    )
                )
            )
        }

        val SAMPLE_PRESETS = listOf(
            SampleMessagePreset(
                title = "Bank Impersonation",
                categoryBadge = "Urgent Banking",
                preview = "URGENT! Chase account restricted. Verify OTP...",
                content = "URGENT from Chase Alert: Your checking account was temporarily frozen due to irregular $1,420.50 charge. Confirm identity & verify OTP immediately: http://chase-security-restore.com/login"
            ),
            SampleMessagePreset(
                title = "Package Delivery Scam",
                categoryBadge = "Postal Spoof",
                preview = "USPS: Package undeliverable. Pay $1.99 redelivery...",
                content = "USPS Notice: Your parcel #940011189956 could not be delivered due to an incorrect house address. Update your address and pay the $1.99 fee within 12h: http://usps-parcel-redelivery.xyz"
            ),
            SampleMessagePreset(
                title = "IRS / Tax Threat",
                categoryBadge = "Government Threat",
                preview = "IRS Final Notice: Warrant issued for outstanding tax...",
                content = "FINAL NOTICE: Internal Revenue Service (IRS). An arrest warrant has been filed under your SSN for unpaid taxes. Call our enforcement officer immediately at 1-800-555-0199 to resolve before detention."
            ),
            SampleMessagePreset(
                title = "Cryptocurrency Giveaway",
                categoryBadge = "Crypto Phish",
                preview = "Elon Musk Giveaway: Send 0.1 ETH to receive 1.0 ETH...",
                content = "Exclusive Tesla Foundation Crypto AirDrop: In honor of the new launch, Elon Musk is giving away 5,000 ETH! Send 0.1 ETH to wallet 0x71C... to receive 1.0 ETH back instantly: http://musk-tesla-drop.net"
            ),
            SampleMessagePreset(
                title = "Lottery / Prize Hook",
                categoryBadge = "Prize Bait",
                preview = "Amazon: You won a $1,000 gift card! Claim now...",
                content = "Amazon Rewards: Congratulations Harsh! You were selected as our shopper of the week. Claim your $1,000 gift certificate before midnight: http://bit.ly/amazon-gift-winner-2026"
            ),
            SampleMessagePreset(
                title = "Legitimate Family Text",
                categoryBadge = "Safe Contact",
                preview = "Hey, heading to the grocery store. Need anything?",
                content = "Hey Mom, I'm heading over to the grocery store now. Do you need milk or sourdough bread for breakfast tomorrow morning? Let me know!"
            )
        )
    }

    private val _messageInput = MutableStateFlow("")
    val messageInput: StateFlow<String> = _messageInput.asStateFlow()

    private val _uiState = MutableStateFlow<ScamUiState>(ScamUiState.Idle)
    val uiState: StateFlow<ScamUiState> = _uiState.asStateFlow()

    private val _selectedTab = MutableStateFlow(AnalysisTab.OVERVIEW)
    val selectedTab: StateFlow<AnalysisTab> = _selectedTab.asStateFlow()

    private val _bottomNavIndex = MutableStateFlow(1) // Default to "Alerts"
    val bottomNavIndex: StateFlow<Int> = _bottomNavIndex.asStateFlow()

    // Scan History Tracking
    private val _scanHistory = MutableStateFlow<List<ScanHistoryItem>>(initialHistory())
    val scanHistory: StateFlow<List<ScanHistoryItem>> = _scanHistory.asStateFlow()

    // MaxShield Monetization State
    private val _isMaxShieldPro = MutableStateFlow(false)
    val isMaxShieldPro: StateFlow<Boolean> = _isMaxShieldPro.asStateFlow()

    private val _showMaxShieldPaywall = MutableStateFlow(false)
    val showMaxShieldPaywall: StateFlow<Boolean> = _showMaxShieldPaywall.asStateFlow()

    fun selectTab(tab: AnalysisTab) {
        _selectedTab.value = tab
    }

    fun selectBottomNav(index: Int) {
        _bottomNavIndex.value = index
    }

    fun onMessageChange(newText: String) {
        if (newText.length <= 4000) {
            _messageInput.value = newText
        }
    }

    fun clearMessage() {
        _messageInput.value = ""
        _uiState.value = ScamUiState.Idle
    }

    fun loadPreset(preset: SampleMessagePreset) {
        _messageInput.value = preset.content
        _uiState.value = ScamUiState.Idle
    }

    fun loadExample(exampleIndex: Int = 0) {
        val selected = SAMPLE_PRESETS[exampleIndex % SAMPLE_PRESETS.size]
        _messageInput.value = selected.content
        _uiState.value = ScamUiState.Idle
    }

    // History Item Selection
    fun loadHistoryItem(item: ScanHistoryItem) {
        _messageInput.value = item.fullMessage
        _uiState.value = ScamUiState.Success(item.result)
        _selectedTab.value = AnalysisTab.OVERVIEW
    }

    fun clearHistory() {
        _scanHistory.value = emptyList()
    }

    fun deleteHistoryItem(id: String) {
        _scanHistory.value = _scanHistory.value.filter { it.id != id }
    }

    // MaxShield Monetization Controls
    fun openMaxShieldPaywall() {
        _showMaxShieldPaywall.value = true
    }

    fun closeMaxShieldPaywall() {
        _showMaxShieldPaywall.value = false
    }

    fun subscribeMaxShieldPro(planId: String = "annual") {
        _isMaxShieldPro.value = true
        _showMaxShieldPaywall.value = false
    }

    fun toggleMaxShieldPro() {
        _isMaxShieldPro.value = !_isMaxShieldPro.value
    }

    fun analyzeCurrentMessage() {
        val text = _messageInput.value.trim()
        if (text.isEmpty()) {
            _uiState.value = ScamUiState.Error("Please paste or type a suspicious message to analyze.")
            return
        }

        _uiState.value = ScamUiState.Loading
        viewModelScope.launch {
            try {
                val result = riskEngine.analyzeMessage(text)
                _uiState.value = ScamUiState.Success(result)

                // Record in history list
                val snippet = if (text.length > 70) text.take(67) + "..." else text
                val historyItem = ScanHistoryItem(
                    timestamp = System.currentTimeMillis(),
                    messageSnippet = snippet,
                    fullMessage = text,
                    result = result
                )
                _scanHistory.value = listOf(historyItem) + _scanHistory.value
            } catch (e: Exception) {
                _uiState.value = ScamUiState.Error(
                    "We couldn't analyze this message right now. Please check your connection and try again."
                )
            }
        }
    }
}

