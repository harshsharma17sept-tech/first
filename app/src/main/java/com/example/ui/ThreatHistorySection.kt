package com.example.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ScanHistoryItem
import com.example.ui.theme.FraudRed
import com.example.ui.theme.FraudRedBorder
import com.example.ui.theme.FraudRedContainer
import com.example.ui.theme.HeroCardGlass
import com.example.ui.theme.HeroCardGlassBorder
import com.example.ui.theme.HeroCyanGlow
import com.example.ui.theme.HeroElectricBlue
import com.example.ui.theme.IndigoBorder
import com.example.ui.theme.IndigoSurface
import com.example.ui.theme.IndigoSurfaceHover
import com.example.ui.theme.SafeGreen
import com.example.ui.theme.SafeGreenBorder
import com.example.ui.theme.SafeGreenContainer
import com.example.ui.theme.SoftSage
import com.example.ui.theme.TextHighEmphasis
import com.example.ui.theme.TextMediumEmphasis
import com.example.ui.theme.TextMuted

private enum class HistoryFilter {
    ALL, FRAUD_ONLY, SAFE_ONLY
}

@Composable
fun ThreatHistorySection(
    historyList: List<ScanHistoryItem>,
    onSelect: (ScanHistoryItem) -> Unit,
    onDelete: (String) -> Unit,
    onClearAll: () -> Unit,
    onNewScan: () -> Unit,
    modifier: Modifier = Modifier
) {
    var activeFilter by remember { mutableStateOf(HistoryFilter.ALL) }

    val fraudCount = historyList.count { it.result.isFraud }
    val safeCount = historyList.count { !it.result.isFraud }

    val filteredList = when (activeFilter) {
        HistoryFilter.ALL -> historyList
        HistoryFilter.FRAUD_ONLY -> historyList.filter { it.result.isFraud }
        HistoryFilter.SAFE_ONLY -> historyList.filter { !it.result.isFraud }
    }

    Column(
        verticalArrangement = Arrangement.spacedBy(14.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("threat_history_section")
    ) {
        // Section Header Card
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, HeroCardGlassBorder, RoundedCornerShape(20.dp))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(IndigoSurfaceHover)
                                .border(1.dp, HeroCyanGlow.copy(alpha = 0.5f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.History,
                                contentDescription = null,
                                tint = HeroCyanGlow,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Scan History",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextHighEmphasis
                            )
                            Text(
                                text = "${historyList.size} threat analyses logged",
                                fontSize = 11.sp,
                                color = TextMuted
                            )
                        }
                    }

                    if (historyList.isNotEmpty()) {
                        OutlinedButton(
                            onClick = onClearAll,
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = TextMuted),
                            modifier = Modifier.testTag("clear_history_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Clear History",
                                modifier = Modifier.size(14.dp),
                                tint = TextMuted
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Clear All", fontSize = 11.sp, color = TextMuted)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Stat Summary Counters: RED vs GREEN
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Total Scans Stat
                    HistoryStatPill(
                        label = "Total Scans",
                        value = historyList.size.toString(),
                        accentColor = HeroCyanGlow,
                        modifier = Modifier.weight(1f)
                    )

                    // Fraud Detected (RED)
                    HistoryStatPill(
                        label = "Fraud Detected",
                        value = fraudCount.toString(),
                        accentColor = FraudRed,
                        modifier = Modifier.weight(1f)
                    )

                    // Safe Messages (GREEN)
                    HistoryStatPill(
                        label = "Safe / Verified",
                        value = safeCount.toString(),
                        accentColor = SafeGreen,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Filter Chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    HistoryFilterChip(
                        label = "All (${historyList.size})",
                        isSelected = activeFilter == HistoryFilter.ALL,
                        activeColor = HeroCyanGlow,
                        onClick = { activeFilter = HistoryFilter.ALL },
                        modifier = Modifier.weight(1f)
                    )
                    HistoryFilterChip(
                        label = "Fraud ($fraudCount)",
                        isSelected = activeFilter == HistoryFilter.FRAUD_ONLY,
                        activeColor = FraudRed,
                        onClick = { activeFilter = HistoryFilter.FRAUD_ONLY },
                        modifier = Modifier.weight(1f)
                    )
                    HistoryFilterChip(
                        label = "Safe ($safeCount)",
                        isSelected = activeFilter == HistoryFilter.SAFE_ONLY,
                        activeColor = SafeGreen,
                        onClick = { activeFilter = HistoryFilter.SAFE_ONLY },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // History List or Empty State
        if (filteredList.isEmpty()) {
            Card(
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, IndigoBorder, RoundedCornerShape(18.dp))
                    .padding(vertical = 12.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = TextMuted,
                        modifier = Modifier.size(36.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (historyList.isEmpty()) "No message scans yet" else "No matching items for this filter",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextHighEmphasis
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Scanned messages, phishing detections, and safe verifications will be logged here.",
                        fontSize = 12.sp,
                        color = TextMuted,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Button(
                        onClick = onNewScan,
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = HeroElectricBlue)
                    ) {
                        Text("Analyze a New Message", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                filteredList.forEach { item ->
                    ScanHistoryItemCard(
                        item = item,
                        onInspect = { onSelect(item) },
                        onDelete = { onDelete(item.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun ScanHistoryItemCard(
    item: ScanHistoryItem,
    onInspect: () -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isFraud = item.result.isFraud
    val riskScore = item.result.estimatedRiskScore
    val riskColor = if (isFraud) FraudRed else SafeGreen
    val riskContainer = if (isFraud) FraudRedContainer else SafeGreenContainer
    val riskBorder = if (isFraud) FraudRedBorder else SafeGreenBorder
    val statusLabel = if (isFraud) "FRAUD DETECTED" else "SAFE / VERIFIED"

    val relativeTime = remember(item.timestamp) {
        val diffMs = System.currentTimeMillis() - item.timestamp
        val minutes = diffMs / (60 * 1000)
        val hours = minutes / 60
        when {
            minutes < 1 -> "Just now"
            minutes < 60 -> "${minutes}m ago"
            hours < 24 -> "${hours}h ago"
            else -> "${hours / 24}d ago"
        }
    }

    Card(
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = HeroCardGlass),
        modifier = modifier
            .fillMaxWidth()
            .border(1.2.dp, riskBorder.copy(alpha = 0.6f), RoundedCornerShape(18.dp))
            .clickable(onClick = onInspect)
            .testTag("history_item_${item.id}")
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            // Header: Fraud/Safe Badge (Red vs Green) + Exact Risk Percentage + Time
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Fraud vs Safe Status Pill
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(riskContainer)
                        .border(1.dp, riskBorder, RoundedCornerShape(10.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = if (isFraud) Icons.Default.Warning else Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = riskColor,
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "$statusLabel • $riskScore%",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = riskColor
                    )
                }

                // Relative Timestamp & Delete
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.AccessTime,
                        contentDescription = null,
                        tint = TextMuted,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = relativeTime,
                        fontSize = 10.5.sp,
                        color = TextMuted
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(24.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete item",
                            tint = TextMuted,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Threat Category & Risk Number
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = item.result.category,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextHighEmphasis
                )

                Text(
                    text = "$riskScore / 100 Risk",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = riskColor
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Message Snippet
            Text(
                text = item.messageSnippet,
                fontSize = 12.5.sp,
                color = TextMediumEmphasis,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 17.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Footer: Red Flags summary & Inspect Action
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (item.result.redFlags.isNotEmpty()) {
                        "${item.result.redFlags.size} red flags detected"
                    } else {
                        "Clean message signals"
                    },
                    fontSize = 11.sp,
                    color = if (isFraud) FraudRed.copy(alpha = 0.85f) else SafeGreen.copy(alpha = 0.85f),
                    fontWeight = FontWeight.Medium
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(IndigoSurfaceHover)
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Visibility,
                        contentDescription = null,
                        tint = HeroCyanGlow,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Inspect Details",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = HeroCyanGlow
                    )
                }
            }
        }
    }
}

@Composable
private fun HistoryStatPill(
    label: String,
    value: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(IndigoSurface)
            .border(1.dp, accentColor.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
            .padding(vertical = 8.dp, horizontal = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Black,
                color = accentColor
            )
            Text(
                text = label,
                fontSize = 9.5.sp,
                fontWeight = FontWeight.Medium,
                color = TextMuted,
                maxLines = 1
            )
        }
    }
}

@Composable
private fun HistoryFilterChip(
    label: String,
    isSelected: Boolean,
    activeColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) activeColor.copy(alpha = 0.2f) else IndigoSurface)
            .border(
                1.dp,
                if (isSelected) activeColor else IndigoBorder,
                RoundedCornerShape(10.dp)
            )
            .clickable(onClick = onClick)
            .padding(vertical = 6.dp, horizontal = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
            color = if (isSelected) activeColor else TextMediumEmphasis,
            maxLines = 1
        )
    }
}
