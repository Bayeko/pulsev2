import { generateSuggestions } from '../supabase/functions/generate_suggestions';

describe('generateSuggestions edge function', () => {
  it('returns happy suggestions for happy mood', () => {
    const suggestions = generateSuggestions({ mood: 'happy' });
    expect(suggestions).toContain('Celebrate with friends');
  });

  it('returns default suggestions when mood unspecified', () => {
    const suggestions = generateSuggestions({});
    expect(suggestions).toEqual(['Take a walk', 'Call a friend']);
  });
});
