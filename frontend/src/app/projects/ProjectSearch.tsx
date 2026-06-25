'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lab } from '@/types';
import { trackEvent } from '@/lib/analytics';

export default function ProjectSearch({ labs }: { labs: Lab[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSearch = searchParams.get('search') || '';
  const initialLabId = searchParams.get('labId') || '';

  const [search, setSearch] = useState(initialSearch);
  const [labId, setLabId] = useState(initialLabId);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Sync state with URL if URL changes externally
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setLabId(searchParams.get('labId') || '');
  }, [searchParams]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Trigger search when debounced value or lab changes (but avoid initial render loop)
  useEffect(() => {
    if (debouncedSearch === initialSearch && labId === initialLabId) return;

    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (labId) params.append('labId', labId);
    
    router.push(`/projects?${params.toString()}`);
  }, [debouncedSearch, labId, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (labId) params.append('labId', labId);
    
    trackEvent({
      eventType: 'PAGE_VIEW',
      metadata: { action: 'project_search', search, labId }
    });

    router.push(`/projects?${params.toString()}`);
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLabId = e.target.value;
    setLabId(newLabId);
    
    trackEvent({
      eventType: 'PAGE_VIEW',
      metadata: { action: 'project_filter_lab', search: debouncedSearch, labId: newLabId }
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-3xl">
      <input 
        type="text" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects by title, tech stack..." 
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      />
      <select 
        value={labId}
        onChange={handleLabChange}
        className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
      >
        <option value="">All Labs</option>
        {labs.map(lab => (
          <option key={lab.id} value={lab.id}>{lab.name}</option>
        ))}
      </select>
      <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition shadow-sm">
        Search
      </button>
    </form>
  );
}
