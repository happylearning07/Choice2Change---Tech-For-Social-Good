# **Choice2Change** — Daily Choice Simulator
<img width="1860" height="872" alt="image" src="https://github.com/user-attachments/assets/a5dcf99a-e17f-4a82-8763-609768075ae6" />

**Tech for Social Good Hackathon**

A friendly, instant, and personal way to see how today’s choices—**Transport, Diet, Energy**—change your carbon footprint right now. Make a choice → see the effect → get a gentle nudge for a cleaner swap.

# ✨ Features

1. Instant CO₂e total with per-category breakdown and an emoji rating
   (🌱 low / ⚠️ medium / 🔥 high).<img width="949" height="834" alt="image" src="https://github.com/user-attachments/assets/09af3072-2b6b-40d7-b343-3cb8043a45bb" />

2. Daily Choice Simulator across Transport, Diet, Energy (quick “chips” UI for bus vs. car, beef vs. veg, AC vs. fan, etc.).<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/387bd637-6a45-4f87-8c65-2fe6a95a8653" />
3. AI-style suggestions that propose small, high-impact swaps (e.g., “take the bus today”), including estimated CO₂e saved.

4. Charts & graphs to visualize today’s split by category + overall total.<img width="1861" height="823" alt="image" src="https://github.com/user-attachments/assets/ba5faa87-6944-4a48-95c5-6eaf423e59be" />

5. 28-day history with a heatmap (great for streaks) and sparkline (see dips/spikes).<img width="1919" height="569" alt="image" src="https://github.com/user-attachments/assets/4fc658ce-634a-4d2d-84b3-76c6aa4ba49e" />


6. Auto-save to LocalStorage (no account, private by default) + CSV export.

7. Climate News banner + compact 3-story grid with resilient thumbnails
   (local/remote fallbacks; optional NewsAPI/GNews keys; Google News RSS via AllOrigins fallback).

8. Responsive, lightweight UI that feels delightful on desktop and mobile.

<img width="918" height="402" alt="image" src="https://github.com/user-attachments/assets/6986cefa-be8c-463e-a800-e00ada73de72" />


# 📦 **Tech stack**

1. React 18 (functional components + hooks)

2. JavaScript (ES2020+)

3. CSS3 (Grid/Flexbox, custom properties, gradients/glass)

4. lucide-react icons

5. LocalStorage for private, on-device persistence

6. Web APIs: fetch, DOMParser (RSS), Blob + URL.createObjectURL (CSV export)

7. Recharts + custom SVG sparkline for charts

8. News sources: NewsAPI / GNews (optional), Google News RSS via AllOrigins fallback

9. Google S2 Favicon service for source badges

10. ESLint

# 🚀 Getting started
Prerequisites

Node.js ≥ 18 and npm

1) Clone
git clone https://github.com/happylearning07/Choice2Change---Tech-For-Social-Good.git
cd "Choice2Change---Tech-For-Social-Good"

2) Install
npm install

3) (Optional) Environment keys for richer news

Create a .env file in the project root (same level as package.json):

# .env
REACT_APP_NEWSAPI_KEY=your_newsapi_key_here
REACT_APP_GNEWS_KEY=your_gnews_key_here


Don’t have keys? No problem—Google News RSS (via AllOrigins) will be used as a fallback.

4) Run in development
npm start

5) Build for production
npm run build

Deploy the /build folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

# Project Structure (High Level)
<img width="413" height="478" alt="image" src="https://github.com/user-attachments/assets/fa8faf60-52eb-48b7-b283-b054e172d95b" />


# Acknowledgements

lucide-react for crisp icons

Recharts for chart primitives

AllOrigins for safe RSS fetching

Google S2 Favicon for lightweight source favicons

    
