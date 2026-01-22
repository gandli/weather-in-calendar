# Changelog

All notable changes to this project are documented in this file.

## [0.0.1] - 2026-01-20

### 🚀 Added
- **Real-time Weather Preview**: Implemented debounced search with 14-day weather preview in the Hero component
- **Global Ambient Background**: Introduced ambient glow system based on UI/UX Pro Max specifications, enhancing overall page depth
- **Default City Forecast**: Automatic display of default city weather preview (Shanghai for Chinese, New York for English) based on locale
- **New API Architecture**: Restructured directory under `src/app/api` with dedicated routes for daily (`/api/daily`) and hourly (`/api/hourly`) forecasts

### 🎨 Improved
- **Cohesive Visual Flow**: Removed conflicting background gradients from individual components, achieving seamless transitions from Hero to Footer through unified ambient glow
- **Glass Morphism Details**: Enhanced Backdrop Blur effects for Footer and feature cards with optimized border contrast
- **Interactive Feedback**: Added micro-scale animations (`scale-[1.02]`) and cursor pointers to feature cards for better user interaction
- **Dynamic Webcal Generation**: Replaced hardcoded `localhost:3000` with dynamic environment Origin for subscription link generation

### 🐞 Fixed
- **TypeScript Type Safety**: Resolved type inference and property access errors for `WeatherEvent` in Hero component
- **Internationalization Completion**: Added missing translations for `previewTitle` and `previewTitleDefault` in both Chinese and English locales, eliminating console errors
- **Data Consistency**: Adjusted ICS generation API to request 15-day forecasts by default, ensuring preview and subscription data alignment

### ✨ Initial Release (Merged from 1.0.0)
- Project foundation setup (Next.js 15, Tailwind CSS, Lucide Icons)
- QWeather API integration
- Basic ICS calendar subscription functionality
- Bilingual support (Chinese/English)

