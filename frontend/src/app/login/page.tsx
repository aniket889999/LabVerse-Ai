'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, AlertCircle, User, Briefcase, GraduationCap, Building2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const handleDemoLogin = async (role: 'admin' | 'student' | 'partner') => {
    setIsLoading(true);
    setErrorMsg('');
    setActiveRole(role);

    const credentials = {
      admin: { email: 'admin@labverse.ai', password: 'Admin@12345' },
      student: { email: 'student@labverse.ai', password: 'Student@12345' },
      partner: { email: 'partner@labverse.ai', password: 'Partner@12345' }
    }[role];

    try {
      const res = await api.login(credentials);
      if (res.success) {
        trackEvent({ eventType: 'PAGE_VIEW', metadata: { page: 'login', status: 'success', role } });
        window.dispatchEvent(new Event('auth-change'));
        router.push('/dashboard');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
      setActiveRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Select Your Role
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Welcome to the LabVerse AI ecosystem. Please select your designated role to access your personalized dashboard and tools.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Faculty Admin Card (Highlighted) */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-500 overflow-hidden flex flex-col relative transform transition hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Primary Demo
            </div>
            <div className="p-8 flex-1">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Faculty Admin</h3>
              <p className="text-sm text-gray-500 mb-6">
                Manage lab ecosystems, review booking requests, and analyze engagement metrics.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Manage booking requests</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> View engagement analytics</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Admin Dashboard access</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto">
              <button
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition disabled:opacity-50"
              >
                {isLoading && activeRole === 'admin' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Use Demo Admin Account'}
              </button>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition hover:shadow-md">
            <div className="p-8 flex-1">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
              <p className="text-sm text-gray-500 mb-6">
                Explore labs, track your learning journey, and save recommended projects.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Explore saved labs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> View recommended projects</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Track learning journey</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto">
              <button
                onClick={() => handleDemoLogin('student')}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition disabled:opacity-50"
              >
                {isLoading && activeRole === 'student' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Use Demo Student Account'}
              </button>
            </div>
          </div>

          {/* Industry Partner Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition hover:shadow-md">
            <div className="p-8 flex-1">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Partner</h3>
              <p className="text-sm text-gray-500 mb-6">
                Discover lab capabilities, sponsor student projects, and request collaborations.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Discover projects</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Request collaboration</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Explore lab capabilities</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-gray-100 mt-auto">
              <button
                onClick={() => handleDemoLogin('partner')}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition disabled:opacity-50"
              >
                {isLoading && activeRole === 'partner' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Use Demo Partner Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
