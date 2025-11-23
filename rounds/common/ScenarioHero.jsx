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
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
      <div
        className={`absolute inset-x-2 -top-6 h-36 rounded-3xl blur-3xl opacity-60 -z-10 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
        aria-hidden="true"
      />

      <div className="bg-white rounded-xl shadow-xl p-8 mb-6 border-t-4 border-blue-500 relative overflow-hidden">
        <div
          className={`absolute -right-14 -top-16 w-56 h-56 rounded-full opacity-10 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}
          aria-hidden="true"
        />
        <div className="flex items-start gap-4 mb-6">
          <AlertCircle className={`${accentColorClass} flex-shrink-0 mt-1`} size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{scenario.title}</h2>
            {scenario.urgency && (
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <Clock size={18} />
                <span>{scenario.urgency}</span>
              </div>
            )}
            <p className="text-gray-700 text-lg leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-xl p-6 text-white border border-white/20`}>
        <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white/80 mb-2">
          <span className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />
          Tutorial mode
        </div>
        <h3 className="text-xl font-bold mb-2">{actionTitle}</h3>
        <p className="text-base mb-5 text-blue-50">{actionCopy}</p>
        <button
          onClick={onAction}
          className={`${buttonClassName} px-8 py-3 rounded-lg font-bold transition-colors inline-flex items-center gap-2 shadow-lg border border-white/30`}
        >
          {actionLabel} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ScenarioHero;
