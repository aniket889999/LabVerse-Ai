import Link from 'next/link';
import { api } from '@/lib/api';
import ErrorState from '@/components/ErrorState';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { ArrowLeft, User, Factory, FileCode2, ExternalLink, Sparkles } from 'lucide-react';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { success, data: project, error } = await api.getProjectById(id);

  if (!success || !project) {
    return (
      <div className="container mx-auto px-4 py-24">
        <ErrorState message={error || 'Project not found.'} />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <AnalyticsTracker eventType="PROJECT_VIEW" projectId={project.id} />
      {/* Header */}
      <div className="bg-gray-900 text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link href="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Repository
          </Link>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">Research Project</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl leading-tight">{project.title}</h1>
          <div className="flex flex-wrap items-center gap-8 text-gray-300 border-t border-gray-800 pt-8 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Author / Mentor</p>
                <p className="font-medium text-white">{project.author?.firstName} {project.author?.lastName}</p>
              </div>
            </div>
            {project.lab && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"><Factory className="w-5 h-5 text-gray-400" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Associated Lab</p>
                  <Link href={`/labs/${project.lab.id}`} className="font-medium text-indigo-400 hover:text-indigo-300 transition">{project.lab.name}</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {project.media && project.media.length > 0 && (
            <div className="w-full h-[400px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
               <img src={project.media[0].url} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileCode2 className="w-6 h-6 text-indigo-600" /> Project Description
            </h2>
            <div className="prose prose-lg text-gray-700 max-w-none">
              <p>{project.description}</p>
              <p className="mt-4 text-gray-500 italic">This is an abstract of the project. Full whitepaper and technical documentation are available upon request or via the repository link.</p>
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resources</h3>
            <a href={project.repoLink || '#'} className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition font-medium ${project.repoLink ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100' : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
               <ExternalLink className="w-4 h-4" /> 
               {project.repoLink ? 'View Repository' : 'Repository Private'}
            </a>
           </div>

           <div className="bg-gray-50 rounded-3xl border border-gray-200 p-8">
             <h3 className="text-lg font-bold text-gray-900 mb-4">Tech Stack Highlights</h3>
             <div className="flex flex-wrap gap-2">
               {['Python', 'IoT Sensors', 'Docker', 'PostgreSQL', 'Machine Learning'].map(tag => (
                 <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 font-medium">
                   {tag}
                 </span>
               ))}
             </div>
            <Link href={`/ai-guide?projectId=${project.id}`} className="ml-auto inline-flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-full text-sm font-semibold transition mt-4 md:mt-0">
              <Sparkles className="w-4 h-4" /> Ask AI about this project
            </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
