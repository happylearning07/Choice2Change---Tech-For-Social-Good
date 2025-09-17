import React from 'react';
import { Zap, Home, Tv, Monitor, Smartphone, Thermometer } from 'lucide-react';

const EnergyCard = ({ choices, onUpdate }) => {
  const heatingOptions = [
    { value: 'gas', label: 'Natural Gas', icon: Thermometer, color: '#ef4444' },
    { value: 'electric', label: 'Electric', icon: Zap, color: '#3b82f6' },
    { value: 'oil', label: 'Oil', icon: Thermometer, color: '#6b7280' }
  ];

  const applianceOptions = [
    { value: 'tv', label: 'TV', icon: Tv, consumption: 0.1 },
    { value: 'computer', label: 'Computer', icon: Monitor, consumption: 0.15 },
    { value: 'phone', label: 'Phone', icon: Smartphone, consumption: 0.01 },
    { value: 'refrigerator', label: 'Refrigerator', icon: Home, consumption: 0.2 },
    { value: 'washing', label: 'Washing Machine', icon: Home, consumption: 0.5 }
  ];

  const carbonFactors = {
    electricity: 0.233, // kg CO2e per kWh
    gas: 0.202,
    oil: 0.267
  };

  const calculateEnergyCarbon = () => {
    let total = 0;
    
    // Electricity usage
    total += choices.electricity * carbonFactors.electricity;
    
    // Heating (assuming 20 kWh per day)
    total += 20 * carbonFactors[choices.heating];
    
    // Appliances (assuming 8 hours usage per day)
    choices.appliances.forEach(appliance => {
      const applianceData = applianceOptions.find(opt => opt.value === appliance);
      if (applianceData) {
        total += applianceData.consumption * 8 * carbonFactors.electricity;
      }
    });
    
    return total.toFixed(2);
  };

  const toggleAppliance = (appliance) => {
    const newAppliances = choices.appliances.includes(appliance)
      ? choices.appliances.filter(a => a !== appliance)
      : [...choices.appliances, appliance];
    
    onUpdate({ appliances: newAppliances });
  };

  const getHeatingIcon = (heating) => {
    const option = heatingOptions.find(opt => opt.value === heating);
    return option ? option.icon : Thermometer;
  };

  const getHeatingColor = (heating) => {
    const option = heatingOptions.find(opt => opt.value === heating);
    return option ? option.color : '#6b7280';
  };

  const HeatingIcon = getHeatingIcon(choices.heating);
  const heatingColor = getHeatingColor(choices.heating);

  return (
    <div className="card energy-card">
      <div className="card-header">
        <div className="card-title">
          <Zap className="card-icon" style={{ color: '#f59e0b' }} />
          <h3>Energy Usage</h3>
        </div>
        <div className="carbon-display">
          <span className="carbon-value">{calculateEnergyCarbon()} kg CO₂e</span>
        </div>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label>Daily Electricity Usage (kWh)</label>
          <input
            type="number"
            className="input"
            value={choices.electricity}
            onChange={(e) => onUpdate({ electricity: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.1"
            placeholder="Enter kWh usage"
          />
        </div>

        <div className="form-group">
          <label>Heating Type</label>
          <div className="heating-options">
            {heatingOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  className={`heating-option ${choices.heating === option.value ? 'active' : ''}`}
                  onClick={() => onUpdate({ heating: option.value })}
                  style={{ '--option-color': option.color }}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label>Appliances Used</label>
          <div className="appliance-grid">
            {applianceOptions.map(option => {
              const Icon = option.icon;
              const isSelected = choices.appliances.includes(option.value);
              return (
                <button
                  key={option.value}
                  className={`appliance-option ${isSelected ? 'active' : ''}`}
                  onClick={() => toggleAppliance(option.value)}
                >
                  <Icon size={16} />
                  <span>{option.label}</span>
                  <span className="consumption">
                    {option.consumption} kWh/h
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="energy-impact">
          <div className="impact-breakdown">
            <div className="impact-item">
              <Zap size={16} style={{ color: '#3b82f6' }} />
              <span>Electricity: {(choices.electricity * carbonFactors.electricity).toFixed(2)} kg CO₂e</span>
            </div>
            <div className="impact-item">
              <HeatingIcon size={16} style={{ color: heatingColor }} />
              <span>Heating: {(20 * carbonFactors[choices.heating]).toFixed(2)} kg CO₂e</span>
            </div>
            <div className="impact-item">
              <Tv size={16} style={{ color: '#6b7280' }} />
              <span>Appliances: {(
                choices.appliances.reduce((total, appliance) => {
                  const applianceData = applianceOptions.find(opt => opt.value === appliance);
                  return total + (applianceData ? applianceData.consumption * 8 * carbonFactors.electricity : 0);
                }, 0)
              ).toFixed(2)} kg CO₂e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyCard;

