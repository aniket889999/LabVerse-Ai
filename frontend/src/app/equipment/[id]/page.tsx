import Link from 'next/link';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { ArrowLeft, Cpu, ShieldCheck, Settings, Sparkles } from 'lucide-react';

export default async function EquipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { success, data: equipment, error } = await api.getEquipmentById(id);

  if (!success || !equipment) {
    return (
      <div className="container mx-auto px-4 py-24">
        <ErrorState message={error || 'Equipment not found.'} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <AnalyticsTracker eventType="EQUIPMENT_CLICK" equipmentId={equipment.id} />
      {/* Header */}
      <div className="bg-slate-900 text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          {equipment.lab && (
            <Link href={`/labs/${equipment.lab.id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition">
              <ArrowLeft className="w-4 h-4" /> Back to {equipment.lab.name}
            </Link>
          )}
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">{equipment.name}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${equipment.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              Status: {equipment.status}
            </span>
            <Link href={`/ai-guide?equipmentId=${equipment.id}`} className="ml-auto inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Ask AI about this equipment
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" /> Technical Details
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">{equipment.description}</p>
          </section>

          <section>
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" /> Usage Guidelines
            </h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700">
              <p className="mb-2">This equipment is strictly for academic and approved research purposes.</p>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                <li>Safety training is required prior to operation.</li>
                <li>Equipment must be reserved at least 24 hours in advance via the Booking system.</li>
                <li>Report any malfunctions immediately to the Lab Faculty Admin.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
