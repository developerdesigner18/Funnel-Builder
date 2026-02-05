import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BarChart3, Layers } from 'lucide-react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">FunnelBuilder</div>
          <Link href="/funnels">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Build Powerful Upsell Funnels Visually
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Design, visualize, and optimize your sales funnels with an intuitive
            drag-and-drop interface. No coding required.
          </p>
          <Link href="/funnels">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
              Start Building <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <Zap className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drag & Drop Builder
            </h3>
            <p className="text-gray-600">
              Easily create and arrange funnel nodes without any technical knowledge.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <BarChart3 className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real-time Visualization
            </h3>
            <p className="text-gray-600">
              See your funnel structure instantly as you build and make adjustments on the fly.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <Layers className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multiple Node Types
            </h3>
            <p className="text-gray-600">
              Products, upsells, conditions, and end nodes to build complex funnels.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your sales?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Create your first funnel now and start converting more customers.
          </p>
          <Link href="/funnels">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Launch Funnel Builder
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
