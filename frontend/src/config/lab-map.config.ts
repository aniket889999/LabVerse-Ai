import { LabMapConfig } from '../types/lab-map';

export const labMapConfigs: Record<string, LabMapConfig> = {
  'WAREHOUSE_INVENTORY': {
    labId: 'warehouse-1',
    labType: 'WAREHOUSE_INVENTORY',
    hotspots: [
      { id: 'wh-1', x: 15, y: 30, title: 'Receiving Area', type: 'SAFETY_ZONE', description: 'Inbound logistics and inspection zone.' },
      { id: 'wh-2', x: 25, y: 60, title: 'Barcode/RFID Station', type: 'LEARNING_ZONE', description: 'Hands-on scanning and sorting technologies.' },
      { id: 'wh-3', x: 60, y: 20, title: 'Storage Rack Zone', type: 'EQUIPMENT', description: 'High-bay storage simulation.' },
      { id: 'wh-4', x: 50, y: 70, title: 'Picking Route Zone', type: 'PROJECT', description: 'Algorithmic route optimization.' },
      { id: 'wh-5', x: 80, y: 40, title: 'Packing & Dispatch Area', type: 'DEMO_AREA', description: 'Outbound logistics.' },
      { id: 'wh-6', x: 85, y: 80, title: 'WMS Dashboard Station', type: 'EQUIPMENT', description: 'Warehouse Management System interface.' },
    ],
    tours: {
      'STUDENT': {
        mode: 'STUDENT',
        steps: [
          { hotspotId: 'wh-2', explanation: 'Learn the fundamentals of barcode and RFID technologies.' },
          { hotspotId: 'wh-4', explanation: 'Apply algorithms to optimize picking routes.' },
          { hotspotId: 'wh-6', explanation: 'Interact with industry-standard WMS software.' }
        ],
        completion: {}
      },
      'RECRUITER': {
        mode: 'RECRUITER',
        steps: [
          { hotspotId: 'wh-6', explanation: 'Students demonstrate proficiency in modern WMS interfaces.' },
          { hotspotId: 'wh-4', explanation: 'Our graduates solve complex routing and optimization problems.' }
        ],
        completion: {}
      },
      'INDUSTRY_PARTNER': {
        mode: 'INDUSTRY_PARTNER',
        steps: [
          { hotspotId: 'wh-3', explanation: 'Test new storage equipment and sensors in our high-bay simulator.' },
          { hotspotId: 'wh-5', explanation: 'Collaborate on automated dispatch systems.' }
        ],
        completion: {}
      }
    }
  },
  'LOGISTICS_SIMULATION_DIGITAL_TWIN': {
    labId: 'sim-1',
    labType: 'LOGISTICS_SIMULATION_DIGITAL_TWIN',
    hotspots: [
      { id: 'sim-1', x: 20, y: 20, title: 'Simulation Workstations', type: 'EQUIPMENT', description: 'High-performance computers for 3D simulation.' },
      { id: 'sim-2', x: 50, y: 15, title: 'Digital Twin Visualization Wall', type: 'DEMO_AREA', description: 'Real-time multi-screen visualization of supply chains.' },
      { id: 'sim-3', x: 80, y: 30, title: 'Transport Planning Zone', type: 'LEARNING_ZONE', description: 'Fleet and route management simulation.' },
      { id: 'sim-4', x: 30, y: 70, title: 'Process Flow Modeling Desk', type: 'PROJECT', description: 'Where students model factory floors.' },
      { id: 'sim-5', x: 70, y: 70, title: 'Optimization Dashboard Zone', type: 'EQUIPMENT', description: 'Analytics and KPI tracking.' },
      { id: 'sim-6', x: 50, y: 50, title: 'Scenario Testing Area', type: 'SAFETY_ZONE', description: 'Stress-testing models under constraint conditions.' },
    ],
    tours: {
      'STUDENT': {
        mode: 'STUDENT',
        steps: [
          { hotspotId: 'sim-1', explanation: 'Build 3D models using AnyLogic and FlexSim.' },
          { hotspotId: 'sim-4', explanation: 'Map out realistic factory floors.' },
          { hotspotId: 'sim-6', explanation: 'Run constraint scenarios to find bottlenecks.' }
        ],
        completion: {}
      },
      'RECRUITER': {
        mode: 'RECRUITER',
        steps: [
          { hotspotId: 'sim-2', explanation: 'Students present complex data on the visualization wall.' },
          { hotspotId: 'sim-5', explanation: 'Graduates know how to read and act on supply chain KPIs.' }
        ],
        completion: {}
      },
      'INDUSTRY_PARTNER': {
        mode: 'INDUSTRY_PARTNER',
        steps: [
          { hotspotId: 'sim-2', explanation: 'Visualize your company’s supply chain in our digital twin lab.' },
          { hotspotId: 'sim-6', explanation: 'Test new operational scenarios without real-world risk.' }
        ],
        completion: {}
      }
    }
  },
  'SMART_SUPPLY_CHAIN': {
    labId: 'smart-1',
    labType: 'SMART_SUPPLY_CHAIN',
    hotspots: [
      { id: 'smart-1', x: 15, y: 40, title: 'ERP/MRP Planning Desk', type: 'EQUIPMENT', description: 'SAP/Oracle sandbox environments.' },
      { id: 'smart-2', x: 40, y: 20, title: 'Forecasting Analytics Station', type: 'PROJECT', description: 'AI-driven demand forecasting.' },
      { id: 'smart-3', x: 75, y: 25, title: 'Supply Chain Dashboard Wall', type: 'DEMO_AREA', description: 'Live tracking of global shipments.' },
      { id: 'smart-4', x: 50, y: 60, title: 'Operations Research Zone', type: 'LEARNING_ZONE', description: 'Linear programming and mathematical optimization.' },
      { id: 'smart-5', x: 20, y: 80, title: 'IoT Data Monitoring Station', type: 'EQUIPMENT', description: 'Sensor data ingestion and analysis.' },
      { id: 'smart-6', x: 80, y: 70, title: 'Case Study Presentation Area', type: 'SAFETY_ZONE', description: 'Collaborative discussion space.' },
    ],
    tours: {
      'STUDENT': {
        mode: 'STUDENT',
        steps: [
          { hotspotId: 'smart-1', explanation: 'Learn enterprise resource planning basics.' },
          { hotspotId: 'smart-2', explanation: 'Apply machine learning to predict demand.' },
          { hotspotId: 'smart-4', explanation: 'Solve complex operations math problems.' }
        ],
        completion: {}
      },
      'RECRUITER': {
        mode: 'RECRUITER',
        steps: [
          { hotspotId: 'smart-1', explanation: 'Students gain hands-on experience with real ERP systems.' },
          { hotspotId: 'smart-2', explanation: 'Graduates are proficient in predictive analytics.' }
        ],
        completion: {}
      },
      'INDUSTRY_PARTNER': {
        mode: 'INDUSTRY_PARTNER',
        steps: [
          { hotspotId: 'smart-3', explanation: 'Integrate your live supply chain data into our dashboards.' },
          { hotspotId: 'smart-5', explanation: 'Collaborate on IoT and sensor tracking solutions.' }
        ],
        completion: {}
      }
    }
  }
};
