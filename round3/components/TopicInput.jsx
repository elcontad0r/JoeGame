import React from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';

const TopicInput = ({ config, userTopic, onTopicChange, onGenerate }) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-purple-200">
        <div className="text-center mb-6">
          <Lightbulb className="mx-auto mb-4 text-purple-600" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Make it relevant</h2>
          <p className="text-gray-600">
            What project or topic are you working on right now? We'll tailor an {config.label.toLowerCase()} scenario to match.
          </p>
          <p className="text-xs text-gray-500 mt-2">{config.instructions}</p>
        </div>

        <textarea
          value={userTopic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="e.g., 'Customer onboarding for new CRM rollout' or 'Back-to-school email for parents' or 'leave blank for a surprise scenario'"
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm resize-none mb-4"
        />

        <button
          onClick={() => onGenerate(userTopic)}
          className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          Generate My Scenario
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default TopicInput;
