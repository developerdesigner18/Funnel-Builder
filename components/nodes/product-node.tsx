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

export function ProductNode({ data, selected, id }: NodeProps) {
  const handleClick = () => {
    // Emit custom event for node selection
    window.dispatchEvent(
      new CustomEvent('nodeSelected', {
        detail: { nodeId: id, nodeType: 'product', nodeData: data },
      })
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[200px] cursor-pointer transition-all relative ${selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'
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
        <div className="text-xs text-gray-600">{data.productName || 'Product'}</div>
        {data.price && (
          <div className="text-xs font-semibold text-green-600">${data.price}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
