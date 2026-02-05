import { getSupabaseClient } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = getSupabaseClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { edge_id, source_node_id, target_node_id } = await request.json();

    const { data: result, error } = await supabase
      .from('funnel_edges')
      .insert([
        {
          funnel_id: id,
          edge_id,
          source_node_id,
          target_node_id,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating edge:', error);
    return NextResponse.json({ error: 'Failed to create edge' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const { edge_id } = await request.json();

    const { error } = await supabase
      .from('funnel_edges')
      .delete()
      .eq('funnel_id', id)
      .eq('edge_id', edge_id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting edge:', error);
    return NextResponse.json({ error: 'Failed to delete edge' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const { edges } = await request.json();

    // First delete all existing edges for this funnel
    const { error: deleteError } = await supabase
      .from('funnel_edges')
      .delete()
      .eq('funnel_id', id);

    if (deleteError) throw deleteError;

    // If there are no edges to save, return early
    if (!edges || edges.length === 0) {
      return NextResponse.json({ success: true, edges: [] });
    }

    // Format edges for insertion
    const edgesToInsert = edges.map((edge: any) => ({
      funnel_id: id,
      edge_id: edge.edge_id,
      source_node_id: edge.source_node_id,
      target_node_id: edge.target_node_id,
    }));

    // Insert new edges
    const { data: result, error: insertError } = await supabase
      .from('funnel_edges')
      .insert(edgesToInsert)
      .select();

    if (insertError) throw insertError;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating edges:', error);
    return NextResponse.json({ error: 'Failed to update edges' }, { status: 500 });
  }
}
