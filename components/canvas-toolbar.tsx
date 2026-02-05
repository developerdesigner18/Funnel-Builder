'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2, Redo2, Save, Trash2, Copy } from 'lucide-react';

interface CanvasToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export function CanvasToolbar({
  onUndo,
  onRedo,
  onSave,
  onDelete,
  onDuplicate,
  canUndo,
  canRedo,
  hasSelection,
}: CanvasToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDuplicate}
          disabled={!hasSelection}
          title="Duplicate (Ctrl+D)"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={!hasSelection}
          title="Delete (Del)"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      <Button
        size="sm"
        onClick={onSave}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
