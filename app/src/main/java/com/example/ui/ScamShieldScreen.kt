package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Timeline
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.model.RiskLevel
import com.example.model.ScamAnalysisResult
import com.example.model.ScanHistoryItem
import com.example.model.UrlAnalysis
import com.example.ui.theme.EditorialAccentOrange
import com.example.ui.theme.EditorialBackground
import com.example.ui.theme.EditorialBorder
import com.example.ui.theme.EditorialBorderDark
import com.example.ui.theme.EditorialDeepBlack
import com.example.ui.theme.EditorialOrangeBg
import com.example.ui.theme.EditorialOrangeBorder
import com.example.ui.theme.EditorialOrangeHover
import com.example.ui.theme.EditorialSurface
import com.example.ui.theme.EditorialSurfaceMuted
import com.example.ui.theme.EditorialSurfaceWhite
import com.example.ui.theme.EditorialTextMuted
import com.example.ui.theme.EditorialTextPrimary
import com.example.ui.theme.EditorialTextSecondary
import com.example.ui.theme.RiskCriticalRed
import com.example.ui.theme.RiskCriticalRedBg
import com.example.ui.theme.RiskCriticalRedBorder
import com.example.ui.theme.RiskSafeGreen
import com.example.ui.theme.RiskSafeGreenBg
import com.example.ui.theme.RiskSafeGreenBorder
import com.example.ui.theme.RiskWarningOrange
import com.example.ui.theme.RiskWarningOrangeBg
import com.example.ui.theme.RiskWarningOrangeBorder
import kotlinx.coroutines.launch

@Composable
fun ScamShieldScreen(
    viewModel: ScamShieldViewModel,
    modifier: Modifier = Modifier
) {
    val messageInput by viewModel.messageInput.collectAsStateWithLifecycle()
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val selectedTab by viewModel.selectedTab.collectAsStateWithLifecycle()
    val bottomNavIndex by viewModel.bottomNavIndex.collectAsStateWithLifecycle()
    val scanHistory by viewModel.scanHistory.collectAsStateWithLifecycle()
    val isMaxShieldPro by viewModel.isMaxShieldPro.collectAsStateWithLifecycle()
    val showMaxShieldPaywall by viewModel.showMaxShieldPaywall.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    var exampleIndex by remember { mutableIntStateOf(0) }
    var scannerMode by remember { mutableStateOf("MESSAGE") }

    // MaxShield Pro Monetization Paywall Modal
    if (showMaxShieldPaywall) {
        MaxShieldMonetizationDialog(
            isCurrentPro = isMaxShieldPro,
            onDismiss = viewModel::closeMaxShieldPaywall,
            onSubscribe = { plan ->
                viewModel.subscribeMaxShieldPro(plan)
                scope.launch {
                    snackbarHostState.showSnackbar("MaxShield Pro Activated. Continuous Protection Enabled.")
                }
            }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            EditorialBottomBar(
                selectedIndex = bottomNavIndex,
                onSelect = { index ->
                    viewModel.selectBottomNav(index)
                    when (index) {
                        0 -> {
                            viewModel.selectTab(AnalysisTab.OVERVIEW)
                        }
                        1 -> {
                            viewModel.selectTab(AnalysisTab.HISTORY)
                        }
                        2 -> {
                            viewModel.loadExample(exampleIndex++)
                            viewModel.selectTab(AnalysisTab.OVERVIEW)
                        }
                        3 -> {
                            viewModel.openMaxShieldPaywall()
                        }
                    }
                }
            )
        },
        containerColor = EditorialBackground,
        modifier = modifier.fillMaxSize()
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(EditorialBackground),
            contentAlignment = Alignment.TopCenter
        ) {
            // Subtle 1px modular grid pattern on warm light-gray canvas
            EditorialGridBackground(modifier = Modifier.fillMaxSize())

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .widthIn(max = 720.dp)
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp)
                    .statusBarsPadding()
                    .imePadding(),
                verticalArrangement = Arrangement.spacedBy(14.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Editorial Header Navigation Bar
                item {
                    Spacer(modifier = Modifier.height(4.dp))
                    EditorialHeader(
                        isPro = isMaxShieldPro,
                        onScanNow = {
                            viewModel.selectTab(AnalysisTab.OVERVIEW)
                            viewModel.analyzeCurrentMessage()
                        },
                        onProClick = viewModel::openMaxShieldPaywall,
                        onMenuClick = {
                            scope.launch {
                                snackbarHostState.showSnackbar("ScamShield Cybersecurity Lab v2.6.4 Active")
                            }
                        }
                    )
                }

                // Dramatic Editorial Hero Section
                item {
                    EditorialHeroSection(
                        hasAnalysis = uiState is ScamUiState.Success,
                        onModeChange = { mode -> scannerMode = mode }
                    )
                }

                // 4-Segment Navigation Tabs (Overview / Graph / Timeline / History)
                item {
                    EditorialSegmentedTabs(
                        selectedTab = selectedTab,
                        historyCount = scanHistory.size,
                        onTabSelect = viewModel::selectTab
                    )
                }

                // Security Status & MaxShield Subscription Module
                item {
                    EditorialSecurityStatusModule(
                        threatScannedCount = 184 + scanHistory.size,
                        isPro = isMaxShieldPro,
                        onUpgradeClick = viewModel::openMaxShieldPaywall
                    )
                }

                // Main Content depending on Tab
                if (selectedTab == AnalysisTab.HISTORY) {
                    item {
                        ThreatHistorySection(
                            historyList = scanHistory,
                            onSelect = { item ->
                                viewModel.loadHistoryItem(item)
                            },
                            onDelete = viewModel::deleteHistoryItem,
                            onClearAll = viewModel::clearHistory,
                            onNewScan = {
                                viewModel.clearMessage()
                                viewModel.selectTab(AnalysisTab.OVERVIEW)
                            }
                        )
                    }
                } else {
                    // Main Scanner Workstation
                    item {
                        EditorialScannerWorkstation(
                            text = messageInput,
                            activeMode = scannerMode,
                            onModeSelect = { scannerMode = it },
                            onTextChange = viewModel::onMessageChange,
                            onClear = viewModel::clearMessage,
                            onExampleClick = {
                                viewModel.loadExample(exampleIndex++)
                            },
                            onSelectPreset = { preset ->
                                viewModel.loadPreset(preset)
                            },
                            onAnalyze = viewModel::analyzeCurrentMessage,
                            isLoading = uiState is ScamUiState.Loading
                        )
                    }

                    // Loading State
                    item {
                        AnimatedVisibility(
                            visible = uiState is ScamUiState.Loading,
                            enter = fadeIn()
                        ) {
                            EditorialLoadingCard()
                        }
                    }

                    // Error State
                    item {
                        AnimatedVisibility(
                            visible = uiState is ScamUiState.Error,
                            enter = fadeIn()
                        ) {
                            if (uiState is ScamUiState.Error) {
                                EditorialErrorCard(
                                    message = (uiState as ScamUiState.Error).message,
                                    onRetry = viewModel::analyzeCurrentMessage
                                )
                            }
                        }
                    }

                    // Result Views conditioned on Selected Tab
                    item {
                        AnimatedVisibility(
                            visible = uiState is ScamUiState.Success,
                            enter = fadeIn() + slideInVertically()
                        ) {
                            if (uiState is ScamUiState.Success) {
                                val result = (uiState as ScamUiState.Success).result
                                when (selectedTab) {
                                    AnalysisTab.OVERVIEW -> EditorialResultAssessment(
                                        result = result,
                                        onActionTaken = { actionName ->
                                            scope.launch {
                                                snackbarHostState.showSnackbar("Action Applied: $actionName")
                                            }
                                        }
                                    )
                                    AnalysisTab.GRAPH -> EditorialGraphSection(result = result)
                                    AnalysisTab.TIMELINE -> EditorialTimelineSection(result = result)
                                    AnalysisTab.HISTORY -> { /* Rendered above */ }
                                }
                            }
                        }
                    }
                }

                // Editorial Footer & Disclaimer
                item {
                    EditorialFooter()
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}

// =========================================================================
// 1. HEADER COMPONENT
// =========================================================================
@Composable
private fun EditorialHeader(
    isPro: Boolean,
    onScanNow: () -> Unit,
    onProClick: () -> Unit,
    onMenuClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(horizontal = 14.dp, vertical = 10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // LEFT: SCAMSHIELD Wordmark with orange square marker
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.clickable(onClick = onMenuClick)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(EditorialAccentOrange)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "SCAMSHIELD",
                    fontFamily = FontFamily.SansSerif,
                    fontWeight = FontWeight.Black,
                    fontSize = 17.sp,
                    letterSpacing = 1.2.sp,
                    color = EditorialDeepBlack
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "// LAB",
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold,
                    fontSize = 11.sp,
                    color = EditorialTextMuted
                )
            }

            // RIGHT: Pro Badge & Orange CTA "SCAN NOW"
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (isPro) {
                    Box(
                        modifier = Modifier
                            .background(EditorialDeepBlack)
                            .padding(horizontal = 7.dp, vertical = 4.dp)
                            .clickable(onClick = onProClick)
                    ) {
                        Text(
                            text = "PRO ACTIVE",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialAccentOrange
                        )
                    }
                }

                // Orange CTA: SCAN NOW
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(2.dp))
                        .background(EditorialAccentOrange)
                        .clickable(onClick = onScanNow)
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "SCAN NOW",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }
        }
    }
}

// =========================================================================
// 2. HERO SECTION
// =========================================================================
@Composable
private fun EditorialHeroSection(
    hasAnalysis: Boolean,
    onModeChange: (String) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(18.dp)
    ) {
        Column {
            // Technical metadata strip
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(6.dp)
                            .background(EditorialAccentOrange)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "AI-POWERED THREAT DETECTION",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialTextMuted,
                        letterSpacing = 0.8.sp
                    )
                }

                Text(
                    text = "SYS_VER: 2.6.4 // ACTIVE-SHIELD",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 9.sp,
                    color = EditorialTextMuted
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Oversized Editorial Typography
            Text(
                text = if (hasAnalysis) "ANALYSIS\nCOMPLETE." else "THINK\nBEFORE\nYOU CLICK.",
                fontSize = 36.sp,
                fontWeight = FontWeight.Black,
                lineHeight = 38.sp,
                letterSpacing = (-1.2).sp,
                color = EditorialDeepBlack,
                modifier = Modifier.testTag("app_title")
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Subtitle description with technical markers
            Text(
                text = "AI-powered security analysis for suspicious messages, emails and URLs.",
                fontSize = 13.sp,
                color = EditorialTextSecondary,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Technical telemetry checklist in modular grid
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                    .background(EditorialSurfaceWhite)
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceAround
            ) {
                TelemetryTickItem(label = "HEURISTICS", value = "ARMED")
                Box(modifier = Modifier.width(1.dp).height(24.dp).background(EditorialBorder))
                TelemetryTickItem(label = "PHISH FILTER", value = "ACTIVE")
                Box(modifier = Modifier.width(1.dp).height(24.dp).background(EditorialBorder))
                TelemetryTickItem(label = "NEURAL MODEL", value = "GEMINI")
            }
        }
    }
}

@Composable
private fun TelemetryTickItem(label: String, value: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            fontFamily = FontFamily.Monospace,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = EditorialDeepBlack
        )
        Text(
            text = label,
            fontFamily = FontFamily.Monospace,
            fontSize = 8.5.sp,
            color = EditorialTextMuted
        )
    }
}

// =========================================================================
// 3. SEGMENTED NAVIGATION TABS
// =========================================================================
@Composable
private fun EditorialSegmentedTabs(
    selectedTab: AnalysisTab,
    historyCount: Int,
    onTabSelect: (AnalysisTab) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        EditorialTabItem(
            label = "OVERVIEW",
            isSelected = selectedTab == AnalysisTab.OVERVIEW,
            onClick = { onTabSelect(AnalysisTab.OVERVIEW) },
            modifier = Modifier.weight(1f)
        )
        EditorialTabItem(
            label = "GRAPH",
            isSelected = selectedTab == AnalysisTab.GRAPH,
            onClick = { onTabSelect(AnalysisTab.GRAPH) },
            modifier = Modifier.weight(1f)
        )
        EditorialTabItem(
            label = "TIMELINE",
            isSelected = selectedTab == AnalysisTab.TIMELINE,
            onClick = { onTabSelect(AnalysisTab.TIMELINE) },
            modifier = Modifier.weight(1f)
        )
        EditorialTabItem(
            label = if (historyCount > 0) "LOGS ($historyCount)" else "LOGS",
            isSelected = selectedTab == AnalysisTab.HISTORY,
            onClick = { onTabSelect(AnalysisTab.HISTORY) },
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun EditorialTabItem(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val bg = if (isSelected) EditorialDeepBlack else EditorialSurfaceWhite
    val textCol = if (isSelected) Color.White else EditorialTextSecondary
    val borderCol = if (isSelected) EditorialDeepBlack else EditorialBorder

    Box(
        modifier = modifier
            .defaultMinSize(minHeight = 40.dp)
            .clip(RoundedCornerShape(2.dp))
            .background(bg)
            .border(1.dp, borderCol, RoundedCornerShape(2.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp)
            .testTag("tab_${label.lowercase().take(8)}"),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontFamily = FontFamily.Monospace,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = textCol,
            maxLines = 1
        )
    }
}

// =========================================================================
// 4. SECURITY STATUS & MAXSHIELD MONETIZATION MODULE
// =========================================================================
@Composable
private fun EditorialSecurityStatusModule(
    threatScannedCount: Int,
    isPro: Boolean,
    onUpgradeClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(12.dp)
            .testTag("glass_security_metrics_widget")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .background(EditorialSurfaceWhite)
                        .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isPro) Icons.Default.Shield else Icons.Default.Security,
                        contentDescription = null,
                        tint = if (isPro) EditorialAccentOrange else EditorialDeepBlack,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = if (isPro) "MAXSHIELD PRO" else "MAXSHIELD STANDARD",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialDeepBlack
                        )
                        if (isPro) {
                            Spacer(modifier = Modifier.width(5.dp))
                            Box(
                                modifier = Modifier
                                    .size(5.dp)
                                    .background(EditorialAccentOrange)
                            )
                        }
                    }
                    Text(
                        text = "$threatScannedCount threats scanned • 24/7 Heuristic Node",
                        fontSize = 11.sp,
                        color = EditorialTextSecondary
                    )
                }
            }

            // Monetize Pro Button
            Button(
                onClick = onUpgradeClick,
                shape = RoundedCornerShape(2.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isPro) EditorialDeepBlack else EditorialAccentOrange,
                    contentColor = Color.White
                ),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                modifier = Modifier.testTag("maxshield_upgrade_button")
            ) {
                Text(
                    text = if (isPro) "PRO TIER" else "SUBSCRIPTION",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}

// =========================================================================
// 5. MAIN SCANNER WORKSTATION
// =========================================================================
@Composable
private fun EditorialScannerWorkstation(
    text: String,
    activeMode: String,
    onModeSelect: (String) -> Unit,
    onTextChange: (String) -> Unit,
    onClear: () -> Unit,
    onExampleClick: () -> Unit,
    onSelectPreset: (SampleMessagePreset) -> Unit,
    onAnalyze: () -> Unit,
    isLoading: Boolean
) {
    val clipboardManager = LocalClipboardManager.current
    var showPresetsDrawer by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(14.dp)
            .testTag("message_input_card")
    ) {
        Column {
            // Laboratory Header & Mode Selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(7.dp)
                            .background(EditorialAccentOrange)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "CHECK A SUSPICIOUS MESSAGE",
                        fontFamily = FontFamily.SansSerif,
                        fontSize = 13.5.sp,
                        fontWeight = FontWeight.Black,
                        color = EditorialDeepBlack,
                        letterSpacing = 0.3.sp
                    )
                }

                // Mode Selector: MESSAGE | CHECK URL | EMAIL
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    ScannerModePill(
                        label = "SMS",
                        isActive = activeMode == "MESSAGE",
                        onClick = { onModeSelect("MESSAGE") }
                    )
                    ScannerModePill(
                        label = "URL",
                        isActive = activeMode == "URL",
                        onClick = { onModeSelect("URL") }
                    )
                    ScannerModePill(
                        label = "EMAIL",
                        isActive = activeMode == "EMAIL",
                        onClick = { onModeSelect("EMAIL") }
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Text Input Field (Crisp rectangular surface with 1px border)
            OutlinedTextField(
                value = text,
                onValueChange = onTextChange,
                placeholder = {
                    Text(
                        text = when (activeMode) {
                            "URL" -> "Paste suspicious link or URL here (e.g. http://usps-redelivery.xyz)..."
                            "EMAIL" -> "Paste email headers, sender address, or message body..."
                            else -> "Paste a suspicious message, SMS, email, or conversation here..."
                        },
                        fontSize = 13.sp,
                        color = EditorialTextMuted,
                        lineHeight = 18.sp
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .background(EditorialSurfaceWhite, RoundedCornerShape(2.dp))
                    .testTag("message_input_field"),
                shape = RoundedCornerShape(2.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = EditorialAccentOrange,
                    unfocusedBorderColor = EditorialBorder,
                    focusedTextColor = EditorialDeepBlack,
                    unfocusedTextColor = EditorialDeepBlack,
                    cursorColor = EditorialAccentOrange
                ),
                textStyle = androidx.compose.ui.text.TextStyle(
                    fontSize = 13.5.sp,
                    lineHeight = 18.sp,
                    color = EditorialDeepBlack
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Sub-bar: Presets button, Paste, Clear, Character count
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    // Presets toggle
                    OutlinedButton(
                        onClick = { showPresetsDrawer = !showPresetsDrawer },
                        shape = RoundedCornerShape(2.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, EditorialBorder),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.testTag("browse_presets_button")
                    ) {
                        Text(
                            text = if (showPresetsDrawer) "HIDE PRESETS" else "ATTACK PRESETS",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialTextSecondary
                        )
                    }

                    // Random sample button
                    OutlinedButton(
                        onClick = onExampleClick,
                        shape = RoundedCornerShape(2.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, EditorialBorder),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.testTag("example_message_button")
                    ) {
                        Text(
                            text = "RANDOM SAMPLE",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialTextSecondary
                        )
                    }

                    if (text.isNotEmpty()) {
                        IconButton(
                            onClick = onClear,
                            modifier = Modifier
                                .size(28.dp)
                                .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                                .testTag("clear_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear",
                                tint = EditorialTextSecondary,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }

                Text(
                    text = "${text.length}/4000",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    color = EditorialTextMuted
                )
            }

            // Presets Drawer
            AnimatedVisibility(visible = showPresetsDrawer) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp)
                        .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                        .background(EditorialSurfaceWhite)
                        .padding(8.dp)
                ) {
                    Text(
                        text = "SELECT THREAT VECTOR FOR DEMO EVALUATION:",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialTextMuted
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        ScamShieldViewModel.SAMPLE_PRESETS.forEach { preset ->
                            Box(
                                modifier = Modifier
                                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                                    .background(EditorialSurface)
                                    .clickable {
                                        onSelectPreset(preset)
                                        showPresetsDrawer = false
                                    }
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = preset.title,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Medium,
                                    color = EditorialDeepBlack
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Primary CTA: ANALYZE THREAT (Accent Orange)
            Button(
                onClick = onAnalyze,
                enabled = !isLoading,
                shape = RoundedCornerShape(2.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = EditorialAccentOrange,
                    contentColor = Color.White,
                    disabledContainerColor = EditorialBorder
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp)
                    .testTag("analyze_button")
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        color = Color.White,
                        strokeWidth = 2.dp,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "SCANNING VECTORS...",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black
                    )
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "ANALYZE THREAT",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 12.5.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "→",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ScannerModePill(
    label: String,
    isActive: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .defaultMinSize(minHeight = 32.dp, minWidth = 44.dp)
            .background(if (isActive) EditorialDeepBlack else EditorialSurfaceWhite)
            .border(1.dp, if (isActive) EditorialDeepBlack else EditorialBorder, RoundedCornerShape(2.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 6.dp)
            .testTag("mode_${label.lowercase()}"),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontFamily = FontFamily.Monospace,
            fontSize = 9.5.sp,
            fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
            color = if (isActive) Color.White else EditorialTextSecondary
        )
    }
}

// =========================================================================
// 6. LOADING CARD
// =========================================================================
@Composable
private fun EditorialLoadingCard() {
    val transition = rememberInfiniteTransition(label = "scan_pulse")
    val alpha by transition.animateFloat(
        initialValue = 0.3f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(700, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scan_alpha"
    )

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialAccentOrange.copy(alpha = alpha), RoundedCornerShape(2.dp))
            .padding(16.dp)
            .testTag("analysis_loading_skeleton_card")
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .background(EditorialAccentOrange)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "HEURISTIC SCAN IN PROGRESS // THREAT INSPECTOR",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = EditorialDeepBlack
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Animated scanning progress bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(3.dp)
                    .background(EditorialBorder)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(alpha)
                        .height(3.dp)
                        .background(EditorialAccentOrange)
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Parsing lexical syntax, checking URL reputation, verifying sender identity markers, and executing zero-trust heuristics...",
                fontSize = 12.sp,
                color = EditorialTextSecondary,
                lineHeight = 16.sp
            )
        }
    }
}

// =========================================================================
// 7. ERROR CARD
// =========================================================================
@Composable
private fun EditorialErrorCard(
    message: String,
    onRetry: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(RiskCriticalRedBg)
            .border(1.dp, RiskCriticalRedBorder, RoundedCornerShape(2.dp))
            .padding(14.dp)
            .testTag("error_card")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.ErrorOutline,
                    contentDescription = null,
                    tint = RiskCriticalRed,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "EVALUATION ERROR",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = RiskCriticalRed
                    )
                    Text(
                        text = message,
                        fontSize = 12.sp,
                        color = EditorialDeepBlack
                    )
                }
            }

            OutlinedButton(
                onClick = onRetry,
                shape = RoundedCornerShape(2.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, RiskCriticalRed),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                modifier = Modifier.testTag("retry_button")
            ) {
                Text(
                    text = "RETRY",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = RiskCriticalRed
                )
            }
        }
    }
}

// =========================================================================
// 8. AI RESULT ASSESSMENT (CORE OUTPUT UI)
// =========================================================================
@Composable
private fun EditorialResultAssessment(
    result: ScamAnalysisResult,
    onActionTaken: (String) -> Unit
) {
    val isFraud = result.isFraud
    val riskScore = result.estimatedRiskScore
    val riskColor = when (result.riskLevel) {
        RiskLevel.CRITICAL -> RiskCriticalRed
        RiskLevel.HIGH -> RiskCriticalRed
        RiskLevel.MEDIUM -> RiskWarningOrange
        RiskLevel.LOW -> RiskSafeGreen
    }
    val riskBg = when (result.riskLevel) {
        RiskLevel.CRITICAL -> RiskCriticalRedBg
        RiskLevel.HIGH -> RiskCriticalRedBg
        RiskLevel.MEDIUM -> RiskWarningOrangeBg
        RiskLevel.LOW -> RiskSafeGreenBg
    }
    val riskBorder = when (result.riskLevel) {
        RiskLevel.CRITICAL -> RiskCriticalRedBorder
        RiskLevel.HIGH -> RiskCriticalRedBorder
        RiskLevel.MEDIUM -> RiskWarningOrangeBorder
        RiskLevel.LOW -> RiskSafeGreenBorder
    }
    val verdictLabel = when (result.riskLevel) {
        RiskLevel.CRITICAL -> "CRITICAL THREAT // FRAUD DETECTED"
        RiskLevel.HIGH -> "HIGH RISK // FRAUD DETECTED"
        RiskLevel.MEDIUM -> "SUSPICIOUS // EXERCISE CAUTION"
        RiskLevel.LOW -> "VERIFIED SAFE // NO THREAT SIGNALS"
    }
    val verdictSubText = when (result.riskLevel) {
        RiskLevel.CRITICAL -> "Immediate caution advised: Do not interact, click links, or reply"
        RiskLevel.HIGH -> "High probability of phishing or scam: Do not engage"
        RiskLevel.MEDIUM -> "Potential security risk detected: Exercise caution before responding"
        RiskLevel.LOW -> "Message passed heuristic security verification"
    }

    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .testTag("analysis_result_card")
    ) {
        // High-Visibility Binary Verdict Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(2.dp))
                .background(riskBg)
                .border(1.5.dp, riskBorder, RoundedCornerShape(2.dp))
                .padding(14.dp)
                .testTag("fraud_verdict_banner")
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = when (result.riskLevel) {
                            RiskLevel.CRITICAL, RiskLevel.HIGH -> Icons.Default.Warning
                            RiskLevel.MEDIUM -> Icons.Default.Warning
                            RiskLevel.LOW -> Icons.Default.CheckCircle
                        },
                        contentDescription = null,
                        tint = riskColor,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = verdictLabel,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Black,
                            color = riskColor,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = verdictSubText,
                            fontSize = 11.5.sp,
                            color = EditorialDeepBlack
                        )
                    }
                }

                Text(
                    text = "$riskScore%",
                    fontFamily = FontFamily.SansSerif,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = riskColor
                )
            }
        }

        // Modular Grid Assessment Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(2.dp))
                .background(EditorialSurface)
                .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                .padding(16.dp)
        ) {
            Column {
                // Header row: Threat Category & Risk Level Badge
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "THREAT ASSESSMENT",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialTextMuted,
                            letterSpacing = 0.8.sp
                        )
                        Text(
                            text = result.category,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = EditorialDeepBlack
                        )
                    }

                    // Risk Level Badge
                    Box(
                        modifier = Modifier
                            .background(riskColor)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                            .testTag("risk_level_badge")
                    ) {
                        Text(
                            text = "${result.riskLevel.name} RISK",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Score Gauge & Equalizer Section
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                        .background(EditorialSurfaceWhite)
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "$riskScore%",
                            fontSize = 38.sp,
                            fontWeight = FontWeight.Black,
                            lineHeight = 38.sp,
                            color = riskColor,
                            modifier = Modifier.testTag("risk_score_value")
                        )
                        Text(
                            text = "ESTIMATED RISK SCORE",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialTextMuted
                        )
                    }

                    // Equalizer Waveform Bars
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                        verticalAlignment = Alignment.Bottom,
                        modifier = Modifier.height(34.dp)
                    ) {
                        val heights = listOf(0.4f, 0.7f, 0.9f, 0.6f, 0.8f, 0.5f, 0.85f, 0.3f)
                        heights.forEachIndexed { i, factor ->
                            val barHeight = (34 * factor * (riskScore.coerceAtLeast(15) / 100f)).coerceAtLeast(4f).dp
                            Box(
                                modifier = Modifier
                                    .width(6.dp)
                                    .height(barHeight)
                                    .background(if (i % 2 == 0) riskColor else riskColor.copy(alpha = 0.6f))
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Summary text
                Text(
                    text = result.summary,
                    fontSize = 13.sp,
                    color = EditorialTextPrimary,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(14.dp))

                // RED FLAGS Section (Structured numbered list)
                if (result.redFlags.isNotEmpty()) {
                    Text(
                        text = "RED FLAGS DETECTED",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Black,
                        color = EditorialDeepBlack,
                        letterSpacing = 0.8.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                            .background(EditorialSurfaceWhite)
                    ) {
                        result.redFlags.forEachIndexed { idx, flag ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(10.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Text(
                                    text = String.format("%02d", idx + 1),
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = EditorialAccentOrange
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    text = flag,
                                    fontSize = 12.5.sp,
                                    color = EditorialDeepBlack,
                                    lineHeight = 16.sp
                                )
                            }
                            if (idx < result.redFlags.size - 1) {
                                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                }

                // RECOMMENDED ACTION
                Text(
                    text = "RECOMMENDED ACTION",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Black,
                    color = EditorialDeepBlack,
                    letterSpacing = 0.8.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(2.dp))
                        .background(if (isFraud) EditorialOrangeBg else RiskSafeGreenBg)
                        .border(1.dp, if (isFraud) EditorialOrangeBorder else RiskSafeGreenBorder, RoundedCornerShape(2.dp))
                        .padding(12.dp)
                ) {
                    Text(
                        text = result.recommendedAction,
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = EditorialDeepBlack,
                        lineHeight = 17.sp
                    )
                }

                // Detected URLs section (if present)
                if (result.detectedUrls.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "DETECTED URLS & DOMAINS",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Black,
                        color = EditorialDeepBlack,
                        letterSpacing = 0.8.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                            .background(EditorialSurfaceWhite)
                    ) {
                        result.detectedUrls.forEachIndexed { index, urlItem ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = urlItem.url,
                                        fontFamily = FontFamily.Monospace,
                                        fontSize = 11.5.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = EditorialDeepBlack,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = urlItem.reason,
                                        fontSize = 11.sp,
                                        color = EditorialTextSecondary
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                        .background(if (urlItem.suspicious) RiskCriticalRed else RiskSafeGreen)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = if (urlItem.suspicious) "SUSPICIOUS" else "SAFE",
                                        fontFamily = FontFamily.Monospace,
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                            }
                            if (index < result.detectedUrls.size - 1) {
                                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                            }
                        }
                    }
                }

                // Heuristic Signals tags
                if (result.heuristicSignals.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "HEURISTIC SIGNALS",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialTextMuted
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        result.heuristicSignals.forEach { sig ->
                            Box(
                                modifier = Modifier
                                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                                    .background(EditorialSurfaceWhite)
                                    .padding(horizontal = 7.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = sig,
                                    fontFamily = FontFamily.Monospace,
                                    fontSize = 10.sp,
                                    color = EditorialTextSecondary
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

// =========================================================================
// 9. ATTACK VECTOR GRAPH SECTION
// =========================================================================
@Composable
private fun EditorialGraphSection(result: ScamAnalysisResult) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(16.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(7.dp)
                        .background(EditorialAccentOrange)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "ATTACK VECTOR CORRELATION GRAPH",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.Black,
                    color = EditorialDeepBlack,
                    letterSpacing = 0.8.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = "Node-to-node signal analysis identifying threat surface propagation:",
                fontSize = 12.5.sp,
                color = EditorialTextSecondary
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Graph visualization nodes
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                    .background(EditorialSurfaceWhite)
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                EditorialGraphNode(
                    nodeId = "NODE_01",
                    title = "Sender Authentication Vector",
                    score = if (result.isFraud) "HIGH RISK (94%)" else "VERIFIED (5%)",
                    isWarning = result.isFraud
                )
                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                EditorialGraphNode(
                    nodeId = "NODE_02",
                    title = "Linguistic Urgency & Coercion Hook",
                    score = if (result.redFlags.isNotEmpty()) "DETECTED" else "BENIGN",
                    isWarning = result.redFlags.isNotEmpty()
                )
                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                EditorialGraphNode(
                    nodeId = "NODE_03",
                    title = "URL Infrastructure Reputation",
                    score = if (result.detectedUrls.any { it.suspicious }) "UNSECURED / SPOOF" else "NO SUSPICIOUS URLS",
                    isWarning = result.detectedUrls.any { it.suspicious }
                )
            }
        }
    }
}

@Composable
private fun EditorialGraphNode(
    nodeId: String,
    title: String,
    score: String,
    isWarning: Boolean
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = nodeId,
                fontFamily = FontFamily.Monospace,
                fontSize = 9.5.sp,
                fontWeight = FontWeight.Bold,
                color = EditorialAccentOrange
            )
            Text(
                text = title,
                fontSize = 12.5.sp,
                fontWeight = FontWeight.Bold,
                color = EditorialDeepBlack
            )
        }
        Text(
            text = score,
            fontFamily = FontFamily.Monospace,
            fontSize = 10.5.sp,
            fontWeight = FontWeight.Black,
            color = if (isWarning) RiskCriticalRed else RiskSafeGreen
        )
    }
}

// =========================================================================
// 10. TIMELINE SECTION
// =========================================================================
@Composable
private fun EditorialTimelineSection(result: ScamAnalysisResult) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(16.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(7.dp)
                        .background(EditorialAccentOrange)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "KILL-CHAIN ATTACK TIMELINE",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 11.5.sp,
                    fontWeight = FontWeight.Black,
                    color = EditorialDeepBlack,
                    letterSpacing = 0.8.sp
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                    .background(EditorialSurfaceWhite)
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                TimelineStepRow(
                    step = "01",
                    title = "Initial Inbound Vector",
                    desc = "SMS or email delivered bypasses default telco filters"
                )
                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                TimelineStepRow(
                    step = "02",
                    title = "Psychological Trigger",
                    desc = "Fabricated urgency or account panic induces victim compliance"
                )
                Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                TimelineStepRow(
                    step = "03",
                    title = "Harvest / Coercion",
                    desc = "Victim prompted to enter OTP, bank login, or cryptocurrency transfer"
                )
            }
        }
    }
}

@Composable
private fun TimelineStepRow(
    step: String,
    title: String,
    desc: String
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = step,
            fontFamily = FontFamily.Monospace,
            fontSize = 11.sp,
            fontWeight = FontWeight.Black,
            color = EditorialAccentOrange
        )
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(
                text = title,
                fontSize = 12.5.sp,
                fontWeight = FontWeight.Bold,
                color = EditorialDeepBlack
            )
            Text(
                text = desc,
                fontSize = 11.sp,
                color = EditorialTextSecondary,
                lineHeight = 15.sp
            )
        }
    }
}

// =========================================================================
// 11. EDITORIAL BOTTOM BAR
// =========================================================================
@Composable
private fun EditorialBottomBar(
    selectedIndex: Int,
    onSelect: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder)
            .navigationBarsPadding()
            .padding(horizontal = 8.dp, vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            BottomNavItem(
                icon = Icons.Default.Shield,
                label = "SCANNER",
                isSelected = selectedIndex == 0,
                onClick = { onSelect(0) }
            )
            BottomNavItem(
                icon = Icons.Default.History,
                label = "HISTORY",
                isSelected = selectedIndex == 1,
                onClick = { onSelect(1) }
            )
            BottomNavItem(
                icon = Icons.Default.Lightbulb,
                label = "SAMPLES",
                isSelected = selectedIndex == 2,
                onClick = { onSelect(2) }
            )
            BottomNavItem(
                icon = Icons.Default.Bolt,
                label = "PRO SHIELD",
                isSelected = selectedIndex == 3,
                onClick = { onSelect(3) }
            )
        }
    }
}

@Composable
private fun BottomNavItem(
    icon: ImageVector,
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val activeColor = EditorialAccentOrange
    val inactiveColor = EditorialTextSecondary

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
        modifier = Modifier
            .defaultMinSize(minWidth = 52.dp, minHeight = 48.dp)
            .clip(RoundedCornerShape(2.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 8.dp, vertical = 4.dp)
            .testTag("nav_${label.lowercase()}")
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = if (isSelected) activeColor else inactiveColor,
            modifier = Modifier.size(20.dp)
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = label,
            fontFamily = FontFamily.Monospace,
            fontSize = 9.sp,
            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
            color = if (isSelected) activeColor else inactiveColor
        )
    }
}

// =========================================================================
// 12. BACKGROUND GRID & FOOTER
// =========================================================================
@Composable
private fun EditorialGridBackground(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val step = 48.dp.toPx()
        val lineColor = EditorialBorder.copy(alpha = 0.55f)

        var x = 0f
        while (x < size.width) {
            drawLine(
                color = lineColor,
                start = Offset(x, 0f),
                end = Offset(x, size.height),
                strokeWidth = 1f
            )
            x += step
        }

        var y = 0f
        while (y < size.height) {
            drawLine(
                color = lineColor,
                start = Offset(0f, y),
                end = Offset(size.width, y),
                strokeWidth = 1f
            )
            y += step
        }
    }
}

@Composable
private fun EditorialFooter() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "SCAMSHIELD // CYBERSECURITY LAB WORKSTATION",
            fontFamily = FontFamily.Monospace,
            fontSize = 9.5.sp,
            fontWeight = FontWeight.Bold,
            color = EditorialTextMuted,
            letterSpacing = 1.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = "Zero-knowledge encryption • Gemini neural classification • Client-side heuristics",
            fontSize = 10.5.sp,
            color = EditorialTextMuted,
            textAlign = TextAlign.Center
        )
    }
}
