import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const db = {
  user: {
    findUnique: async ({ where }: { where: { address: string } }) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('address', where.address)
        .single();
      
      if (error) {
        throw error;
      }
      return data;
    },
    update: async ({ where, data }: { where: { address: string }, data: any }) => {
      const { data: updatedData, error } = await supabase
        .from('users')
        .update(data)
        .eq('address', where.address)
        .single();
      
      if (error) {
        throw error;
      }
      return updatedData;
    }
  }
};
