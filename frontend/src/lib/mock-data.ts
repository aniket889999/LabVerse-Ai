import { Lab, Project, Equipment } from '../types';

export const mockLabs: Lab[] = [
  {
    id: 'mock-lab-1',
    name: 'Warehouse & Inventory Management Lab',
    description: 'A state-of-the-art facility focused on modern warehousing techniques, automated storage, and real-time inventory tracking systems.',
    labType: 'WAREHOUSE_INVENTORY',
    capacity: 30,
    location: 'Building A, Room 101',
    _count: { equipment: 4, projects: 2 }
  },
  {
    id: 'mock-lab-2',
    name: 'Logistics Simulation & Digital Twin Lab',
    description: 'Focused on creating virtual replicas of physical supply chains to simulate disruptions and optimize material flows.',
    labType: 'LOGISTICS_SIMULATION_DIGITAL_TWIN',
    capacity: 25,
    location: 'Building B, Room 204',
    _count: { equipment: 4, projects: 2 }
  },
  {
    id: 'mock-lab-3',
    name: 'Smart Supply Chain & Operations Lab',
    description: 'Integrating IoT, blockchain, and advanced analytics to create transparent, resilient, and responsive supply chains.',
    labType: 'SMART_SUPPLY_CHAIN',
    capacity: 40,
    location: 'Building C, Room 305',
    _count: { equipment: 5, projects: 3 }
  }
];

export const mockProjects: Project[] = [
  {
    id: 'mock-proj-1',
    labId: 'mock-lab-1',
    authorId: 'admin-1',
    title: 'RFID-Based Inventory Tracking System',
    description: 'Implemented a real-time tracking system reducing inventory discrepancy by 98%.',
    lab: { id: 'mock-lab-1', name: 'Warehouse & Inventory Management Lab' },
    author: { id: 'admin-1', firstName: 'Dr. Jane', lastName: 'Smith' },
    media: [{ id: 'm1', mediaType: 'IMAGE', url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'mock-proj-2',
    labId: 'mock-lab-2',
    authorId: 'admin-1',
    title: 'Digital Twin for Logistics Flow Simulation',
    description: 'A complete virtual replica of a regional distribution center to stress-test holiday peak volumes.',
    lab: { id: 'mock-lab-2', name: 'Logistics Simulation & Digital Twin Lab' },
    author: { id: 'admin-1', firstName: 'Dr. Jane', lastName: 'Smith' },
  }
];

export const mockEquipment: Equipment[] = [
  {
    id: 'mock-eq-1',
    labId: 'mock-lab-1',
    name: 'Automated Storage and Retrieval System (AS/RS)',
    description: 'Mini-load AS/RS for high-speed carton buffering.',
    status: 'AVAILABLE',
    lab: { id: 'mock-lab-1', name: 'Warehouse Lab' }
  }
];
