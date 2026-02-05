'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

export function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Ctrl+Z', description: 'Undo' },
    { key: 'Ctrl+Y', description: 'Redo' },
    { key: 'Ctrl+S', description: 'Save funnel' },
    { key: 'Delete', description: 'Delete selected node' },
    { key: 'Ctrl+D', description: 'Duplicate selected node' },
    { key: '?', description: 'Show this help' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        title="Keyboard shortcuts"
        className="text-gray-600 hover:text-gray-900"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-gray-700">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
