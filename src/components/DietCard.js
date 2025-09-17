import React from 'react';
import { Utensils, Beef, Fish, Apple, Wheat } from 'lucide-react';

const DietCard = ({ choices, onUpdate }) => {
  const allFoodOptions = [
    { value: 'cereal', label: 'Cereal', icon: Wheat, color: '#f59e0b' },
    { value: 'eggs', label: 'Eggs', icon: Beef, color: '#ef4444' },
    { value: 'fruits', label: 'Fruits', icon: Apple, color: '#10b981' },
    { value: 'bread', label: 'Bread', icon: Wheat, color: '#f59e0b' },
    { value: 'oats', label: 'Oats', icon: Wheat, color: '#10b981' },
    { value: 'yogurt', label: 'Yogurt', icon: Beef, color: '#3b82f6' },
    { value: 'chicken', label: 'Chicken', icon: Beef, color: '#ef4444' },
    { value: 'fish', label: 'Fish', icon: Fish, color: '#3b82f6' },
    { value: 'dal', label: 'Dal (Lentils)', icon: Wheat, color: '#10b981' },
    { value: 'vegetables', label: 'Vegetables', icon: Apple, color: '#10b981' },
    { value: 'beef', label: 'Beef', icon: Beef, color: '#ef4444' },
    { value: 'pasta', label: 'Pasta', icon: Wheat, color: '#f59e0b' },
    { value: 'rice', label: 'Rice', icon: Wheat, color: '#f59e0b' },
    { value: 'roti', label: 'Roti', icon: Wheat, color: '#10b981' },
    { value: 'lamb', label: 'Lamb', icon: Beef, color: '#ef4444' },
    { value: 'pork', label: 'Pork', icon: Beef, color: '#ef4444' },
    { value: 'tofu', label: 'Tofu', icon: Apple, color: '#10b981' },
    { value: 'nuts', label: 'Nuts', icon: Apple, color: '#10b981' },
    { value: 'cheese', label: 'Cheese', icon: Beef, color: '#3b82f6' },
    { value: 'milk', label: 'Milk', icon: Beef, color: '#3b82f6' },
    { value: 'pizza', label: 'Pizza', icon: Wheat, color: '#f59e0b' },
    { value: 'burger', label: 'Burger', icon: Beef, color: '#ef4444' },
    { value: 'salad', label: 'Salad', icon: Apple, color: '#10b981' },
    { value: 'soup', label: 'Soup', icon: Apple, color: '#10b981' }
  ];

  const carbonFactors = {
    beef: 27.0,
    lamb: 39.2,
    chicken: 6.9,
    fish: 3.0,
    eggs: 4.2,
    dairy: 3.2,
    rice: 4.0,
    pasta: 2.0,
    bread: 1.4,
    vegetables: 2.0,
    fruits: 1.1,
    nuts: 2.3,
    cereal: 1.8,
    dal: 2.1,
    roti: 1.2,
    pork: 12.1,
    tofu: 2.0,
    cheese: 13.5,
    milk: 3.2,
    yogurt: 3.2,
    oats: 1.5,
    pizza: 8.0,
    burger: 15.0,
    salad: 1.5,
    soup: 2.5
  };

  const calculateDietCarbon = () => {
    let total = 0;
    Object.values(choices.meals).forEach(meal => {
      if (carbonFactors[meal]) {
        total += carbonFactors[meal];
      }
    });
    return total.toFixed(2);
  };

  const updateMeal = (mealType, food) => {
    onUpdate({
      meals: {
        ...choices.meals,
        [mealType]: food
      }
    });
  };

  const getMealIcon = (meal) => {
    const option = allFoodOptions.find(opt => opt.value === meal);
    return option ? option.icon : Utensils;
  };

  const getMealColor = (meal) => {
    const option = allFoodOptions.find(opt => opt.value === meal);
    return option ? option.color : '#6b7280';
  };

  return (
    <div className="card diet-card">
      <div className="card-header">
        <div className="card-title">
          <Utensils className="card-icon" style={{ color: '#f59e0b' }} />
          <h3>Diet</h3>
        </div>
        <div className="carbon-display">
          <span className="carbon-value">{calculateDietCarbon()} kg CO₂e</span>
        </div>
      </div>

      <div className="card-content">
        {Object.keys(choices.meals).map(mealType => {
          const currentMeal = choices.meals[mealType];
          const Icon = getMealIcon(currentMeal);
          const iconColor = getMealColor(currentMeal);
          
          return (
            <div key={mealType} className="form-group">
              <label className="meal-label">
                <Icon size={16} style={{ color: iconColor }} />
                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </label>
              <select
                className="select meal-select"
                value={currentMeal}
                onChange={(e) => updateMeal(mealType, e.target.value)}
              >
                {allFoodOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({carbonFactors[option.value] || 0} kg CO₂e)
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <div className="diet-impact">
          <div className="impact-summary">
            <h4>Daily Diet Impact</h4>
            <div className="impact-breakdown">
              {Object.entries(choices.meals).map(([mealType, meal]) => (
                <div key={mealType} className="impact-item">
                  <span className="meal-name">{mealType}:</span>
                  <span className="meal-carbon">
                    {carbonFactors[meal] ? `${carbonFactors[meal]} kg` : '0 kg'} CO₂e
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietCard;
