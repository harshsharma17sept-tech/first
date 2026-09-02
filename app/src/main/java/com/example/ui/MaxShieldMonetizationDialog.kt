package com.example.ui

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.ui.theme.GoldAccent
import com.example.ui.theme.GoldAccentGlow
import com.example.ui.theme.GoldBorder
import com.example.ui.theme.GoldContainer
import com.example.ui.theme.HeroCardGlass
import com.example.ui.theme.HeroCyanGlow
import com.example.ui.theme.HeroElectricBlue
import com.example.ui.theme.IndigoBorder
import com.example.ui.theme.IndigoCanvasDark
import com.example.ui.theme.IndigoSurface
import com.example.ui.theme.IndigoSurfaceHover
import com.example.ui.theme.SafeGreen
import com.example.ui.theme.TextHighEmphasis
import com.example.ui.theme.TextMediumEmphasis
import com.example.ui.theme.TextMuted

private enum class MonetizedPlan(
    val id: String,
    val title: String,
    val price: String,
    val period: String,
    val badge: String?,
    val trialInfo: String
) {
    ANNUAL(
        id = "annual",
        title = "Annual Defense",
        price = "$39.99",
        period = "/ year ($3.33/mo)",
        badge = "BEST VALUE • SAVE 33%",
        trialInfo = "Includes 7-Day Free Trial"
    ),
    MONTHLY(
        id = "monthly",
        title = "Monthly Flex",
        price = "$4.99",
        period = "/ month",
        badge = null,
        trialInfo = "7-Day Free Trial"
    ),
    LIFETIME(
        id = "lifetime",
        title = "Lifetime MaxShield",
        price = "$89.99",
        period = "one-time payment",
        badge = "VIP PASS",
        trialInfo = "Never pay again"
    )
}

@Composable
fun MaxShieldMonetizationDialog(
    isCurrentPro: Boolean,
    onDismiss: () -> Unit,
    onSubscribe: (String) -> Unit
) {
    var selectedPlan by remember { mutableStateOf(MonetizedPlan.ANNUAL) }
    val scrollState = rememberScrollState()

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(26.dp))
                .background(IndigoCanvasDark)
                .border(1.5.dp, GoldBorder, RoundedCornerShape(26.dp))
                .testTag("maxshield_monetization_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scrollState)
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Top close button
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(GoldContainer)
                            .border(1.dp, GoldAccent.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = GoldAccentGlow,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "MONETIZED TIER",
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Black,
                                color = GoldAccentGlow,
                                letterSpacing = 0.8.sp
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(IndigoSurfaceHover)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = TextMediumEmphasis,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Glowing Shield Crest Icon
                Box(
                    modifier = Modifier
                        .size(68.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(GoldAccent.copy(alpha = 0.35f), Color.Transparent)
                            )
                        )
                        .border(2.dp, GoldAccent, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "MaxShield",
                        tint = GoldAccentGlow,
                        modifier = Modifier.size(38.dp)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "Upgrade to MaxShield Pro",
                    fontSize = 21.sp,
                    fontWeight = FontWeight.Black,
                    color = TextHighEmphasis,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "Autonomous zero-trust protection, automated SMS interceptor, and 24/7 fraud concierge.",
                    fontSize = 12.sp,
                    color = TextMediumEmphasis,
                    textAlign = TextAlign.Center,
                    lineHeight = 17.sp,
                    modifier = Modifier.padding(horizontal = 8.dp)
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Feature Comparison List
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MonetizedFeatureRow(
                        title = "24/7 Autonomous SMS Auto-Firewall",
                        description = "Pre-screens smishing and quarantined links in the background before you tap"
                    )
                    MonetizedFeatureRow(
                        title = "Unlimited Gemini Zero-Trust Scans",
                        description = "Full heuristic deep scans with no daily limits or throttled quotas"
                    )
                    MonetizedFeatureRow(
                        title = "Deepfake & Audio Voice Scam Guard",
                        description = "Acoustic AI biometric fingerprinting filters impersonation phone calls"
                    )
                    MonetizedFeatureRow(
                        title = "$1,000,000 Fraud Coverage & Direct Bank Line",
                        description = "Priority emergency dispatch hotline with certified fraud restoration counsel"
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Plan Selector Cards
                Text(
                    text = "CHOOSE YOUR DEFENSE PLAN",
                    fontSize = 10.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextMuted,
                    letterSpacing = 1.sp,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(8.dp))

                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MonetizedPlan.values().forEach { plan ->
                        PlanOptionCard(
                            plan = plan,
                            isSelected = selectedPlan == plan,
                            onClick = { selectedPlan = plan }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Big Upgrade CTA Button
                Button(
                    onClick = { onSubscribe(selectedPlan.id) },
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(GoldAccent, GoldAccentGlow, HeroElectricBlue)
                            )
                        )
                        .testTag("subscribe_maxshield_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Bolt,
                            contentDescription = null,
                            tint = Color.Black,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isCurrentPro) "Manage Active Subscription" else "Start 7-Day Free Trial",
                            fontSize = 14.5.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Black
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text("Not now", fontSize = 11.5.sp, color = TextMuted)
                    }
                    TextButton(onClick = { onSubscribe(selectedPlan.id) }) {
                        Text("Restore Purchases", fontSize = 11.5.sp, color = TextMediumEmphasis)
                    }
                }

                Text(
                    text = "Recurring billing via Google Play. Cancel anytime in Google Play Store subscriptions. Terms of Service & Zero-Trust Privacy Guarantee apply.",
                    fontSize = 9.5.sp,
                    color = TextMuted,
                    textAlign = TextAlign.Center,
                    lineHeight = 13.sp,
                    modifier = Modifier.padding(horizontal = 10.dp)
                )
            }
        }
    }
}

@Composable
private fun MonetizedFeatureRow(
    title: String,
    description: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(IndigoSurface)
            .border(1.dp, IndigoBorder, RoundedCornerShape(12.dp))
            .padding(10.dp),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(20.dp)
                .clip(CircleShape)
                .background(SafeGreen.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Check,
                contentDescription = null,
                tint = SafeGreen,
                modifier = Modifier.size(13.dp)
            )
        }
        Spacer(modifier = Modifier.width(10.dp))
        Column {
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = TextHighEmphasis
            )
            Text(
                text = description,
                fontSize = 10.5.sp,
                color = TextMediumEmphasis,
                lineHeight = 14.sp
            )
        }
    }
}

@Composable
private fun PlanOptionCard(
    plan: MonetizedPlan,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val borderColor by animateColorAsState(
        targetValue = if (isSelected) GoldAccent else IndigoBorder,
        label = "plan_border"
    )
    val bgColor by animateColorAsState(
        targetValue = if (isSelected) GoldContainer else IndigoSurface,
        label = "plan_bg"
    )

    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor),
        modifier = Modifier
            .fillMaxWidth()
            .border(if (isSelected) 1.8.dp else 1.dp, borderColor, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .testTag("plan_card_${plan.id}")
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Radio indicator
                Box(
                    modifier = Modifier
                        .size(18.dp)
                        .clip(CircleShape)
                        .border(1.5.dp, if (isSelected) GoldAccent else TextMuted, CircleShape)
                        .background(if (isSelected) GoldAccent else Color.Transparent),
                    contentAlignment = Alignment.Center
                ) {
                    if (isSelected) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(Color.Black)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = plan.title,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextHighEmphasis
                        )
                        if (plan.badge != null) {
                            Spacer(modifier = Modifier.width(6.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(GoldAccent)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = plan.badge,
                                    fontSize = 8.5.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.Black
                                )
                            }
                        }
                    }
                    Text(
                        text = plan.trialInfo,
                        fontSize = 10.sp,
                        color = if (isSelected) GoldAccentGlow else TextMuted
                    )
                }
            }

            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = plan.price,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = if (isSelected) GoldAccentGlow else TextHighEmphasis
                )
                Text(
                    text = plan.period,
                    fontSize = 10.sp,
                    color = TextMuted
                )
            }
        }
    }
}
