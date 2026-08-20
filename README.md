# Hearth 🔥

**Live app:** https://rileydempsey1.github.io/hearth/ — open it on your phone and add it to your Home Screen.

A calm, local-first work hub for iOS — built with Expo / React Native.

Spaces hold each project's running log (notes, decisions, wins, blockers, open
questions, with one level of threaded replies). Tasks sit alongside, the
Library ships 18 original playbooks on working well, and a daily streak ties it
together. Everything lives on-device: no account, no backend, no analytics.

## Run it

```
npm install
npx expo start          # then press i for the iOS simulator
```

The web preview (`npx expo start --web`) is fully functional for development.

## Web deploys

Every push to `main` builds and publishes the PWA to GitHub Pages automatically
(`.github/workflows/deploy.yml`). The build generates all icons from SVG
(`gen-assets.mjs`) and wraps the Expo web export as an installable, offline-capable
PWA (`scripts-build-web.mjs`).

## Ship it (App Store, later)

- Bundle id: `com.hearthapp.hearth` (see app.json)
- Icons and splash are generated in `assets/images/`
- Purchases are mocked by design: the paywall sets a local `isPremium` flag.
  Swap in StoreKit/RevenueCat before charging real money.
- Local notifications only; times are user-picked in the You tab.

## Layout

- `src/theme` — design tokens (color roles, type scale, spacing, motion) + ThemeProvider
- `src/ui` — the component kit (Text, controls, surfaces, motion, layout)
- `src/store` — AsyncStorage-backed app state
- `src/content` — the bundled playbook library and daily prompts
- `src/lib` — dates, haptics, notification scheduling
- `src/app` — expo-router screens
