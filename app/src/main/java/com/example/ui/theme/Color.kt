package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// =========================================================================
// Human-Centric Trustworthy Palette (Deep Indigo, Soft Sage & Frosted Glass)
// =========================================================================

// Deep Indigo Canvas & Surfaces
val IndigoCanvasDark = Color(0xFF0C0E1A)        // Deep Midnight Indigo base
val IndigoCanvasRadial = Color(0xFF16192E)      // Subtle elevated indigo ambient
val IndigoSurface = Color(0xFF15182C)           // Trustworthy deep indigo glass card
val IndigoSurfaceHover = Color(0xFF1F243E)      // Elevated hover / secondary pill
val IndigoBorder = Color(0x337986CB)            // Delicate translucent indigo border
val IndigoBorderFocused = Color(0x669FA8DA)

// Frosted Glass Layering & Shimmer Colors
val GlassSurfaceUltra = Color(0x331C2242)       // Ultra translucent frosted glass background
val GlassSurfaceElevated = Color(0x4D222A52)    // Floating frosted glass card layer
val GlassBorderLuminous = Color(0x448EBAA3)     // Soft sage luminous border for glass cards
val GlassBorderSubtle = Color(0x2E818CF8)       // Indigo crystalline border
val GlassShimmerStart = Color(0x00FFFFFF)       // Shimmer scan gradient start
val GlassShimmerHighlight = Color(0x24FFFFFF)   // Shimmer scan gradient peak
val GlassSkeletonBase = Color(0xFF191F38)       // Skeleton item placeholder base
val GlassSkeletonHighlight = Color(0xFF28325A)  // Skeleton item shimmer highlight

// Soft Sage Accents (Calm, Human, Grounded)
val SoftSage = Color(0xFF8EBAA3)                // Natural, calming soft sage green
val SoftSageLight = Color(0xFFAFD1C0)           // Light sage accent
val SoftSageContainer = Color(0xFF1C2C24)       // Soft sage muted container
val SoftSageOnContainer = Color(0xFFC7E2D5)     // Sage readable text

// Trustworthy Indigo Brand Tones
val DeepIndigoPrimary = Color(0xFF4F46E5)       // Rich trustworthy Indigo
val DeepIndigoAccent = Color(0xFF6366F1)        // Bright Indigo accent
val IndigoSubtle = Color(0xFF3730A3)            // Deep slate indigo

// Human Alert & Severity Tones (Warm Earth / Terracotta / Rose rather than harsh neon)
val RiskCriticalCrimson = Color(0xFFD64545)     // Trustworthy deep crimson
val RiskHighTerracotta = Color(0xFFDE6B48)      // Warm terracotta / persimmon
val RiskMediumOchre = Color(0xFFDDA15E)         // Warm earth ochre / amber
val RiskLowSage = Color(0xFF8EBAA3)             // Soft Sage for low risk & safe states

// Vivid Binary Alert Tones: RED for Fraud, GREEN for Safe
val FraudRed = Color(0xFFEF4444)                // Clear, unmistakable Vivid Red for Fraud
val FraudRedDark = Color(0xFFDC2626)
val FraudRedContainer = Color(0x2EEF4444)
val FraudRedBorder = Color(0x80EF4444)

val SafeGreen = Color(0xFF22C55E)               // Clear, unmistakable Vivid Green for Safe / No Fraud
val SafeGreenDark = Color(0xFF16A34A)
val SafeGreenContainer = Color(0x2E22C55E)
val SafeGreenBorder = Color(0x8022C55E)

// MaxShield Pro Monetization Gold & Premium Tones
val GoldAccent = Color(0xFFF59E0B)
val GoldAccentGlow = Color(0xFFFBBF24)
val GoldContainer = Color(0x26F59E0B)
val GoldBorder = Color(0x66F59E0B)

// Typography & Contrast Tones
val TextHighEmphasis = Color(0xFFF8F9FD)        // Warm off-white
val TextMediumEmphasis = Color(0xFFA3A8C5)      // Slate indigo secondary
val TextMuted = Color(0xFF707694)               // Subdued indigo slate
val GridDotColor = Color(0x1F818CF8)            // Delicate indigo dot mesh

// Legacy & UI Element Aliases (Seamlessly mapping to Deep Indigo & Soft Sage)
val HeroCanvasDark = IndigoCanvasDark
val HeroCanvasRadial = IndigoCanvasRadial
val HeroCardGlass = IndigoSurface
val HeroCardGlassBorder = IndigoBorder
val HeroCardGlassHover = IndigoSurfaceHover

val HeroCyanGlow = SoftSage                     // Calming soft sage accent!
val HeroElectricBlue = DeepIndigoPrimary        // Deep trustworthy indigo!
val HeroEmerald = SoftSage                      // Soft sage
val HeroHotPink = RiskHighTerracotta            // Warm terracotta instead of artificial pink
val HeroNeonPurple = Color(0xFF7C6FA0)          // Soft warm violet

val RiskLowGreen = RiskLowSage
val RiskMediumAmber = RiskMediumOchre
val RiskHighRose = RiskHighTerracotta
val RiskCriticalMagenta = RiskCriticalCrimson
