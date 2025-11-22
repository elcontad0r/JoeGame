export const DEFAULT_ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

export function getAnthropicModel() {
  const configuredModel = (process.env.ANTHROPIC_MODEL || '').trim();
  const model = configuredModel || DEFAULT_ANTHROPIC_MODEL;

  if (typeof model !== 'string' || model.length === 0) {
    throw new Error('Invalid Anthropic model configuration');
  }

  return model;
}
