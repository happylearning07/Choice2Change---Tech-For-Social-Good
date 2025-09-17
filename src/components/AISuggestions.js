import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb, RefreshCw, Brain, Settings } from 'lucide-react';

const AISuggestions = ({ choices, footprint, carbonFactors }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  // Rules-based suggestions
  const generateRulesBasedSuggestions = useCallback(() => {
    const suggestions = [];

    // Transport suggestions
    if (choices.transport.method === 'car' && choices.transport.fuelType !== 'electric') {
      const currentCarbon = choices.transport.distance * carbonFactors.transport.car[choices.transport.fuelType];
      const busCarbon = choices.transport.distance * carbonFactors.transport.bus;
      const savings = (currentCarbon - busCarbon).toFixed(2);
      
      suggestions.push({
        category: 'Transport',
        title: 'Switch to Public Transport',
        description: `Take the bus instead of driving. You'll save ${savings} kg CO₂e daily!`,
        impact: `Save ${savings} kg CO₂e`,
        icon: '🚌',
        priority: 'high'
      });
    }

    if (choices.transport.method === 'car' && choices.transport.distance > 5) {
      const currentCarbon = choices.transport.distance * carbonFactors.transport.car[choices.transport.fuelType];
      const savings = currentCarbon.toFixed(2);
      
      suggestions.push({
        category: 'Transport',
        title: 'Consider Cycling',
        description: `For shorter distances, cycling is carbon-free and great for your health!`,
        impact: `Save ${savings} kg CO₂e`,
        icon: '🚴',
        priority: 'medium'
      });
    }

    // Diet suggestions
    if (choices.diet.meals.lunch === 'chicken' || choices.diet.meals.dinner === 'chicken') {
      const chickenCarbon = carbonFactors.diet.chicken;
      const dalCarbon = carbonFactors.diet.dal;
      const savings = (chickenCarbon - dalCarbon).toFixed(2);
      
      suggestions.push({
        category: 'Diet',
        title: 'Swap Chicken for Dal',
        description: `Replace chicken with dal (lentils) for a protein-rich, low-carbon meal.`,
        impact: `Save ${savings} kg CO₂e`,
        icon: '🥗',
        priority: 'high'
      });
    }

    if (choices.diet.meals.dinner === 'beef') {
      const beefCarbon = carbonFactors.diet.beef;
      const rotiCarbon = carbonFactors.diet.roti;
      const savings = (beefCarbon - rotiCarbon).toFixed(2);
      
      suggestions.push({
        category: 'Diet',
        title: 'Choose Plant-Based Dinner',
        description: `Replace beef with roti and vegetables. Beef has the highest carbon footprint!`,
        impact: `Save ${savings} kg CO₂e`,
        icon: '🌱',
        priority: 'high'
      });
    }

    // Energy suggestions
    if (choices.energy.electricity > 30) {
      suggestions.push({
        category: 'Energy',
        title: 'Reduce Electricity Usage',
        description: `Turn off lights and unplug devices when not in use. Small changes add up!`,
        impact: `Save ~2-3 kg CO₂e`,
        icon: '💡',
        priority: 'medium'
      });
    }

    if (choices.energy.heating === 'gas' || choices.energy.heating === 'oil') {
      suggestions.push({
        category: 'Energy',
        title: 'Optimize Heating',
        description: `Lower your thermostat by 1°C and wear warmer clothes. Every degree matters!`,
        impact: `Save ~1-2 kg CO₂e`,
        icon: '🌡️',
        priority: 'medium'
      });
    }

    return suggestions.slice(0, 4); // Limit to 4 suggestions
  }, [choices, carbonFactors]);

  // AI-powered suggestions (simulated)
  const generateAISuggestions = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiSuggestions = [
      {
        category: 'Personalized',
        title: 'Smart Commute Optimization',
        description: `Based on your 10km daily commute, consider carpooling twice a week. You could reduce your transport emissions by 40% while building community connections.`,
        impact: `Save 3.2 kg CO₂e weekly`,
        icon: '🤝',
        priority: 'high'
      },
      {
        category: 'Personalized',
        title: 'Meal Planning for Impact',
        description: `Your current diet shows high protein intake. Try "Meatless Mondays" with dal and vegetables. This simple change could reduce your weekly carbon footprint by 15%.`,
        impact: `Save 2.1 kg CO₂e weekly`,
        icon: '📅',
        priority: 'high'
      },
      {
        category: 'Personalized',
        title: 'Energy Efficiency Upgrade',
        description: `Your energy usage is above average. Consider LED bulbs and smart power strips. These investments pay for themselves and reduce emissions significantly.`,
        impact: `Save 1.8 kg CO₂e daily`,
        icon: '⚡',
        priority: 'medium'
      },
      {
        category: 'Personalized',
        title: 'Seasonal Adaptation',
        description: `With winter approaching, layer up with warm clothing instead of cranking up the heat. This natural approach saves energy and money.`,
        impact: `Save 1.2 kg CO₂e daily`,
        icon: '🧥',
        priority: 'medium'
      }
    ];
    
    setSuggestions(aiSuggestions);
    setIsLoading(false);
  };

  useEffect(() => {
    if (useAI) {
      generateAISuggestions();
    } else {
      setSuggestions(generateRulesBasedSuggestions());
    }
  }, [choices, useAI, generateRulesBasedSuggestions]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💚';
      default: return '💡';
    }
  };

  return (
    <div className="card suggestions-card">
      <div className="card-header">
        <div className="card-title">
          <Lightbulb className="card-icon" style={{ color: '#f59e0b' }} />
          <h3>Personalized Recommendations</h3>
        </div>
        <div className="suggestion-controls">
          <button
            className={`btn btn-secondary ${!useAI ? 'active' : ''}`}
            onClick={() => setUseAI(false)}
          >
            <Settings size={16} />
            Rules-Based
          </button>
          <button
            className={`btn btn-secondary ${useAI ? 'active' : ''}`}
            onClick={() => setUseAI(true)}
          >
            <Brain size={16} />
            AI-Powered
          </button>
        </div>
      </div>

      <div className="suggestions-content">
        {isLoading ? (
          <div className="loading-state">
            <RefreshCw className="loading-icon" />
            <p>Generating personalized suggestions...</p>
          </div>
        ) : (
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-item"
                style={{ '--priority-color': getPriorityColor(suggestion.priority) }}
              >
                <div className="suggestion-header">
                  <div className="suggestion-icon">
                    {suggestion.icon}
                  </div>
                  <div className="suggestion-meta">
                    <span className="suggestion-category">{suggestion.category}</span>
                    <span className="suggestion-priority">
                      {getPriorityIcon(suggestion.priority)} {suggestion.priority}
                    </span>
                  </div>
                </div>
                
                <h4 className="suggestion-title">{suggestion.title}</h4>
                <p className="suggestion-description">{suggestion.description}</p>
                
                <div className="suggestion-impact">
                  <span className="impact-label">Impact:</span>
                  <span className="impact-value">{suggestion.impact}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="suggestion-footer">
          <p className="suggestion-note">
            {useAI 
              ? "AI suggestions are personalized based on your current choices and environmental data."
              : "Rules-based suggestions use proven environmental impact data and best practices."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
