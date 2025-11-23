import { useCallback, useMemo, useState } from 'react';

const createEmptyPresetState = () => ({
  task: [],
  context: [],
  format: [],
  audience: [],
  constraints: [],
  goal: []
});

const createCollapsedState = () => ({
  task: false,
  context: false,
  format: false,
  audience: false,
  constraints: false,
  goal: false
});

const usePromptIngredients = ({ chipRule }) => {
  const [promptTask, setPromptTask] = useState('');
  const [promptContext, setPromptContext] = useState('');
  const [promptFormat, setPromptFormat] = useState('');
  const [promptAudience, setPromptAudience] = useState('');
  const [promptConstraints, setPromptConstraints] = useState('');
  const [promptGoal, setPromptGoal] = useState('');
  const [selectedPresets, setSelectedPresets] = useState(createEmptyPresetState);
  const [collapsed, setCollapsed] = useState(createCollapsedState);

  const promptValues = useMemo(
    () => ({
      task: promptTask,
      context: promptContext,
      format: promptFormat,
      audience: promptAudience,
      constraints: promptConstraints,
      goal: promptGoal
    }),
    [promptAudience, promptConstraints, promptContext, promptFormat, promptGoal, promptTask]
  );

  const promptSetters = useMemo(
    () => ({
      task: setPromptTask,
      context: setPromptContext,
      format: setPromptFormat,
      audience: setPromptAudience,
      constraints: setPromptConstraints,
      goal: setPromptGoal
    }),
    []
  );

  const chipsPlayed = useMemo(
    () => Object.values(selectedPresets).reduce((sum, list) => sum + (list?.length || 0), 0),
    [selectedPresets]
  );

  const baseFieldsFilled = useMemo(
    () => promptTask && promptContext && promptFormat && promptAudience && promptConstraints && promptGoal,
    [promptAudience, promptConstraints, promptContext, promptFormat, promptGoal, promptTask]
  );

  const toggleCollapse = useCallback((field) => {
    setCollapsed((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const resetPromptState = useCallback(() => {
    setPromptTask('');
    setPromptContext('');
    setPromptFormat('');
    setPromptAudience('');
    setPromptConstraints('');
    setPromptGoal('');
    setSelectedPresets(createEmptyPresetState());
    setCollapsed(createCollapsedState());
  }, []);

  const buildFullPrompt = useCallback(() => {
    const parts = [];

    if (promptValues.task) parts.push(`TASK: ${promptValues.task}`);
    if (promptValues.context) parts.push(`CONTEXT: ${promptValues.context}`);
    if (promptValues.format) parts.push(`FORMAT: ${promptValues.format}`);
    if (promptValues.audience) parts.push(`AUDIENCE: ${promptValues.audience}`);
    if (promptValues.constraints) parts.push(`CONSTRAINTS: ${promptValues.constraints}`);
    if (promptValues.goal) parts.push(`GOAL: ${promptValues.goal}`);

    if (parts.length === 0) return '';

    return parts.join('\n\n');
  }, [promptValues]);

  const applyPresetToField = useCallback(
    (field, preset) => {
      const setter = promptSetters[field];
      const currentValue = promptValues[field] || '';
      if (!setter || !preset?.snippet) return;

      const currentSelections = selectedPresets[field] || [];
      const limit = chipRule?.perFieldLimit || 0;
      if (limit > 0 && !currentSelections.includes(preset.id) && currentSelections.length >= limit) {
        alert(`You already locked ${limit} chip${limit === 1 ? '' : 's'} for ${field}. Clear a slot by editing the text, or switch fields.`);
        return;
      }

      if (currentSelections.includes(preset.id)) {
        const updatedSelections = currentSelections.filter((id) => id !== preset.id);
        setSelectedPresets((prev) => ({ ...prev, [field]: updatedSelections }));
        setter(currentValue.replace(preset.snippet, '').trim());
        return;
      }

      setSelectedPresets((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), preset.id]
      }));

      if (!currentValue.includes(preset.snippet)) {
        const separator = currentValue.trim().length > 0 ? '\n' : '';
        setter(`${currentValue}${separator}${preset.snippet}`);
      }
    },
    [chipRule?.perFieldLimit, promptSetters, promptValues, selectedPresets]
  );

  return {
    promptValues,
    promptSetters,
    selectedPresets,
    collapsed,
    chipsPlayed,
    baseFieldsFilled,
    buildFullPrompt,
    applyPresetToField,
    toggleCollapse,
    resetPromptState
  };
};

export default usePromptIngredients;
