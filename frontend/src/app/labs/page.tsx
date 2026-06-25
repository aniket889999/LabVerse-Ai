import Link from 'next/link';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import { Factory, MapPin, Users } from 'lucide-react';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default async function LabsPage() {
  const { success, data: labs, error } = await api.getLabs();

  if (!success) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Laboratory Directory</h1>
        <ErrorState message={error!} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnalyticsTracker eventType="LAB_VIEW" />
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Laboratory Directory</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore our specialized facilities designed to simulate real-world supply chain and logistics environments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {labs?.map((lab) => (
          <Link href={`/labs/${lab.id}`} key={lab.id} className="group flex flex-col sm:flex-row bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
            <div className="sm:w-2/5 bg-gray-100 relative min-h-[200px] flex items-center justify-center p-8 border-b sm:border-b-0 sm:border-r border-gray-100">
              <Factory className="w-16 h-16 text-indigo-200 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-500" />
            </div>
            <div className="sm:w-3/5 p-8 flex flex-col">
              <div className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2">{lab.labType.replace(/_/g, ' ')}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">{lab.name}</h2>
              <p className="text-gray-600 mb-6 line-clamp-3">{lab.description}</p>
              
              <div className="mt-auto flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {lab.location || 'TBD'}</div>
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Capacity: {lab.capacity}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
