# PRD — Weather in Calendar

## 1. Overview

**Product Name:** Weather in Calendar
**Tagline:** See the weather forecast right inside your calendar — no extra app needed.
**Target Users:** Anyone who uses digital calendars (Google Calendar, Apple Calendar) and wants weather context for planning.

## 2. Problem Statement

People check weather separately from their calendar, then mentally combine the two for planning. Weather in Calendar eliminates this friction by injecting weather forecasts directly into calendar events via ICS subscription.

## 3. Core Features

### 3.1 ICS Weather Feed
- Generates standard ICS/iCal feed URL
- Compatible with Google Calendar, Apple Calendar, Outlook
- Daily weather events: high/low temp, conditions, precipitation probability
- Hourly breakdown in event description

### 3.2 Location Configuration
- Set home/work/custom locations
- Support multiple locations in one feed
- Auto-detect timezone

### 3.3 Customization
- Temperature unit (°C/°F)
- Event format (emoji + text, compact, detailed)
- Forecast range (3-day, 7-day, 14-day)
- Bilingual support (Chinese/English)

### 3.4 Weather Sources
- Primary: Open-Meteo (free, no API key)
- Fallback: wttr.in
- Configurable update frequency

## 4. Technical Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Web Config  │────▶│  Python API  │────▶│  Open-Meteo  │
│    (UI)      │     │ (ICS Gen)    │     │  (Weather)   │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │  ICS Feed    │
                     │ (Subscribe)  │
                     └──────────────┘
```

## 5. MVP Scope (Completed)

| Feature | Status |
|---------|--------|
| ICS feed generation | ✅ Done |
| Google Calendar compatible | ✅ Done |
| Location config | ✅ Done |
| Bilingual | ✅ Done |
| Multi-location | 🔄 In progress |
| Hourly breakdown | 🔄 In progress |

## 6. Improvement Ideas

- PWA for mobile configuration
- Widget showing next 3 days
- Severe weather alerts as calendar reminders
- Integration with travel calendar (auto-detect destination weather)
