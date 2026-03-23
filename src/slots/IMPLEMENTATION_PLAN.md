# Slot Machine Implementation Plan

This document outlines the step-by-step phases to build the CSS-themed Cascading Slot Machine game. Each phase must be completed and tested against its specific acceptance criteria before moving to the next.

---

## Phase 1: Engine Skeleton & Data Grid Rendering

### Objective
Establish the foundational data structure, random symbol generation, and raw React UI grid (strictly constrained to 100vh) without cascading or economy logic.

### Functional Requirements
- **Configuration File**: Create an independent config file (`symbols.config.js`) defining the core symbols: `n1` (highest value), `n2` (second highest), `A`, `K`, `Q`, `J`, and `WILD`.
- **Asset Mapping**: Use the existing SVGs for `n1`, `n2`, and `WILD`. Use clean CSS text elements for `A`, `K`, `Q`, `J`.
- **RNG Matrix Algorithm**: Build a pure JavaScript class or custom hook that generates a 7 column x 6 row multi-dimensional array.
- **Weighted Generation**: The RNG must favor basic cards (`A,K,Q,J`), drop `n2` occasionally, drop `n1` rarely, and drop `WILD` exceedingly rarely. (Base probabilities only for now).
- **Core UI Structure**: Scaffold the main layout. Apply the required color theme (`#005596`, `#ffcf01`, `#033b5e`).

### Non-Functional Requirements
- **Layout Constraints**: The application *must not scroll*. It must fit perfectly within `100vh` on both mobile (e.g. iPhone SE dimensions) and 4k desktop monitors.
- **Responsiveness**: Grid aspect ratio should be maintained via responsive CSS Grids/Flexbox or `vw/vh` relative sizing.

### Acceptance Criteria
- [x] Opening `/slots` displays a centered 7-column, 6-row grid.
- [x] The browser does not show vertical or horizontal scrollbars at any typical screen size.
- [x] The `n1`, `n2`, and `WILD` grid spaces display their respective `<img>` assets fetched from `/public/slots/assets/`.
- [x] `A`, `K`, `Q`, `J` are cleanly styled using CSS and text.
- [x] A temporary "Generate Grid" button sits below the grid. Clicking it accurately re-renders a new 7x6 matrix of random symbols matching the weighting logic.

---

## Phase 2: Core Economy & Betting UI

### Objective
Integrate the user interface for betting, manage the local player state (bankroll), and restrict spins based on funds.

### Functional Requirements
- **Bet Selection**: Create interactive toggle buttons for `$1`, `$2`, and `$5` bets.
- **Bankroll State**: Initialize a local state value of `$1000`.
- **Spin Action**: Replace the temporary Generate button with the official "SPIN" button. Clicking SPIN deducts the active bet from the bankroll and regenerates the grid.
- **Auto-Replenish Edge Case**: If the player attempts to spin and `bankroll < selected_bet`, the bankroll instantly resets back to `$1000`.

### Non-Functional Requirements
- **Control Panel Layout**: The betting toggles, bankroll display, and spin button must sit *directly below* the grid, still fitting strictly within the `100vh` viewport.
- **Visual Feedback**: The active bet size must be visually distinct (e.g. highlighted gold `#ffcf01`).

### Acceptance Criteria
- [x] The exact current bankroll is clearly visible to the user at all times.
- [x] The user can click `$1`, `$2`, or `$5` and the active bet visually updates.
- [x] Clicking Spin successfully subtracts the correct amount and updates the matrix.
- [x] Clicking Spin when balance is $0 (or lower than the bet) logs an auto-replenish event and sets balance to $1000.

---

## Phase 3: Cluster Detection & RTP Skeleton

### Objective
Implement the Depth-First Search (DFS) algorithm to find clusters, process WILD substitution, and map these clusters to payouts.

### Functional Requirements
- **Algorithm**: Build the logic to scan the 7x6 matrix for orthogonally touching symbols (up, down, left, right).
- **Cluster Minimum**: Only clusters of 5 or more are valid.
- **WILD Logic**: 
  - WILD acts as any symbol.
  - If a single WILD connects two different valid clusters (e.g. touching 4 'A's and 4 'n1's), the DFS logic must assign the WILD to the higher-value cluster (`n1`). It cannot count toward both clusters simultaneously.
- **Payout Table**: Define a mathematical schedule inside the config file where symbol value (n1 > n2 > A ...) multiplied by cluster size multiplied by bet size = added bankroll.
- **RTP Baseline (99%)**: Ensure the mathematical payout multipliers and RNG probabilities give an average expected return close to 99%. 

### Non-Functional Requirements
- **Separation of Concerns**: The cluster checking algorithm must be pure JavaScript (UI agnostic) so it evaluates instantly without UI blocking.

### Acceptance Criteria
- [x] Clicking Spin evaluates the grid *after* generation.
- [x] A debugging panel or console.log clearly outputs valid clusters (e.g., `[CLUSTER DETECTED] Symbol: "A", Size: 6, Payout: $20`).
- [x] The user's bankroll accurately increases based on the payout map.
- [x] A manually crafted test grid proves that a single `WILD` flanked by 'n1' and 'A' only rewards the 'n1' combination.

---

## Phase 4: Cascades & Visual Feedback ("Tumbling")

### Objective
Translate the mathematical wins into visual cascades using Framer Motion. 

### Functional Requirements
- **Implode Animation**: Winning symbols must pulse (scale up slightly), then scale down to `0` opacity and `0` scale.
- **Gravity Drop**: 
  - Symbols located *above* the destroyed winning symbols must fall straight down to fill the empty array slots.
  - The vacated gaps at the very top of the grid must be mathematically filled with new RNG symbols.
- **Cascading Loop**: The game engine must re-evaluate the grid for *new* clusters after gravity drops. If more wins exist, the loop continues (implode -> drop -> evaluate) until no clusters remain.
- **Lock Controls**: The Spin button and Bet sizes must be strictly disabled during the duration of any cascade.

### Non-Functional Requirements
- **Animation Tooling**: Must use `framer-motion` for buttery smooth layout transitions.
- **Timing**: Animations should be snappy enough to feel rewarding but not artificially extend the game loop (approx 300-500ms max per phase).

### Acceptance Criteria
- [x] When a win occurs, winning symbols visibly shrink and disappear.
- [x] Symbols fall smoothly from above to take their place.
- [x] New symbols spawn smoothly from the top boundary.
- [x] Consecutive/Cascading wins pay out properly into the Bankroll and do not require another button press.
- [x] The Spin button is visually greyed out and unclickable while tumbling is occurring.

---

## Phase 5: Polish, Audio & Settings

### Objective
Finalize the aesthetic presence, hook up the actual background music, and present game settings menus.

### Functional Requirements
- **Settings Menu**: Add a small gear icon that opens a modal or inline menu.
- **Spin Speed**: Add a toggle (Normal / Fast). "Fast" practically bypasses animation delay timers to execute cascades near-instantly.
- **Audio Control**: Implement an Audio object referencing `/public/slots/bgmusic/`. Include an On/Off toggle. Ensure playback is tied to user-interaction to respect browser autoplay constraints.
- **Game Logo**: Ensure `GAMELOGO.svg` is styled prominently above the grid.

### Non-Functional Requirements
- **Z-Indexing**: The settings menu or modal must properly overlay the entire screen without bugging out Framer Motion.

### Acceptance Criteria
- [x] The user can toggle a "Fast" mode and see cascades complete in half the time or less.
- [x] Background music plays smoothly and loops continuously once interacted with, and can be fully muted via toggle.
- [x] The `GAMELOGO.svg` is cleanly integrated at the top of the interface.
- [ ] The game is tested and confirmed fully functional on Chrome, Safari, and Firefox.