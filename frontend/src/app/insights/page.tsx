import { api } from '@/lib/api';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { BarChart3, Users, MousePointerClick, CalendarCheck, Factory, FileText } from 'lucide-react';

export default async function InsightsPage() {
  const { success, data } = await api.getAnalyticsSummary();

  // Gracefully fallback to polished placeholder data if backend/DB is not available
  const stats = success && data ? data : {
    totalEvents: 4521,
    pageViews: 3102,
    labViews: 843,
    projectViews: 512,
    equipmentClicks: 219,
    bookingSubmissions: 45
  };

  const isPlaceholder = !success || !data;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <AnalyticsTracker eventType="PAGE_VIEW" metadata={{ page: 'insights' }} />
      <div className="container mx-auto px-4">
        
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4" /> Platform Insights
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Engagement Analytics</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Track how students, recruiters, and industry partners interact with the LabVerse AI ecosystem.
            {isPlaceholder && <span className="block mt-2 text-amber-600 text-sm bg-amber-50 inline-block px-3 py-1 rounded-md border border-amber-200">Demo Mode: Displaying sample data because backend database is unavailable.</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pageViews.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><Factory className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Lab Explorations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.labViews.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Projects Viewed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.projectViews.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center"><MousePointerClick className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Equipment Interactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.equipmentClicks.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center"><CalendarCheck className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Booking Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bookingSubmissions.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart3 className="w-24 h-24 text-white" /></div>
             <p className="text-indigo-200 text-sm font-medium relative z-10">Total Platform Events</p>
             <p className="text-4xl font-bold text-white relative z-10">{stats.totalEvents.toLocaleString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
