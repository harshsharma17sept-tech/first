package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val HumanCentricColorScheme = darkColorScheme(
    primary = SoftSage,
    onPrimary = Color(0xFF0C1611),
    primaryContainer = DeepIndigoPrimary,
    onPrimaryContainer = Color(0xFFEEF2FF),
    secondary = SoftSageLight,
    onSecondary = Color(0xFF13221A),
    secondaryContainer = Color(0xFF232846),
    onSecondaryContainer = SoftSageLight,
    tertiary = RiskHighTerracotta,
    onTertiary = Color.White,
    background = IndigoCanvasDark,
    onBackground = TextHighEmphasis,
    surface = IndigoSurface,
    onSurface = TextHighEmphasis,
    surfaceVariant = IndigoSurfaceHover,
    onSurfaceVariant = TextMediumEmphasis,
    outline = IndigoBorder,
    error = RiskCriticalCrimson,
    onError = Color.White
)

@Composable
fun InboxHeroTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = HumanCentricColorScheme,
        typography = Typography,
        content = content
    )
}

@Composable
fun ScamShieldTheme(
    content: @Composable () -> Unit
) {
    InboxHeroTheme(content = content)
}
