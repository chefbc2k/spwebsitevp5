import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('address', address.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw error;
    }

    return NextResponse.json({ isAdmin: !!data });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
