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
    id: 'sales-page',
    type: 'product',
    label: 'Sales Page',
    icon: <Package className="w-5 h-5" />,
    description: 'Initial landing page for your offer',
    defaultData: { productName: 'Sales Page', price: 0, type: 'sales' },
    preview: 'bg-blue-100 text-blue-900',
  },
  {
    id: 'order-page',
    type: 'product',
    label: 'Order Page',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Checkout page for customers',
    defaultData: { productName: 'Checkout', price: 99, type: 'order' },
    preview: 'bg-green-100 text-green-900',
  },
  {
    id: 'upsell',
    type: 'upsell',
    label: 'Upsell',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Offer a higher-tier product',
    defaultData: { upsellName: 'Premium Add-on', discount: 15, type: 'upsell' },
    preview: 'bg-orange-100 text-orange-900',
  },
  {
    id: 'downsell',
    type: 'upsell',
    label: 'Downsell',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Lower-priced alternative offer',
    defaultData: { upsellName: 'Basic Pack', discount: 10, type: 'downsell' },
    preview: 'bg-yellow-100 text-yellow-900',
  },
  {
    id: 'thank-you',
    type: 'end',
    label: 'Thank You',
    icon: <Flag className="w-5 h-5" />,
    description: 'Final page of the funnel',
    defaultData: { label: 'Thank You Page' },
    preview: 'bg-purple-100 text-purple-900',
  },
];

interface TemplatesSidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, label: string, defaultData: Record<string, unknown>) => void;
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
            tabIndex={0}
            role="button"
            aria-label={`Drag ${template.label} to canvas to add`}
            onDragStart={(e) => onDragStart(e, template.type, template.label, template.defaultData)}
            className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="text-gray-700 group-hover:text-blue-600 transition-colors">{template.icon}</div>
              <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">{template.label}</h3>
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
