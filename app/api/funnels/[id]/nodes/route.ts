import { getSupabaseClient } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = getSupabaseClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { node_id, type, label, position_x, position_y, data } = await request.json();

    const { data: result, error } = await supabase
      .from('funnel_nodes')
      .insert([
        {
          funnel_id: id,
          node_id,
          type,
          label,
          position_x,
          position_y,
          data: data || {},
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating node:', error);
    return NextResponse.json({ error: 'Failed to create node' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const { node_id, label, position_x, position_y, data } = await request.json();

    const { data: result, error } = await supabase
      .from('funnel_nodes')
      .update({
        label,
        position_x,
        position_y,
        data,
        updated_at: new Date().toISOString(),
      })
      .eq('funnel_id', id)
      .eq('node_id', node_id)
      .select();

    if (error) throw error;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating node:', error);
    return NextResponse.json({ error: 'Failed to update node' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const { node_id } = await request.json();

    const { error } = await supabase
      .from('funnel_nodes')
      .delete()
      .eq('funnel_id', id)
      .eq('node_id', node_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting node:', error);
    return NextResponse.json({ error: 'Failed to delete node' }, { status: 500 });
  }
}
