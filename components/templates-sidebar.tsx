'use client';

import React from 'react';
import { Package, TrendingUp, GitBranch, Flag } from 'lucide-react';

interface NodeTemplate {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  defaultData: Record<string, unknown>;
  preview: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    id: 'product-1',
    type: 'product',
    label: 'Product',
    icon: <Package className="w-5 h-5" />,
    description: 'Base product offering',
    defaultData: { productName: 'New Product', price: 99 },
    preview: 'bg-blue-100 text-blue-900',
  },
  {
    id: 'upsell-1',
    type: 'upsell',
    label: 'Upsell',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Premium upsell option',
    defaultData: { upsellName: 'Premium Add-on', discount: 15 },
    preview: 'bg-orange-100 text-orange-900',
  },
  {
    id: 'conditional-1',
    type: 'conditional',
    label: 'Conditional',
    icon: <GitBranch className="w-5 h-5" />,
    description: 'Split funnel logic',
    defaultData: { condition: 'Check condition' },
    preview: 'bg-purple-100 text-purple-900',
  },
  {
    id: 'end-1',
    type: 'end',
    label: 'End Node',
    icon: <Flag className="w-5 h-5" />,
    description: 'Funnel endpoint',
    defaultData: {},
    preview: 'bg-gray-100 text-gray-900',
  },
];

interface TemplatesSidebarProps {
  onDragStart: (nodeType: string, defaultData: Record<string, unknown>) => void;
}

export function TemplatesSidebar({ onDragStart }: TemplatesSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Node Templates</h2>

      <div className="space-y-3">
        {nodeTemplates.map((template) => (
          <div
            key={template.id}
            draggable
            onDragStart={() => onDragStart(template.type, template.defaultData)}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-700">{template.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900">{template.label}</h3>
            </div>

            <div className={`p-2 rounded mb-2 ${template.preview} text-xs font-medium text-center`}>
              Preview
            </div>

            <p className="text-xs text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-900">
          💡 Drag templates onto the canvas to add nodes to your funnel.
        </p>
      </div>
    </div>
  );
}
