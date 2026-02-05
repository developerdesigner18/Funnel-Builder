'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit3, Calendar } from 'lucide-react';

interface Funnel {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export default function FunnelsPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFunnelName, setNewFunnelName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchFunnels();
  }, []);

  const fetchFunnels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/funnels');
      if (!response.ok) throw new Error('Failed to fetch funnels');
      const data = await response.json();
      setFunnels(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFunnel = async () => {
    if (!newFunnelName.trim()) return;

    try {
      setCreating(true);
      const response = await fetch('/api/funnels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFunnelName,
          description: 'New upsell funnel',
        }),
      });

      if (!response.ok) throw new Error('Failed to create funnel');
      const newFunnel = await response.json();
      setFunnels([newFunnel, ...funnels]);
      setNewFunnelName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create funnel');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFunnel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this funnel?')) return;

    try {
      const response = await fetch(`/api/funnels/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete funnel');
      setFunnels(funnels.filter((f) => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete funnel');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Funnels</h1>
              <p className="text-gray-600 mt-1">
                Create and manage your upsell funnels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create New Funnel */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newFunnelName}
              onChange={(e) => setNewFunnelName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFunnel();
              }}
              placeholder="Enter funnel name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleCreateFunnel}
              disabled={!newFunnelName.trim() || creating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {creating ? 'Creating...' : 'Create Funnel'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Loading funnels...</p>
          </div>
        ) : funnels.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">No funnels yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funnels.map((funnel) => (
              <div
                key={funnel.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {funnel.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {funnel.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  {formatDate(funnel.created_at)}
                </div>

                <div className="flex gap-2">
                  <Link href={`/funnels/${funnel.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFunnel(funnel.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
