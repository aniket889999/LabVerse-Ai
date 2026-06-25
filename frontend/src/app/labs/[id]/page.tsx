import Link from 'next/link';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import { MapPin, Users, Settings, FolderKanban, Map as MapIcon, ArrowLeft, Sparkles } from 'lucide-react';
import LabExperience from '@/components/labs/LabExperience';
import { labMapConfigs } from '@/config/lab-map.config';
import { getLabVisuals } from '@/lib/visuals';

export default async function LabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { success, data: lab, error } = await api.getLabById(id);

  if (!success || !lab) {
    return (
      <div className="container mx-auto px-4 py-24">
        <ErrorState message={error || 'Lab not found.'} />
      </div>
    );
  }

  const visuals = getLabVisuals(lab.name);
  const Icon = visuals.Icon;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className={`relative ${visuals.gradient} text-white pt-24 pb-16 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay pointer-events-none"></div>
        <Icon className="absolute -right-20 -bottom-20 w-96 h-96 text-white opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/labs" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Labs
          </Link>
          <div className="text-sm font-bold text-indigo-300 tracking-wider uppercase mb-4">{lab.labType.replace(/_/g, ' ')}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl">{lab.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-indigo-100">
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {lab.location || 'Location TBD'}</div>
            <div className="flex items-center gap-2"><Users className="w-5 h-5" /> Capacity: {lab.capacity}</div>
            {lab.facultyAdmin && (
              <div className="flex items-center gap-2 bg-indigo-800/50 px-3 py-1 rounded-full text-sm">
                Admin: {lab.facultyAdmin.firstName} {lab.facultyAdmin.lastName}
              </div>
            )}
            <Link href={`/ai-guide?labId=${lab.id}`} className="ml-auto inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> Ask AI about this lab
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{lab.description}</p>
          </section>

          {/* Interactive Map & Guided Tour */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapIcon className="w-6 h-6 text-indigo-600" /> Interactive Facility Map
            </h2>
            {labMapConfigs[lab.labType] ? (
              <LabExperience config={labMapConfigs[lab.labType]} />
            ) : (
              <div className="w-full p-8 bg-gray-50 rounded-3xl border border-gray-200 text-center text-gray-500">
                Map configuration not available for this lab type.
              </div>
            )}
          </section>

          {/* Equipment */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-indigo-600" /> Equipment & Resources
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lab.equipment?.map((eq) => (
                <Link href={`/equipment/${eq.id}`} key={eq.id} className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition mb-1">{eq.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{eq.description}</p>
                </Link>
              ))}
              {(!lab.equipment || lab.equipment.length === 0) && (
                <p className="text-gray-500 italic">No equipment listed yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-600" /> Featured Projects
            </h2>
            <div className="space-y-6">
              {lab.projects?.map((proj) => (
                <Link href={`/projects/${proj.id}`} key={proj.id} className="block group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition mb-1">{proj.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{proj.description}</p>
                </Link>
              ))}
              {(!lab.projects || lab.projects.length === 0) && (
                <p className="text-gray-500 text-sm">No projects published yet.</p>
              )}
            </div>
            <Link href={`/projects?labId=${lab.id}`} className="mt-6 block w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-indigo-600 font-medium rounded-xl transition">
              View all lab projects
            </Link>
          </div>
          
          <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 text-center">
             <h3 className="font-bold text-indigo-900 mb-2">Want to see it in person?</h3>
             <p className="text-sm text-indigo-700 mb-6">Schedule a guided tour or request lab access for your research.</p>
             <Link href={`/book-visit?labId=${lab.id}`} className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md">
               Book Visit
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
