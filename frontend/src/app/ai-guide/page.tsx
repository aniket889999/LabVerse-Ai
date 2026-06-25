import AiGuideInterface from './AiGuideInterface';

export default function AiGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LabVerse AI Guide</h1>
          <p className="text-gray-600">Ask questions about labs, equipment, student projects, and industry use cases.</p>
        </div>
        
        <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <AiGuideInterface />
        </div>
      </div>
    </div>
  );
}
