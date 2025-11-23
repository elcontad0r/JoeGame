import React from 'react';
import OptionCard from './OptionCard';

const LessonSection = ({ section, selectedOptionId, onSelectOption }) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-3 mb-4 flex-col sm:flex-row sm:items-center">
        <div>
      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">{section.title}</div>
      <h4 className="text-lg font-bold text-gray-900 mb-1">{section.summary}</h4>
      <p className="text-sm text-gray-600">{section.helper}</p>
    </div>
        {selectedOptionId && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            Locked in
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {section.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const hint =
            option.learning ||
            'Notice how this choice shapes what the AI pays attention to.';

          return (
            <OptionCard
              key={option.id}
              label={option.label}
              description={option.description}
              selected={isSelected}
              onSelect={() => onSelectOption(option.id)}
              selectedHint={isSelected ? hint : undefined}
              selectedBadgeText="Chosen"
              selectedHintClassName="text-sm bg-blue-50 border border-blue-100 text-blue-900"
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonSection;
