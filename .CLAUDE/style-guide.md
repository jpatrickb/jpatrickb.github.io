# Web Style Guide

This guide ensures all webpages for course materials and projects maintain visual and functional consistency across GitHub Pages static sites.

## Overview

All pages use:
- **Font Family**: Geist (weights: 400, 500, 600, 700) via Google Fonts, with fallbacks to system fonts
- **Base Font Size**: 16px
- **Color Scheme**: Blue-based (#0052cc primary) with supporting neutrals and semantic colors
- **Layout**: Responsive container-based grid system with max-width of 1200px
- **Framework**: Semantic HTML5 with inline styling for one-off adjustments, class-based styling for reusable components

---

## Color Palette

### Primary Colors
- **Primary Blue**: `#0052cc` — Main brand color for headings, links, buttons, accents
- **Dark Blue**: `#003d99` — Darker shade for hover states and gradients
- **Light Blue Background**: `#f0f4ff` — Subtle background for hover states and alternating sections

### Secondary/Supporting Colors
- **Indigo**: `#6366f1` — Secondary accent for hierarchical emphasis (e.g., parent-level nodes in diagrams)
- **Bright Blue**: `#3b82f6` — Tertiary accent (e.g., child-level nodes in diagrams)
- **Cyan**: `#06b6d4` — Quaternary accent (e.g., leaf-level nodes in diagrams)

### Neutral Colors
- **Dark Gray/Near Black**: `#1a1a1a` — Body text color
- **Medium Gray**: `#404040` — Secondary text (paragraphs)
- **Light Gray**: `#666` — Muted text (author info, metadata)
- **Very Light Gray**: `#e5e5e5` — Borders, dividers
- **Lightest Gray**: `#f8f9fa` — Subtle background sections
- **White**: `#ffffff` — Primary background
- **Near Black**: `#a0a0a0` — Footer text
- **Dark Near-Black**: `#333` — Footer border

---

## Typography

### Heading Hierarchy

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| `<h1>` | 3.5rem | 700 | #0052cc (gradient) | Gradient from #0052cc to #003d99; max-width 900px |
| `<h2>` | 2.5rem | 600 | #0052cc | Main section headings; margin-bottom: 2rem |
| `<h3>` | 1.5rem | 600 | #1a1a1a | Card titles, subsections |
| `<h4>` | 1.25rem | 600 | #0052cc | Step titles, concept titles |
| `<p>` | 1rem (base) | 400 | #404040 | margin-bottom: 1.2rem; line-height: 1.8 |
| `<strong>` | — | 600 | #0052cc | Emphasized text |

### Special Text Styles
- **Subtitles** (`.subtitle`): 1.5rem, color #404040, font-weight: 500
- **Author info** (`.author`): 1.1rem, color #666, font-style: italic, margin-bottom: 3rem
- **Intro text** (`.intro-text`): 1.2rem, centered, max-width 800px, color #404040, line-height: 1.9

---

## Layout & Spacing

### Container System
```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}
```

### Section Padding
- Standard sections: `padding: 5rem 0`
- Hero section: `padding: 6rem 0`
- Compact sections: `padding: 3rem 0` (mobile)

### Margin & Gap Conventions
- Section margins: 2rem or 3rem
- Grid gaps: 2rem (cards, topics) or 1.5rem (compact)
- Flex gaps: 1.5rem (buttons) or 2rem (step numbers to content)

---

## Component Styles

### Header & Navigation

**Navbar**:
- Position: `sticky` with `z-index: 100`
- Background: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(10px)`
- Border-bottom: `1px solid #e5e5e5`
- Padding: `1rem 0`

**Logo**:
- Font-size: 1.25rem, font-weight: 700
- Color: #0052cc

**Nav Links**:
- Display: flex with 2rem gap
- Color: #404040 (default), #0052cc (hover and active)
- Active indicator: `::after` pseudo-element, 2px solid bar below

### Hero Section
- Background: Linear gradient `135deg, #f8f9fa 0%, #ffffff 50%, #f0f4ff 100%`
- Border-bottom: `1px solid #e5e5e5`
- Text-align: center
- CTA Buttons wrapped in `.cta-buttons` with flex, gap: 1.5rem, flex-wrap: wrap

### Buttons

**Primary Button** (`.btn-primary`):
- Background: Linear gradient `135deg, #0052cc 0%, #003d99 100%`
- Color: white
- Padding: 1rem 2rem
- Border-radius: 8px
- Font-weight: 600
- Box-shadow: `0 4px 15px rgba(0, 82, 204, 0.2)`
- Hover: `transform: translateY(-2px)`, shadow increases to `0 6px 25px rgba(0, 82, 204, 0.3)`

**Secondary Button** (`.btn-secondary`):
- Background: #f0f0f0
- Color: #0052cc
- Border: 2px solid #0052cc
- Hover: background becomes #0052cc, color becomes white

### Cards (Generic)
- Padding: 2rem
- Background: #f8f9fa
- Border-radius: 12px
- Border: 1px solid #e5e5e5
- Hover: `transform: translateY(-5px)`, `box-shadow: 0 10px 30px rgba(0, 82, 204, 0.1)`, border becomes #0052cc

### Topic Cards (`.topic-card`)
- Same as generic cards but with:
  - Flex layout: flex-direction: column
  - Icon: font-size: 2.5rem, margin-bottom: 1rem
  - Heading: color #0052cc, font-size: 1.3rem
  - Description: font-size: 0.95rem, flex-grow: 1 (to push list to bottom)
  - List items: No bullets, padding-left: 1.5rem with `▸` pseudo-element in #0052cc

### Finding Cards (`.finding-card`)
- Similar to topic cards but:
  - Text-align: center
  - Icon: font-size: 3rem
  - Hover transform: `translateY(-8px)` instead of -5px
  - Box-shadow: `0 12px 40px rgba(0, 82, 204, 0.15)`

### Practice/Step Cards (`.practice` and `.step`)
- Display: grid with `grid-template-columns: 60px 1fr`
- Gap: 2rem
- Padding: 2rem
- Background: #f8f9fa
- Border-left: 4px solid #0052cc
- Hover: background becomes #f0f4ff, `transform: translateX(5px)`

**Step Number** (`.step-number` and `.practice-number`):
- Width/Height: 50px (step) or flexible width (practice)
- Background: Linear gradient `135deg, #0052cc 0%, #003d99 100%`
- Color: white
- Border-radius: 50% (step) or not rounded (practice)
- Font-weight: 700
- Display: flex, centered

### Download Cards (`.download-card`)
- Padding: 2.5rem
- Background: white
- Border: 2px solid #e5e5e5
- Border-radius: 12px
- Text-align: center
- Hover: border becomes #0052cc, shadow `0 15px 40px rgba(0, 82, 204, 0.15)`, `transform: translateY(-8px)`
- Icon: font-size: 3.5rem, margin-bottom: 1.5rem
- CTA text: display block, border-top: 1px solid #e5e5e5, margin-top: 1rem, width: 100%

### Diagram Containers (`.tree-container`)
- Margin: 3rem 0
- Padding: 3rem 2rem
- Background: white
- Border-radius: 12px
- Border: 1px solid #e5e5e5
- Display: flex
- Justify-content: center
- Align-items: center
- Overflow: auto
- Min-height: 600px

**SVG Diagram** (`.tree-diagram`):
- Max-width: 100%
- Height: auto
- Width: 100%

---

## Section-Specific Styles

### Overview Section (`.overview`)
- Padding: 5rem 0
- Grid for cards: `grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))`, gap: 2rem

### Findings Section (`.findings`)
- Padding: 5rem 0
- Background-color: #f8f9fa
- Border-top and border-bottom: 1px solid #e5e5e5
- Grid: `repeat(auto-fit, minmax(280px, 1fr))`, gap: 2rem

### Framework Section (`.framework`)
- Padding: 5rem 0
- Steps displayed in grid: `repeat(auto-fit, minmax(300px, 1fr))`, gap: 2rem

### Concepts Section (`.concepts`)
- Padding: 5rem 0
- Background-color: #f8f9fa
- Border-top and border-bottom: 1px solid #e5e5e5
- Concept Grid: `repeat(auto-fit, minmax(300px, 1fr))`, gap: 2rem

**Concept Cards** (`.concept`):
- Same as generic cards
- `<h4>` color: #0052cc
- Font-size: 0.95rem

### Topics Section (`.topics-section`)
- Padding: 5rem 0
- Grid: `repeat(auto-fit, minmax(320px, 1fr))`, gap: 2rem

### Takeaways Section (`.takeaways`)
- Padding: 5rem 0
- List: no bullets, max-width: 900px, margin: 3rem auto 0
- List items: padding: 1.5rem 0 with 3rem left padding, border-bottom: 1px solid #e5e5e5
- `::before` pseudo-element: "✓", color #0052cc, font-size: 1.5rem, font-weight: 700

### Download Section (`.download`)
- Padding: 5rem 0
- Background: Linear gradient `135deg, #f0f4ff 0%, #f8f9fa 100%`
- Border-top and border-bottom: 1px solid #e5e5e5

### Family Tree Section (`.family-tree-section`)
- Padding: 5rem 0
- Background-color: #f8f9fa
- Border-top and border-bottom: 1px solid #e5e5e5

---

## Footer

- Background-color: #1a1a1a
- Color: #a0a0a0
- Padding: 3rem 0
- Border-top: 1px solid #333
- Text-align: center
- Links: color #0052cc, hover to #70c0ff

**Footer Note** (`.footer-note`):
- Font-size: 0.9rem
- Margin-top: 1rem

---

## Responsive Design Breakpoints

### Tablet & Below (max-width: 768px)

```css
h1 { font-size: 2.5rem; }
h2 { font-size: 1.8rem; }

.hero { padding: 4rem 0; }
.cta-buttons { flex-direction: column; gap: 1rem; }
.btn { width: 100%; justify-content: center; }

.grid-2 { grid-template-columns: 1fr; }
.steps { grid-template-columns: 1fr; }
.findings-grid, .concept-grid, .download-grid { grid-template-columns: 1fr; }

.subtitle { font-size: 1.2rem; }
.intro-text { font-size: 1rem; }

.tree-container { padding: 2rem 1rem; min-height: 500px; }
.takeaway-list li { font-size: 1rem; }
```

### Mobile (max-width: 480px)

```css
body { font-size: 14px; }
h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }

.container { padding: 0 1rem; }
.hero { padding: 2rem 0; }

.overview, .findings, .framework, .concepts, .takeaways, .download { padding: 3rem 0; }

.card, .finding-card, .concept, .step, .download-card { padding: 1.5rem; }

.hero h1 { margin-bottom: 1rem; }
.author { margin-bottom: 2rem; }

.btn { padding: 0.8rem 1.5rem; font-size: 1rem; }
```

---

## Page Structure Template

Every page should follow this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[Page description]">
    <meta name="author" content="Patrick Beal">
    <title>[Page Title] - Economics 588</title>
    <link rel="stylesheet" href="assets/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <div class="navbar-content">
                    <div class="logo">Econ 588</div>
                    <ul class="nav-links">
                        <li><a href="index.html" class="nav-link">Project</a></li>
                        <li><a href="class-material.html" class="nav-link">Class Material</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <!-- Page content sections here -->
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Patrick Beal. Economics 588 at Brigham Young University.</p>
            <p class="footer-note">
                <a href="https://github.com/jpatrickb/byu-econ-588" target="_blank">View on GitHub</a>
            </p>
        </div>
    </footer>
</body>
</html>
```

---

## Common Section Patterns

### Hero Section with CTA Buttons

```html
<section class="hero">
    <div class="container">
        <div class="hero-content">
            <h1>[Main Title]</h1>
            <p class="subtitle">[Subtitle]</p>
            <p class="author">[Author/Attribution]</p>
            <div class="cta-buttons">
                <a href="#" class="btn btn-primary">
                    <span class="icon">📚</span> [Button Text]
                </a>
                <a href="#" class="btn btn-secondary">
                    <span class="icon">📊</span> [Button Text]
                </a>
            </div>
        </div>
    </div>
</section>
```

### Overview Section with Cards

```html
<section class="overview">
    <div class="container">
        <h2>[Section Title]</h2>
        <p class="intro-text">[Introduction paragraph]</p>
        <div class="grid-2">
            <div class="card">
                <h3>[Card Title]</h3>
                <p>[Card content]</p>
            </div>
            <!-- Repeat card as needed -->
        </div>
    </div>
</section>
```

### Topic/Card Grid

```html
<section class="topics-section">
    <div class="container">
        <h2>[Section Title]</h2>
        <div class="topics-grid">
            <div class="topic-card">
                <div class="topic-icon">[Emoji]</div>
                <h3>[Card Title]</h3>
                <p>[Description]</p>
                <ul class="topic-items">
                    <li>[Item 1]</li>
                    <li>[Item 2]</li>
                    <li>[Item 3]</li>
                </ul>
            </div>
            <!-- Repeat card as needed -->
        </div>
    </div>
</section>
```

### Numbered Steps Section

```html
<section class="practices-section">
    <div class="container">
        <h2>[Section Title]</h2>
        <p style="text-align: center; max-width: 900px; margin: 0 auto 2rem; font-size: 1rem; color: #404040;">
            [Introduction text]
        </p>
        <div class="practices-list">
            <div class="practice">
                <div class="practice-number">1</div>
                <div class="practice-content">
                    <h4>[Step Title]</h4>
                    <p>[Step description]</p>
                </div>
            </div>
            <!-- Repeat for each step -->
        </div>
    </div>
</section>
```

### Finding Cards Grid

```html
<section class="findings">
    <div class="container">
        <h2>[Section Title]</h2>
        <div class="findings-grid">
            <div class="finding-card">
                <div class="finding-icon">[Emoji]</div>
                <h3>[Finding Title]</h3>
                <p>[Finding content with <strong>bold</strong> labels]</p>
            </div>
            <!-- Repeat card as needed -->
        </div>
    </div>
</section>
```

### Download Cards

```html
<section class="download">
    <div class="container">
        <h2>[Section Title]</h2>
        <p>[Intro text]</p>
        <div class="download-grid">
            <a href="path/to/file.pdf" class="download-card" target="_blank" rel="noopener noreferrer">
                <div class="download-icon">[Emoji]</div>
                <h3>[Document Title]</h3>
                <p>[Description]</p>
                <span class="download-cta">Read PDF →</span>
            </a>
            <!-- Repeat card as needed -->
        </div>
    </div>
</section>
```

---

## SVG Diagram Guidelines

For diagrams (like the econometrics family tree):

1. **Viewbox**: Should be generous (e.g., 1800x1100) to prevent node overlap
2. **Font Family**: Use `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
3. **Colors**:
   - Root nodes: #0052cc (primary blue)
   - Parent level: #6366f1 (indigo)
   - Child level: #3b82f6 (bright blue)
   - Grandchild level: #06b6d4 (cyan)
4. **Stroke width**: 2.5px for node borders
5. **Lines**: Use #9ca3af (medium gray) for connection lines
6. **Text Centering**: Use `text-anchor: middle` and `dominant-baseline: middle` for proper SVG text alignment
7. **Node Sizing**:
   - Root: 400×100
   - Parents: 400×90
   - Children: 200×85
   - Grandchildren: 120-140×75
8. **Spacing**: Ensure adequate horizontal separation between siblings to prevent overlap (at least 30px minimum gap)

---

## Accessibility Notes

- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`)
- Ensure sufficient color contrast (WCAG AA standard)
- Include `alt` attributes on images
- Use `target="_blank"` with `rel="noopener noreferrer"` for external links
- Keyboard-navigable navigation (all buttons/links accessible via Tab)
- Responsive design ensures mobile usability

---

## Performance Best Practices

- Keep CSS organized and minimal
- Use system fonts as fallbacks
- Optimize images and SVGs for web
- Lazy-load non-critical resources
- Use `min-height` instead of fixed heights for flexibility

---

## Extending This Guide

When adding new components:
1. Name classes descriptively (`.section-name` or `.component-name`)
2. Follow the color palette and spacing conventions
3. Ensure responsive behavior at 768px and 480px breakpoints
4. Document the new component in this guide
5. Test across modern browsers and devices

---

## Quick Reference: Common Classes

| Class | Purpose |
|-------|---------|
| `.container` | Max-width wrapper for content |
| `.hero` | Large hero section with gradient background |
| `.card` | Generic card component |
| `.topic-card` | Card with icon, title, description, and list |
| `.finding-card` | Centered card for findings/results |
| `.practice` | Numbered step with icon and content |
| `.step` | Alternative step component |
| `.download-card` | Card linking to downloadable file |
| `.tree-container` | SVG diagram container |
| `.btn btn-primary` | Primary call-to-action button |
| `.btn btn-secondary` | Secondary button |
| `.grid-2` | Two-column responsive grid |
| `.topics-grid` | Multi-column grid for topic cards |
| `.findings-grid` | Multi-column grid for finding cards |

