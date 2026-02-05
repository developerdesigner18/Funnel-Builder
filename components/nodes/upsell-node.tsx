'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export function UpsellNode({ data, selected, id }: NodeProps) {
  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent('nodeSelected', {
        detail: { nodeId: id, nodeType: 'upsell', nodeData: data },
      })
    );
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md min-w-[200px] cursor-pointer transition-all ${
        selected ? 'border-orange-500 ring-2 ring-orange-300' : 'border-orange-300 hover:border-orange-400'
      }`}
    >
      <Handle type="target" position={Position.Top} />
      <div className="space-y-1">
        <div className="text-sm font-bold text-gray-900">{data.label}</div>
        <div className="text-xs text-gray-600">{data.upsellName || 'Upsell'}</div>
        {data.discount && (
          <div className="text-xs font-semibold text-orange-600">{data.discount}% off</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
