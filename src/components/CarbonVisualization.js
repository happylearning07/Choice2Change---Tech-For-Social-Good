import React from 'react';
import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

const CarbonVisualization = ({ footprint, choices, carbonFactors }) => {
  // Calculate breakdown by category
  const transportCarbon = choices.transport.method === 'car' 
    ? choices.transport.distance * carbonFactors.transport.car[choices.transport.fuelType]
    : choices.transport.distance * carbonFactors.transport[choices.transport.method];

  const dietCarbon = Object.values(choices.diet.meals).reduce((total, meal) => {
    return total + (carbonFactors.diet[meal] || 0);
  }, 0);

  const energyCarbon = choices.electricity * carbonFactors.energy.electricity + 
    20 * carbonFactors.energy[choices.energy.heating] +
    choices.appliances.reduce((total, appliance) => {
      const applianceConsumption = {
        tv: 0.1,
        computer: 0.15,
        phone: 0.01,
        refrigerator: 0.2,
        washing: 0.5
      };
      return total + (applianceConsumption[appliance] || 0) * 8 * carbonFactors.energy.electricity;
    }, 0);

  const breakdownData = [
    { name: 'Transport', value: transportCarbon, color: '#ef4444' },
    { name: 'Diet', value: dietCarbon, color: '#f59e0b' },
    { name: 'Energy', value: energyCarbon, color: '#3b82f6' }
  ];

  const barData = [
    { category: 'Transport', current: transportCarbon, optimal: transportCarbon * 0.3 },
    { category: 'Diet', current: dietCarbon, optimal: dietCarbon * 0.5 },
    { category: 'Energy', current: energyCarbon, optimal: energyCarbon * 0.7 }
  ];

  const getCarbonRating = (footprint) => {
    if (footprint < 15) return { level: 'Excellent', color: '#10b981', emoji: '🌱' };
    if (footprint < 25) return { level: 'Good', color: '#f59e0b', emoji: '👍' };
    if (footprint < 40) return { level: 'Fair', color: '#f97316', emoji: '⚠️' };
    return { level: 'Poor', color: '#ef4444', emoji: '🔥' };
  };

  const rating = getCarbonRating(footprint);

  return (
    <div className="card visualization-card">
      <div className="card-header">
        <div className="card-title">
          <TrendingUp className="card-icon" style={{ color: '#3b82f6' }} />
          <h3>Carbon Footprint Analysis</h3>
        </div>
        <div className="rating-display">
          <div className={`carbon-rating rating-${rating.level.toLowerCase()}`}>
            <span className="rating-emoji">{rating.emoji}</span>
            <span className="rating-text">{rating.level}</span>
          </div>
        </div>
      </div>

      <div className="visualization-content">
        <div className="charts-grid">
          <div className="chart-container">
            <h4>Daily Breakdown</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} kg CO₂e`, 'Carbon Footprint']}
                  labelStyle={{ color: '#374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {breakdownData.map((item, index) => (
                <div key={index} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <h4>Optimization Potential</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} kg CO₂e`, 'Carbon Footprint']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="current" fill="#ef4444" name="Current" />
                <Bar dataKey="optimal" fill="#10b981" name="Optimal" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="insights-section">
          <div className="insight-card">
            <Target className="insight-icon" />
            <div className="insight-content">
              <h4>Daily Target</h4>
              <p>UK average: 15 kg CO₂e per person per day</p>
              <div className="target-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min((footprint / 15) * 100, 100)}%`,
                      backgroundColor: rating.color
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {((footprint / 15) * 100).toFixed(0)}% of target
                </span>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <TrendingDown className="insight-icon" />
            <div className="insight-content">
              <h4>Savings Potential</h4>
              <p>You could save up to {(footprint * 0.4).toFixed(1)} kg CO₂e daily</p>
              <div className="savings-breakdown">
                <div className="savings-item">
                  <span>Transport:</span>
                  <span>{(transportCarbon * 0.5).toFixed(1)} kg</span>
                </div>
                <div className="savings-item">
                  <span>Diet:</span>
                  <span>{(dietCarbon * 0.3).toFixed(1)} kg</span>
                </div>
                <div className="savings-item">
                  <span>Energy:</span>
                  <span>{(energyCarbon * 0.2).toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonVisualization;




























