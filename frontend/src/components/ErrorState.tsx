import { AlertTriangle, Database } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 border border-red-100 bg-red-50/50 rounded-2xl flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 text-left w-full text-sm font-mono text-gray-700">
        <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Database className="w-4 h-4" /> Developer Note:
        </p>
        <p>This UI is designed API-first. To resolve this error:</p>
        <ol className="list-decimal ml-5 mt-2 space-y-1 text-gray-600">
          <li>Ensure Docker is running on your host machine.</li>
          <li>Run <code className="bg-gray-100 px-1 py-0.5 rounded">docker-compose up -d</code> in the backend directory.</li>
          <li>Run <code className="bg-gray-100 px-1 py-0.5 rounded">npx prisma migrate dev</code>.</li>
          <li>Run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run prisma:seed</code> to inject mock data.</li>
          <li>Start the Express server on port 5000.</li>
        </ol>
      </div>
    </div>
  );
}
