import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const THEMES = {
  light: [
    { id: 'regal', name: 'Regal', desc: 'Royal blue & aquamarine', gradient: 'bg-gradient-to-br from-[#02027A] to-[#059669]' },
    { id: 'aurora', name: 'Aurora', desc: 'Blue, cyan & mint', gradient: 'bg-gradient-to-br from-[#0284c7] to-[#10b981]' }
  ],
  dark: [
    { id: 'midnight', name: 'Midnight', desc: 'Deep navy & teal', gradient: 'bg-gradient-to-br from-[#0f172a] to-[#0d9488]' },
    { id: 'neon', name: 'Neon', desc: 'Emerald & electric violet', gradient: 'bg-gradient-to-br from-[#059669] to-[#a855f7]' },
    { id: 'obsidian', name: 'Obsidian', desc: 'Metallic gold & basalt', gradient: 'bg-gradient-to-br from-[#fbbf24] to-[#27272a]' }
  ]
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get current theme name
  const currentThemeObj = [...THEMES.light, ...THEMES.dark].find(t => t.id === theme) || THEMES.light[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderThemeOption = (t) => (
    <button
      key={t.id}
      onClick={() => {
        setTheme(t.id);
        setIsOpen(false);
      }}
      className={`w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition ${theme === t.id ? 'bg-gray-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${t.gradient} shadow-sm shrink-0`} />
        <div className="text-left">
          <div className="text-sm font-semibold text-gray-800">{t.name}</div>
          <div className="text-[11px] text-gray-500 truncate max-w-[140px]">{t.desc}</div>
        </div>
      </div>
      {theme === t.id && <Check size={16} className="text-[#059669] shrink-0" />}
    </button>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition"
      >
        <Palette size={18} className="text-indigo-600" />
        <span className="text-sm font-semibold text-gray-800">{currentThemeObj.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 z-50 flex gap-4">
          <div className="flex-1">
            <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">LIGHT</h3>
            <div className="space-y-1">
              {THEMES.light.map(renderThemeOption)}
            </div>
          </div>
          
          <div className="w-px bg-gray-100 shrink-0" />
          
          <div className="flex-1">
            <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">DARK</h3>
            <div className="space-y-1">
              {THEMES.dark.map(renderThemeOption)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
