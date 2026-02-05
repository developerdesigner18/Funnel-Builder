'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const EndNode = React.memo(({ data, selected, id }: NodeProps) => {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('nodeSelected', {
        detail: { nodeId: id, nodeType: 'end', nodeData: data },
      })
    );
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${data.label} node, End Node, ${selected ? 'selected' : ''}`}
      className={`px-4 py-3 rounded-lg border-2 bg-gray-100 shadow-md min-w-[200px] cursor-pointer transition-all relative outline-none focus-visible:ring-4 focus-visible:ring-gray-400 ${selected ? 'border-gray-500 ring-2 ring-gray-300' : 'border-gray-400 hover:border-gray-500'
        } ${data.warning ? 'border-orange-400' : ''}`}
    >
      {data.warning && (
        <div className="absolute -top-3 -right-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-orange-100 text-orange-600 rounded-full p-1 shadow-sm border border-orange-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{data.warning}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      <Handle type="target" position={Position.Top} />
      <div className="space-y-1">
        <div className="text-sm font-bold text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-600">End Node</div>
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';
