import React from 'react';
import { Car, Bus, Train, Bike, Footprints } from 'lucide-react';

const TransportCard = ({ choices, onUpdate }) => {
  const transportOptions = [
    { value: 'car', label: 'Car', icon: Car, color: '#ef4444' },
    { value: 'bus', label: 'Bus', icon: Bus, color: '#3b82f6' },
    { value: 'train', label: 'Train', icon: Train, color: '#10b981' },
    { value: 'bike', label: 'Bike', icon: Bike, color: '#f59e0b' },
    { value: 'walk', label: 'Walk', icon: Footprints, color: '#8b5cf6' }
  ];

  const fuelOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' }
  ];

  const carbonFactors = {
    car: { petrol: 0.192, diesel: 0.171, electric: 0.053 },
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0
  };

  const calculateTransportCarbon = () => {
    if (choices.method === 'car') {
      return (choices.distance * carbonFactors.car[choices.fuelType]).toFixed(2);
    }
    return (choices.distance * carbonFactors[choices.method]).toFixed(2);
  };

  const getTransportIcon = (method) => {
    const option = transportOptions.find(opt => opt.value === method);
    return option ? option.icon : Car;
  };

  const getTransportColor = (method) => {
    const option = transportOptions.find(opt => opt.value === method);
    return option ? option.color : '#ef4444';
  };

  const IconComponent = getTransportIcon(choices.method);
  const iconColor = getTransportColor(choices.method);

  return (
    <div className="card transport-card">
      <div className="card-header">
        <div className="card-title">
          <Car className="card-icon" style={{ color: iconColor }} />
          <h3>Transportation</h3>
        </div>
        <div className="carbon-display">
          <span className="carbon-value">{calculateTransportCarbon()} kg CO₂e</span>
        </div>
      </div>

      <div className="card-content">
        <div className="form-group">
          <label>Transport Method</label>
          <div className="transport-options">
            {transportOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  className={`transport-option ${choices.method === option.value ? 'active' : ''}`}
                  onClick={() => onUpdate({ method: option.value })}
                  style={{ '--option-color': option.color }}
                >
                  <Icon size={20} />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {choices.method === 'car' && (
          <div className="form-group">
            <label>Fuel Type</label>
            <select
              className="select"
              value={choices.fuelType}
              onChange={(e) => onUpdate({ fuelType: e.target.value })}
            >
              {fuelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Distance (km)</label>
          <input
            type="number"
            className="input"
            value={choices.distance}
            onChange={(e) => onUpdate({ distance: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.1"
            placeholder="Enter distance"
          />
        </div>

        <div className="transport-impact">
          <div className="impact-item">
            <IconComponent size={16} style={{ color: iconColor }} />
            <span>Your choice: {transportOptions.find(opt => opt.value === choices.method)?.label}</span>
          </div>
          <div className="impact-value">
            {calculateTransportCarbon()} kg CO₂e per day
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportCard;

