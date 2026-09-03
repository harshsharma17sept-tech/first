package com.example.ui

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.ScanHistoryItem
import com.example.ui.theme.EditorialAccentOrange
import com.example.ui.theme.EditorialBackground
import com.example.ui.theme.EditorialBorder
import com.example.ui.theme.EditorialBorderDark
import com.example.ui.theme.EditorialDeepBlack
import com.example.ui.theme.EditorialOrangeBg
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
        verticalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier
            .fillMaxWidth()
            .testTag("threat_history_section")
    ) {
        // Section Header Box (Modular 1px border)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(2.dp))
                .background(EditorialSurface)
                .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                .padding(14.dp)
        ) {
            Column {
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
                        Column {
                            Text(
                                text = "THREAT LOG // REPOSITORY",
                                fontFamily = FontFamily.Monospace,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = EditorialDeepBlack,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "${historyList.size} logged message evaluations",
                                fontSize = 11.sp,
                                color = EditorialTextSecondary
                            )
                        }
                    }

                    if (historyList.isNotEmpty()) {
                        OutlinedButton(
                            onClick = onClearAll,
                            shape = RoundedCornerShape(2.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, EditorialBorder),
                            contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = EditorialTextSecondary),
                            modifier = Modifier.testTag("clear_history_button")
                        ) {
                            Icon(
                                imageVector = Icons.Default.Delete,
                                contentDescription = "Clear History",
                                modifier = Modifier.size(13.dp),
                                tint = EditorialTextMuted
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "CLEAR LOGS",
                                fontFamily = FontFamily.Monospace,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = EditorialTextSecondary
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Stat Summary Counters: Total, Fraud (Red), Safe (Green)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    HistoryStatBlock(
                        label = "TOTAL SCANS",
                        value = historyList.size.toString(),
                        accentColor = EditorialDeepBlack,
                        modifier = Modifier.weight(1f)
                    )
                    HistoryStatBlock(
                        label = "FRAUD FLAGGED",
                        value = fraudCount.toString(),
                        accentColor = RiskCriticalRed,
                        modifier = Modifier.weight(1f)
                    )
                    HistoryStatBlock(
                        label = "VERIFIED SAFE",
                        value = safeCount.toString(),
                        accentColor = RiskSafeGreen,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Filter Chips
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    EditorialFilterTab(
                        label = "ALL (${historyList.size})",
                        isSelected = activeFilter == HistoryFilter.ALL,
                        onClick = { activeFilter = HistoryFilter.ALL },
                        modifier = Modifier.weight(1f)
                    )
                    EditorialFilterTab(
                        label = "FRAUD ($fraudCount)",
                        isSelected = activeFilter == HistoryFilter.FRAUD_ONLY,
                        onClick = { activeFilter = HistoryFilter.FRAUD_ONLY },
                        modifier = Modifier.weight(1f)
                    )
                    EditorialFilterTab(
                        label = "SAFE ($safeCount)",
                        isSelected = activeFilter == HistoryFilter.SAFE_ONLY,
                        onClick = { activeFilter = HistoryFilter.SAFE_ONLY },
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // History List or Empty State
        if (filteredList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(2.dp))
                    .background(EditorialSurface)
                    .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = EditorialTextMuted,
                        modifier = Modifier.size(30.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (historyList.isEmpty()) "NO SCANS RECORDED" else "NO MATCHING LOGS",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialDeepBlack,
                        letterSpacing = 0.5.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Scanned messages and phishing analyses are archived here.",
                        fontSize = 12.sp,
                        color = EditorialTextSecondary,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = onNewScan,
                        shape = RoundedCornerShape(2.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EditorialAccentOrange,
                            contentColor = Color.White
                        )
                    ) {
                        Text(
                            text = "START NEW SCAN",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }
        } else {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
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
    val riskColor = if (isFraud) RiskCriticalRed else RiskSafeGreen
    val riskBg = if (isFraud) RiskCriticalRedBg else RiskSafeGreenBg
    val riskBorder = if (isFraud) RiskCriticalRedBorder else RiskSafeGreenBorder
    val statusLabel = if (isFraud) "FRAUD DETECTED" else "VERIFIED SAFE"

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

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurface)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .clickable(onClick = onInspect)
            .padding(12.dp)
            .testTag("history_item_${item.id}")
    ) {
        Column {
            // Header row with status banner & time
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(riskBg)
                        .border(1.dp, riskBorder, RoundedCornerShape(2.dp))
                        .padding(horizontal = 7.dp, vertical = 3.dp)
                ) {
                    Icon(
                        imageVector = if (isFraud) Icons.Default.Warning else Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = riskColor,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(5.dp))
                    Text(
                        text = "$statusLabel • $riskScore%",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = riskColor
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = relativeTime,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 10.sp,
                        color = EditorialTextMuted
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    IconButton(
                        onClick = onDelete,
                        modifier = Modifier.size(22.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Delete,
                            contentDescription = "Delete item",
                            tint = EditorialTextMuted,
                            modifier = Modifier.size(14.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Threat category & numerical score
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = item.result.category,
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = EditorialDeepBlack
                )
                Text(
                    text = "$riskScore / 100",
                    fontFamily = FontFamily.Monospace,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = riskColor
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Message Snippet
            Text(
                text = item.messageSnippet,
                fontSize = 12.sp,
                color = EditorialTextSecondary,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 16.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Footer row: flags count & inspect button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (item.result.redFlags.isNotEmpty()) {
                        "${item.result.redFlags.size} red flags analyzed"
                    } else {
                        "Clean signature"
                    },
                    fontSize = 10.5.sp,
                    color = EditorialTextMuted
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(EditorialSurfaceWhite)
                        .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "VIEW DIAGNOSTICS →",
                        fontFamily = FontFamily.Monospace,
                        fontSize = 9.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialAccentOrange
                    )
                }
            }
        }
    }
}

@Composable
private fun HistoryStatBlock(
    label: String,
    value: String,
    accentColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(2.dp))
            .background(EditorialSurfaceWhite)
            .border(1.dp, EditorialBorder, RoundedCornerShape(2.dp))
            .padding(vertical = 8.dp, horizontal = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = value,
                fontSize = 17.sp,
                fontWeight = FontWeight.Black,
                color = accentColor
            )
            Text(
                text = label,
                fontFamily = FontFamily.Monospace,
                fontSize = 8.5.sp,
                fontWeight = FontWeight.Bold,
                color = EditorialTextMuted,
                maxLines = 1
            )
        }
    }
}

@Composable
private fun EditorialFilterTab(
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
            .clip(RoundedCornerShape(2.dp))
            .background(bg)
            .border(1.dp, borderCol, RoundedCornerShape(2.dp))
            .clickable(onClick = onClick)
            .padding(vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontFamily = FontFamily.Monospace,
            fontSize = 9.5.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = textCol,
            maxLines = 1
        )
    }
}
