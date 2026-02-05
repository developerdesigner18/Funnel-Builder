'use client';

import { useCallback, useEffect, useState } from 'react';
import { Node, Edge } from 'reactflow';

interface FunnelData {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export function useFunnelStorage(funnelId: string) {
  const [funnel, setFunnel] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch funnel data
  useEffect(() => {
    async function fetchFunnel() {
      try {
        setLoading(true);
        const response = await fetch(`/api/funnels/${funnelId}`);
        if (!response.ok) throw new Error('Failed to fetch funnel');

        const { funnel: funnelData, nodes, edges } = await response.json();

        const formattedNodes: Node[] = nodes.map((node: any) => ({
          id: node.node_id,
          data: node.data,
          position: { x: node.position_x, y: node.position_y },
          type: node.type,
        }));

        const formattedEdges: Edge[] = edges.map((edge: any) => ({
          id: edge.edge_id,
          source: edge.source_node_id,
          target: edge.target_node_id,
        }));

        setFunnel({
          id: funnelData.id,
          name: funnelData.name,
          description: funnelData.description,
          nodes: formattedNodes,
          edges: formattedEdges,
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchFunnel();
  }, [funnelId]);

  const saveNodes = useCallback(
    async (nodes: Node[]) => {
      try {
        await fetch(`/api/funnels/${funnelId}/nodes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodes: nodes.map((node) => ({
              node_id: node.id,
              type: node.type,
              label: node.data.label,
              position_x: node.position.x,
              position_y: node.position.y,
              data: node.data,
            })),
          }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save nodes');
      }
    },
    [funnelId]
  );

  const addNode = useCallback(
    async (node: Node) => {
      try {
        const response = await fetch(`/api/funnels/${funnelId}/nodes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            node_id: node.id,
            type: node.type,
            label: node.data.label,
            position_x: node.position.x,
            position_y: node.position.y,
            data: node.data,
          }),
        });
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add node');
      }
    },
    [funnelId]
  );

  const deleteNode = useCallback(
    async (nodeId: string) => {
      try {
        await fetch(`/api/funnels/${funnelId}/nodes`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ node_id: nodeId }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete node');
      }
    },
    [funnelId]
  );

  const addEdge = useCallback(
    async (edge: Edge) => {
      try {
        const response = await fetch(`/api/funnels/${funnelId}/edges`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            edge_id: edge.id,
            source_node_id: edge.source,
            target_node_id: edge.target,
          }),
        });
        return await response.json();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add edge');
      }
    },
    [funnelId]
  );

  const deleteEdge = useCallback(
    async (edgeId: string) => {
      try {
        await fetch(`/api/funnels/${funnelId}/edges`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ edge_id: edgeId }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete edge');
      }
    },
    [funnelId]
  );

  const saveEdges = useCallback(
    async (edges: Edge[]) => {
      try {
        await fetch(`/api/funnels/${funnelId}/edges`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            edges: edges.map((edge) => ({
              edge_id: edge.id,
              source_node_id: edge.source,
              target_node_id: edge.target,
            })),
          }),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save edges');
      }
    },
    [funnelId]
  );

  return {
    funnel,
    loading,
    error,
    saveNodes,
    saveEdges,
    addNode,
    deleteNode,
    addEdge,
    deleteEdge,
  };
}
