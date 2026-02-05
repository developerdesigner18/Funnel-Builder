'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Node, Edge } from 'reactflow';
import { FunnelCanvas } from '@/components/funnel-canvas';
import { TemplatesSidebar } from '@/components/templates-sidebar';
import { PropertiesEditor } from '@/components/properties-editor';
import { useFunnelStorage } from '@/hooks/use-funnel-storage';
import { useUndoRedo } from '@/hooks/use-undo-redo';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Undo2, Redo2, Save, Download, Upload } from 'lucide-react';
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

  const validatedNodes = useMemo(() => {
    return nodes.map((node) => {
      let warning = '';
      const nodeType = node.data?.type;

      const outgoingEdges = edges.filter((e) => e.source === node.id);
      const incomingEdges = edges.filter((e) => e.target === node.id);

      // Rule: Sales Page must have exactly one outgoing edge
      if (nodeType === 'sales') {
        if (outgoingEdges.length === 0) {
          warning = 'Sales Page needs an outgoing connection.';
        } else if (outgoingEdges.length > 1) {
          warning = 'Sales Page should typically have only one path.';
        }
      }

      // Rule: General Orphan Nodes (except Sales Page)
      if (nodeType !== 'sales' && outgoingEdges.length === 0 && incomingEdges.length === 0) {
        warning = 'This node is not connected to the funnel.';
      }

      return {
        ...node,
        data: {
          ...node.data,
          warning: warning || undefined,
        },
      };
    });
  }, [nodes, edges]);
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

  const handleDragStart = (
    event: React.DragEvent,
    nodeType: string,
    label: string,
    defaultData: Record<string, unknown>
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.setData(
      'application/reactflow-data',
      JSON.stringify(defaultData)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (node: Node) => {
    const nodeType = node.data.type;
    let finalLabel = node.data.label;

    if (nodeType === 'upsell' || nodeType === 'downsell') {
      const baseName = nodeType === 'upsell' ? 'Upsell' : 'Downsell';

      // Find all existing nodes of the same type and extract their numbers from labels
      const existingIndexes = nodes
        .filter((n) => n.data.type === nodeType)
        .map((n) => {
          const match = n.data.label.match(new RegExp(`${baseName} (\\d+)`));
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((idx) => idx > 0);

      // Find the first available number starting from 1
      let nextIndex = 1;
      while (existingIndexes.includes(nextIndex)) {
        nextIndex++;
      }

      finalLabel = `${baseName} ${nextIndex}`;
    }

    const newNode = {
      ...node,
      data: {
        ...node.data,
        label: finalLabel,
      },
    };

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

  // Auto-save logic
  useEffect(() => {
    // Only auto-save if we have nodes (prevent saving empty states on initial load)
    if (nodes.length === 0 && edges.length === 0) return;

    const timer = setTimeout(() => {
      saveNodes(nodes);
      saveEdges(edges);
    }, 3000); // 3-second debounce

    return () => clearTimeout(timer);
  }, [nodes, edges, saveNodes, saveEdges]);

  // JSON Export/Import
  const handleExport = () => {
    const data = {
      name: funnel?.name || 'funnel',
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${funnel?.name || 'funnel'}-export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Funnel exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.nodes || !data.edges) {
          throw new Error('Invalid funnel data format');
        }

        // Apply imported data
        setNodes(data.nodes);
        setEdges(data.edges);
        pushHistory(data.nodes, data.edges);

        // Immediate sync to database
        saveNodes(data.nodes);
        saveEdges(data.edges);

        toast.success('Funnel imported successfully');
      } catch (err) {
        toast.error('Invalid JSON file. Please check the format.');
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
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
          <div className="w-px h-6 bg-gray-200 mx-1" />

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md mr-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo}
              className="h-8 w-8 p-0 focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo}
              className="h-8 w-8 p-0 focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-gray-600 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Export funnel as JSON"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <label className="cursor-pointer group">
              <input
                type="file"
                accept=".json"
                className="sr-only"
                onChange={handleImport}
                aria-label="Import funnel from JSON"
              />
              <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-300 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 group-focus-within:ring-2 group-focus-within:ring-blue-500 outline-none">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </div>
            </label>

            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Save all changes"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <TemplatesSidebar onDragStart={handleDragStart} />

        <div className="flex-1 relative bg-gray-100">
          <FunnelCanvas
            funnelId={funnelId}
            initialNodes={validatedNodes}
            initialEdges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onDrop={onDrop}
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
