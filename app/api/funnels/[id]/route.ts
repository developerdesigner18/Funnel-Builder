import { getSupabaseClient } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .select('*')
      .eq('id', id)
      .single();

    if (funnelError) throw funnelError;

    const { data: nodes, error: nodesError } = await supabase
      .from('funnel_nodes')
      .select('*')
      .eq('funnel_id', id);

    if (nodesError) throw nodesError;

    const { data: edges, error: edgesError } = await supabase
      .from('funnel_edges')
      .select('*')
      .eq('funnel_id', id);

    if (edgesError) throw edgesError;

    return NextResponse.json({ funnel, nodes, edges });
  } catch (error) {
    console.error('Error fetching funnel:', error);
    return NextResponse.json({ error: 'Failed to fetch funnel' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const { name, description } = await request.json();

    const { data, error } = await supabase
      .from('funnels')
      .update({ name, description, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating funnel:', error);
    return NextResponse.json({ error: 'Failed to update funnel' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { error } = await supabase
      .from('funnels')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting funnel:', error);
    return NextResponse.json({ error: 'Failed to delete funnel' }, { status: 500 });
  }
}
