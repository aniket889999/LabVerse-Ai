import { api } from '@/lib/api';
import BookingForm from './BookingForm';
import ErrorState from '@/components/ErrorState';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default async function BookVisitPage() {
  const { success, data: labs, error } = await api.getLabs();

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <AnalyticsTracker eventType="PAGE_VIEW" />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Partner with LabVerse AI</h1>
          <p className="text-xl text-gray-600">
            Request a physical lab visit, an online guided demo, or propose an industry partnership.
          </p>
        </div>

        {/* Partnership Positioning */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
             <h3 className="font-bold text-indigo-700 mb-2">For Students</h3>
             <p className="text-sm text-gray-600">Explore lab facilities, understand equipment and projects, or request an online demo.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
             <h3 className="font-bold text-indigo-700 mb-2">For Recruiters</h3>
             <p className="text-sm text-gray-600">Discover student projects, evaluate skill outcomes, and request talent showcases.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
             <h3 className="font-bold text-indigo-700 mb-2">For Industry</h3>
             <p className="text-sm text-gray-600">Discuss research collaboration, request lab capability demos, and propose problem statements.</p>
          </div>
        </div>

        {!success ? (
          <ErrorState message={error!} />
        ) : (
          <BookingForm labs={labs || []} />
        )}
      </div>
    </div>
  );
}
