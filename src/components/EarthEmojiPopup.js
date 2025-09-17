import React from 'react';
import { X, Heart, Leaf } from 'lucide-react';

const EarthEmojiPopup = ({ isOpen, onClose, totalCarbonFootprint }) => {
  const getEarthEmoji = (footprint) => {
    if (footprint < 10) return { emoji: '🌍😊', mood: 'Very Happy', color: '#10b981' };
    if (footprint < 15) return { emoji: '🌍😌', mood: 'Happy', color: '#84cc16' };
    if (footprint < 25) return { emoji: '🌍😐', mood: 'Okay', color: '#f59e0b' };
    if (footprint < 35) return { emoji: '🌍😟', mood: 'Sad', color: '#ef4444' };
    return { emoji: '🌍😢', mood: 'Very Sad', color: '#dc2626' };
  };

  const getMotivationalMessage = (footprint) => {
    if (footprint < 10) return "Amazing! You're doing great for the planet! 🌱";
    if (footprint < 15) return "Good job! You're within the UK daily target! 🎯";
    if (footprint < 25) return "Not bad! Try to reduce a bit more for Earth! 🌍";
    if (footprint < 35) return "Earth needs your help! Let's make better choices! 💚";
    return "Earth is crying! Please make more eco-friendly choices! 😢";
  };

  const getTips = (footprint) => {
    if (footprint < 15) return [
      "Keep up the great work! 🌟",
      "Consider sharing your eco-tips with friends! 👥",
      "You're a climate hero! 🦸‍♀️"
    ];
    return [
      "Try walking or cycling instead of driving! 🚶‍♀️",
      "Choose plant-based meals more often! 🥗",
      "Turn off lights when not needed! 💡",
      "Use public transport when possible! 🚌"
    ];
  };

  const earthData = getEarthEmoji(totalCarbonFootprint);
  const message = getMotivationalMessage(totalCarbonFootprint);
  const tips = getTips(totalCarbonFootprint);

  if (!isOpen) return null;

  return (
    <div className="emoji-popup-overlay" onClick={onClose}>
      <div className="emoji-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="popup-header">
          <div className="earth-emoji-large" style={{ color: earthData.color }}>
            {earthData.emoji}
          </div>
          <h3>Earth's Mood Today</h3>
          <div className="mood-indicator" style={{ color: earthData.color }}>
            {earthData.mood}
          </div>
        </div>

        <div className="popup-content">
          <div className="carbon-display">
            <div className="carbon-value">{totalCarbonFootprint.toFixed(1)} kg CO₂e</div>
            <div className="carbon-label">Your Daily Carbon Footprint</div>
          </div>

          <div className="message-box">
            <p>{message}</p>
          </div>

          <div className="tips-section">
            <h4>💡 Tips for a Happier Earth:</h4>
            <ul>
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="progress-section">
            <div className="progress-label">Progress to UK Target (15 kg/day)</div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min((totalCarbonFootprint / 15) * 100, 100)}%`,
                  backgroundColor: earthData.color
                }}
              ></div>
            </div>
            <div className="progress-text">
              {((totalCarbonFootprint / 15) * 100).toFixed(0)}% of target
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary" onClick={onClose}>
              <Heart className="btn-icon" />
              I'll Help Earth!
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              <Leaf className="btn-icon" />
              Make Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthEmojiPopup;
