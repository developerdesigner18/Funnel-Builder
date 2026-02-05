'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export function EndNode({ data, selected, id }: NodeProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('nodeSelected', {
        detail: { nodeId: id, nodeType: 'end', nodeData: data },
      })
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 rounded-lg border-2 bg-gray-100 shadow-md min-w-[200px] cursor-pointer transition-all ${
        selected ? 'border-gray-500 ring-2 ring-gray-300' : 'border-gray-400 hover:border-gray-500'
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="space-y-1">
        <div className="text-sm font-bold text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-600">End Node</div>
      </div>
    </div>
  );
}
