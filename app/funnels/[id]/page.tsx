'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Node, Edge } from 'reactflow';
import { FunnelCanvas } from '@/components/funnel-canvas';
import { TemplatesSidebar } from '@/components/templates-sidebar';
import { PropertiesEditor } from '@/components/properties-editor';
import { useFunnelStorage } from '@/hooks/use-funnel-storage';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Undo2, Redo2, Save } from 'lucide-react';
import Link from 'next/link';
import { KeyboardHelp } from '@/components/keyboard-help';

export default function FunnelEditorPage() {
  const params = useParams();
  const funnelId = params.id as string;

  const { funnel, loading, saveNodes, saveEdges, addNode, deleteNode, addEdge, deleteEdge } =
    useFunnelStorage(funnelId);
  const { pushHistory, undo, redo, canUndo, canRedo } = useUndoRedo();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState({});
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (funnel) {
      setNodes(funnel.nodes);
      setEdges(funnel.edges);
      pushHistory(funnel.nodes, funnel.edges);
    }
  }, [funnel]);

  useEffect(() => {
    const handleNodeSelected = (event: CustomEvent) => {
      const { nodeId, nodeType, nodeData } = event.detail;
      setSelectedNodeId(nodeId);
      setSelectedNodeType(nodeType);
      setSelectedNodeData(nodeData);
    };

    window.addEventListener('nodeSelected', handleNodeSelected as EventListener);
    return () => {
      window.removeEventListener('nodeSelected', handleNodeSelected as EventListener);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y') {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'd') {
          e.preventDefault();
          if (selectedNodeId) {
            handleDuplicateNode();
          }
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        if (selectedNodeId) {
          handleDeleteNode();
        }
      } else if (e.key === '?') {
        e.preventDefault();
        // Trigger help dialog
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes, edges]);

  const handleNodesChange = useCallback(
    (updatedNodes: Node[]) => {
      setNodes(updatedNodes);
      pushHistory(updatedNodes, edges);
    },
    [edges, pushHistory]
  );

  const handleEdgesChange = useCallback(
    (updatedEdges: Edge[]) => {
      setEdges(updatedEdges);
      pushHistory(nodes, updatedEdges);
    },
    [nodes, pushHistory]
  );

  const handleDragStart = (nodeType: string, defaultData: Record<string, unknown>) => {
    const nodeId = `node-${Date.now()}-${Math.random()}`;
    const newNode: Node = {
      id: nodeId,
      type: nodeType,
      data: {
        label: `New ${nodeType}`,
        ...defaultData,
      },
      position: { x: 0, y: 0 },
    };

    // Add node immediately
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    handleNodesChange(updatedNodes);
    addNode(newNode);
  };

  const handlePropertyUpdate = (updates: Record<string, unknown>) => {
    const updatedNodes = nodes.map((node) =>
      node.id === selectedNodeId
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    );
    setNodes(updatedNodes);
    setSelectedNodeData({ ...selectedNodeData, ...updates });
    handleNodesChange(updatedNodes);
  };

  const handleDeleteNode = () => {
    if (!selectedNodeId) return;
    const updatedNodes = nodes.filter((n) => n.id !== selectedNodeId);
    const updatedEdges = edges.filter(
      (e) => e.source !== selectedNodeId && e.target !== selectedNodeId
    );
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setSelectedNodeId(null);
    handleNodesChange(updatedNodes);
    handleEdgesChange(updatedEdges);
    deleteNode(selectedNodeId);
  };

  const handleDuplicateNode = () => {
    if (!selectedNodeId) return;
    const nodeToClone = nodes.find((n) => n.id === selectedNodeId);
    if (!nodeToClone) return;

    const newNodeId = `node-${Date.now()}-${Math.random()}`;
    const newNode: Node = {
      ...nodeToClone,
      id: newNodeId,
      position: {
        x: nodeToClone.position.x + 50,
        y: nodeToClone.position.y + 50,
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    handleNodesChange(updatedNodes);
    addNode(newNode);
    setSelectedNodeId(newNodeId);
  };

  const handleUndo = () => {
    const previous = undo();
    if (previous) {
      setNodes(previous.nodes);
      setEdges(previous.edges);
    }
  };

  const handleRedo = () => {
    const next = redo();
    if (next) {
      setNodes(next.nodes);
      setEdges(next.edges);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all([saveNodes(nodes), saveEdges(edges)]);
      toast.success('Funnel saved successfully');
    } catch (error) {
      toast.error('Failed to save funnel');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading funnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/funnels">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{funnel?.name}</h1>
            {funnel?.description && (
              <p className="text-sm text-gray-500">{funnel.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <KeyboardHelp />
          <div className="w-px h-6 bg-gray-200" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <TemplatesSidebar onDragStart={handleDragStart} />

        <div className="flex-1 relative bg-gray-100">
          <FunnelCanvas
            funnelId={funnelId}
            initialNodes={nodes}
            initialEdges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>

        {selectedNodeId && (
          <PropertiesEditor
            nodeId={selectedNodeId}
            nodeType={selectedNodeType}
            nodeData={selectedNodeData}
            onUpdate={handlePropertyUpdate}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>
    </div>
  );
}
