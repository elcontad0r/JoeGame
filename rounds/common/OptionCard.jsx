import React from 'react';
import { CheckCircle } from 'lucide-react';

const OptionCard = ({
  label,
  description,
  onSelect,
  selected,
  selectedBadgeText = 'Locked',
  selectedHint,
  className = '',
  selectedClasses = 'border-blue-400 bg-blue-50 text-gray-900 shadow-sm',
  unselectedClasses = 'border-gray-200 bg-white text-gray-900',
  badgeClassName = 'bg-blue-100 text-blue-700',
  selectedHintClassName = 'text-blue-800 bg-blue-50 border border-blue-100'
}) => {
  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-lg border-2 p-4 transition-all h-full flex flex-col gap-2 hover:-translate-y-0.5 ${
        selected ? selectedClasses : unselectedClasses
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-sm">{label}</span>
        {selected && (
          <span className={`px-2 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 ${badgeClassName}`}>
            <CheckCircle size={14} />
            {selectedBadgeText}
          </span>
        )}
      </div>
      {description && <p className="text-sm text-gray-700 leading-relaxed">{description}</p>}
      {selected && selectedHint && (
        <p className={`text-xs rounded-md p-2 ${selectedHintClassName}`}>{selectedHint}</p>
      )}
    </button>
  );
};

export default OptionCard;
