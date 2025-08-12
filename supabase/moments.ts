import { supabase } from './client';

export type Moment = {
  id: number;
  pair_id: string;
  timestamp: string;
  description?: string;
};

export async function addMoment(moment: { pair_id: string; timestamp: string; description?: string }): Promise<Moment> {
  const { data, error } = await supabase
    .from('moments')
    .insert(moment)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Moment;
}
