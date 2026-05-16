import React from 'react';
import './TypographyTester.css';

const FONT_CATEGORIES = {
  Sans: ['Inter', 'Montserrat', 'Roboto Condensed', 'Open Sans', 'Lato'],
  Serif: ['Playfair Display', 'Lora', 'Merriweather', 'Crimson Text', 'PT Serif'],
  Mono: ['JetBrains Mono', 'Roboto Mono', 'Source Code Pro', 'Fira Code', 'Space Mono'],
  Display: ['Oswald', 'Bebas Neue', 'Abril Fatface', 'Righteous', 'Cinzel']
};

export const FontSelector = ({ currentFont, onSelect }) => {
  const [activeCat, setActiveCat] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const handleSelect = (f) => {
    const fontName = f.trim();
    if (!fontName) return;
    onSelect(`'${fontName}', sans-serif`);
    // Preload font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@100..900&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSelect(search);
    }
  };

  return (
    <div className="font-selector">
      <div className="font-search-box">
        <input
          type="text"
          placeholder="Search Google Font... (Enter to apply)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchSubmit}
          className="font-search-input"
        />
        <button onClick={() => handleSelect(search)} className="font-search-btn">Add</button>
      </div>

      <div className="category-tabs">
        {Object.keys(FONT_CATEGORIES).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(activeCat === cat ? null : cat)}
            className={`category-btn ${activeCat === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {activeCat && (
        <div className="font-grid">
          {FONT_CATEGORIES[activeCat].map(f => (
            <button
              key={f}
              onClick={() => handleSelect(f)}
              className={`font-item-btn ${currentFont.includes(f) ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
