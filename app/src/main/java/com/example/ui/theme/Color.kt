package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// =========================================================================
// ScamShield Editorial / Cyber Lab Design Tokens
// =========================================================================

// Background & Surfaces
val EditorialBackground = Color(0xFFE4E4E4)       // Warm neutral light gray
val EditorialSurface = Color(0xFFF6F6F6)          // Pure surface for cards, sections, inputs
val EditorialSurfaceMuted = Color(0xFFECECEC)     // Subtle secondary gray
val EditorialSurfaceWhite = Color(0xFFFFFFFF)     // Clean white surface
val EditorialBorder = Color(0xFFD7D7D7)           // 1px modular grid border
val EditorialBorderDark = Color(0xFFBEBEBE)       // High contrast grid border

// Typography Tokens
val EditorialTextPrimary = Color(0xFF1B1B1B)      // Near-black for major text & titles
val EditorialDeepBlack = Color(0xFF0E0E0E)        // Deep black for heavy typography & accents
val EditorialTextSecondary = Color(0xFF4A4A4A)    // Secondary readable gray
val EditorialTextMuted = Color(0xFF767676)        // Technical labels & timestamps

// Accent Orange Tokens (Primary brand accent)
val EditorialAccentOrange = Color(0xFFEC783B)     // Vibrant safety orange
val EditorialOrangeHover = Color(0xFFD9662B)      // Pressed/focused orange
val EditorialOrangeBg = Color(0xFFFDEEE6)         // Subtle orange tinted surface
val EditorialOrangeBorder = Color(0xFFF6AB83)     // Border for orange accents

// Risk States in Editorial Context
val RiskCriticalRed = Color(0xFFD32F2F)           // Genuine critical/high-risk state
val RiskCriticalRedBg = Color(0xFFFDEAEA)
val RiskCriticalRedBorder = Color(0xFFF5AAAA)

val RiskWarningOrange = EditorialAccentOrange     // Medium warning
val RiskWarningOrangeBg = EditorialOrangeBg
val RiskWarningOrangeBorder = EditorialOrangeBorder

val RiskSafeGreen = Color(0xFF1B8A44)             // Low risk / safe state
val RiskSafeGreenBg = Color(0xFFE9F5ED)
val RiskSafeGreenBorder = Color(0xFFA5D8B4)

// Legacy Aliases mapped to Editorial Design Tokens (Ensures 100% backward compatibility)
val IndigoCanvasDark = EditorialBackground
val IndigoCanvasRadial = EditorialBackground
val IndigoSurface = EditorialSurface
val IndigoSurfaceHover = EditorialSurfaceMuted
val IndigoBorder = EditorialBorder
val IndigoBorderFocused = EditorialBorderDark

val GlassSurfaceUltra = EditorialSurface
val GlassSurfaceElevated = EditorialSurface
val GlassBorderLuminous = EditorialBorder
val GlassBorderSubtle = EditorialBorder
val GlassShimmerStart = Color(0x00FFFFFF)
val GlassShimmerHighlight = Color(0x33EC783B)
val GlassSkeletonBase = EditorialSurfaceMuted
val GlassSkeletonHighlight = EditorialSurface

val SoftSage = RiskSafeGreen
val SoftSageLight = Color(0xFF2E9E58)
val SoftSageContainer = RiskSafeGreenBg
val SoftSageOnContainer = EditorialTextPrimary

val DeepIndigoPrimary = EditorialAccentOrange
val DeepIndigoAccent = EditorialAccentOrange
val IndigoSubtle = EditorialSurfaceMuted

val RiskCriticalCrimson = RiskCriticalRed
val RiskHighTerracotta = EditorialAccentOrange
val RiskMediumOchre = Color(0xFFD97706)
val RiskLowSage = RiskSafeGreen

val FraudRed = RiskCriticalRed
val FraudRedDark = Color(0xFFB71C1C)
val FraudRedContainer = RiskCriticalRedBg
val FraudRedBorder = RiskCriticalRedBorder

val SafeGreen = RiskSafeGreen
val SafeGreenDark = Color(0xFF146C34)
val SafeGreenContainer = RiskSafeGreenBg
val SafeGreenBorder = RiskSafeGreenBorder

val GoldAccent = EditorialAccentOrange
val GoldAccentGlow = EditorialAccentOrange
val GoldContainer = EditorialOrangeBg
val GoldBorder = EditorialOrangeBorder

val TextHighEmphasis = EditorialTextPrimary
val TextMediumEmphasis = EditorialTextSecondary
val TextMuted = EditorialTextMuted
val GridDotColor = EditorialBorder

val HeroCanvasDark = EditorialBackground
val HeroCanvasRadial = EditorialBackground
val HeroCardGlass = EditorialSurface
val HeroCardGlassBorder = EditorialBorder
val HeroCardGlassHover = EditorialSurfaceMuted

val HeroCyanGlow = EditorialAccentOrange
val HeroElectricBlue = EditorialAccentOrange
val HeroEmerald = RiskSafeGreen
val HeroHotPink = EditorialAccentOrange
val HeroNeonPurple = EditorialDeepBlack

val RiskLowGreen = RiskSafeGreen
val RiskMediumAmber = RiskWarningOrange
val RiskHighRose = RiskCriticalRed
val RiskCriticalMagenta = RiskCriticalRed
