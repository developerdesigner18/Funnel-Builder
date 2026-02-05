'use client';

import { useCallback, useState } from 'react';
import { Node, Edge } from 'reactflow';

interface History {
  nodes: Node[];
  edges: Edge[];
}

export function useUndoRedo() {
  const [history, setHistory] = useState<History[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const pushHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback((): History | null => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback((): History | null => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      return history[newIndex];
    }
    return null;
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
