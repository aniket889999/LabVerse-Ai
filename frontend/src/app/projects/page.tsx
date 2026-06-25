import Link from 'next/link';
import { Suspense } from 'react';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import { FileText, ArrowRight } from 'lucide-react';
import ProjectSearch from './ProjectSearch';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ search?: string, labId?: string }> }) {
  const resolvedParams = await searchParams;
  const [{ success, data: projects, error }, { data: labs }] = await Promise.all([
    api.getProjects(resolvedParams),
    api.getLabs()
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      <AnalyticsTracker eventType="PROJECT_VIEW" />
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Repository</h1>
        <p className="text-xl text-gray-600 max-w-3xl mb-8">
          Browse innovative research, case studies, and practical implementations built within our labs.
        </p>

        <Suspense fallback={<div className="h-12 w-full max-w-2xl bg-gray-100 animate-pulse rounded-xl"></div>}>
          <ProjectSearch labs={labs || []} />
        </Suspense>
      </div>

      {!success ? (
        <ErrorState message={error!} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((proj) => (
            <Link href={`/projects/${proj.id}`} key={proj.id} className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all h-full">
              <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                 {proj.media?.[0] ? (
                   <img src={proj.media[0].url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <FileText className="w-12 h-12 text-gray-300" />
                 )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs font-semibold text-indigo-600 mb-2 truncate">{proj.lab?.name || 'Cross-Lab Project'}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{proj.title}</h2>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{proj.description}</p>
                <div className="flex items-center justify-between mt-auto text-sm font-medium text-gray-900">
                  <span>Read case study</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          {projects?.length === 0 && (
             <div className="col-span-full text-center py-12 text-gray-500">No projects found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
}
