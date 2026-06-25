import { Box, Factory, Cpu, Network, BarChart3, LineChart, Globe, Zap } from 'lucide-react';

export const getLabVisuals = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('warehouse') || lowerName.includes('inventory')) {
    return {
      gradient: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700',
      Icon: Box,
      accent: 'text-blue-200'
    };
  }
  if (lowerName.includes('digital twin') || lowerName.includes('simulation')) {
    return {
      gradient: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700',
      Icon: Network,
      accent: 'text-emerald-200'
    };
  }
  if (lowerName.includes('smart') || lowerName.includes('operations')) {
    return {
      gradient: 'bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600',
      Icon: Zap,
      accent: 'text-orange-200'
    };
  }
  
  return {
    gradient: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900',
    Icon: Factory,
    accent: 'text-slate-300'
  };
};

export const getProjectVisuals = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('rfid') || lowerTitle.includes('tracking')) {
    return {
      gradient: 'bg-gradient-to-tr from-cyan-600 to-blue-600',
      Icon: Cpu,
      accent: 'text-cyan-200'
    };
  }
  if (lowerTitle.includes('twin')) {
    return {
      gradient: 'bg-gradient-to-tr from-fuchsia-600 to-purple-600',
      Icon: Globe,
      accent: 'text-fuchsia-200'
    };
  }
  if (lowerTitle.includes('forecasting') || lowerTitle.includes('demand')) {
    return {
      gradient: 'bg-gradient-to-tr from-amber-500 to-orange-600',
      Icon: LineChart,
      accent: 'text-amber-200'
    };
  }
  if (lowerTitle.includes('analytics')) {
    return {
      gradient: 'bg-gradient-to-tr from-indigo-500 to-violet-600',
      Icon: BarChart3,
      accent: 'text-indigo-200'
    };
  }

  return {
    gradient: 'bg-gradient-to-tr from-slate-600 to-slate-800',
    Icon: Box,
    accent: 'text-slate-300'
  };
};
