import React from 'react';
import { AlertCircle, ArrowRight, Clock } from 'lucide-react';

const ScenarioHero = ({
  scenario,
  actionTitle,
  actionCopy,
  actionLabel,
  onAction,
  accentColorClass = 'text-blue-500',
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-purple-600',
  buttonClassName = 'bg-white text-blue-600 hover:bg-blue-50'
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className={`${accentColorClass} flex-shrink-0 mt-1`} size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
            {scenario.urgency && (
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <Clock size={18} />
                <span>{scenario.urgency}</span>
              </div>
            )}
            <p className="text-gray-700 text-lg leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-xl p-6 text-white`}>
        <h3 className="text-xl font-bold mb-3">{actionTitle}</h3>
        <p className="text-base mb-5 text-blue-50">{actionCopy}</p>
        <button
          onClick={onAction}
          className={`${buttonClassName} px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center gap-2`}
        >
          {actionLabel} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ScenarioHero;
