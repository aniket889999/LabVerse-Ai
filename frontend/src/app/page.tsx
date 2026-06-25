import Link from 'next/link';
import { ArrowRight, Microscope, Boxes, Link2, Factory, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default async function Home() {
  const { success, data: labs, error } = await api.getLabs();

  return (
    <div className="w-full">
      <AnalyticsTracker eventType="PAGE_VIEW" />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-gray-50 pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl">
            An AI-ready Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Laboratory Experience</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            Connecting universities, students, and industry partners through an immersive, data-driven lab ecosystem. Explore projects, book visits, and discover innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/labs" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
              Explore Labs <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/book-visit" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg transition flex items-center justify-center">
              Book a Visit
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link href="/ai-guide" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-8 py-3 rounded-full font-semibold transition flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> Ask AI Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Lab Overview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">State-of-the-Art Facilities</h2>
              <p className="text-gray-600 text-lg">Discover our specialized laboratories equipped with industry-standard technology for hands-on learning and research.</p>
            </div>
            <Link href="/labs" className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center gap-2 group">
              View all labs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {!success ? (
            <ErrorState message={error!} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {labs?.slice(0, 3).map((lab) => (
                <div key={lab.id} className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {lab.labType === 'WAREHOUSE_INVENTORY' ? <Boxes className="w-7 h-7" /> : 
                     lab.labType === 'SMART_SUPPLY_CHAIN' ? <Link2 className="w-7 h-7" /> : 
                     <Factory className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{lab.name}</h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{lab.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Microscope className="w-4 h-4" /> {lab._count?.equipment || 0} Equip.
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Boxes className="w-4 h-4" /> {lab._count?.projects || 0} Proj.
                    </div>
                  </div>

                  <Link href={`/labs/${lab.id}`} className="w-full py-3 rounded-xl border border-gray-200 text-center font-semibold text-gray-900 hover:bg-gray-50 transition mt-auto">
                    Lab Details
                  </Link>
                </div>
              ))}
              {labs?.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-500">No labs available yet.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
