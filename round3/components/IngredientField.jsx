import React from 'react';
import { Edit2, ChevronUp } from 'lucide-react';
import { ingredientColors } from '../constants';

const IngredientField = ({
  field,
  number,
  title,
  placeholder,
  value,
  onChange,
  hint,
  collapsed,
  onToggleCollapse,
  presets = [],
  onPresetSelect,
  selectedPresets,
  difficulty,
  perFieldLimit
}) => {
  const isCollapsed = collapsed[field];
  const colors = ingredientColors[field];
  const hasContent = value.trim().length > 0;
  const selectedIds = selectedPresets?.[field] || [];
  const remainingSlots = Math.max(perFieldLimit - selectedIds.length, 0);

  if (isCollapsed && hasContent) {
    return (
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 mb-4`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`inline-block ${colors.label} px-2 py-0.5 rounded text-xs font-bold mb-2`}>
              {number}. {title}
            </div>
            <p className={`text-sm ${colors.text} font-medium line-clamp-2`}>
              {value}
            </p>
          </div>
          <button
            onClick={() => onToggleCollapse(field)}
            className={`${colors.text} hover:opacity-70 p-2 ml-2 flex-shrink-0`}
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-800 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {number}
          </span>
          <label className="font-semibold text-gray-900">{title}</label>
        </div>
        {hasContent && (
          <button
            onClick={() => onToggleCollapse(field)}
            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
            title="Collapse"
          >
            <ChevronUp size={18} />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-600 mb-2">{hint}</p>

      {difficulty !== 'hard' && presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {presets.map((preset) => {
            const isSelected = selectedIds.includes(preset.id);
            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(field, preset)}
                className={`rounded-lg border px-3 py-2 text-left transition-all text-sm ${
                  isSelected
                    ? `${colors.bg} ${colors.border} border-2 text-gray-900 shadow-sm`
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold text-xs mb-1 text-gray-900 flex items-center gap-2">
                  <span className={`${colors.label} px-2 py-0.5 rounded`}>{preset.label}</span>
                  {preset.tone && <span className="text-[10px] uppercase tracking-wide text-gray-500">{preset.tone}</span>}
                  {isSelected && <span className="text-[10px] text-green-700">Locked</span>}
                </div>
                <p className="text-xs text-gray-700 leading-snug">{preset.snippet}</p>
              </button>
            );
          })}
        </div>
      )}

      {difficulty !== 'hard' && perFieldLimit > 0 && (
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200">
            {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} left in this category
          </span>
          {selectedIds.length > 0 && <span className="text-gray-400">Tap a new chip to stack more detail.</span>}
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (hasContent) {
            onToggleCollapse(field);
          }
        }}
        placeholder={placeholder}
        className="w-full h-24 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm resize-none"
      />
    </div>
  );
};

export default IngredientField;
