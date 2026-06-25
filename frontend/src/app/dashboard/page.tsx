'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Loader2, LayoutDashboard, Calendar, Users, FlaskConical, Library, LineChart, LogOut, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const userRes = await api.getCurrentUser();
        if (userRes.success && userRes.data) {
          if (isMounted) setUser(userRes.data);
          
          if (userRes.data.role === 'FACULTY_ADMIN') {
             // Load admin data
             const [bookingsRes, analyticsRes] = await Promise.all([
               api.getAdminBookings(statusFilter ? `status=${statusFilter}` : ''),
               api.getAdminAnalyticsSummary()
             ]);
             if (bookingsRes.success && isMounted) setBookings(bookingsRes.data);
             if (analyticsRes.success && isMounted) setAnalytics(analyticsRes.data);
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [router, statusFilter]);

  const handleLogout = async () => {
    await api.logout();
    router.push('/login');
    router.refresh();
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await api.updateBookingStatus(id, newStatus);
      if (res.success) {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        // Refresh analytics
        const aRes = await api.getAdminAnalyticsSummary();
        if (aRes.success) setAnalytics(aRes.data);
      }
    } catch (e) {
      console.error(e);
    }
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

  // Admin View
  if (user.role === 'FACULTY_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                {getDashboardTitle()}
              </h1>
              <p className="text-gray-500 mt-1">Manage bookings and monitor lab engagement.</p>
            </div>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>

          {/* Analytics Overview Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-indigo-600" /> Analytics Overview
              </h2>
              <Link href="/insights" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                View Public Insights <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                 <p className="text-3xl font-bold text-amber-600 mt-2">{analytics?.metrics?.pendingBookings || 0}</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500">Approved Bookings</p>
                 <p className="text-3xl font-bold text-emerald-600 mt-2">{analytics?.metrics?.approvedBookings || 0}</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500">Total Events</p>
                 <p className="text-3xl font-bold text-indigo-600 mt-2">{analytics?.metrics?.totalEvents || 0}</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500">Lab Views</p>
                 <p className="text-3xl font-bold text-blue-600 mt-2">{analytics?.metrics?.labViews || 0}</p>
               </div>
            </div>
          </div>

          {/* Booking Requests Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Booking Requests
              </h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Filter:</label>
                <select 
                  className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab & Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No booking requests found.</td>
                    </tr>
                  ) : bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.requesterName}</div>
                        <div className="text-sm text-gray-500">{booking.requesterEmail}</div>
                        {booking.organizationName && <div className="text-xs text-gray-400 mt-1">{booking.organizationName}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{booking.lab?.name || 'General Tour'}</div>
                        <div className="text-xs text-gray-500 mt-1">{booking.requestType.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">{booking.preferredTimeSlot || 'Any Time'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          booking.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status === 'PENDING' && <Clock className="w-3 h-3" />}
                          {booking.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                          {booking.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {booking.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'APPROVED')} className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition">Approve</button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'REJECTED')} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition">Reject</button>
                          </div>
                        )}
                        {booking.status === 'APPROVED' && (
                           <button onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')} className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition">Mark Completed</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student / Industry Partner Placeholder View
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              {getDashboardTitle()}
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {user.firstName || user.email}</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition shadow-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
           <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <FlaskConical className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Features Coming Soon</h2>
           <p className="text-gray-500 max-w-md mx-auto mb-6">
             We are currently building dedicated tools for your role. Soon you'll be able to manage your saved labs, review recommended projects, and track your collaborations.
           </p>
           <Link href="/labs" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
             Explore Labs Directory
           </Link>
        </div>
      </div>
    </div>
  );
}
