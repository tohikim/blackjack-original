# Sorcerer's Hand

A minimalist, logic-driven Blackjack engine set in a wizarding world. By pairing classic casino rules with an immersive magical aesthetic, it delivers a clean, calculated, and thematic card-playing experience without the clutter.

<img width="1200" height="630" alt="og-image" src="https://github.com/user-attachments/assets/019d3d0c-5f4e-4872-8891-9852a0b42ee3" />

<h2> Try it Live </h2>

This project is deployed and ready for immediate use. You do not need to install anything locally to test the features:
 **[Live Demo on Vercel](https://sorcerers-hand.vercel.app/)**

<h2>Features </h2>

- **Wizarding Aesthetic:** A fully styled interface utilizing rich magical elements, featuring a classic parchment-and-gold visual style set against a thematic background.
- **Splitting & Multi-Hand Logic:** True casino rules support. When dealt pairs of equal value, split your hand seamlessly to manage distinct bets and actions in parallel.
- **Dynamic Soundscapes:** Immersive custom audio feedback tracks every tactical movement—including distinct sound effects for chip stacking, card flips, deals, and wins.
- **Real-time Bankroll Engine:** A precise betting layout managing multi-chip denominations ($500, $100, $25, $5, $1) with native all-in capabilities and rapid single-click undo actions.
- **Asynchronous House Rules:** The Dealer follows rigid house thresholds ($17+$ stand rules) powered by smooth, timed sequence loops for card drawing.

<h2>Tech Stack</h2>

- **Frontend:** React (Vite) + TypeScriptStyling: Tailwind CSS (featuring custom background positioning and fine-grained ambient border gradients)
- **State Management:** Core React Hooks (useState, useEffect, useMemo) combined with deep lodash cloning (cloneDeep) for resilient state isolation between hands.
- **Audio Management:** Custom React hook abstraction (useSFX) for low-latency sound effects.

<h2>Installation & Setup</h2> 

To get this project running locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tohikim/sorcerers-hand
   cd sorcerers-hand
   ```
2. **Install core dependencies:**
   ```bash
   npm install
   ```

3. **Install specialized utility libraries:**
   ```bash
   npm install lodash
   npm install -D @types/lodash
   ```
   
4. **Start the development server:**
   ```bash
   npm run dev
   ```

<h2>Project Structure</h2>

- **App.tsx:** Orchestrates the game states, evaluation conditions, asynchronous dealers, and overall game layout.
- **PlayerHand.jsx:** Coordinates individual card arrays, state rendering, wins, and loss checks for single or split states.
- **useSFX.ts:** Custom hook executing contextual HTML5 Audio playbacks and volume scaling.
- **utils/:** Abstracted pure logic files managing operations like getDeck, shuffle-deck, and asynchronous calculation intervals (sleep).

---

Developed by **Tohi Kim**
