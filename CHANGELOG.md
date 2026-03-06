# Changelog

All notable changes to this project are documented in this file.

## [unreleased]



### ci

- Add cloudflare deployment workflow (#106)

- Add Cloudflare Pages deployment workflow for main branch


### 🐞 Fixed

- Remove proxy file for cloudflare compatibility (#107)

- Unblock cloudflare deploy by removing r2 cache override (#108)

- Output _worker.js for Cloudflare Pages runtime


### 📝 Documentation

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]


### 🔧 Chore

- Trigger pages rebuild after nodejs_compat flag


## [0.1.2] - 2026-03-03



### ci

- Commit screenshot outputs to repository


### 🐞 Fixed

- Detect screenshot changes including new files (#102)

- Stabilize screenshot workflow push and data readiness (#104)


### 📝 Documentation

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]

- Auto-update changelog [skip ci]


### 🔧 Chore

- Bump version to 0.1.2


### 🚀 Added

- Add city autocomplete suggestions (#101)

- Add smart city autocomplete with api suggestions (#103)

- Capture screenshots by locale and theme (#105)


## [0.1.1] - 2026-03-03



### ci

- Add screenshot and auto-changelog workflows (#100)


### ⚡ Performance

- Optimize hourly weather formatting by hoisting Intl.DateTimeFormat

- Cache searchCity API calls for 24h

- Cache Intl.DateTimeFormat in ICS generation logic

- Cache getWeatherNow API calls for 10 minutes

- Move `emojiMap` to module scope in `qweather.ts`

- Remove artificial 800ms startup delay

- Optimize weather cache duration for freshness

- Optimize redundant Date creation in WeatherDisplay loop

- Optimize string concatenation in ICS generation using array join

- Optimize date formatting and string concatenation (#95)

- Stream initial weather fetch in Hero component (#68)


### 🐞 Fixed

- 更新部署配置文件引用和天气数据类型处理

- Prevent CRLF injection in ICS generation

- Add aria-label to navbar get started button (#66)


### 📝 Documentation

- 添加Cloudflare Pages部署指南和配置说明

- 更新 Cloudflare 部署文档中的构建配置说明

- 更新 Cloudflare 部署指南支持 Workers 和 Pages

- Auto-update changelog [skip ci]


### 🔧 Chore

- Initial commit

- 更新cloudflare-env.d.ts

- 移除配置文件中的多余逗号

- Bump next from 16.1.4 to 16.1.6

- Bump the npm_and_yarn group across 1 directory with 4 updates (#97)

- Remove .jules directory


### 🚀 Added

- Add caching to hourly weather fetch

- Add clear button to hero search input

- Add loading spinner during weather validation

- Optimize WeatherDisplay date handling

- Architectural analysis report

- Add validation for city parameter

- Localize clear search button aria-label and add tooltip

- Add aria-labels to LanguageSwitcher and Navbar (#96)

- Add security headers to next.config.ts (#94)

- Add aria-labels to icon-only buttons for accessibility (#88)

- Add Cache-Control header to weather API (#78)

- Add aria-label to navbar get started button (#75)

- Phase 3 product optimization and unified API errors (#98)

- Phase 4 observability and release readiness (#99)

