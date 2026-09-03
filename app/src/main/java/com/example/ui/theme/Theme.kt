package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val EditorialColorScheme = lightColorScheme(
    primary = EditorialAccentOrange,
    onPrimary = Color.White,
    primaryContainer = EditorialOrangeBg,
    onPrimaryContainer = EditorialDeepBlack,
    secondary = EditorialDeepBlack,
    onSecondary = Color.White,
    secondaryContainer = EditorialSurfaceMuted,
    onSecondaryContainer = EditorialTextPrimary,
    tertiary = EditorialAccentOrange,
    onTertiary = Color.White,
    background = EditorialBackground,
    onBackground = EditorialTextPrimary,
    surface = EditorialSurface,
    onSurface = EditorialTextPrimary,
    surfaceVariant = EditorialSurfaceMuted,
    onSurfaceVariant = EditorialTextSecondary,
    outline = EditorialBorder,
    outlineVariant = EditorialBorderDark,
    error = RiskCriticalRed,
    onError = Color.White
)

val HumanCentricColorScheme = EditorialColorScheme

@Composable
fun InboxHeroTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = EditorialColorScheme,
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
