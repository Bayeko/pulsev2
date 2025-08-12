import { supabase } from './client';

export type SuggestionSlot = {
  start?: string;
  end?: string;
  [key: string]: any;
};

export async function generateSuggestions(): Promise<SuggestionSlot[]> {
  const { data, error } = await supabase.functions.invoke('generate_suggestions');

  if (error) {
    throw new Error(error.message);
  }

  if (Array.isArray(data)) {
    return data as SuggestionSlot[];
  }
  if (data && Array.isArray((data as any).slots)) {
    return (data as any).slots as SuggestionSlot[];
  }
  return [];
}
