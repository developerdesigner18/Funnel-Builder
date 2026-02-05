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
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
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
  onDrop?: (node: Node) => void;
}

const GRID_SIZE = 20;

const snapToGrid = (value: number) => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

function FunnelCanvasContent({
  funnelId,
  initialNodes,
  initialEdges,
  onNodesChange,
  onEdgesChange,
  onDrop,
}: FunnelCanvasProps) {
  const reactFlowInstance = useReactFlow();

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
    (params: Connection) => {
      // Prevent connecting to self
      if (params.source === params.target) return;

      // Prevent duplicate edges
      const isDuplicate = initialEdges.some(
        (edge) => edge.source === params.source && edge.target === params.target
      );
      if (isDuplicate) return;

      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };

      const nextEdges = addEdge(edge, initialEdges);
      onEdgesChange(nextEdges);
    },
    [initialEdges, onEdgesChange]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const dataStr = event.dataTransfer.getData('application/reactflow-data');

      if (!type || !onDrop) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultData = dataStr ? JSON.parse(dataStr) : {};

      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random()}`,
        type,
        position,
        data: {
          label: label || `New ${type}`,
          ...defaultData,
        },
      };

      onDrop(newNode);
    },
    [reactFlowInstance, onDrop]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={handleDrop}
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

export function FunnelCanvas(props: FunnelCanvasProps) {
  return (
    <ReactFlowProvider>
      <FunnelCanvasContent {...props} />
    </ReactFlowProvider>
  );
}
