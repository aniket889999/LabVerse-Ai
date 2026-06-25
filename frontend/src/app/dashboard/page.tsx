'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Loader2, LayoutDashboard, Calendar, Users, FlaskConical, Library, LineChart, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.success && res.data) {
          if (isMounted) setUser(res.data);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();
    return () => { isMounted = false; };
  }, [router]);

  const handleLogout = async () => {
    await api.logout();
    router.push('/login');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'FACULTY_ADMIN': return 'Faculty Admin Dashboard';
      case 'STUDENT': return 'Student Dashboard';
      case 'INDUSTRY_PARTNER': return 'Industry Partner Dashboard';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              {getDashboardTitle()}
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.firstName || user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
           <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Your Profile</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Name</p>
                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Role</p>
                <span className="inline-flex mt-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
           </div>
        </div>

        {/* Placeholder Modules Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard icon={<Calendar />} title="Booking Requests" desc="Manage lab visit and demo requests." active={user.role === 'FACULTY_ADMIN'} />
          <ModuleCard icon={<FlaskConical />} title="Lab Management" desc="Update equipment and capacities." active={user.role === 'FACULTY_ADMIN'} />
          <ModuleCard icon={<Library />} title="Project Repository" desc="Submit and review student projects." active={true} />
          <ModuleCard icon={<LineChart />} title="Analytics Dashboard" desc="View visitor engagement metrics." active={user.role === 'FACULTY_ADMIN'} />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ icon, title, desc, active }: { icon: React.ReactNode, title: string, desc: string, active: boolean }) {
  return (
    <div className={`p-6 rounded-2xl border ${active ? 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition' : 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
      {!active && <span className="inline-block mt-3 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Restricted Access</span>}
    </div>
  );
}
