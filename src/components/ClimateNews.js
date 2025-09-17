// // import React, { useEffect, useMemo, useRef, useState } from "react";

// // const NEWS_LIMIT = 8;          // number of cards
// // const REFRESH_MINUTES = 30;    // auto-refresh cadence
// // const RSS_FALLBACK =
// //   "https://news.google.com/rss/search?q=climate%20OR%20global%20warming%20OR%20carbon%20emissions&hl=en-IN&gl=IN&ceid=IN:en";

// // function timeAgo(iso) {
// //   const d = new Date(iso);
// //   const mins = Math.floor((Date.now() - d.getTime()) / 60000);
// //   if (mins < 1) return "just now";
// //   if (mins < 60) return `${mins}m ago`;
// //   const hrs = Math.floor(mins / 60);
// //   if (hrs < 24) return `${hrs}h ago`;
// //   const days = Math.floor(hrs / 24);
// //   return `${days}d ago`;
// // }

// // function stripHTML(str = "") {
// //   const tmp = document.createElement("div");
// //   tmp.innerHTML = str;
// //   return tmp.textContent || tmp.innerText || "";
// // }

// // // --- Providers ---

// // async function fetchNewsAPI() {
// //   const key = process.env.REACT_APP_NEWSAPI_KEY;
// //   if (!key) return null;
// //   const url =
// //     `https://newsapi.org/v2/everything?` +
// //     new URLSearchParams({
// //       q: "climate OR global warming OR carbon emissions",
// //       sortBy: "publishedAt",
// //       language: "en",
// //       pageSize: String(NEWS_LIMIT + 2),
// //       apiKey: key,
// //     }).toString();

// //   const res = await fetch(url);
// //   if (!res.ok) throw new Error("NewsAPI error");
// //   const data = await res.json();
// //   if (!data?.articles) return null;
// //   return data.articles.map((a) => ({
// //     title: a.title,
// //     url: a.url,
// //     image: a.urlToImage,
// //     source: a.source?.name || "NewsAPI",
// //     publishedAt: a.publishedAt || new Date().toISOString(),
// //     summary: a.description || "",
// //   }));
// // }

// // async function fetchGNews() {
// //   const key = process.env.REACT_APP_GNEWS_KEY;
// //   if (!key) return null;
// //   const url =
// //     `https://gnews.io/api/v4/search?` +
// //     new URLSearchParams({
// //       q: "climate OR global warming OR carbon emissions",
// //       lang: "en",
// //       country: "in",
// //       sortby: "publishedAt",
// //       max: String(NEWS_LIMIT + 2),
// //       apikey: key,
// //     }).toString();

// //   const res = await fetch(url);
// //   if (!res.ok) throw new Error("GNews error");
// //   const data = await res.json();
// //   if (!data?.articles) return null;
// //   return data.articles.map((a) => ({
// //     title: a.title,
// //     url: a.url,
// //     image: a.image,
// //     source: a.source?.name || "GNews",
// //     publishedAt: a.publishedAt || new Date().toISOString(),
// //     summary: a.description || "",
// //   }));
// // }

// // async function fetchRSSFallback() {
// //   // CORS-safe proxy for RSS
// //   const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_FALLBACK)}`;
// //   const res = await fetch(proxied);
// //   if (!res.ok) throw new Error("RSS error");
// //   const xmlText = await res.text();
// //   const parser = new DOMParser();
// //   const xml = parser.parseFromString(xmlText, "text/xml");
// //   const items = Array.from(xml.querySelectorAll("item")).slice(0, NEWS_LIMIT + 2);

// //   return items.map((it) => {
// //     const title = it.querySelector("title")?.textContent || "Untitled";
// //     const link = it.querySelector("link")?.textContent || "#";
// //     const pub = it.querySelector("pubDate")?.textContent;
// //     const source = it.querySelector("source")?.textContent || "Google News";
// //     const desc = stripHTML(it.querySelector("description")?.textContent || "");
// //     return {
// //       title,
// //       url: link,
// //       image: null, // RSS rarely provides images
// //       source,
// //       publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
// //       summary: desc,
// //     };
// //   });
// // }

// // // --- UI ---

// // const SkeletonCard = () => (
// //   <div className="cnews-card cnews-skeleton">
// //     <div className="cnews-skel-img" />
// //     <div className="cnews-skel-title" />
// //     <div className="cnews-skel-sub" />
// //   </div>
// // );

// // const NewsCard = ({ n }) => (
// //   <a className="cnews-card" href={n.url} target="_blank" rel="noreferrer">
// //     <div className="cnews-image">
// //       {n.image ? (
// //         <img src={n.image} alt={n.title} loading="lazy" />
// //       ) : (
// //         <div className="cnews-placeholder">Climate News</div>
// //       )}
// //       <span className="cnews-chip">{n.source}</span>
// //     </div>
// //     <h4 className="cnews-title">{n.title}</h4>
// //     <p className="cnews-sub">{n.summary}</p>
// //     <div className="cnews-time">{timeAgo(n.publishedAt)}</div>
// //   </a>
// // );

// // export default function ClimateNews() {
// //   const [news, setNews] = useState([]);
// //   const [phase, setPhase] = useState("loading"); // loading | ready | error
// //   const [error, setError] = useState("");

// //   const refresh = async () => {
// //     try {
// //       setPhase("loading");
// //       setError("");
// //       let items = await fetchNewsAPI();
// //       if (!items || items.length === 0) items = await fetchGNews();
// //       if (!items || items.length === 0) items = await fetchRSSFallback();
// //       if (!items || items.length === 0) throw new Error("No news found");
// //       setNews(items.slice(0, NEWS_LIMIT));
// //       setPhase("ready");
// //     } catch (e) {
// //       setPhase("error");
// //       setError(e.message || "Failed to load news");
// //     }
// //   };

// //   useEffect(() => {
// //     refresh();
// //     const id = setInterval(refresh, REFRESH_MINUTES * 60 * 1000);
// //     return () => clearInterval(id);
// //   }, []);

// //   const tickerText = useMemo(
// //     () => (news.length ? news.map((n) => n.title).join("   •   ") : "Fetching headlines..."),
// //     [news]
// //   );

// //   const marqueeRef = useRef(null);

// //   return (
// //     <section className="cnews-section">
// //       {/* Banner / Ticker */}
// //       <div className="cnews-banner">
// //         <span className="cnews-banner-label">🌍 Latest Climate News</span>
// //         <div
// //           className="cnews-ticker-wrap"
// //           onMouseEnter={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "paused")}
// //           onMouseLeave={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "running")}
// //         >
// //           <div className="cnews-ticker" ref={marqueeRef}>
// //             {tickerText}
// //           </div>
// //         </div>
// //         <button className="cnews-refresh" onClick={refresh}>Refresh</button>
// //       </div>

// //       {/* Grid */}
// //       <div className="cnews-grid">
// //         {phase === "loading" &&
// //           Array.from({ length: NEWS_LIMIT }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
// //         {phase === "error" && (
// //           <div className="cnews-error">
// //             Failed to load news: {error}. Try Refresh.
// //           </div>
// //         )}
// //         {phase === "ready" && news.map((n, i) => <NewsCard n={n} key={i} />)}
// //       </div>
// //     </section>
// //   );
// // }




// import React, { useEffect, useMemo, useRef, useState } from "react";

// const NEWS_LIMIT = 3;           // show only 2–3 items
// const REFRESH_MINUTES = 30;     // auto-refresh cadence
// const MAX_AGE_DAYS = 60;        // filter very old items
// const RSS_FALLBACK =
//   "https://news.google.com/rss/search?q=climate%20OR%20global%20warming%20OR%20carbon%20emissions&hl=en-IN&gl=IN&ceid=IN:en";

// function timeAgo(iso) {
//   const d = new Date(iso);
//   const mins = Math.floor((Date.now() - d.getTime()) / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   const days = Math.floor(hrs / 24);
//   return `${days}d ago`;
// }

// function stripHTML(str = "") {
//   const tmp = document.createElement("div");
//   tmp.innerHTML = str;
//   return tmp.textContent || tmp.innerText || "";
// }

// function domainFromUrl(u) {
//   try { return new URL(u).hostname; } catch { return ""; }
// }
// function faviconFor(url) {
//   const d = domainFromUrl(url);
//   return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=128` : null;
// }

// /* ---------------- Providers ---------------- */

// async function fetchNewsAPI() {
//   const key = process.env.REACT_APP_NEWSAPI_KEY;
//   if (!key) return null;
//   const url =
//     `https://newsapi.org/v2/everything?` +
//     new URLSearchParams({
//       q: "climate OR global warming OR carbon emissions",
//       sortBy: "publishedAt",
//       language: "en",
//       pageSize: String(NEWS_LIMIT),
//       apiKey: key,
//     }).toString();

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("NewsAPI error");
//   const data = await res.json();
//   if (!data?.articles) return null;

//   const items = data.articles.map((a) => ({
//     title: a.title,
//     url: a.url,
//     image: a.urlToImage || null,
//     source: a.source?.name || "NewsAPI",
//     publishedAt: a.publishedAt || new Date().toISOString(),
//     summary: a.description || "",
//     favicon: faviconFor(a.url),
//   }));

//   return items.slice(0, NEWS_LIMIT);
// }

// async function fetchGNews() {
//   const key = process.env.REACT_APP_GNEWS_KEY;
//   if (!key) return null;
//   const url =
//     `https://gnews.io/api/v4/search?` +
//     new URLSearchParams({
//       q: "climate OR global warming OR carbon emissions",
//       lang: "en",
//       country: "in",
//       sortby: "publishedAt",
//       max: String(NEWS_LIMIT),
//       apikey: key,
//     }).toString();

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("GNews error");
//   const data = await res.json();
//   if (!data?.articles) return null;

//   const items = data.articles.map((a) => ({
//     title: a.title,
//     url: a.url,
//     image: a.image || null,
//     source: a.source?.name || "GNews",
//     publishedAt: a.publishedAt || new Date().toISOString(),
//     summary: a.description || "",
//     favicon: faviconFor(a.url),
//   }));

//   return items.slice(0, NEWS_LIMIT);
// }

// async function fetchRSSFallback() {
//   const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_FALLBACK)}`;
//   const res = await fetch(proxied);
//   if (!res.ok) throw new Error("RSS error");
//   const xmlText = await res.text();

//   const parser = new DOMParser();
//   const xml = parser.parseFromString(xmlText, "text/xml");
//   const items = Array.from(xml.querySelectorAll("item"));

//   const mapped = items.map((it) => {
//     const title = it.querySelector("title")?.textContent || "Untitled";
//     const link = it.querySelector("link")?.textContent || "#";
//     const pub = it.querySelector("pubDate")?.textContent;
//     const source = it.querySelector("source")?.textContent || "Google News";
//     const desc = stripHTML(it.querySelector("description")?.textContent || "");

//     // Try multiple places for an image (RSS often hides it)
//     let image =
//       it.querySelector("media\\:content")?.getAttribute("url") ||
//       it.querySelector("enclosure")?.getAttribute("url") ||
//       null;

//     if (!image) {
//       const encoded = it.querySelector("content\\:encoded")?.textContent || "";
//       const match = encoded.match(/<img[^>]+src="([^"]+)"/i);
//       if (match) image = match[1];
//     }

//     return {
//       title,
//       url: link,
//       image: image || null,
//       source,
//       publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
//       summary: desc,
//       favicon: faviconFor(link),
//     };
//   });

//   // Filter very old articles and limit
//   const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
//   const fresh = mapped.filter((a) => new Date(a.publishedAt).getTime() >= cutoff);
//   return fresh.slice(0, NEWS_LIMIT);
// }

// /* ---------------- UI ---------------- */

// const SkeletonCard = () => (
//   <div className="cnews-card cnews-skeleton">
//     <div className="cnews-skel-img" />
//     <div className="cnews-skel-title" />
//     <div className="cnews-skel-sub" />
//   </div>
// );

// const NewsCard = ({ n }) => (
//   <a className="cnews-card" href={n.url} target="_blank" rel="noreferrer">
//     <div className="cnews-image">
//       {n.image ? (
//         <img src={n.image} alt={n.title} loading="lazy" />
//       ) : (
//         <div className="cnews-placeholder">
//           {n.favicon ? <img src={n.favicon} alt="" style={{ width: 28, height: 28 }} /> : null}
//           <span>Climate News</span>
//         </div>
//       )}
//       <span className="cnews-chip">{n.source}</span>
//     </div>
//     <h4 className="cnews-title">{n.title}</h4>
//     <p className="cnews-sub">{n.summary}</p>
//     <div className="cnews-time">{timeAgo(n.publishedAt)}</div>
//   </a>
// );

// export default function ClimateNews() {
//   const [news, setNews] = useState([]);
//   const [phase, setPhase] = useState("loading"); // loading | ready | error
//   const [error, setError] = useState("");

//   const refresh = async () => {
//     try {
//       setPhase("loading");
//       setError("");
//       let items = await fetchNewsAPI();
//       if (!items || items.length === 0) items = await fetchGNews();
//       if (!items || items.length === 0) items = await fetchRSSFallback();
//       if (!items || items.length === 0) throw new Error("No news found");
//       setNews(items.slice(0, NEWS_LIMIT));
//       setPhase("ready");
//     } catch (e) {
//       setPhase("error");
//       setError(e.message || "Failed to load news");
//     }
//   };

//   useEffect(() => {
//     refresh();
//     const id = setInterval(refresh, REFRESH_MINUTES * 60 * 1000);
//     return () => clearInterval(id);
//   }, []);

//   const tickerText = useMemo(
//     () => (news.length ? news.map((n) => n.title).join("   •   ") : "Fetching headlines..."),
//     [news]
//   );

//   const marqueeRef = useRef(null);

//   return (
//     <section className="cnews-section">
//       {/* Banner / Ticker */}
//       <div className="cnews-banner">
//         <span className="cnews-banner-label">🌍 Latest Climate News</span>
//         <div
//           className="cnews-ticker-wrap"
//           onMouseEnter={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "paused")}
//           onMouseLeave={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "running")}
//         >
//           <div className="cnews-ticker" ref={marqueeRef}>
//             {tickerText}
//           </div>
//         </div>
//         <button className="cnews-refresh" onClick={refresh}>Refresh</button>
//       </div>

//       {/* Grid */}
//       <div className="cnews-grid">
//         {phase === "loading" &&
//           Array.from({ length: NEWS_LIMIT }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
//         {phase === "error" && (
//           <div className="cnews-error">
//             Failed to load news: {error}. Try Refresh.
//           </div>
//         )}
//         {phase === "ready" && news.map((n, i) => <NewsCard n={n} key={i} />)}
//       </div>
//     </section>
//   );
// }






import React, { useEffect, useMemo, useRef, useState } from "react";

const NEWS_LIMIT = 3;
const REFRESH_MINUTES = 30;
const MAX_AGE_DAYS = 60;
const RSS_FALLBACK =
  "https://news.google.com/rss/search?q=climate%20OR%20global%20warming%20OR%20carbon%20emissions&hl=en-IN&gl=IN&ceid=IN:en";

// Common thumbnail for all cards (local), plus a remote backup if local missing
const DEFAULT_IMG = `${process.env.PUBLIC_URL}/news_cover.png`;
const REMOTE_FALLBACK =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60";

function timeAgo(iso) {
  const d = new Date(iso);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function stripHTML(str = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
}

function domainFromUrl(u) {
  try { return new URL(u).hostname; } catch { return ""; }
}
function faviconFor(url) {
  const d = domainFromUrl(url);
  return d ? `https://www.google.com/s2/favicons?domain=${d}&sz=64` : null;
}

/* ---------------- Providers ---------------- */

async function fetchNewsAPI() {
  const key = process.env.REACT_APP_NEWSAPI_KEY;
  if (!key) return null;
  const url =
    `https://newsapi.org/v2/everything?` +
    new URLSearchParams({
      q: "climate OR global warming OR carbon emissions",
      sortBy: "publishedAt",
      language: "en",
      pageSize: String(NEWS_LIMIT),
      apiKey: key,
    }).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error("NewsAPI error");
  const data = await res.json();
  if (!data?.articles) return null;

  return data.articles.slice(0, NEWS_LIMIT).map((a) => ({
    title: a.title,
    url: a.url,
    image: a.urlToImage || DEFAULT_IMG,
    source: a.source?.name || "NewsAPI",
    publishedAt: a.publishedAt || new Date().toISOString(),
    summary: a.description || "",
    favicon: faviconFor(a.url),
  }));
}

async function fetchGNews() {
  const key = process.env.REACT_APP_GNEWS_KEY;
  if (!key) return null;
  const url =
    `https://gnews.io/api/v4/search?` +
    new URLSearchParams({
      q: "climate OR global warming OR carbon emissions",
      lang: "en",
      country: "in",
      sortby: "publishedAt",
      max: String(NEWS_LIMIT),
      apikey: key,
    }).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error("GNews error");
  const data = await res.json();
  if (!data?.articles) return null;

  return data.articles.slice(0, NEWS_LIMIT).map((a) => ({
    title: a.title,
    url: a.url,
    image: a.image || DEFAULT_IMG,
    source: a.source?.name || "GNews",
    publishedAt: a.publishedAt || new Date().toISOString(),
    summary: a.description || "",
    favicon: faviconFor(a.url),
  }));
}

async function fetchRSSFallback() {
  const proxied = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_FALLBACK)}`;
  const res = await fetch(proxied);
  if (!res.ok) throw new Error("RSS error");
  const xmlText = await res.text();

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.querySelectorAll("item"));

  const mapped = items.map((it) => {
    const title = it.querySelector("title")?.textContent || "Untitled";
    const link = it.querySelector("link")?.textContent || "#";
    const pub = it.querySelector("pubDate")?.textContent;
    const source = it.querySelector("source")?.textContent || "Google News";
    const desc = stripHTML(it.querySelector("description")?.textContent || "");

    // Try to find an image in various RSS places
    let image =
      it.querySelector("media\\:content")?.getAttribute("url") ||
      it.querySelector("enclosure")?.getAttribute("url") ||
      null;

    if (!image) {
      const encoded = it.querySelector("content\\:encoded")?.textContent || "";
      const match = encoded.match(/<img[^>]+src="([^"]+)"/i);
      if (match) image = match[1];
    }

    return {
      title,
      url: link,
      image: image || DEFAULT_IMG,
      source,
      publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
      summary: desc,
      favicon: faviconFor(link),
    };
  });

  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const fresh = mapped.filter((a) => new Date(a.publishedAt).getTime() >= cutoff);
  return fresh.slice(0, NEWS_LIMIT);
}

/* ---------------- UI ---------------- */

const SkeletonCard = () => (
  <div className="cnews-card cnews-skeleton">
    <div className="cnews-skel-img" />
    <div className="cnews-skel-title" />
    <div className="cnews-skel-sub" />
  </div>
);

const NewsCard = ({ n }) => (
  <a className="cnews-card" href={n.url} target="_blank" rel="noreferrer">
    <div className="cnews-image">
      <img
        src={n.image || DEFAULT_IMG}
        alt={n.title}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = REMOTE_FALLBACK; }}
      />
      <span className="cnews-chip">{n.source}</span>
    </div>
    <h4 className="cnews-title">{n.title}</h4>
    <p className="cnews-sub">{n.summary}</p>
    <div className="cnews-time">{timeAgo(n.publishedAt)}</div>
  </a>
);

export default function ClimateNews() {
  const [news, setNews] = useState([]);
  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setPhase("loading");
      setError("");
      let items = await fetchNewsAPI();
      if (!items || items.length === 0) items = await fetchGNews();
      if (!items || items.length === 0) items = await fetchRSSFallback();
      if (!items || items.length === 0) throw new Error("No news found");
      setNews(items.slice(0, NEWS_LIMIT));
      setPhase("ready");
    } catch (e) {
      setPhase("error");
      setError(e.message || "Failed to load news");
    }
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, REFRESH_MINUTES * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const tickerText = useMemo(
    () => (news.length ? news.map((n) => n.title).join("   •   ") : "Fetching headlines..."),
    [news]
  );

  const marqueeRef = useRef(null);

  return (
    <section className="cnews-section">
      {/* Banner / Ticker */}
      <div className="cnews-banner">
        <span className="cnews-banner-label">🌍 Latest Climate News</span>
        <div
          className="cnews-ticker-wrap"
          onMouseEnter={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "paused")}
          onMouseLeave={() => marqueeRef.current && (marqueeRef.current.style.animationPlayState = "running")}
        >
          <div className="cnews-ticker" ref={marqueeRef}>
            {tickerText}
          </div>
        </div>
        <button className="cnews-refresh" onClick={refresh}>Refresh</button>
      </div>

      {/* Grid */}
      <div className="cnews-grid">
        {phase === "loading" &&
          Array.from({ length: NEWS_LIMIT }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
        {phase === "error" && (
          <div className="cnews-error">
            Failed to load news: {error}. Try Refresh.
          </div>
        )}
        {phase === "ready" && news.map((n, i) => <NewsCard n={n} key={i} />)}
      </div>
    </section>
  );
}
