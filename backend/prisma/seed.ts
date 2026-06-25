import bcrypt from "bcryptjs";
import { PrismaClient, LabType, MediaType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Student
  await prisma.user.upsert({
    where: { email: 'student@labverse.ai' },
    update: {},
    create: {
      email: 'student@labverse.ai',
      passwordHash: bcrypt.hashSync('Student@12345', 10),
      role: 'STUDENT',
      firstName: 'Alex',
      lastName: 'Student',
    },
  });

  // Seed Industry Partner
  await prisma.user.upsert({
    where: { email: 'partner@labverse.ai' },
    update: {},
    create: {
      email: 'partner@labverse.ai',
      passwordHash: bcrypt.hashSync('Partner@12345', 10),
      role: 'INDUSTRY_PARTNER',
      firstName: 'Sarah',
      lastName: 'Partner',
    },
  });

  // Clean up existing demo data to ensure idempotency
  await prisma.projectMedia.deleteMany();
  await prisma.project.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.aiKnowledgeDocument.deleteMany();
  await prisma.lab.deleteMany();
  // We keep users or just delete the admin to recreate cleanly
  await prisma.user.deleteMany({ where: { email: 'admin@labverse.ai' } });

  // Create Faculty Admin for the labs
  const admin = await prisma.user.upsert({
    where: { email: 'admin@labverse.ai' },
    update: {},
    create: {
      email: 'admin@labverse.ai',
      passwordHash: bcrypt.hashSync('Admin@12345', 10),
      role: 'FACULTY_ADMIN',
      firstName: 'Dr. Jane',
      lastName: 'Smith',
    },
  });

  // Create Lab 1: Warehouse & Inventory Management
  const lab1 = await prisma.lab.create({
    data: {
      name: 'Warehouse & Inventory Management Lab',
      description: 'A state-of-the-art facility focused on modern warehousing techniques, automated storage, and real-time inventory tracking systems.',
      labType: LabType.WAREHOUSE_INVENTORY,
      facultyAdminId: admin.id,
      capacity: 30,
      location: 'Building A, Room 101',
      equipment: {
        create: [
          { name: 'Automated Storage and Retrieval System (AS/RS)', description: 'Mini-load AS/RS for high-speed carton buffering.' },
          { name: 'RFID Gate Readers', description: 'UHF RFID portals for inbound/outbound tracking.' },
          { name: 'Barcode Scanners', description: 'Industrial grade 2D scanners.' },
          { name: 'Conveyor System Simulator', description: 'Scale model of a sorter conveyor.' },
        ],
      },
      projects: {
        create: [
          {
            title: 'RFID-Based Inventory Tracking System',
            description: 'Implemented a real-time tracking system reducing inventory discrepancy by 98%.',
            authorId: admin.id,
            media: {
              create: [{ mediaType: MediaType.IMAGE, url: 'https://placehold.co/600x400/png?text=RFID+Project' }]
            }
          },
          {
            title: 'Warehouse Picking Route Optimization',
            description: 'Algorithm development for minimizing travel distance in high-density warehouses using TSP variants.',
            authorId: admin.id,
          }
        ]
      }
    },
  });

  // Create Lab 2: Logistics Simulation & Digital Twin
  const lab2 = await prisma.lab.create({
    data: {
      name: 'Logistics Simulation & Digital Twin Lab',
      description: 'Focused on creating virtual replicas of physical supply chains to simulate disruptions and optimize material flows.',
      labType: LabType.LOGISTICS_SIMULATION_DIGITAL_TWIN,
      facultyAdminId: admin.id,
      capacity: 25,
      location: 'Building B, Room 204',
      equipment: {
        create: [
          { name: 'High-Performance Computing Cluster', description: 'For running complex Monte Carlo simulations.' },
          { name: 'VR Headsets', description: 'For immersive digital twin walkthroughs.' },
          { name: 'AnyLogic Software Licenses', description: 'Multimethod simulation modeling tool.' },
          { name: '3D Mapping Drones', description: 'Indoor drones for facility scanning.' },
        ],
      },
      projects: {
        create: [
          {
            title: 'Digital Twin for Logistics Flow Simulation',
            description: 'A complete virtual replica of a regional distribution center to stress-test holiday peak volumes.',
            authorId: admin.id,
          },
          {
            title: 'Port Congestion Simulator',
            description: 'Agent-based model predicting vessel wait times based on crane availability and weather patterns.',
            authorId: admin.id,
          }
        ]
      }
    },
  });

  // Create Lab 3: Smart Supply Chain & Operations
  const lab3 = await prisma.lab.create({
    data: {
      name: 'Smart Supply Chain & Operations Lab',
      description: 'Integrating IoT, blockchain, and advanced analytics to create transparent, resilient, and responsive supply chains.',
      labType: LabType.SMART_SUPPLY_CHAIN,
      facultyAdminId: admin.id,
      capacity: 40,
      location: 'Building C, Room 305',
      equipment: {
        create: [
          { name: 'IoT Sensor Kits', description: 'Temperature, humidity, and shock sensors for cold chain tracking.' },
          { name: 'Blockchain Node Servers', description: 'Dedicated nodes for Hyperledger Fabric smart contract testing.' },
          { name: 'Telematics Dashboards', description: 'Fleet tracking and driver behavior monitoring setups.' },
          { name: 'Operations Command Center', description: 'Multi-screen setup for real-time global supply chain visibility.' },
          { name: 'Edge Computing Devices', description: 'For processing sensor data locally before cloud transmission.' },
        ],
      },
      projects: {
        create: [
          {
            title: 'Demand Forecasting Dashboard',
            description: 'Machine learning model utilizing external data (weather, holidays) to predict SKU-level demand with 92% accuracy.',
            authorId: admin.id,
          },
          {
            title: 'Smart Supply Chain Analytics Platform',
            description: 'End-to-end visibility tool connecting ERP data with real-time IoT feeds to flag supplier delays.',
            authorId: admin.id,
          },
          {
            title: 'Cold Chain Blockchain Ledger',
            description: 'Immutable record of temperature data during transit to ensure pharmaceutical compliance.',
            authorId: admin.id,
          }
        ]
      }
    },
  });

  console.log('Seed completed successfully!');
// append to the end of seed.ts before console.log('Seed completed successfully!');

  // Seed AI Knowledge Documents
  await prisma.aiKnowledgeDocument.createMany({
    data: [
      {
        labId: lab1.id,
        title: "What is LabVerse AI?",
        content: "LabVerse AI is a next-generation platform connecting students, university researchers, and industry partners. It provides digital access to physical lab spaces, interactive equipment details, project repositories, and automated booking systems.",
      },
      {
        labId: lab1.id,
        title: "Warehouse & Inventory Management Lab Overview",
        content: "This lab features an Automated Storage and Retrieval System (AS/RS), RFID portals, and barcode scanners. It is used to research and optimize real-time inventory tracking and picking routes.",
      },
      {
        labId: lab2.id,
        title: "Logistics Simulation & Digital Twin Lab Overview",
        content: "Focuses on virtual replicas of supply chains. Features High-Performance Computing, VR Headsets, and Drone mapping to simulate holiday peak volumes and port congestion.",
      },
      {
        labId: lab3.id,
        title: "Smart Supply Chain & Operations Lab Overview",
        content: "Integrates IoT, blockchain, and advanced analytics. Uses sensors to track cold chains and blockchain to ensure pharmaceutical compliance. Includes demand forecasting ML models.",
      },
      {
        labId: lab1.id,
        title: "Industry Partnership Use Cases",
        content: "Industry partners can use LabVerse AI to scout talent, sponsor lab equipment, access academic research for R&D, and run digital twin simulations for their logistics operations.",
      },
      {
        labId: lab2.id,
        title: "Recruiter Use Cases",
        content: "Recruiters can explore student projects to evaluate technical skills, review hands-on experience with equipment like AS/RS and RFID, and connect with top-performing students.",
      },
      {
        labId: lab3.id,
        title: "Student Learning Outcomes",
        content: "Students gain practical experience with enterprise equipment, develop portfolio-ready projects, learn supply chain optimization, and collaborate directly with industry sponsors.",
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
