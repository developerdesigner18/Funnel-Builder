'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export function ConditionalNode({ data, selected, id }: NodeProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('nodeSelected', {
        detail: { nodeId: id, nodeType: 'conditional', nodeData: data },
      })
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md min-w-[200px] cursor-pointer transition-all ${
        selected ? 'border-purple-500 ring-2 ring-purple-300' : 'border-purple-300 hover:border-purple-400'
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="space-y-1">
        <div className="text-sm font-bold text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-600">{data.condition || 'Condition'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="true" />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%' }} />
    </div>
  );
}
