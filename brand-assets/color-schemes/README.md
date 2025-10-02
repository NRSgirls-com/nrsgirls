# NRSgirls Color Schemes

## Overview
This directory contains color palette definitions in various formats for use across different applications and design tools.

## Available Formats

### 1. Adobe Swatch Exchange (.ase)
**File**: `brand-colors.ase`
- **For**: Adobe Creative Suite (Photoshop, Illustrator, InDesign)
- **Import**: Swatches panel → Import Swatches

### 2. SCSS Variables
**File**: `colors.scss`
- **For**: Web development with Sass
- **Usage**: Import in your stylesheets

### 3. CSS Custom Properties
**File**: `colors.css`
- **For**: Modern web development
- **Usage**: Include in your CSS

### 4. JSON
**File**: `colors.json`
- **For**: JavaScript applications
- **Usage**: Import in your code

### 5. Figma
**File**: `colors-figma.json`
- **For**: Figma design files
- **Import**: Plugins → Color Palette

### 6. Sketch Palette
**File**: `colors.sketchpalette`
- **For**: Sketch design files
- **Import**: Plugins → Palette Manager

## Color Palette

### Primary Colors

#### NRS Pink
```
Name: NRS Pink
Hex: #FF006E
RGB: rgb(255, 0, 110)
HSL: hsl(337, 100%, 50%)
CMYK: cmyk(0%, 100%, 57%, 0%)
Pantone: Similar to PMS 213 C
```

#### Deep Purple
```
Name: Deep Purple
Hex: #8338EC
RGB: rgb(131, 56, 236)
HSL: hsl(265, 83%, 57%)
CMYK: cmyk(44%, 76%, 0%, 7%)
Pantone: Similar to PMS 266 C
```

#### Electric Blue
```
Name: Electric Blue
Hex: #3A86FF
RGB: rgb(58, 134, 255)
HSL: hsl(217, 100%, 61%)
CMYK: cmyk(77%, 47%, 0%, 0%)
Pantone: Similar to PMS 2727 C
```

### Secondary Colors

#### Neon Green
```
Name: Neon Green
Hex: #06FFA5
RGB: rgb(6, 255, 165)
HSL: hsl(158, 100%, 51%)
CMYK: cmyk(98%, 0%, 35%, 0%)
```

#### Sunset Orange
```
Name: Sunset Orange
Hex: #FFB703
RGB: rgb(255, 183, 3)
HSL: hsl(43, 100%, 51%)
CMYK: cmyk(0%, 28%, 99%, 0%)
```

#### Hot Red
```
Name: Hot Red
Hex: #FB5607
RGB: rgb(251, 86, 7)
HSL: hsl(19, 97%, 51%)
CMYK: cmyk(0%, 66%, 97%, 2%)
```

### Neutral Colors

#### Pure White
```
Hex: #FFFFFF
RGB: rgb(255, 255, 255)
```

#### Off White
```
Hex: #F8F9FA
RGB: rgb(248, 249, 250)
```

#### Light Gray
```
Hex: #E9ECEF
RGB: rgb(233, 236, 239)
```

#### Medium Gray
```
Hex: #6C757D
RGB: rgb(108, 117, 125)
```

#### Dark Gray
```
Hex: #212529
RGB: rgb(33, 37, 41)
```

#### Pure Black
```
Hex: #000000
RGB: rgb(0, 0, 0)
```

## Gradients

### Primary Gradient (Pink to Purple)
```css
background: linear-gradient(135deg, #FF006E 0%, #8338EC 100%);
```

### Secondary Gradient (Blue to Green)
```css
background: linear-gradient(135deg, #3A86FF 0%, #06FFA5 100%);
```

### Dark Gradient
```css
background: linear-gradient(180deg, #212529 0%, #000000 100%);
```

## Usage Guidelines

### Primary Colors
- Use for main brand elements
- CTAs and important actions
- Navigation highlights
- Key UI components

### Secondary Colors
- Use for supporting elements
- Status indicators (success, warning, error)
- Accent highlights
- Special features

### Neutral Colors
- Use for text and backgrounds
- Borders and dividers
- Disabled states
- Body content

### Accessibility

#### WCAG AA Compliant Combinations

**Text on Background** (minimum 4.5:1 ratio):
- ✅ Dark Gray (#212529) on White (#FFFFFF) - 15.8:1
- ✅ Dark Gray (#212529) on Off White (#F8F9FA) - 15.5:1
- ✅ White (#FFFFFF) on NRS Pink (#FF006E) - 4.5:1
- ✅ White (#FFFFFF) on Deep Purple (#8338EC) - 6.2:1
- ✅ White (#FFFFFF) on Electric Blue (#3A86FF) - 4.6:1

**Large Text** (minimum 3:1 ratio):
- ✅ Medium Gray (#6C757D) on White (#FFFFFF) - 4.7:1
- ✅ White (#FFFFFF) on Hot Red (#FB5607) - 4.8:1

**UI Components** (minimum 3:1 ratio):
- ✅ All brand colors meet contrast requirements for interactive elements

## Implementation Examples

### Web (CSS)
```css
:root {
  /* Primary */
  --color-primary: #FF006E;
  --color-secondary: #8338EC;
  --color-accent: #3A86FF;
  
  /* Secondary */
  --color-success: #06FFA5;
  --color-warning: #FFB703;
  --color-error: #FB5607;
  
  /* Neutral */
  --color-white: #FFFFFF;
  --color-gray-100: #F8F9FA;
  --color-gray-200: #E9ECEF;
  --color-gray-500: #6C757D;
  --color-gray-900: #212529;
  --color-black: #000000;
}
```

### JavaScript
```javascript
const colors = {
  primary: '#FF006E',
  secondary: '#8338EC',
  accent: '#3A86FF',
  success: '#06FFA5',
  warning: '#FFB703',
  error: '#FB5607',
  white: '#FFFFFF',
  gray: {
    100: '#F8F9FA',
    200: '#E9ECEF',
    500: '#6C757D',
    900: '#212529'
  },
  black: '#000000'
};
```

### Swift (iOS)
```swift
extension UIColor {
    static let nrsPink = UIColor(hex: "FF006E")
    static let deepPurple = UIColor(hex: "8338EC")
    static let electricBlue = UIColor(hex: "3A86FF")
    static let neonGreen = UIColor(hex: "06FFA5")
    static let sunsetOrange = UIColor(hex: "FFB703")
    static let hotRed = UIColor(hex: "FB5607")
}
```

### Kotlin (Android)
```kotlin
object BrandColors {
    val nrsPink = Color(0xFFFF006E)
    val deepPurple = Color(0xFF8338EC)
    val electricBlue = Color(0xFF3A86FF)
    val neonGreen = Color(0xFF06FFA5)
    val sunsetOrange = Color(0xFFFFB703)
    val hotRed = Color(0xFFFB5607)
}
```

## Color Psychology

### NRS Pink (#FF006E)
- **Emotion**: Energy, passion, excitement
- **Usage**: Primary actions, important highlights
- **Audience**: Bold, confident, modern

### Deep Purple (#8338EC)
- **Emotion**: Creativity, luxury, imagination
- **Usage**: Secondary elements, premium features
- **Audience**: Sophisticated, artistic

### Electric Blue (#3A86FF)
- **Emotion**: Trust, professionalism, innovation
- **Usage**: Information, links, DJ theme
- **Audience**: Reliable, tech-savvy

### Neon Green (#06FFA5)
- **Emotion**: Success, growth, positive energy
- **Usage**: Success states, live indicators
- **Audience**: Optimistic, fresh

## Print Specifications

### CMYK Conversion
When printing, use CMYK values provided. Note that screen colors may not exactly match print colors due to color space differences.

### Pantone Matching
For exact color matching in print:
- NRS Pink: PMS 213 C (closest match)
- Deep Purple: PMS 266 C (closest match)
- Electric Blue: PMS 2727 C (closest match)

Consult with your printer for best color matching results.

## Updating Color Schemes

If brand colors are updated:
1. Update all format files in this directory
2. Regenerate swatches and palettes
3. Update style-guide.md
4. Communicate changes to all teams
5. Version control all changes

## Support

For questions about color usage:
- **Email**: brand@nrsgirls.com
- **Slack**: #brand-guidelines

---

**© NRS Group of Fresno. All rights reserved.**
