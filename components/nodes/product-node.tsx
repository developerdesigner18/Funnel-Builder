'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

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
      className={`px-4 py-3 rounded-lg border-2 bg-white shadow-md min-w-[200px] cursor-pointer transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
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
