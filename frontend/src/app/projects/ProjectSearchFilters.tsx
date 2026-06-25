'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProjectSearchFilters({ labs }: { labs: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [labId, setLabId] = useState(searchParams.get('labId') || '');

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      if (labId) {
        params.set('labId', labId);
      } else {
        params.delete('labId');
      }
      router.push(`/projects?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, labId, router, searchParams]);

  return (
    <div className="flex gap-4 max-w-2xl">
      <input 
        type="text" 
        placeholder="Search projects..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      />
      <select 
        value={labId}
        onChange={(e) => setLabId(e.target.value)}
        className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
      >
        <option value="">All Labs</option>
        {labs?.map(lab => (
          <option key={lab.id} value={lab.id}>{lab.name}</option>
        ))}
      </select>
    </div>
  );
}
