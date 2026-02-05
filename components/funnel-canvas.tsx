'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  Background,
  Controls,
  MiniMap,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ProductNode } from './nodes/product-node';
import { UpsellNode } from './nodes/upsell-node';
import { ConditionalNode } from './nodes/conditional-node';
import { EndNode } from './nodes/end-node';
import { EmptyFunnelState } from './empty-funnel-state';

const nodeTypes: NodeTypes = {
  product: ProductNode,
  upsell: UpsellNode,
  conditional: ConditionalNode,
  end: EndNode,
};

interface FunnelCanvasProps {
  funnelId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const GRID_SIZE = 20;

const snapToGrid = (value: number) => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export function FunnelCanvas({
  funnelId,
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
}: FunnelCanvasProps) {
  // Removed internal state to prevent infinite loops and make it a true controlled component

  const handleNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const snappedChanges = changes.map((change) => {
        if (change.type === 'position' && change.position) {
          return {
            ...change,
            position: {
              x: snapToGrid(change.position.x),
              y: snapToGrid(change.position.y),
            },
          };
        }
        return change;
      });

      const nextNodes = applyNodeChanges(snappedChanges, initialNodes);
      onNodesChange(nextNodes);
    },
    [initialNodes, onNodesChange]
  );

  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const nextEdges = applyEdgeChanges(changes, initialEdges);
      onEdgesChange(nextEdges);
    },
    [initialEdges, onEdgesChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const nextEdges = addEdge(connection, initialEdges);
      onEdgesChange(nextEdges);
    },
    [initialEdges, onEdgesChange]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={GRID_SIZE} color="#f0f0f0" size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {initialNodes.length === 0 && <EmptyFunnelState />}
    </div>
  );
}
