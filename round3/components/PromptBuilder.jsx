import React from 'react';
import { Lightbulb, CheckCircle, Sparkles, AlertCircle, Zap } from 'lucide-react';
import IngredientField from './IngredientField';

const PromptBuilder = ({
  scenario,
  config,
  selectedDifficulty,
  ingredientPresets,
  chipRule,
  chipsPlayed,
  showHints,
  onToggleHints,
  allHints,
  promptIngredients,
  baseFieldsFilled,
  buildFullPrompt,
  readyToGenerate,
  handleGenerate,
  onBackToScenario,
  difficultyFieldOrder
}) => {
  const {
    promptValues,
    promptSetters,
    selectedPresets,
    collapsed,
    applyPresetToField,
    toggleCollapse
  } = promptIngredients;

  const activePresets = ingredientPresets[selectedDifficulty] || ingredientPresets.easy;
  const totalChipSelections = Object.values(selectedPresets).filter(Boolean).length;
  const shouldShowChipSections = selectedDifficulty !== 'hard' && (chipRule?.minTotalSelections ?? 0) > 0;
  const difficultyCopy = {
    easy: {
      title: 'Easy',
      description: 'Use suggested ingredient chips to remix Round 2 and get unstuck fast.'
    },
    medium: {
      title: 'Medium',
      description: 'Still get scaffolding, but add your own spin by combining chips.'
    },
    hard: {
      title: 'Hard',
      description: 'No chips, no hints—freeform drafting for leaderboard glory.'
    }
  };

  const fields = {
    context: {
      number: 1,
      title: 'Context',
      placeholder: 'What does Claude need to know about the background and situation?',
      hint: 'Share the project, key facts, and any background. Copy/paste relevant lines from your doc if helpful.',
      value: promptValues.context,
      onChange: promptSetters.context
    },
    format: {
      number: 2,
      title: 'Format',
      placeholder: 'What shape should the response take?',
      hint: 'Do you want bullets, an outline, a draft email, a table? Call it out clearly.',
      value: promptValues.format,
      onChange: promptSetters.format
    },
    audience: {
      number: 3,
      title: 'Audience',
      placeholder: 'Who is reading this? What perspective do they have?',
      hint: 'Name the audience, their concerns, and what will resonate.',
      value: promptValues.audience,
      onChange: promptSetters.audience
    },
    constraints: {
      number: 4,
      title: 'Constraints',
      placeholder: 'What must be avoided or prioritized?',
      hint: 'List guardrails, tone requirements, and any must-include details.',
      value: promptValues.constraints,
      onChange: promptSetters.constraints
    },
    goal: {
      number: 5,
      title: 'Goal',
      placeholder: 'What should this accomplish?',
      hint: "What's the desired outcome? What action should readers take? How do you measure success?",
      value: promptValues.goal,
      onChange: promptSetters.goal
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
            <Zap className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-orange-900 mb-2">Your Scenario</h3>
            <p className="text-sm text-orange-800 leading-relaxed mb-3">{scenario?.situation}</p>
            <div className="bg-white border-l-4 border-orange-400 rounded p-3">
              <p className="text-xs font-semibold text-orange-900 mb-1">Your challenge:</p>
              <p className="text-sm text-orange-800">{scenario?.requirement}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-lg p-6 mb-6 border border-purple-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Build Your Prompt</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800 mb-4">
          <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
            <p className="font-semibold text-purple-900 mb-1">Level style</p>
            <p className="leading-snug">{config.playstyle}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
            <p className="font-semibold text-orange-900 mb-1">Keep in mind</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{config.instructions}</li>
              <li>Keep it scannable; avoid filler words.</li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-dashed border-purple-300 mb-4">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-sm font-semibold text-purple-900">Chip draft</span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
              {Math.min(chipsPlayed, chipRule.minTotalSelections || 0)} / {chipRule.minTotalSelections || 0} needed
            </span>
            {chipRule.perFieldLimit > 0 && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                Max {chipRule.perFieldLimit} per category
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-2">{chipRule.label}</p>
          {chipRule.minTotalSelections > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-2 transition-all"
                style={{ width: `${Math.min(100, Math.round((chipsPlayed / chipRule.minTotalSelections) * 100))}%` }}
              ></div>
            </div>
          )}
        </div>
        <button
          onClick={onToggleHints}
          className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-2"
        >
          <Lightbulb size={16} />
          {showHints ? 'Hide' : 'Show'} helpful questions
        </button>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="text-green-600" size={18} />
          <p className="font-semibold text-gray-900">Task block</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs uppercase font-bold text-green-800 mb-1">Deliverable</p>
            <p className="leading-snug">{scenario?.requirement || 'Spell out what you need written or outlined.'}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs uppercase font-bold text-blue-800 mb-1">Timing</p>
            <p className="leading-snug">{scenario?.urgency || 'Note when this is due and why the timing matters.'}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs uppercase font-bold text-purple-800 mb-1">Audience</p>
            <p className="leading-snug">{scenario?.sector ? `Write for folks in ${scenario.sector}.` : 'Call out who will read this.'}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs uppercase font-bold text-orange-800 mb-1">Must include</p>
            <p className="leading-snug">{scenario?.focus || 'Include the key facts from the scenario without adding extras.'}</p>
          </div>
        </div>
      </div>

      {showHints && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Questions to guide you:</h3>
          <div className="grid gap-4">
            {allHints.map((hint, idx) => (
              <div key={idx} className="border-l-4 border-purple-300 pl-4">
                <p className="font-semibold text-purple-900 mb-2">{hint.category}</p>
                <ul className="space-y-1">
                  {hint.questions.map((q, qIdx) => (
                    <li key={qIdx} className="text-sm text-gray-600">• {q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border-2 border-purple-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase text-gray-500 font-semibold">Level</p>
            <h3 className="text-xl font-bold text-gray-900">{difficultyCopy[selectedDifficulty].title}</h3>
            <p className="text-sm text-gray-600">{difficultyCopy[selectedDifficulty].description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.badgeColor}`}>
            {config.label}
          </span>
        </div>

        {difficultyFieldOrder[selectedDifficulty].map((fieldKey) => (
          <IngredientField
            key={fieldKey}
            field={fieldKey}
            number={fields[fieldKey].number}
            title={fields[fieldKey].title}
            placeholder={fields[fieldKey].placeholder}
            hint={fields[fieldKey].hint}
            value={fields[fieldKey].value}
            onChange={fields[fieldKey].onChange}
            presets={activePresets?.[fieldKey] || []}
            onPresetSelect={applyPresetToField}
            selectedPresets={selectedPresets}
            difficulty={selectedDifficulty}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            perFieldLimit={chipRule.perFieldLimit}
          />
        ))}

        <IngredientField
          field="goal"
          number={5}
          title="Goal"
          placeholder="What should this accomplish?"
          hint="What's the desired outcome? What action should readers take? How do you measure success?"
          value={promptValues.goal}
          onChange={promptSetters.goal}
          presets={activePresets?.goal || []}
          onPresetSelect={applyPresetToField}
          selectedPresets={selectedPresets}
          difficulty={selectedDifficulty}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          perFieldLimit={chipRule.perFieldLimit}
        />
      </div>

      {baseFieldsFilled && (
        <div className="bg-white rounded-lg border-2 border-purple-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            Your Complete Prompt
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {buildFullPrompt()}
          </div>
        </div>
      )}

      {!readyToGenerate && chipRule.minTotalSelections > 0 && (
        <p className="text-xs text-orange-700 mb-2">Play at least {chipRule.minTotalSelections} chips and fill each ingredient before generating.</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={onBackToScenario}
          className="bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Scenario
        </button>
        <button
          onClick={handleGenerate}
          disabled={!readyToGenerate}
          className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
            readyToGenerate ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Zap size={20} />
          Generate & See Results
        </button>
      </div>

      {shouldShowChipSections && totalChipSelections < chipRule.minTotalSelections && (
        <div className="mt-3 text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-md p-3 flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5" />
          <p className="leading-snug">Play chips before generating to meet the level requirements.</p>
        </div>
      )}
    </div>
  );
};

export default PromptBuilder;
