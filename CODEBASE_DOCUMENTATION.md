# Akshar Fast Food - Admin Dashboard Documentation

## Overview
Akshar Fast Food Admin is a high-end, responsive web application built for managing merchant operations, logistics, and menu items. The dashboard prioritizes an "Elevated Minimalist Food Experience" with sophisticated earth tones, premium typography, and fluid responsive transitions.

## Tech Stack
- **Core**: React 19, Vite, TypeScript
- **Styling**: Vanilla CSS (Global Tokens + Component-scoped CSS)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router DOM

## Project Structure
```text
aksharfastfood-admin/
├── src/
│   ├── components/       # Reusable layout and UI components
│   │   ├── Sidebar       # Desktop navigation
│   │   ├── BottomNav     # Mobile navigation (tabs)
│   │   └── Layout        # Global layout wrapper
│   ├── pages/            # Page-level components
│   │   ├── Dashboard     # Overview, stats, and revenue charts
│   │   ├── Orders        # Searchable order queue management
│   │   ├── Drivers       # Fleet management (table/card views)
│   │   ├── Menu          # Categorized menu management
│   │   └── Payments      # Financial tracking and activity
│   ├── assets/           # Static assets (images, fonts)
│   ├── index.css         # Design tokens and global resets
│   └── App.tsx           # Route definitions
├── index.html            # Entry point
└── package.json          # Dependencies and scripts
```

## Design System

### 🎨 Color Palette
Tailored for a premium, organic feel:
- **Primary**: `#49694A` (Deep Sage Green) — Branding and primary actions.
- **Secondary**: `#C4703F` (Terracotta) — Highlights and status accents.
- **Background**: `#F8F6F3` (Off-White/Cream) — Base foundation.
- **Surface**: `#FFFFFF` (White) — Content containers/cards.
- **Text**: `#2C2C2C` (Charcoal) — High legibility primary text.

### 🔡 Typography
- **Typeface**: Space Grotesk (Modern, high-end editorial feel)
- **Scale**: Defined via CSS variables (`--font-size-xs` to `--font-size-3xl`).

### 📱 Responsive Design
The application uses a dual-layout strategy:
1. **Desktop (> 768px)**: Persistent left sidebar, detailed tables, and multi-column grids.
2. **Mobile (≤ 768px)**:
   - Floating bottom navigation bar.
   - Tables automatically transition to touch-friendly card layouts.
   - Headers refined for vertical stacking (Dashboard) or horizontal icons (Drivers/Menu).
   - Hidden scrollbars for a clean "app-like" touch experience.

## Page Details

### Dashboard
- **Stats Grid**: High-level metrics for orders and revenue.
- **Revenue Analytics**: Bar charts powered by Recharts with CAD currency formatting.
- **Recent Orders**: Summary list of the latest transitions.

### Menu Management
- **Category Tabs**: Centered, scrollable tabs for filtering items.
- **Stat Highlights**: High-level counts for stock management.
- **Item Cards**: horizontal/vertical cards with availability toggles and veg/non-veg indicators.

### Fleet Management (Drivers)
- **Context-Aware Views**: Table view on desktop, card-based list on mobile.
- **Actions**: Integrated Edit/Delete functionality across all viewports.
- **Status Indicators**: Visual badges for Active, On Break, and Warning states.

## Development Guide

### Running Locally
```bash
npm install
npm run dev
```

### Adding a New Page
1. Create page component and CSS in `src/pages/`.
2. Update `src/App.tsx` with a new route.
3. Update `Sidebar.tsx` and `BottomNav.tsx` with the new navigation link.

### Design Principles
- **Spacing**: Always use CSS variables (`--space-1` to `--space-12`) to maintain consistency.
- **Elevation**: Use `--shadow-sm/md/lg` for card depth.
- **Interactivity**: Maintain smooth transitions (`--transition-base`) for hovers and toggles.
