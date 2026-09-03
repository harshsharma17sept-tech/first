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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.ui.theme.EditorialAccentOrange
import com.example.ui.theme.EditorialBackground
import com.example.ui.theme.EditorialBorder
import com.example.ui.theme.EditorialBorderDark
import com.example.ui.theme.EditorialDeepBlack
import com.example.ui.theme.EditorialOrangeBg
import com.example.ui.theme.EditorialOrangeBorder
import com.example.ui.theme.EditorialSurface
import com.example.ui.theme.EditorialSurfaceMuted
import com.example.ui.theme.EditorialSurfaceWhite
import com.example.ui.theme.EditorialTextMuted
import com.example.ui.theme.EditorialTextPrimary
import com.example.ui.theme.EditorialTextSecondary

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
                .fillMaxWidth(0.94f)
                .clip(RoundedCornerShape(4.dp))
                .background(EditorialSurface)
                .border(1.dp, EditorialBorder, RoundedCornerShape(4.dp))
                .testTag("maxshield_monetization_dialog")
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .verticalScroll(scrollState)
                    .padding(20.dp),
                horizontalAlignment = Alignment.Start
            ) {
                // Top header bar with technical label and close button
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
                            text = "MAXSHIELD // PRO CYBERLAB",
                            fontFamily = FontFamily.Monospace,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = EditorialDeepBlack,
                            letterSpacing = 1.sp
                        )
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .size(28.dp)
                            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "Close",
                            tint = EditorialDeepBlack,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Oversized editorial headline
                Text(
                    text = "AUTONOMOUS\nTHREAT DEFENSE.",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    lineHeight = 27.sp,
                    letterSpacing = (-0.5).sp,
                    color = EditorialDeepBlack
                )

                Spacer(modifier = Modifier.height(6.dp))

                Text(
                    text = "Upgrade to MaxShield Pro for continuous AI heuristic interception, automated threat quarantine, and advanced link analysis.",
                    fontSize = 13.sp,
                    color = EditorialTextSecondary,
                    lineHeight = 18.sp
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Feature Checklist in modular bordered rows
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                        .background(EditorialSurfaceWhite)
                ) {
                    EditorialFeatureRow(
                        index = "01",
                        title = "24/7 Autonomous SMS Auto-Firewall",
                        description = "Pre-screens smishing and quarantined links in background"
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                    EditorialFeatureRow(
                        index = "02",
                        title = "Unlimited Gemini Neural Deep Scans",
                        description = "Full heuristic deep scans with no daily throttles"
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                    EditorialFeatureRow(
                        index = "03",
                        title = "Deepfake & Audio Voice Scam Guard",
                        description = "Acoustic AI fingerprinting against impersonation"
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(EditorialBorder))
                    EditorialFeatureRow(
                        index = "04",
                        title = "$1,000,000 Fraud Restoration Coverage",
                        description = "Priority emergency dispatch hotline with certified counsel"
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = "SELECT PLAN // MODULAR SUBSCRIPTION",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = EditorialTextMuted,
                    letterSpacing = 1.sp
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Plan Selector Cards
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    MonetizedPlan.values().forEach { plan ->
                        val isSelected = selectedPlan == plan
                        val borderColor by animateColorAsState(
                            targetValue = if (isSelected) EditorialAccentOrange else EditorialBorder,
                            label = "plan_border"
                        )
                        val bgColor by animateColorAsState(
                            targetValue = if (isSelected) EditorialOrangeBg else EditorialSurfaceWhite,
                            label = "plan_bg"
                        )

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(2.dp))
                                .background(bgColor)
                                .border(if (isSelected) 1.5.dp else 1.dp, borderColor, RoundedCornerShape(2.dp))
                                .clickable { selectedPlan = plan }
                                .padding(12.dp)
                                .testTag("plan_card_${plan.id}"),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = plan.title,
                                        fontSize = 14.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = EditorialDeepBlack
                                    )
                                    if (plan.badge != null) {
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Box(
                                            modifier = Modifier
                                                .background(EditorialAccentOrange)
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = plan.badge,
                                                fontSize = 8.5.sp,
                                                fontWeight = FontWeight.Black,
                                                color = Color.White
                                            )
                                        }
                                    }
                                }
                                Text(
                                    text = plan.trialInfo,
                                    fontSize = 11.sp,
                                    color = EditorialTextSecondary
                                )
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = plan.price,
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (isSelected) EditorialAccentOrange else EditorialDeepBlack
                                )
                                Text(
                                    text = plan.period,
                                    fontSize = 10.sp,
                                    color = EditorialTextMuted
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Primary CTA Button (Accent Orange)
                Button(
                    onClick = { onSubscribe(selectedPlan.id) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("subscribe_maxshield_button"),
                    shape = RoundedCornerShape(2.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = EditorialAccentOrange,
                        contentColor = Color.White
                    )
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Bolt,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = Color.White
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isCurrentPro) "UPDATE SUBSCRIPTION" else "ACTIVATE PRO SHIELD",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Encrypted 256-bit checkout • Cancel anytime • Google Play Billing",
                    fontSize = 10.5.sp,
                    color = EditorialTextMuted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
private fun EditorialFeatureRow(
    index: String,
    title: String,
    description: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(10.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = index,
            fontFamily = FontFamily.Monospace,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
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
                text = description,
                fontSize = 11.sp,
                color = EditorialTextSecondary,
                lineHeight = 15.sp
            )
        }
    }
}
