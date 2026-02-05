'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NodeData {
  [key: string]: unknown;
}

interface PropertiesEditorProps {
  nodeId: string | null;
  nodeType: string | null;
  nodeData: NodeData;
  onUpdate: (updates: NodeData) => void;
  onClose: () => void;
}

export function PropertiesEditor({
  nodeId,
  nodeType,
  nodeData,
  onUpdate,
  onClose,
}: PropertiesEditorProps) {
  const [formData, setFormData] = useState<NodeData>(nodeData);

  useEffect(() => {
    setFormData(nodeData);
  }, [nodeData]);

  if (!nodeId) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-gray-500">
        <p className="text-sm">Select a node to edit properties</p>
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    const updated = { ...formData, [key]: value };
    setFormData(updated);
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  const renderFields = () => {
    switch (nodeType) {
      case 'product':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <Input
                value={formData.productName as string}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <Input
                type="number"
                value={formData.price as number}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                placeholder="Enter price"
              />
            </div>
          </>
        );
      case 'upsell':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upsell Name
              </label>
              <Input
                value={formData.upsellName as string}
                onChange={(e) => handleChange('upsellName', e.target.value)}
                placeholder="Enter upsell name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <Input
                type="number"
                value={formData.discount as number}
                onChange={(e) => handleChange('discount', parseInt(e.target.value))}
                placeholder="Enter discount percentage"
              />
            </div>
          </>
        );
      case 'conditional':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <textarea
              value={formData.condition as string}
              onChange={(e) => handleChange('condition', e.target.value)}
              placeholder="Describe the condition"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <aside
      className="w-80 bg-white border-l border-gray-200 p-4 flex flex-col h-full shadow-lg z-20"
      role="complementary"
      aria-labelledby="properties-editor-title"
    >
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
        <h3 id="properties-editor-title" className="font-bold text-gray-900">Properties</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close properties editor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Node Label
          </label>
          <Input
            value={formData.label as string}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Enter node label"
            className="focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </div>

        {renderFields()}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-4">
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm font-semibold h-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Save changes to node"
        >
          Update Properties
        </Button>
      </div>
    </aside>
  );
}
