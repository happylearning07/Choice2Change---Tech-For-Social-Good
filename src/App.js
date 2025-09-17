// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { Leaf, Car, Utensils, Zap, Lightbulb, BarChart3 } from 'lucide-react';
// import './App.css';
// import BeautifulCharts from './components/BeautifulCharts';
// import EarthEmojiPopup from './components/EarthEmojiPopup';
// import ClimateNews from './components/ClimateNews';
// import FootprintHistory from './components/FootprintHistory'; // 👈 NEW

// /* =========================
//    Local history (daily save)
//    ========================= */
// const STORAGE_KEY = 'footprintHistoryV1';

// function dateKey(d = new Date()) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// }
// function loadHistoryObject() {
//   try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
//   catch { return {}; }
// }
// function saveDailyFootprint(value) {
//   const obj = loadHistoryObject();
//   obj[dateKey()] = Number(value) || 0; // overwrite today
//   const keepN = 120; // keep ~4 months
//   const dates = Object.keys(obj).sort();
//   if (dates.length > keepN) {
//     dates.slice(0, dates.length - keepN).forEach(k => delete obj[k]);
//   }
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
// }
// function getHistoryArray(days = 30) {
//   const obj = loadHistoryObject();
//   const out = [];
//   const today = new Date();
//   for (let i = days - 1; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(d.getDate() - i);
//     const k = dateKey(d);
//     out.push({ date: k, value: obj[k] ?? null });
//   }
//   return out;
// }

// /* ========================= */
// const PALETTE = {
//   transport: '#ef4444',
//   diet: '#f59e0b',
//   energy: '#3b82f6',
//   dark: '#111827',
// };

// function KPIChip({ label, value }) {
//   return (
//     <div className="kpi-chip">
//       <span className="kpi-label">{label}</span>
//       <span className="kpi-value">{value}</span>
//     </div>
//   );
// }

// function App() {
//   const [userChoices, setUserChoices] = useState({
//     transport: { method: 'car', distance: 20, fuelType: 'petrol' },
//     diet: { breakfast: 'cereal', lunch: 'rice', dinner: 'chicken' },
//     energy: { electricity: 10, heating: 'gas', appliances: ['tv', 'computer', 'phone'] }
//   });

//   const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0);
//   const [showCharts, setShowCharts] = useState(true);
//   const [showEmojiPopup, setShowEmojiPopup] = useState(false);
//   const [activeMealTab, setActiveMealTab] = useState('breakfast');

//   // 👇 NEW: in-memory history for the History card
//   const [historyData, setHistoryData] = useState(() => getHistoryArray(30));

//   const chartsRef = useRef(null);

//   // Conversion factors
//   const carbonFactors = useMemo(() => ({
//     transport: {
//       car: { petrol: 0.192, diesel: 0.171, electric: 0.053 },
//       bus: 0.089,
//       train: 0.041,
//       bike: 0,
//       walk: 0
//     },
//     diet: {
//       beef: 27.0, chicken: 6.9, fish: 3.0, eggs: 4.2,
//       rice: 4.0, pasta: 2.0, bread: 1.4, vegetables: 2.0,
//       fruits: 1.1, cereal: 1.8, dal: 2.1, roti: 1.2,
//       pork: 12.1, tofu: 2.0, cheese: 13.5, milk: 3.2, yogurt: 3.2,
//       oats: 1.5, pizza: 8.0, burger: 15.0, salad: 1.5, soup: 2.5
//     },
//     energy: { electricity: 0.233, gas: 0.202, oil: 0.267 }
//   }), []);

//   // Per-category CO₂e (kg)
//   const transportCO2 = useMemo(() => {
//     const { method, distance, fuelType } = userChoices.transport;
//     if (method === 'car') return distance * (carbonFactors.transport.car[fuelType] ?? 0.192);
//     return distance * (carbonFactors.transport[method] ?? 0);
//   }, [userChoices.transport, carbonFactors]);

//   const dietCO2 = useMemo(() => {
//     const { breakfast, lunch, dinner } = userChoices.diet;
//     return (
//       (carbonFactors.diet[breakfast] || 0) +
//       (carbonFactors.diet[lunch] || 0) +
//       (carbonFactors.diet[dinner] || 0)
//     );
//   }, [userChoices.diet, carbonFactors]);

//   const energyCO2 = useMemo(() => {
//     const elec = (userChoices.energy.electricity || 0) * carbonFactors.energy.electricity;
//     const heat = 20 * (carbonFactors.energy[userChoices.energy.heating] || 0);
//     const applianceConsumption = { tv: 0.1, computer: 0.15, phone: 0.01, fan: 0.05, ac: 1.0, refrigerator: 0.2, washing: 0.5 };
//     const apps = (userChoices.energy.appliances || []).reduce((sum, a) => {
//       const kwh = applianceConsumption[a] || 0;
//       return sum + kwh * 8 * carbonFactors.energy.electricity;
//     }, 0);
//     return elec + heat + apps;
//   }, [userChoices.energy, carbonFactors]);

//   useEffect(() => {
//     const total = transportCO2 + dietCO2 + energyCO2;
//     setTotalCarbonFootprint(Math.round(total * 100) / 100);
//   }, [transportCO2, dietCO2, energyCO2]);

//   // 👇 NEW: whenever total changes, save today's value and refresh 30-day history
//   useEffect(() => {
//     if (!Number.isFinite(totalCarbonFootprint)) return;
//     saveDailyFootprint(totalCarbonFootprint);
//     setHistoryData(getHistoryArray(30));
//   }, [totalCarbonFootprint]);

//   const getCarbonRating = (footprint) => {
//     if (footprint < 15) return { level: 'low', emoji: '🌱' };
//     if (footprint < 30) return { level: 'medium', emoji: '⚠️' };
//     return { level: 'high', emoji: '🔥' };
//   };
//   const rating = getCarbonRating(totalCarbonFootprint);
//   const percentOfTotal = (v) => (!totalCarbonFootprint ? 0 : Math.round((v / totalCarbonFootprint) * 100));

//   const revealCharts = () => {
//     setShowCharts(true);
//     setTimeout(() => chartsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
//   };

//   const transportMethods = [
//     { key: 'car', label: '🚗 Car', color: PALETTE.transport },
//     { key: 'bus', label: '🚌 Bus', color: '#8b5cf6' },
//     { key: 'train', label: '🚂 Train', color: '#10b981' },
//     { key: 'bike', label: '🚴 Bike', color: '#3b82f6' },
//     { key: 'walk', label: '🚶 Walk', color: '#f59e0b' }
//   ];
//   const fuelTypes = [
//     { key: 'petrol', label: '⛽ Petrol', color: PALETTE.transport },
//     { key: 'diesel', label: '🛢️ Diesel', color: '#7c3aed' },
//     { key: 'electric', label: '⚡ Electric', color: '#10b981' }
//   ];

//   const mealOptions = {
//     breakfast: [
//       { key: 'cereal', label: '🥣 Cereal', color: '#8b5cf6' },
//       { key: 'eggs', label: '🥚 Eggs', color: '#f97316' },
//       { key: 'bread', label: '🍞 Bread', color: '#3b82f6' },
//       { key: 'oats', label: '🌾 Oats', color: '#10b981' },
//       { key: 'fruits', label: '🍎 Fruits', color: '#f59e0b' },
//       { key: 'milk', label: '🥛 Milk', color: '#60a5fa' },
//       { key: 'yogurt', label: '🥛 Yogurt', color: '#60a5fa' }
//     ],
//     lunch: [
//       { key: 'rice', label: '🍚 Rice', color: '#60a5fa' },
//       { key: 'pasta', label: '🍝 Pasta', color: '#8b5cf6' },
//       { key: 'chicken', label: '🍗 Chicken', color: PALETTE.transport },
//       { key: 'fish', label: '🐟 Fish', color: '#10b981' },
//       { key: 'vegetables', label: '🥗 Veggies', color: '#22c55e' },
//       { key: 'dal', label: '🫘 Dal', color: PALETTE.diet },
//       { key: 'roti', label: '🫓 Roti', color: '#7c3aed' },
//       { key: 'tofu', label: '🍱 Tofu', color: '#06b6d4' }
//     ],
//     dinner: [
//       { key: 'chicken', label: '🍗 Chicken', color: PALETTE.transport },
//       { key: 'beef', label: '🥩 Beef', color: '#dc2626' },
//       { key: 'fish', label: '🐟 Fish', color: '#10b981' },
//       { key: 'pasta', label: '🍝 Pasta', color: '#8b5cf6' },
//       { key: 'rice', label: '🍚 Rice', color: '#60a5fa' },
//       { key: 'roti', label: '🫓 Roti', color: '#7c3aed' },
//       { key: 'vegetables', label: '🥗 Vegetables', color: '#22c55e' },
//       { key: 'pizza', label: '🍕 Pizza', color: '#f97316' },
//       { key: 'burger', label: '🍔 Burger', color: PALETTE.diet },
//       { key: 'salad', label: '🥗 Salad', color: '#16a34a' },
//       { key: 'soup', label: '🍲 Soup', color: '#0ea5e9' }
//     ]
//   };

//   return (
//     <div className="App">
//       <header className="app-header">
//         <div className="header-content">
//           <div className="header-title">
//             <Leaf className="header-icon" />
//             <h1>Daily Choice Simulator</h1>
//             <p>Track your carbon footprint and make eco-friendly choices</p>
//           </div>
//           <div className="carbon-summary">
//             <div className="carbon-display">
//               <div className="carbon-value">{totalCarbonFootprint.toFixed(1)}</div>
//               <div className="carbon-unit">kg CO₂e</div>
//             </div>
//             <div className="carbon-rating">
//               <span className="rating-emoji">{rating.emoji}</span>
//               <span className="rating-text">{rating.level.toUpperCase()}</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="app-main">
//         {/* 🔹 Latest Climate News */}
//         <ClimateNews />

//         <div className="cards-grid" style={{ '--card-h': '560px' }}>
//           {/* Transport */}
//           <div className="card transport-card compact-card">
//             <div className="card-header">
//               <div className="card-title">
//                 <Car className="card-icon" style={{ color: PALETTE.transport }} />
//                 <h3>Transport</h3>
//               </div>
//               <div className="card-right">
//                 <div className="kpi-row">
//                   <KPIChip label="Transport CO₂e" value={`${transportCO2.toFixed(2)} kg`} />
//                   <KPIChip label="Share" value={`${percentOfTotal(transportCO2)}%`} />
//                 </div>
//                 <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
//               </div>
//             </div>

//             <div className="card-content">
//               <label className="meal-label">🚗 Transportation Method</label>
//               <div className="transport-options">
//                 {transportMethods.map(opt => (
//                   <button
//                     key={opt.key}
//                     className={`transport-option ${userChoices.transport.method === opt.key ? 'active' : ''}`}
//                     style={{ '--option-color': opt.color }}
//                     onClick={() => setUserChoices(prev => ({ ...prev, transport: { ...prev.transport, method: opt.key } }))}
//                   >
//                     {opt.label}
//                   </button>
//                 ))}
//               </div>

//               {userChoices.transport.method === 'car' && (
//                 <>
//                   <label className="meal-label" style={{ marginTop: 12 }}>⛽ Fuel Type</label>
//                   <div className="transport-options">
//                     {fuelTypes.map(ft => (
//                       <button
//                         key={ft.key}
//                         className={`transport-option ${userChoices.transport.fuelType === ft.key ? 'active' : ''}`}
//                         style={{ '--option-color': ft.color }}
//                         onClick={() => setUserChoices(prev => ({ ...prev, transport: { ...prev.transport, fuelType: ft.key } }))}
//                       >
//                         {ft.label}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}

//               <div className="form-group" style={{ marginTop: 12 }}>
//                 <label>📏 Distance (km)</label>
//                 <input
//                   type="number"
//                   value={userChoices.transport.distance}
//                   onChange={(e) =>
//                     setUserChoices(prev => ({
//                       ...prev,
//                       transport: { ...prev.transport, distance: Math.max(0, parseFloat(e.target.value) || 0) }
//                     }))
//                   }
//                   min="0"
//                   step="0.1"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Diet */}
//           <div className="card diet-card compact-card">
//             <div className="card-header">
//               <div className="card-title">
//                 <Utensils className="card-icon" style={{ color: PALETTE.diet }} />
//                 <h3>Diet</h3>
//               </div>
//               <div className="card-right">
//                 <div className="kpi-row">
//                   <KPIChip label="Diet CO₂e" value={`${dietCO2.toFixed(2)} kg`} />
//                   <KPIChip label="Share" value={`${percentOfTotal(dietCO2)}%`} />
//                 </div>
//                 <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
//               </div>
//             </div>

//             <div className="card-content">
//               <div className="tabs-row">
//                 {['breakfast', 'lunch', 'dinner'].map(meal => (
//                   <button
//                     key={meal}
//                     type="button"
//                     className={`tab ${activeMealTab === meal ? 'active' : ''}`}
//                     onClick={() => setActiveMealTab(meal)}
//                   >
//                     {meal === 'breakfast' && '🌅 Breakfast'}
//                     {meal === 'lunch' && '☀️ Lunch'}
//                     {meal === 'dinner' && '🌙 Dinner'}
//                   </button>
//                 ))}
//               </div>

//               {activeMealTab === 'breakfast' && (
//                 <div className="meal-options">
//                   {mealOptions.breakfast.map(opt => (
//                     <button
//                       key={opt.key}
//                       className={`meal-option ${userChoices.diet.breakfast === opt.key ? 'active' : ''}`}
//                       style={{ '--option-color': opt.color }}
//                       onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, breakfast: opt.key } }))}
//                     >
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {activeMealTab === 'lunch' && (
//                 <div className="meal-options">
//                   {mealOptions.lunch.map(opt => (
//                     <button
//                       key={opt.key}
//                       className={`meal-option ${userChoices.diet.lunch === opt.key ? 'active' : ''}`}
//                       style={{ '--option-color': opt.color }}
//                       onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, lunch: opt.key } }))}
//                     >
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {activeMealTab === 'dinner' && (
//                 <div className="meal-options">
//                   {mealOptions.dinner.map(opt => (
//                     <button
//                       key={opt.key}
//                       className={`meal-option ${userChoices.diet.dinner === opt.key ? 'active' : ''}`}
//                       style={{ '--option-color': opt.color }}
//                       onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, dinner: opt.key } }))}
//                     >
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Energy */}
//           <div className="card energy-card compact-card">
//             <div className="card-header">
//               <div className="card-title">
//                 <Zap className="card-icon" style={{ color: PALETTE.energy }} />
//                 <h3>Energy</h3>
//               </div>
//               <div className="card-right">
//                 <div className="kpi-row">
//                   <KPIChip label="Energy CO₂e" value={`${energyCO2.toFixed(2)} kg`} />
//                   <KPIChip label="Share" value={`${percentOfTotal(energyCO2)}%`} />
//                 </div>
//                 <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
//               </div>
//             </div>

//             <div className="card-content">
//               <div className="form-group">
//                 <label>⚡ Electricity Usage (kWh)</label>
//                 <input
//                   type="number"
//                   value={userChoices.energy.electricity}
//                   onChange={(e) =>
//                     setUserChoices(prev => ({
//                       ...prev,
//                       energy: { ...prev.energy, electricity: Math.max(0, parseFloat(e.target.value) || 0) }
//                     }))
//                   }
//                   min="0"
//                   step="0.1"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>🔥 Heating Type</label>
//                 <select
//                   value={userChoices.energy.heating}
//                   onChange={(e) =>
//                     setUserChoices(prev => ({ ...prev, energy: { ...prev.energy, heating: e.target.value } }))
//                   }
//                 >
//                   <option value="gas">🔥 Natural Gas</option>
//                   <option value="electric">⚡ Electric</option>
//                   <option value="oil">🛢️ Oil</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>🏠 Appliances Used</label>
//                 <div className="appliance-grid two-col">
//                   {[
//                     { value: 'tv', label: '📺 TV', consumption: '0.1 kWh/h' },
//                     { value: 'computer', label: '💻 Computer', consumption: '0.15 kWh/h' },
//                     { value: 'phone', label: '📱 Phone', consumption: '0.01 kWh/h' },
//                     { value: 'fan', label: '🌀 Fan', consumption: '0.05 kWh/h' },
//                     { value: 'ac', label: '❄️ AC', consumption: '1.0 kWh/h' },
//                     { value: 'refrigerator', label: '🧊 Refrigerator', consumption: '0.2 kWh/h' },
//                     { value: 'washing', label: '🧺 Washing Machine', consumption: '0.5 kWh/h' }
//                   ].map(a => {
//                     const active = userChoices.energy.appliances.includes(a.value);
//                     return (
//                       <button
//                         key={a.value}
//                         className={`appliance-option ${active ? 'active' : ''}`}
//                         onClick={() => {
//                           const newAppliances = active
//                             ? userChoices.energy.appliances.filter(x => x !== a.value)
//                             : [...userChoices.energy.appliances, a.value];
//                           setUserChoices(prev => ({ ...prev, energy: { ...prev.energy, appliances: newAppliances } }));
//                         }}
//                       >
//                         <span>{a.label}</span>
//                         <small>{a.consumption}</small>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="charts-section" id="charts" ref={chartsRef}>
//           <div className="card charts-card">
//             <div className="card-header">
//               <div className="card-title">
//                 <BarChart3 className="card-icon" style={{ color: '#8b5cf6' }} />
//                 <h3>Carbon Footprint Analysis</h3>
//               </div>
//               <div className="header-buttons">
//                 <button
//                   className="btn-toggle-charts"
//                   onClick={() => setShowCharts(!showCharts)}
//                   aria-pressed={showCharts}
//                 >
//                   {showCharts ? 'Hide Charts' : 'Show Charts'}
//                 </button>
//                 <button className="btn btn-emoji" onClick={() => setShowEmojiPopup(true)} title="See Earth's mood">
//                   🌍
//                 </button>
//               </div>
//             </div>

//             {showCharts && (
//               <BeautifulCharts
//                 transportCO2={transportCO2}
//                 dietCO2={dietCO2}
//                 energyCO2={energyCO2}
//                 total={totalCarbonFootprint}
//                 palette={PALETTE}
//               />
//             )}
//           </div>
//         </div>

//         {/* 👇 NEW: 30-day History card */}
//         <FootprintHistory history={historyData} />

//         {/* Suggestions */}
//         <div className="suggestions-section">
//           <div className="card suggestions-card">
//             <div className="card-header">
//               <div className="card-title">
//                 <Lightbulb className="card-icon" style={{ color: '#f59e0b' }} />
//                 <h3>AI-Powered Suggestions</h3>
//               </div>
//             </div>
//             <div className="card-content">
//               <div className="suggestions-grid">
//                 {[
//                   { icon: '🚌', title: 'Switch to Public Transport', description: 'Take the bus instead of driving to reduce emissions by ~50%', impact: 'Save 2.5 kg CO₂e daily' },
//                   { icon: '🥗', title: 'Choose Plant-Based Meals', description: 'Replace meat with vegetables and legumes', impact: 'Save 3.2 kg CO₂e daily' },
//                   { icon: '💡', title: 'Optimize Energy Usage', description: 'Turn off lights and use energy-efficient appliances', impact: 'Save 1.8 kg CO₂e daily' }
//                 ].map((s, i) => (
//                   <div key={i} className="suggestion-item">
//                     <div className="suggestion-icon">{s.icon}</div>
//                     <h4>{s.title}</h4>
//                     <p>{s.description}</p>
//                     <div className="suggestion-impact">{s.impact}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <EarthEmojiPopup
//         isOpen={showEmojiPopup}
//         onClose={() => setShowEmojiPopup(false)}
//         totalCarbonFootprint={totalCarbonFootprint}
//       />
//     </div>
//   );
// }

// export default App;









import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Leaf, Car, Utensils, Zap, Lightbulb, BarChart3 } from 'lucide-react';
import './App.css';
import BeautifulCharts from './components/BeautifulCharts';
import EarthEmojiPopup from './components/EarthEmojiPopup';
import ClimateNews from './components/ClimateNews';
import FootprintHistory from './components/FootprintHistory';

/* =========================
   Local history (daily save)
   ========================= */
const STORAGE_KEY = 'footprintHistoryV1';

function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function loadHistoryObject() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveDailyFootprint(value) {
  const obj = loadHistoryObject();
  obj[dateKey()] = Number(value) || 0; // overwrite today
  const keepN = 120; // keep ~4 months
  const dates = Object.keys(obj).sort();
  if (dates.length > keepN) {
    dates.slice(0, dates.length - keepN).forEach(k => delete obj[k]);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}
function getHistoryArray(days = 30) {
  const obj = loadHistoryObject();
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const k = dateKey(d);
    out.push({ date: k, value: obj[k] ?? null });
  }
  return out;
}

/* ========================= */
const PALETTE = {
  transport: '#ef4444',
  diet: '#f59e0b',
  energy: '#3b82f6',
  dark: '#111827',
};

function KPIChip({ label, value }) {
  return (
    <div className="kpi-chip">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
    </div>
  );
}

function App() {
  const [userChoices, setUserChoices] = useState({
    transport: { method: 'car', distance: 20, fuelType: 'petrol' },
    diet: { breakfast: 'cereal', lunch: 'rice', dinner: 'chicken' },
    energy: { electricity: 10, heating: 'gas', appliances: ['tv', 'computer', 'phone'] }
  });

  const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0);
  const [showCharts, setShowCharts] = useState(true);
  const [showEmojiPopup, setShowEmojiPopup] = useState(false);
  const [activeMealTab, setActiveMealTab] = useState('breakfast');

  // in-memory history for the History card
  const [historyData, setHistoryData] = useState(() => getHistoryArray(30));

  const chartsRef = useRef(null);

  // Conversion factors
  const carbonFactors = useMemo(() => ({
    transport: {
      car: { petrol: 0.192, diesel: 0.171, electric: 0.053 },
      bus: 0.089,
      train: 0.041,
      bike: 0,
      walk: 0
    },
    diet: {
      beef: 27.0, chicken: 6.9, fish: 3.0, eggs: 4.2,
      rice: 4.0, pasta: 2.0, bread: 1.4, vegetables: 2.0,
      fruits: 1.1, cereal: 1.8, dal: 2.1, roti: 1.2,
      pork: 12.1, tofu: 2.0, cheese: 13.5, milk: 3.2, yogurt: 3.2,
      oats: 1.5, pizza: 8.0, burger: 15.0, salad: 1.5, soup: 2.5
    },
    energy: { electricity: 0.233, gas: 0.202, oil: 0.267 }
  }), []);

  // Per-category CO₂e (kg)
  const transportCO2 = useMemo(() => {
    const { method, distance, fuelType } = userChoices.transport;
    if (method === 'car') return distance * (carbonFactors.transport.car[fuelType] ?? 0.192);
    return distance * (carbonFactors.transport[method] ?? 0);
  }, [userChoices.transport, carbonFactors]);

  const dietCO2 = useMemo(() => {
    const { breakfast, lunch, dinner } = userChoices.diet;
    return (
      (carbonFactors.diet[breakfast] || 0) +
      (carbonFactors.diet[lunch] || 0) +
      (carbonFactors.diet[dinner] || 0)
    );
  }, [userChoices.diet, carbonFactors]);

  const energyCO2 = useMemo(() => {
    const elec = (userChoices.energy.electricity || 0) * carbonFactors.energy.electricity;
    const heat = 20 * (carbonFactors.energy[userChoices.energy.heating] || 0);
    const applianceConsumption = { tv: 0.1, computer: 0.15, phone: 0.01, fan: 0.05, ac: 1.0, refrigerator: 0.2, washing: 0.5 };
    const apps = (userChoices.energy.appliances || []).reduce((sum, a) => {
      const kwh = applianceConsumption[a] || 0;
      return sum + kwh * 8 * carbonFactors.energy.electricity;
    }, 0);
    return elec + heat + apps;
  }, [userChoices.energy, carbonFactors]);

  useEffect(() => {
    const total = transportCO2 + dietCO2 + energyCO2;
    setTotalCarbonFootprint(Math.round(total * 100) / 100);
  }, [transportCO2, dietCO2, energyCO2]);

  // whenever total changes, save today's value and refresh 30-day history
  useEffect(() => {
    if (!Number.isFinite(totalCarbonFootprint)) return;
    saveDailyFootprint(totalCarbonFootprint);
    setHistoryData(getHistoryArray(30));
  }, [totalCarbonFootprint]);

  const getCarbonRating = (footprint) => {
    if (footprint < 15) return { level: 'low', emoji: '🌱' };
    if (footprint < 30) return { level: 'medium', emoji: '⚠️' };
    return { level: 'high', emoji: '🔥' };
  };
  const rating = getCarbonRating(totalCarbonFootprint);
  const percentOfTotal = (v) => (!totalCarbonFootprint ? 0 : Math.round((v / totalCarbonFootprint) * 100));

  const revealCharts = () => {
    setShowCharts(true);
    setTimeout(() => chartsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const transportMethods = [
    { key: 'car', label: '🚗 Car', color: PALETTE.transport },
    { key: 'bus', label: '🚌 Bus', color: '#8b5cf6' },
    { key: 'train', label: '🚂 Train', color: '#10b981' },
    { key: 'bike', label: '🚴 Bike', color: '#3b82f6' },
    { key: 'walk', label: '🚶 Walk', color: '#f59e0b' }
  ];
  const fuelTypes = [
    { key: 'petrol', label: '⛽ Petrol', color: PALETTE.transport },
    { key: 'diesel', label: '🛢️ Diesel', color: '#7c3aed' },
    { key: 'electric', label: '⚡ Electric', color: '#10b981' }
  ];

  const mealOptions = {
    breakfast: [
      { key: 'cereal', label: '🥣 Cereal', color: '#8b5cf6' },
      { key: 'eggs', label: '🥚 Eggs', color: '#f97316' },
      { key: 'bread', label: '🍞 Bread', color: '#3b82f6' },
      { key: 'oats', label: '🌾 Oats', color: '#10b981' },
      { key: 'fruits', label: '🍎 Fruits', color: '#f59e0b' },
      { key: 'milk', label: '🥛 Milk', color: '#60a5fa' },
      { key: 'yogurt', label: '🥛 Yogurt', color: '#60a5fa' }
    ],
    lunch: [
      { key: 'rice', label: '🍚 Rice', color: '#60a5fa' },
      { key: 'pasta', label: '🍝 Pasta', color: '#8b5cf6' },
      { key: 'chicken', label: '🍗 Chicken', color: PALETTE.transport },
      { key: 'fish', label: '🐟 Fish', color: '#10b981' },
      { key: 'vegetables', label: '🥗 Veggies', color: '#22c55e' },
      { key: 'dal', label: '🫘 Dal', color: PALETTE.diet },
      { key: 'roti', label: '🫓 Roti', color: '#7c3aed' },
      { key: 'tofu', label: '🍱 Tofu', color: '#06b6d4' }
    ],
    dinner: [
      { key: 'chicken', label: '🍗 Chicken', color: PALETTE.transport },
      { key: 'beef', label: '🥩 Beef', color: '#dc2626' },
      { key: 'fish', label: '🐟 Fish', color: '#10b981' },
      { key: 'pasta', label: '🍝 Pasta', color: '#8b5cf6' },
      { key: 'rice', label: '🍚 Rice', color: '#60a5fa' },
      { key: 'roti', label: '🫓 Roti', color: '#7c3aed' },
      { key: 'vegetables', label: '🥗 Vegetables', color: '#22c55e' },
      { key: 'pizza', label: '🍕 Pizza', color: '#f97316' },
      { key: 'burger', label: '🍔 Burger', color: PALETTE.diet },
      { key: 'salad', label: '🥗 Salad', color: '#16a34a' },
      { key: 'soup', label: '🍲 Soup', color: '#0ea5e9' }
    ]
  };

  return (
    <div className="App">
      {/* ✨ New hero header */}
      <header className="hero">
        <div className="hero-inner">
          {/* Brand / Title */}
          <div className="hero-brand">
            <div className="hero-logo">
              <Leaf size={24} />
            </div>

            <h1 className="hero-title">
              <span className="brand-1">Choice</span>
              <span className="brand-2">2Change</span>
            </h1>

            <p className="hero-sub">your own daily choice simulator</p>
          </div>

          {/* Metric card */}
          <div
            className="hero-metric"
            style={{
              '--chip-color':
                (rating.level === 'low' && '#10b981') ||
                (rating.level === 'medium' && '#f59e0b') ||
                '#ef4444',
            }}
          >
            <div className="hero-number">{totalCarbonFootprint.toFixed(1)}</div>
            <div className="hero-unit">kg CO₂e</div>

            <div className={`hero-chip ${rating.level}`}>
              {rating.level.toUpperCase()}
            </div>
          </div>
        </div>

        {/* soft background glow */}
        <div className="hero-glow" />
      </header>

      <main className="app-main">
        {/* 🔹 Latest Climate News */}
        <ClimateNews />

        <div className="cards-grid" style={{ '--card-h': '560px' }}>
          {/* Transport */}
          <div className="card transport-card compact-card">
            <div className="card-header">
              <div className="card-title">
                <Car className="card-icon" style={{ color: PALETTE.transport }} />
                <h3>Transport</h3>
              </div>
              <div className="card-right">
                <div className="kpi-row">
                  <KPIChip label="Transport CO₂e" value={`${transportCO2.toFixed(2)} kg`} />
                  <KPIChip label="Share" value={`${percentOfTotal(transportCO2)}%`} />
                </div>
                <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
              </div>
            </div>

            <div className="card-content">
              <label className="meal-label">🚗 Transportation Method</label>
              <div className="transport-options">
                {transportMethods.map(opt => (
                  <button
                    key={opt.key}
                    className={`transport-option ${userChoices.transport.method === opt.key ? 'active' : ''}`}
                    style={{ '--option-color': opt.color }}
                    onClick={() => setUserChoices(prev => ({ ...prev, transport: { ...prev.transport, method: opt.key } }))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {userChoices.transport.method === 'car' && (
                <>
                  <label className="meal-label" style={{ marginTop: 12 }}>⛽ Fuel Type</label>
                  <div className="transport-options">
                    {fuelTypes.map(ft => (
                      <button
                        key={ft.key}
                        className={`transport-option ${userChoices.transport.fuelType === ft.key ? 'active' : ''}`}
                        style={{ '--option-color': ft.color }}
                        onClick={() => setUserChoices(prev => ({ ...prev, transport: { ...prev.transport, fuelType: ft.key } }))}
                      >
                        {ft.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginTop: 12 }}>
                <label>📏 Distance (km)</label>
                <input
                  type="number"
                  value={userChoices.transport.distance}
                  onChange={(e) =>
                    setUserChoices(prev => ({
                      ...prev,
                      transport: { ...prev.transport, distance: Math.max(0, parseFloat(e.target.value) || 0) }
                    }))
                  }
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Diet */}
          <div className="card diet-card compact-card">
            <div className="card-header">
              <div className="card-title">
                <Utensils className="card-icon" style={{ color: PALETTE.diet }} />
                <h3>Diet</h3>
              </div>
              <div className="card-right">
                <div className="kpi-row">
                  <KPIChip label="Diet CO₂e" value={`${dietCO2.toFixed(2)} kg`} />
                  <KPIChip label="Share" value={`${percentOfTotal(dietCO2)}%`} />
                </div>
                <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
              </div>
            </div>

            <div className="card-content">
              <div className="tabs-row">
                {['breakfast', 'lunch', 'dinner'].map(meal => (
                  <button
                    key={meal}
                    type="button"
                    className={`tab ${activeMealTab === meal ? 'active' : ''}`}
                    onClick={() => setActiveMealTab(meal)}
                  >
                    {meal === 'breakfast' && '🌅 Breakfast'}
                    {meal === 'lunch' && '☀️ Lunch'}
                    {meal === 'dinner' && '🌙 Dinner'}
                  </button>
                ))}
              </div>

              {activeMealTab === 'breakfast' && (
                <div className="meal-options">
                  {mealOptions.breakfast.map(opt => (
                    <button
                      key={opt.key}
                      className={`meal-option ${userChoices.diet.breakfast === opt.key ? 'active' : ''}`}
                      style={{ '--option-color': opt.color }}
                      onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, breakfast: opt.key } }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {activeMealTab === 'lunch' && (
                <div className="meal-options">
                  {mealOptions.lunch.map(opt => (
                    <button
                      key={opt.key}
                      className={`meal-option ${userChoices.diet.lunch === opt.key ? 'active' : ''}`}
                      style={{ '--option-color': opt.color }}
                      onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, lunch: opt.key } }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {activeMealTab === 'dinner' && (
                <div className="meal-options">
                  {mealOptions.dinner.map(opt => (
                    <button
                      key={opt.key}
                      className={`meal-option ${userChoices.diet.dinner === opt.key ? 'active' : ''}`}
                      style={{ '--option-color': opt.color }}
                      onClick={() => setUserChoices(prev => ({ ...prev, diet: { ...prev.diet, dinner: opt.key } }))}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Energy */}
          <div className="card energy-card compact-card">
            <div className="card-header">
              <div className="card-title">
                <Zap className="card-icon" style={{ color: PALETTE.energy }} />
                <h3>Energy</h3>
              </div>
              <div className="card-right">
                <div className="kpi-row">
                  <KPIChip label="Energy CO₂e" value={`${energyCO2.toFixed(2)} kg`} />
                  <KPIChip label="Share" value={`${percentOfTotal(energyCO2)}%`} />
                </div>
                <button className="btn-toggle-charts" onClick={revealCharts}>See impact in charts</button>
              </div>
            </div>

            <div className="card-content">
              <div className="form-group">
                <label>⚡ Electricity Usage (kWh)</label>
                <input
                  type="number"
                  value={userChoices.energy.electricity}
                  onChange={(e) =>
                    setUserChoices(prev => ({
                      ...prev,
                      energy: { ...prev.energy, electricity: Math.max(0, parseFloat(e.target.value) || 0) }
                    }))
                  }
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label>🔥 Heating Type</label>
                <select
                  value={userChoices.energy.heating}
                  onChange={(e) =>
                    setUserChoices(prev => ({ ...prev, energy: { ...prev.energy, heating: e.target.value } }))
                  }
                >
                  <option value="gas">🔥 Natural Gas</option>
                  <option value="electric">⚡ Electric</option>
                  <option value="oil">🛢️ Oil</option>
                </select>
              </div>

              <div className="form-group">
                <label>🏠 Appliances Used</label>
                <div className="appliance-grid two-col">
                  {[
                    { value: 'tv', label: '📺 TV', consumption: '0.1 kWh/h' },
                    { value: 'computer', label: '💻 Computer', consumption: '0.15 kWh/h' },
                    { value: 'phone', label: '📱 Phone', consumption: '0.01 kWh/h' },
                    { value: 'fan', label: '🌀 Fan', consumption: '0.05 kWh/h' },
                    { value: 'ac', label: '❄️ AC', consumption: '1.0 kWh/h' },
                    { value: 'refrigerator', label: '🧊 Refrigerator', consumption: '0.2 kWh/h' },
                    { value: 'washing', label: '🧺 Washing Machine', consumption: '0.5 kWh/h' }
                  ].map(a => {
                    const active = userChoices.energy.appliances.includes(a.value);
                    return (
                      <button
                        key={a.value}
                        className={`appliance-option ${active ? 'active' : ''}`}
                        onClick={() => {
                          const newAppliances = active
                            ? userChoices.energy.appliances.filter(x => x !== a.value)
                            : [...userChoices.energy.appliances, a.value];
                          setUserChoices(prev => ({ ...prev, energy: { ...prev.energy, appliances: newAppliances } }));
                        }}
                      >
                        <span>{a.label}</span>
                        <small>{a.consumption}</small>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section" id="charts" ref={chartsRef}>
          <div className="card charts-card">
            <div className="card-header">
              <div className="card-title">
                <BarChart3 className="card-icon" style={{ color: '#8b5cf6' }} />
                <h3>Carbon Footprint Analysis</h3>
              </div>
              <div className="header-buttons">
                <button
                  className="btn-toggle-charts"
                  onClick={() => setShowCharts(!showCharts)}
                  aria-pressed={showCharts}
                >
                  {showCharts ? 'Hide Charts' : 'Show Charts'}
                </button>
                <button className="btn btn-emoji" onClick={() => setShowEmojiPopup(true)} title="See Earth's mood">
                  🌍
                </button>
              </div>
            </div>

            {showCharts && (
              <BeautifulCharts
                transportCO2={transportCO2}
                dietCO2={dietCO2}
                energyCO2={energyCO2}
                total={totalCarbonFootprint}
                palette={PALETTE}
              />
            )}
          </div>
        </div>

        {/* 30-day History card */}
        <FootprintHistory history={historyData} />

        {/* Suggestions */}
        <div className="suggestions-section">
          <div className="card suggestions-card">
            <div className="card-header">
              <div className="card-title">
                <Lightbulb className="card-icon" style={{ color: '#f59e0b' }} />
                <h3>AI-Powered Suggestions</h3>
              </div>
            </div>
            <div className="card-content">
              <div className="suggestions-grid">
                {[
                  { icon: '🚌', title: 'Switch to Public Transport', description: 'Take the bus instead of driving to reduce emissions by ~50%', impact: 'Save 2.5 kg CO₂e daily' },
                  { icon: '🥗', title: 'Choose Plant-Based Meals', description: 'Replace meat with vegetables and legumes', impact: 'Save 3.2 kg CO₂e daily' },
                  { icon: '💡', title: 'Optimize Energy Usage', description: 'Turn off lights and use energy-efficient appliances', impact: 'Save 1.8 kg CO₂e daily' }
                ].map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="suggestion-icon">{s.icon}</div>
                    <h4>{s.title}</h4>
                    <p>{s.description}</p>
                    <div className="suggestion-impact">{s.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <EarthEmojiPopup
        isOpen={showEmojiPopup}
        onClose={() => setShowEmojiPopup(false)}
        totalCarbonFootprint={totalCarbonFootprint}
      />
    </div>
  );
}

export default App;
