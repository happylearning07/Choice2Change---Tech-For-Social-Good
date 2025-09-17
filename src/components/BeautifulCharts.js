import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';

const DefaultPalette = {
  transport: '#ef4444',
  diet: '#f59e0b',
  energy: '#3b82f6',
};

const tooltipStyle = {
  background: 'rgba(17,24,39,0.95)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 8,
  padding: '6px 8px',
  fontSize: 12
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={tooltipStyle}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i}>
            {p.name}: <strong>{p.value.toFixed ? p.value.toFixed(2) : p.value}</strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function BeautifulCharts({ transportCO2, dietCO2, energyCO2, total, palette = DefaultPalette }) {
  const barData = [
    { name: 'Transport', value: +transportCO2 },
    { name: 'Diet', value: +dietCO2 },
    { name: 'Energy', value: +energyCO2 }
  ];
  const pieData = [
    { name: 'Transport', value: +transportCO2, color: palette.transport },
    { name: 'Diet', value: +dietCO2, color: palette.diet },
    { name: 'Energy', value: +energyCO2, color: palette.energy }
  ];

  return (
    <div className="beautiful-charts">
      <div className="chart-grid">
        <div className="chart-container">
          <h4 className="chart-title">Carbon Footprint Breakdown</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="kg CO₂e">
                <Cell fill={palette.transport} />
                <Cell fill={palette.diet} />
                <Cell fill={palette.energy} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4 className="chart-title">Distribution Pie Chart</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`slice-${idx}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: 8, color: '#e5e7eb' }}>
            Total: <strong>{(total || 0).toFixed(1)} kg CO₂e</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
