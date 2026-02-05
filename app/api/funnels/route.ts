import { getSupabaseClient } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = getSupabaseClient();

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { name, description } = await request.json();

    const { data, error } = await supabase
      .from('funnels')
      .insert([{ name, description }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating funnel:', error);
    return NextResponse.json({ error: 'Failed to create funnel' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('funnels')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching funnels:', error);
    return NextResponse.json({ error: 'Failed to fetch funnels' }, { status: 500 });
  }
}
