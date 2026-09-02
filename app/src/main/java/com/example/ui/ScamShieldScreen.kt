package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AcUnit
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Dns
import androidx.compose.material.icons.filled.ErrorOutline
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Radar
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.WarningAmber
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
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
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.model.RiskLevel
import com.example.model.ScamAnalysisResult
import com.example.model.ScanHistoryItem
import com.example.model.UrlAnalysis
import com.example.ui.theme.FraudRed
import com.example.ui.theme.FraudRedBorder
import com.example.ui.theme.FraudRedContainer
import com.example.ui.theme.GlassBorderLuminous
import com.example.ui.theme.GlassBorderSubtle
import com.example.ui.theme.GlassSkeletonBase
import com.example.ui.theme.GlassSkeletonHighlight
import com.example.ui.theme.GlassSurfaceElevated
import com.example.ui.theme.GlassSurfaceUltra
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldAccentGlow
import com.example.ui.theme.GoldBorder
import com.example.ui.theme.GoldContainer
import com.example.ui.theme.GridDotColor
import com.example.ui.theme.HeroCanvasDark
import com.example.ui.theme.HeroCardGlass
import com.example.ui.theme.HeroCardGlassBorder
import com.example.ui.theme.HeroCardGlassHover
import com.example.ui.theme.HeroCyanGlow
import com.example.ui.theme.HeroElectricBlue
import com.example.ui.theme.HeroEmerald
import com.example.ui.theme.HeroHotPink
import com.example.ui.theme.HeroNeonPurple
import com.example.ui.theme.IndigoBorder
import com.example.ui.theme.IndigoBorderFocused
import com.example.ui.theme.IndigoCanvasDark
import com.example.ui.theme.IndigoSurface
import com.example.ui.theme.IndigoSurfaceHover
import com.example.ui.theme.RiskCriticalMagenta
import com.example.ui.theme.RiskHighRose
import com.example.ui.theme.RiskLowGreen
import com.example.ui.theme.RiskMediumAmber
import com.example.ui.theme.SafeGreen
import com.example.ui.theme.SafeGreenBorder
import com.example.ui.theme.SafeGreenContainer
import com.example.ui.theme.SoftSage
import com.example.ui.theme.SoftSageContainer
import com.example.ui.theme.SoftSageLight
import com.example.ui.theme.SoftSageOnContainer
import com.example.ui.theme.TextHighEmphasis
import com.example.ui.theme.TextMediumEmphasis
import com.example.ui.theme.TextMuted
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

    // MaxShield Pro Monetization Paywall Modal
    if (showMaxShieldPaywall) {
        MaxShieldMonetizationDialog(
            isCurrentPro = isMaxShieldPro,
            onDismiss = viewModel::closeMaxShieldPaywall,
            onSubscribe = { plan ->
                viewModel.subscribeMaxShieldPro(plan)
                scope.launch {
                    snackbarHostState.showSnackbar("🎉 MaxShield Pro Activated! 24/7 AI Defense Enabled.")
                }
            }
        )
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            InboxHeroBottomBar(
                selectedIndex = bottomNavIndex,
                onSelect = { index ->
                    viewModel.selectBottomNav(index)
                    when (index) {
                        0 -> {
                            viewModel.clearMessage()
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
        containerColor = HeroCanvasDark,
        modifier = modifier.fillMaxSize()
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF13172E),
                            Color(0xFF0D1021),
                            Color(0xFF080A14)
                        )
                    )
                )
        ) {
            // Ambient glowing cyber-mesh background overlay
            CyberGridBackground(modifier = Modifier.fillMaxSize())

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 18.dp)
                    .statusBarsPadding()
                    .imePadding(),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top Header with Back, Title, Notification Bell
                item {
                    Spacer(modifier = Modifier.height(6.dp))
                    HeroTopBar(
                        onBack = { viewModel.clearMessage() },
                        onMenu = {
                            scope.launch {
                                snackbarHostState.showSnackbar("Inbox Hero Threat Shield v2.4 Active")
                            }
                        }
                    )
                }

                // Title & Subtitle Banner
                item {
                    HeroHeaderBanner(hasAnalysis = uiState is ScamUiState.Success)
                }

                // 4-Segment Filter Chips (Overview / Graph / Timeline / History)
                item {
                    SegmentedTabRow(
                        selectedTab = selectedTab,
                        historyCount = scanHistory.size,
                        onTabSelect = viewModel::selectTab
                    )
                }

                // Quick Security Status Glass Widget (with MaxShield Monetization)
                item {
                    GlassSecurityMetricsWidget(
                        threatScannedCount = 184 + scanHistory.size,
                        shieldsActive = true,
                        isMaxShieldPro = isMaxShieldPro,
                        onUpgradeClick = viewModel::openMaxShieldPaywall
                    )
                }

                // Condition content based on selected tab:
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
                    // Input Box / Message Scanner Card
                    item {
                        GlassMessageInputCard(
                            text = messageInput,
                            onTextChange = viewModel::onMessageChange,
                            onClear = viewModel::clearMessage,
                            onExampleClick = {
                                viewModel.loadExample(exampleIndex)
                                exampleIndex++
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
                            NeonLoadingCard()
                        }
                    }

                    // Error State
                    item {
                        AnimatedVisibility(
                            visible = uiState is ScamUiState.Error,
                            enter = fadeIn()
                        ) {
                            if (uiState is ScamUiState.Error) {
                                GlassErrorCard(message = (uiState as ScamUiState.Error).message)
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
                                    AnalysisTab.OVERVIEW -> ThreatOverviewSection(
                                        result = result,
                                        onActionTaken = { actionName ->
                                            scope.launch {
                                                snackbarHostState.showSnackbar("Action Applied: $actionName")
                                            }
                                        }
                                    )
                                    AnalysisTab.GRAPH -> ThreatGraphSection(result = result)
                                    AnalysisTab.TIMELINE -> ThreatTimelineSection(result = result)
                                    AnalysisTab.HISTORY -> { /* Rendered above */ }
                                }
                            }
                        }
                    }
                }

                // Footer & Safety Badge
                item {
                    HeroPrivacyDisclaimer()
                    Spacer(modifier = Modifier.height(18.dp))
                }
            }
        }
    }
}

@Composable
private fun HeroTopBar(
    onBack: () -> Unit,
    onMenu: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Back Pill
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(HeroCardGlass)
                .border(1.dp, HeroCardGlassBorder, CircleShape)
                .clickable(onClick = onBack),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Back",
                tint = TextHighEmphasis,
                modifier = Modifier.size(20.dp)
            )
        }

        // Center Title
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(HeroCyanGlow)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Analyze Threat",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = TextHighEmphasis,
                letterSpacing = 0.5.sp
            )
        }

        // Right Action Pill
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(CircleShape)
                .background(HeroCardGlass)
                .border(1.dp, HeroCardGlassBorder, CircleShape)
                .clickable(onClick = onMenu),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Menu,
                contentDescription = "Menu",
                tint = TextHighEmphasis,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
private fun HeroHeaderBanner(hasAnalysis: Boolean) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 8.dp, bottom = 4.dp),
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            text = if (hasAnalysis) "Suspicious Threat Identified" else "Inbox Hero Security",
            fontSize = 25.sp,
            fontWeight = FontWeight.ExtraBold,
            color = TextHighEmphasis,
            lineHeight = 30.sp,
            modifier = Modifier.testTag("app_title")
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = if (hasAnalysis) "High risk activity and deceptive signals isolated" else "Real-time AI message threat scanner & link guard",
            fontSize = 13.sp,
            fontWeight = FontWeight.Normal,
            color = TextMediumEmphasis
        )
    }
}

@Composable
private fun SegmentedTabRow(
    selectedTab: AnalysisTab,
    historyCount: Int,
    onTabSelect: (AnalysisTab) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(IndigoSurface)
            .border(1.dp, IndigoBorder, RoundedCornerShape(24.dp))
            .padding(4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            AnalysisTab.values().forEach { tab ->
                val isSelected = tab == selectedTab
                val animatedBg by animateColorAsState(
                    targetValue = if (isSelected) IndigoSurfaceHover else Color.Transparent,
                    label = "tab_bg"
                )
                val animatedTextColor by animateColorAsState(
                    targetValue = if (isSelected) HeroCyanGlow else TextMediumEmphasis,
                    label = "tab_text"
                )

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(20.dp))
                        .background(animatedBg)
                        .clickable { onTabSelect(tab) }
                        .padding(vertical = 10.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = when (tab) {
                            AnalysisTab.OVERVIEW -> "Overview"
                            AnalysisTab.GRAPH -> "Graph"
                            AnalysisTab.TIMELINE -> "Timeline"
                            AnalysisTab.HISTORY -> if (historyCount > 0) "History ($historyCount)" else "History"
                        },
                        fontSize = 12.5.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = animatedTextColor
                    )
                }
            }
        }
    }
}

@Composable
private fun GlassSecurityMetricsWidget(
    threatScannedCount: Int,
    shieldsActive: Boolean,
    isMaxShieldPro: Boolean,
    onUpgradeClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = modifier
            .fillMaxWidth()
            .border(
                1.dp,
                if (isMaxShieldPro) GoldBorder else GlassBorderSubtle,
                RoundedCornerShape(20.dp)
            )
            .testTag("glass_security_metrics_widget")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 14.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Metric 1: Shield Protection Level
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(if (isMaxShieldPro) GoldContainer else SoftSageContainer)
                        .border(
                            1.dp,
                            if (isMaxShieldPro) GoldAccent else SoftSage.copy(alpha = 0.5f),
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = if (isMaxShieldPro) Icons.Default.VerifiedUser else Icons.Default.Shield,
                        contentDescription = "Shield Active",
                        tint = if (isMaxShieldPro) GoldAccentGlow else SoftSage,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "Protection Tier",
                        fontSize = 10.5.sp,
                        color = TextMuted
                    )
                    Text(
                        text = if (isMaxShieldPro) "MaxShield Pro 🛡️" else "MaxShield Free",
                        fontSize = 12.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (isMaxShieldPro) GoldAccentGlow else TextHighEmphasis
                    )
                }
            }

            // Metric Divider
            Box(
                modifier = Modifier
                    .width(1.dp)
                    .height(28.dp)
                    .background(IndigoBorder)
            )

            // Metric 2: Monetized Action / Status
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.End,
                modifier = Modifier
                    .weight(1.2f)
                    .padding(start = 10.dp)
            ) {
                if (isMaxShieldPro) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(GoldContainer)
                            .border(1.dp, GoldBorder, RoundedCornerShape(12.dp))
                            .clickable(onClick = onUpgradeClick)
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(SafeGreen)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "PRO ACTIVE",
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Black,
                                color = GoldAccentGlow,
                                letterSpacing = 0.5.sp
                            )
                        }
                    }
                } else {
                    Button(
                        onClick = onUpgradeClick,
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                        modifier = Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(
                                Brush.horizontalGradient(
                                    colors = listOf(GoldAccent, HeroElectricBlue)
                                )
                            )
                            .testTag("maxshield_upgrade_button")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Bolt,
                                contentDescription = null,
                                tint = Color.Black,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "MONETIZE PRO",
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.Black
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GlassMessageInputCard(
    text: String,
    onTextChange: (String) -> Unit,
    onClear: () -> Unit,
    onExampleClick: () -> Unit,
    onSelectPreset: (SampleMessagePreset) -> Unit,
    onAnalyze: () -> Unit,
    isLoading: Boolean
) {
    var showPresetSelector by remember { androidx.compose.runtime.mutableStateOf(false) }

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, GlassBorderSubtle, RoundedCornerShape(22.dp))
            .testTag("message_input_card")
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(SoftSageContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Radar,
                            contentDescription = null,
                            tint = SoftSage,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "INBOX SCANNER",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.2.sp,
                        color = SoftSage
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Quick next sample button
                    OutlinedButton(
                        onClick = onExampleClick,
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .height(30.dp)
                            .testTag("example_message_button"),
                        contentPadding = PaddingValues(horizontal = 10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, SoftSage.copy(alpha = 0.5f))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lightbulb,
                            contentDescription = "Sample",
                            tint = SoftSage,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Sample", fontSize = 11.sp, color = SoftSage, fontWeight = FontWeight.Bold)
                    }

                    // Browse presets dropdown/sheet toggle
                    OutlinedButton(
                        onClick = { showPresetSelector = !showPresetSelector },
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .height(30.dp)
                            .testTag("browse_presets_button"),
                        contentPadding = PaddingValues(horizontal = 8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, IndigoBorderFocused)
                    ) {
                        Text(
                            text = if (showPresetSelector) "Close" else "Presets",
                            fontSize = 11.sp,
                            color = TextMediumEmphasis,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    if (text.isNotEmpty()) {
                        IconButton(
                            onClick = onClear,
                            modifier = Modifier
                                .size(30.dp)
                                .testTag("clear_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear input",
                                tint = TextMediumEmphasis,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }
                }
            }

            // Expandable Sample Presets Carousel / Grid
            AnimatedVisibility(
                visible = showPresetSelector,
                enter = fadeIn() + slideInVertically()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 12.dp, bottom = 4.dp)
                ) {
                    Text(
                        text = "SELECT A REAL-WORLD THREAT TEMPLATE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = TextMuted
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        ScamShieldViewModel.SAMPLE_PRESETS.forEach { preset ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(IndigoSurfaceHover)
                                    .border(1.dp, IndigoBorder, RoundedCornerShape(12.dp))
                                    .clickable {
                                        onSelectPreset(preset)
                                        showPresetSelector = false
                                    }
                                    .padding(horizontal = 12.dp, vertical = 8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = preset.title,
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = TextHighEmphasis
                                        )
                                        Text(
                                            text = preset.preview,
                                            fontSize = 10.5.sp,
                                            color = TextMediumEmphasis,
                                            maxLines = 1
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(
                                                if (preset.categoryBadge == "Safe Contact") SoftSageContainer
                                                else Color(0xFF3B1E28)
                                            )
                                            .padding(horizontal = 6.dp, vertical = 3.dp)
                                    ) {
                                        Text(
                                            text = preset.categoryBadge,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = if (preset.categoryBadge == "Safe Contact") SoftSage else RiskHighRose
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = text,
                onValueChange = onTextChange,
                placeholder = {
                    Text(
                        text = "Paste suspicious text, SMS, WhatsApp forward, or email here...",
                        fontSize = 14.sp,
                        color = TextMuted
                    )
                },
                minLines = 3,
                maxLines = 6,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = IndigoCanvasDark,
                    unfocusedContainerColor = IndigoCanvasDark,
                    focusedBorderColor = SoftSage,
                    unfocusedBorderColor = IndigoBorder,
                    focusedTextColor = TextHighEmphasis,
                    unfocusedTextColor = TextHighEmphasis
                ),
                shape = RoundedCornerShape(14.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("message_input_field")
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${text.length} / 4000",
                    fontSize = 11.sp,
                    color = TextMuted,
                    fontWeight = FontWeight.Medium
                )

                // Human-centric Trustworthy Deep Indigo to Sage Gradient Button
                Button(
                    onClick = onAnalyze,
                    enabled = text.isNotBlank() && !isLoading,
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color.Transparent,
                        disabledContainerColor = IndigoSurfaceHover
                    ),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 10.dp),
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            if (text.isNotBlank() && !isLoading) {
                                Brush.horizontalGradient(
                                    colors = listOf(HeroElectricBlue, HeroCyanGlow)
                                )
                            } else {
                                Brush.horizontalGradient(
                                    colors = listOf(IndigoSurfaceHover, IndigoSurfaceHover)
                                )
                            }
                        )
                        .testTag("analyze_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Security,
                        contentDescription = null,
                        tint = if (text.isNotBlank() && !isLoading) Color.White else TextMuted,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (isLoading) "Scanning..." else "Analyze Threat",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = if (text.isNotBlank() && !isLoading) Color.White else TextMuted
                    )
                }
            }
        }
    }
}

@Composable
private fun NeonLoadingCard() {
    val infiniteTransition = rememberInfiniteTransition(label = "skeleton_shimmer")
    val shimmerTranslate by infiniteTransition.animateFloat(
        initialValue = -300f,
        targetValue = 1200f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_offset"
    )

    // Stage pulse rotation for visual progress
    val stagePulse by infiniteTransition.animateFloat(
        initialValue = 0.35f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "stage_pulse"
    )

    val shimmerBrush = Brush.linearGradient(
        colors = listOf(
            GlassSkeletonBase,
            GlassSkeletonHighlight,
            GlassSkeletonBase
        ),
        start = Offset(shimmerTranslate - 250f, 0f),
        end = Offset(shimmerTranslate + 250f, 250f)
    )

    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, GlassBorderLuminous, RoundedCornerShape(22.dp))
            .testTag("analysis_loading_skeleton_card")
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            // Live Visual Progress Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(SoftSageContainer)
                            .border(1.dp, SoftSage.copy(alpha = stagePulse), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = SoftSage,
                            modifier = Modifier.size(20.dp),
                            strokeWidth = 2.5.dp
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "AI Threat Analysis In Progress",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = TextHighEmphasis
                        )
                        Text(
                            text = "Synthesizing Heuristic Rules & Gemini Zero-Trust Model",
                            fontSize = 11.sp,
                            color = SoftSage
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(SoftSageContainer)
                        .border(1.dp, SoftSage.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "LIVE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 1.sp,
                        color = SoftSage
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Visual Progress Step Badges
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LoadingStepPill(
                    icon = Icons.Default.Dns,
                    title = "URLs",
                    isCurrent = true,
                    alpha = stagePulse,
                    modifier = Modifier.weight(1f)
                )
                LoadingStepPill(
                    icon = Icons.Default.WarningAmber,
                    title = "Urgency",
                    isCurrent = true,
                    alpha = stagePulse * 0.8f,
                    modifier = Modifier.weight(1f)
                )
                LoadingStepPill(
                    icon = Icons.Default.Fingerprint,
                    title = "Vectors",
                    isCurrent = false,
                    alpha = 0.4f,
                    modifier = Modifier.weight(1f)
                )
                LoadingStepPill(
                    icon = Icons.Default.Shield,
                    title = "Calibrate",
                    isCurrent = false,
                    alpha = 0.4f,
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Skeleton Placeholder 1: Threat Score Radial / Summary Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(shimmerBrush)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.7f)
                            .height(14.dp)
                            .clip(RoundedCornerShape(7.dp))
                            .background(shimmerBrush)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.95f)
                            .height(10.dp)
                            .clip(RoundedCornerShape(5.dp))
                            .background(shimmerBrush)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Skeleton Placeholder 2: Multi-line analysis narrative skeleton
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(shimmerBrush)
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Skeleton Placeholder 3: Two pill tags
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(28.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(shimmerBrush)
                )
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(28.dp)
                        .clip(RoundedCornerShape(14.dp))
                        .background(shimmerBrush)
                )
            }
        }
    }
}

@Composable
private fun LoadingStepPill(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    isCurrent: Boolean,
    alpha: Float,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isCurrent) IndigoSurfaceHover else GlassSurfaceUltra)
            .border(
                width = 1.dp,
                color = if (isCurrent) SoftSage.copy(alpha = alpha) else IndigoBorder,
                shape = RoundedCornerShape(10.dp)
            )
            .padding(vertical = 6.dp, horizontal = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isCurrent) SoftSage else TextMuted,
                modifier = Modifier.size(11.dp)
            )
            Spacer(modifier = Modifier.width(3.dp))
            Text(
                text = title,
                fontSize = 9.5.sp,
                fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                color = if (isCurrent) TextHighEmphasis else TextMuted
            )
        }
    }
}

@Composable
private fun GlassErrorCard(message: String) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = RiskCriticalMagenta.copy(alpha = 0.15f)),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, RiskCriticalMagenta.copy(alpha = 0.6f), RoundedCornerShape(16.dp))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.ErrorOutline,
                contentDescription = "Error",
                tint = RiskCriticalMagenta,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = message,
                fontSize = 13.sp,
                color = TextHighEmphasis
            )
        }
    }
}

/* =========================================================================
   TAB 1: THREAT OVERVIEW (Matches Screenshot Layout 1 with Equalizer, Score,
   Origin-Destination Pills, and Actions)
   ========================================================================= */

@Composable
private fun ThreatOverviewSection(
    result: ScamAnalysisResult,
    onActionTaken: (String) -> Unit
) {
    val isFraud = result.isFraud
    val riskColor = if (isFraud) FraudRed else SafeGreen
    val riskContainer = if (isFraud) FraudRedContainer else SafeGreenContainer
    val riskBorder = if (isFraud) FraudRedBorder else SafeGreenBorder
    val statusTitle = if (isFraud) "FRAUD DETECTED" else "SAFE / VERIFIED"
    val riskBadge = if (isFraud) "FRAUD • ${result.estimatedRiskScore}% RISK" else "SAFE • ${result.estimatedRiskScore}% RISK"

    Column(
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        // High-Contrast Red vs Green Verdict Banner
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = riskContainer),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.5.dp, riskBorder, RoundedCornerShape(20.dp))
                .testTag("fraud_verdict_banner")
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f)
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(riskColor.copy(alpha = 0.25f))
                            .border(1.5.dp, riskColor, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (isFraud) Icons.Default.Warning else Icons.Default.CheckCircle,
                            contentDescription = statusTitle,
                            tint = riskColor,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = statusTitle,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp,
                            color = riskColor
                        )
                        Text(
                            text = if (isFraud) "Deceptive social engineering threat detected"
                                   else "Clean message signals; no fraud indicators identified",
                            fontSize = 11.sp,
                            color = TextHighEmphasis
                        )
                    }
                }

                // Explicit Risk in Number or Percentage Box
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(riskColor)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                ) {
                    Text(
                        text = "${result.estimatedRiskScore}% Risk",
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }
        }

        // Main Threat Card (Like the $12,847.92 Transaction card in screenshot)
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.2.dp, riskColor.copy(alpha = 0.6f), RoundedCornerShape(24.dp))
                .testTag("analysis_result_card")
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(40.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(riskColor.copy(alpha = 0.2f))
                                .border(1.dp, riskColor.copy(alpha = 0.6f), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = if (isFraud) Icons.Default.Warning else Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = riskColor,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = if (isFraud) "FRAUD CLASSIFICATION" else "SAFETY CLASSIFICATION",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                color = TextMediumEmphasis
                            )
                            Text(
                                text = result.category,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = TextHighEmphasis
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(riskColor.copy(alpha = 0.2f))
                            .border(1.dp, riskColor, RoundedCornerShape(12.dp))
                            .padding(horizontal = 10.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = riskBadge,
                            color = riskColor,
                            fontWeight = FontWeight.Black,
                            fontSize = 11.sp,
                            letterSpacing = 0.8.sp,
                            modifier = Modifier.testTag("risk_level_badge")
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Threat Equalizer wave in Red or Green
                ThreatEqualizerBar(riskScore = result.estimatedRiskScore, riskColor = riskColor)

                Spacer(modifier = Modifier.height(16.dp))

                // Context Origin & Destination pills
                DualNodePillSection(result = result)
            }
        }

        // Risk Confidence Slider / Gauge Card (Red if fraud, Green if safe)
        RiskConfidenceGaugeCard(
            score = result.estimatedRiskScore,
            isFraud = isFraud,
            riskColor = riskColor
        )

        // Identified Red Flags Card
        RedFlagsDetailCard(redFlags = result.redFlags, riskColor = riskColor)

        // URL Analysis if present
        if (result.detectedUrls.isNotEmpty()) {
            ExtractedUrlsCard(urls = result.detectedUrls)
        }

        // AI Recommendations & Action Buttons (From screenshot: Freeze Card / Secure Device)
        AiRecommendationsActionCard(
            result = result,
            onActionTaken = onActionTaken
        )
    }
}

@Composable
private fun ThreatEqualizerBar(
    riskScore: Int,
    riskColor: Color
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(54.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(IndigoCanvasDark)
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val barCount = 38
            val spacing = size.width / barCount
            val barWidth = spacing * 0.45f
            val baseHeight = size.height

            for (i in 0 until barCount) {
                // Sine wave height modulation with risk intensity
                val factor = (Math.sin(i * 0.4).toFloat() + 1f) * 0.5f
                val activeIntensity = (riskScore / 100f)
                val barHeight = (factor * baseHeight * 0.7f + 6.dp.toPx()) * (0.4f + activeIntensity * 0.6f)

                val x = i * spacing + spacing / 2
                val yTop = (baseHeight - barHeight) / 2
                val yBottom = yTop + barHeight

                val isHighTension = i > (barCount * (1f - activeIntensity))
                val barColor = if (isHighTension) riskColor else HeroCyanGlow.copy(alpha = 0.5f)

                drawLine(
                    color = barColor,
                    start = Offset(x, yTop),
                    end = Offset(x, yBottom),
                    strokeWidth = barWidth,
                    cap = StrokeCap.Round
                )
            }
        }
    }
}

@Composable
private fun DualNodePillSection(result: ScamAnalysisResult) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Node 1: Incoming Vector
        Box(
            modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(16.dp))
                .background(Color(0xFF081220))
                .border(1.dp, Color(0x3338BDF8), RoundedCornerShape(16.dp))
                .padding(12.dp)
        ) {
            Column {
                Text(
                    text = "SENDER VECTOR",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextMuted,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = if (result.detectedUrls.isNotEmpty()) "Web Link / SMS" else "Direct Message",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextHighEmphasis
                )
                Text(
                    text = "Unverified Origin",
                    fontSize = 10.sp,
                    color = RiskHighRose
                )
            }
        }

        // Center glowing particle connector
        Box(
            modifier = Modifier
                .padding(horizontal = 8.dp)
                .size(24.dp)
                .clip(CircleShape)
                .background(HeroHotPink.copy(alpha = 0.2f))
                .border(1.dp, HeroHotPink.copy(alpha = 0.7f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(HeroCyanGlow)
            )
        }

        // Node 2: Target Impact
        Box(
            modifier = Modifier
                .weight(1f)
                .clip(RoundedCornerShape(16.dp))
                .background(IndigoSurface)
                .border(1.dp, IndigoBorder, RoundedCornerShape(16.dp))
                .padding(12.dp)
        ) {
            Column {
                Text(
                    text = "INTENDED TARGET",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextMuted,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = "Credentials / OTP",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextHighEmphasis
                )
                Text(
                    text = "High Exposure Risk",
                    fontSize = 10.sp,
                    color = HeroCyanGlow
                )
            }
        }
    }
}

@Composable
private fun RiskConfidenceGaugeCard(
    score: Int,
    isFraud: Boolean,
    riskColor: Color
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Threat Risk Percentage",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TextHighEmphasis
                    )
                    Text(
                        text = "$score out of 100 Risk Score",
                        fontSize = 11.sp,
                        color = TextMuted
                    )
                }

                Text(
                    text = "$score%",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = riskColor,
                    modifier = Modifier.testTag("risk_score_value")
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Glowing Slider Track inspired by the screenshot's slider knob
            val animatedScore by animateFloatAsState(
                targetValue = score / 100f,
                animationSpec = tween(durationMillis = 800, easing = FastOutSlowInEasing),
                label = "score_anim"
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(20.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                // Background Track
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(IndigoCanvasDark)
                )

                // Fill Track with Gradient (Safe green or fraud red)
                Box(
                    modifier = Modifier
                        .fillMaxWidth(animatedScore)
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(
                            Brush.horizontalGradient(
                                colors = if (isFraud) listOf(HeroCyanGlow, FraudRed)
                                         else listOf(SafeGreen, SafeGreen)
                            )
                        )
                )

                // Glowing Thumb Knob
                Box(
                    modifier = Modifier
                        .padding(start = (280.dp * animatedScore).coerceAtLeast(0.dp))
                        .size(18.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(3.dp, riskColor, CircleShape)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("0% (Clean)", fontSize = 10.sp, color = SafeGreen)
                Text("50% (Threshold)", fontSize = 10.sp, color = TextMuted)
                Text("100% (Critical)", fontSize = 10.sp, color = FraudRed)
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Status Verdict banner below gauge
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isFraud) FraudRedContainer else SafeGreenContainer)
                    .border(
                        1.dp,
                        if (isFraud) FraudRedBorder else SafeGreenBorder,
                        RoundedCornerShape(12.dp)
                    )
                    .padding(10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (isFraud) Icons.Default.Warning else Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = riskColor,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isFraud) "FRAUD DETECTED: Deceptive intent and high-risk indicators confirmed ($score%)."
                               else "SAFE / NO FRAUD: Clean message pattern verified ($score% minimal risk).",
                        fontSize = 11.5.sp,
                        color = riskColor,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Composable
private fun RedFlagsDetailCard(
    redFlags: List<String>,
    riskColor: Color
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = null,
                    tint = HeroCyanGlow,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "IDENTIFIED RED FLAGS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = HeroCyanGlow
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                redFlags.forEach { flag ->
                    Row(
                        verticalAlignment = Alignment.Top,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .padding(top = 4.dp, end = 10.dp)
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(riskColor)
                        )
                        Text(
                            text = flag,
                            fontSize = 13.sp,
                            color = TextHighEmphasis,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ExtractedUrlsCard(urls: List<UrlAnalysis>) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(20.dp))
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Text(
                text = "EXTRACTED LINK INSPECTOR",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = HeroCyanGlow
            )
            Spacer(modifier = Modifier.height(10.dp))

            urls.forEach { item ->
                val badgeColor = if (item.suspicious) RiskHighRose else RiskLowGreen
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF081220))
                        .border(1.dp, badgeColor.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Link,
                                contentDescription = null,
                                tint = badgeColor,
                                modifier = Modifier.size(15.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = item.url,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextHighEmphasis
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = item.reason,
                            fontSize = 11.sp,
                            color = TextMediumEmphasis
                        )
                    }
                }
                Spacer(modifier = Modifier.height(6.dp))
            }
        }
    }
}

@Composable
private fun AiRecommendationsActionCard(
    result: ScamAnalysisResult,
    onActionTaken: (String) -> Unit
) {
    Card(
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, IndigoBorder, RoundedCornerShape(22.dp))
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(IndigoSurfaceHover),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = HeroCyanGlow,
                        modifier = Modifier.size(18.dp)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "AI Recommendations",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextHighEmphasis
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = result.recommendedAction,
                fontSize = 13.sp,
                color = TextHighEmphasis,
                lineHeight = 19.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Dual Action Buttons exactly matching the screenshot pill buttons:
            // "Freeze Card" (cyan-blue pill) and "Secure Device" (dark pill)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = { onActionTaken("Block Sender & Quarantine") },
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = HeroElectricBlue,
                        contentColor = Color.White
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.AcUnit,
                        contentDescription = null,
                        tint = HeroCyanGlow,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Quarantine Link",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Button(
                    onClick = { onActionTaken("Mark Safe / Report") },
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = IndigoSurfaceHover,
                        contentColor = TextHighEmphasis
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(44.dp)
                        .border(1.dp, IndigoBorder, RoundedCornerShape(20.dp))
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = TextMediumEmphasis,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Secure Device",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

/* =========================================================================
   TAB 2: THREAT GRAPH (Matches Screenshot Layout 2 with Node Network Graph)
   ========================================================================= */

@Composable
private fun ThreatGraphSection(result: ScamAnalysisResult) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(24.dp))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "THREAT ATTACK GRAPH",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    color = HeroCyanGlow
                )
                Text(
                    text = "5 Nodes Linked",
                    fontSize = 11.sp,
                    color = TextMuted
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Visual Node Graph matching screenshot screen 2
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(IndigoCanvasDark)
                    .border(1.dp, IndigoBorder, RoundedCornerShape(16.dp)),
                contentAlignment = Alignment.Center
            ) {
                // Background Neural Dots
                Canvas(modifier = Modifier.fillMaxSize()) {
                    // Center node to outer nodes glowing curved connection lines
                    val center = Offset(size.width / 2, size.height / 2)
                    val p1 = Offset(size.width * 0.22f, size.height * 0.22f)
                    val p2 = Offset(size.width * 0.78f, size.height * 0.25f)
                    val p3 = Offset(size.width * 0.15f, size.height * 0.75f)
                    val p4 = Offset(size.width * 0.75f, size.height * 0.82f)

                    listOf(p1, p2, p3, p4).forEach { pt ->
                        drawLine(
                            color = HeroHotPink.copy(alpha = 0.5f),
                            start = center,
                            end = pt,
                            strokeWidth = 2.dp.toPx()
                        )
                    }
                }

                // Node 1: Top Left Vector
                GraphNodeBadge(
                    text = "Spoofed SMS",
                    icon = Icons.Default.Radar,
                    isHighRisk = true,
                    modifier = Modifier.align(Alignment.TopStart).padding(start = 20.dp, top = 25.dp)
                )

                // Node 2: Top Right Vector
                GraphNodeBadge(
                    text = "Malicious URL",
                    icon = Icons.Default.Link,
                    isHighRisk = true,
                    modifier = Modifier.align(Alignment.TopEnd).padding(end = 20.dp, top = 30.dp)
                )

                // Central Node: Impersonation Target (like Noah Hayes card in screenshot)
                Box(
                    modifier = Modifier
                        .size(130.dp, 100.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Color(0x66FF007A), Color(0xFF132035))
                            )
                        )
                        .border(1.5.dp, HeroHotPink, RoundedCornerShape(18.dp))
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = result.category.take(16),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextHighEmphasis,
                            textAlign = TextAlign.Center
                        )
                        Box(
                            modifier = Modifier
                                .padding(top = 4.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(RiskCriticalMagenta.copy(alpha = 0.3f))
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text("High Risk Node", fontSize = 8.sp, color = RiskCriticalMagenta, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Node 3: Bottom Left Vector
                GraphNodeBadge(
                    text = "Credential Hook",
                    icon = Icons.Default.Lock,
                    isHighRisk = false,
                    modifier = Modifier.align(Alignment.BottomStart).padding(start = 24.dp, bottom = 25.dp)
                )

                // Node 4: Bottom Right Vector
                GraphNodeBadge(
                    text = "Target Device",
                    icon = Icons.Default.Shield,
                    isHighRisk = false,
                    modifier = Modifier.align(Alignment.BottomEnd).padding(end = 24.dp, bottom = 20.dp)
                )
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Status chip like "5 Failed Login Attempts • 2m ago" in screenshot
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xFF111E32))
                    .border(1.dp, Color(0x3338BDF8), RoundedCornerShape(20.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(HeroHotPink)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Active correlation: ${result.redFlags.size} indicators detected across attack vector",
                        fontSize = 12.sp,
                        color = TextHighEmphasis,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
private fun GraphNodeBadge(
    text: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isHighRisk: Boolean,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(Color(0xFF0F233E))
            .border(1.dp, if (isHighRisk) HeroHotPink else HeroCyanGlow, RoundedCornerShape(12.dp))
            .padding(8.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isHighRisk) HeroHotPink else HeroCyanGlow,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(text = text, fontSize = 10.sp, color = TextHighEmphasis, fontWeight = FontWeight.Bold)
        }
    }
}

/* =========================================================================
   TAB 3: THREAT TIMELINE (Step-by-step Attack Progression breakdown)
   ========================================================================= */

@Composable
private fun ThreatTimelineSection(result: ScamAnalysisResult) {
    Card(
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(24.dp))
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                text = "ATTACK PROGRESSION TIMELINE",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp,
                color = HeroCyanGlow
            )
            Spacer(modifier = Modifier.height(14.dp))

            val timelineSteps = listOf(
                Pair("Phase 1: Initial Hook", "Attacker crafts urgent premise (account freeze / delivery failure / prize)."),
                Pair("Phase 2: Artificial Urgency", "Pressure applied to bypass user critical thinking within minutes."),
                Pair("Phase 3: Redirection / Phishing Link", "Victim prompted to open external unverified URL or dial fake helpline."),
                Pair("Phase 4: Credential Exploitation", "Demands for OTP, PIN, password, or direct financial authorization.")
            )

            timelineSteps.forEachIndexed { index, step ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.Top
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(HeroElectricBlue)
                                .border(1.dp, HeroCyanGlow, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "${index + 1}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                        if (index < timelineSteps.size - 1) {
                            Box(
                                modifier = Modifier
                                    .width(2.dp)
                                    .height(36.dp)
                                    .background(Color(0x3338BDF8))
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = step.first,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextHighEmphasis
                        )
                        Text(
                            text = step.second,
                            fontSize = 12.sp,
                            color = TextMediumEmphasis,
                            lineHeight = 17.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }
        }
    }
}

/* =========================================================================
   BOTTOM NAVIGATION BAR (Matching screenshot floating pill bar: Home / Alerts / Insights / Profile)
   ========================================================================= */

@Composable
private fun InboxHeroBottomBar(
    selectedIndex: Int,
    onSelect: (Int) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding()
            .padding(horizontal = 24.dp, vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(30.dp))
                .background(Color(0xE6121528))
                .border(1.dp, IndigoBorder, RoundedCornerShape(30.dp))
                .padding(horizontal = 14.dp, vertical = 8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                BottomNavItem(
                    label = "Home",
                    icon = Icons.Default.Home,
                    isSelected = selectedIndex == 0,
                    onClick = { onSelect(0) }
                )
                BottomNavItem(
                    label = "Alerts",
                    icon = Icons.Default.Radar,
                    isSelected = selectedIndex == 1,
                    onClick = { onSelect(1) }
                )
                BottomNavItem(
                    label = "Samples",
                    icon = Icons.Default.PieChart,
                    isSelected = selectedIndex == 2,
                    onClick = { onSelect(2) }
                )
                BottomNavItem(
                    label = "Profile",
                    icon = Icons.Default.Person,
                    isSelected = selectedIndex == 3,
                    onClick = { onSelect(3) }
                )
            }
        }
    }
}

@Composable
private fun BottomNavItem(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val animatedColor by animateColorAsState(
        targetValue = if (isSelected) HeroCyanGlow else TextMuted,
        label = "nav_item_color"
    )

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) IndigoSurfaceHover else Color.Transparent)
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = animatedColor,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = label,
                fontSize = 10.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = animatedColor
            )
        }
    }
}

@Composable
private fun CyberGridBackground(modifier: Modifier = Modifier) {
    Canvas(modifier = modifier) {
        val step = 32.dp.toPx()
        val cols = (size.width / step).toInt() + 1
        val rows = (size.height / step).toInt() + 1

        for (i in 0..cols) {
            for (j in 0..rows) {
                drawCircle(
                    color = GridDotColor,
                    radius = 1.2.dp.toPx(),
                    center = Offset(i * step, j * step)
                )
            }
        }
    }
}

@Composable
private fun HeroPrivacyDisclaimer() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(bottom = 4.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Lock,
                contentDescription = null,
                tint = HeroCyanGlow,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Inbox Hero Zero-Trust Engine: No messages stored.",
                fontSize = 11.sp,
                color = TextMediumEmphasis,
                fontWeight = FontWeight.SemiBold
            )
        }

        Text(
            text = "Automated threat telemetry & contextual reasoning. When in doubt, verify with your provider directly.",
            fontSize = 10.sp,
            color = TextMuted,
            textAlign = TextAlign.Center,
            lineHeight = 14.sp
        )
    }
}
