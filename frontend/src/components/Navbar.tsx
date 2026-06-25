'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Beaker, Search, Sparkles, User, LogOut } from 'lucide-react';
import { api } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.success) {
          setUser(res.data);
        }
      } catch (e) {
        // Not logged in
      } finally {
        setIsAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    router.push('/login');
    router.refresh();
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-indigo-700 hover:opacity-80 transition">
          <Beaker className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">LabVerse <span className="text-gray-900">AI</span></span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <Link href="/labs" className="hover:text-indigo-600 transition">Labs</Link>
          <Link href="/projects" className="hover:text-indigo-600 transition">Projects</Link>
          <Link href="/insights" className="hover:text-indigo-600 transition">Insights</Link>
          <Link href="/ai-guide" className="hover:text-indigo-600 transition flex items-center gap-1"><Sparkles className="w-3 h-3"/> AI Guide</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition">
            <Search className="w-5 h-5" />
          </button>
          
          {!isAuthLoading && !user && (
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-sm">
              Sign In
            </Link>
          )}

          {!isAuthLoading && user && (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                <User className="w-4 h-4" /> {user.firstName || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
