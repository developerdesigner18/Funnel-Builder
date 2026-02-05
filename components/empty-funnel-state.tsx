'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyFunnelState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Inbox className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Your funnel is empty</h3>
      <p className="text-gray-500 max-w-sm">
        Drag node templates from the sidebar onto the canvas to start building your upsell funnel.
      </p>
    </div>
  );
}
