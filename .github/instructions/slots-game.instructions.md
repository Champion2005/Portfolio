---
description: "Guidelines and rules for developing the CSS-themed Slot Machine game"
applyTo: "src/slots/**/*", "public/slots/**/*"
---

# Slot Machine Game Instructions

## Theme & Visuals
- **Design System**: CSS-themed slot machine.
- **Color Palette (SUPER IMPORTANT)**: 
  - Primary Blue: `#005596`
  - Accent Yellow/Gold: `#ffcf01`
  - Dark Blue: `#033b5e`
- **Branding**: The game logo uses `GAMELOGO.svg` with the word "slot" next to it. 
- **Icons & Assets**: Future visual assets are stored in `/public/slots/assets`.

## Symbols & Hierarchy
- **High-Value Symbols**: 
  - Named sequentially: `n1` (highest value), `n2` (second highest). Note: For now, only `n1` and `n2` exist; the engine must be built to support `n3`, `n4`, etc. later.
- **Low-Value Symbols (Basic)**: Represented using simple text fonts (or very generic CSS) for playing cards: `A` (Ace), `K` (King), `Q` (Queen), `J` (Jack).
- **Special Symbols**: 
  - Wild Card: `WILD.svg`.
- **Extensibility**: Symbol logic (payout tiers, probabilities) must be stored in an accessible config file/object to trivially define and bolt on more symbols.

## game engine & logic
- **Grid Layout**: 6x7 grid (6 columns, 7 rows).
- **Core Mechanic**: Cascading slot (Tumbling). When a win occurs, winning symbols vanish, and new symbols fall from the top. Cascades continue until no more winning combinations exist.
- **RNG & RTP**: The game math must target around a 99% Return to Player (RTP) expected value. Symbol occurrences and payouts scale inversely (A, K, Q, J appear frequently; n1 is rarest).
- **Win Condition**: "Cluster Pays" / Any cluster of 5 or more of the same symbol touching orthogonally (horizontally or vertically).
- **WILD Rules**: A WILD substitutes for other symbols. If a WILD touches two different valid clusters, it assumes the identity of the higher-value symbol (it cannot act as two symbols at once).
- **Mechanics Setup**: Game state must be cleanly abstracted to manage cascades, cluster evaluation, gravity drop, and animations correctly.

## Economy & Betting
- **Bankroll**: Players start with `$1000` (resets on page load). If bankroll reaches $0, it should auto-replenish.
- **Bet Sizes**: Selectable bets of `$1`, `$2`, and `$5`.
- **UI Layout**: Controls (bet size, spin, bankroll) go directly below the grid. The entire game must fit within 100vh (no scrolling) and must be fully responsive for mobile screens.

## Settings & Audio
- **Animations**: Winning symbols will pulse, scale down ("implode"), and disappear.
- **Configuration Menu**: Provide simple settings for:
  - Music Tone Toggle (On/Off).
  - Spin Speed.
- **Audio Assets**: Background music files are expected under `/public/slots/bgmusic/`.
