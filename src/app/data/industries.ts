export interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: { name: string; count: number; isCritical: boolean }[];
  assets: { name: string; count: number }[];
}

export const industries: IndustryTemplate[] = [
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    description: 'Manage fleet operations, delivery networks, and warehouse systems',
    icon: 'Truck',
    roles: [
      { name: 'Driver', count: 50, isCritical: true },
      { name: 'Dispatcher', count: 10, isCritical: true },
      { name: 'Warehouse Staff', count: 30, isCritical: false },
      { name: 'Route Planner', count: 8, isCritical: true },
      { name: 'Delivery Executive', count: 25, isCritical: false },
    ],
    assets: [
      { name: 'Trucks', count: 40 },
      { name: 'Delivery Vans', count: 30 },
      { name: 'Warehouses', count: 5 },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Hospitals',
    description: 'Optimize patient care, emergency response, and medical operations',
    icon: 'Heart',
    roles: [
      { name: 'Doctor', count: 30, isCritical: true },
      { name: 'Nurse', count: 80, isCritical: true },
      { name: 'Surgeon', count: 15, isCritical: true },
      { name: 'Pharmacist', count: 12, isCritical: false },
      { name: 'Lab Technician', count: 20, isCritical: false },
      { name: 'Emergency Staff', count: 25, isCritical: true },
    ],
    assets: [
      { name: 'Ambulances', count: 10 },
      { name: 'ICU Beds', count: 50 },
      { name: 'Medical Equipment', count: 200 },
    ],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Streamline production lines, quality control, and equipment maintenance',
    icon: 'Factory',
    roles: [
      { name: 'Machine Operator', count: 60, isCritical: true },
      { name: 'Quality Inspector', count: 20, isCritical: true },
      { name: 'Maintenance Engineer', count: 15, isCritical: true },
      { name: 'Production Supervisor', count: 10, isCritical: false },
    ],
    assets: [
      { name: 'Machines', count: 80 },
      { name: 'Production Lines', count: 8 },
      { name: 'Warehouses', count: 3 },
    ],
  },
  {
    id: 'transport',
    name: 'Public Transport & Mobility',
    description: 'Coordinate fleet management, route optimization, and passenger services',
    icon: 'Bus',
    roles: [
      { name: 'Driver', count: 100, isCritical: true },
      { name: 'Conductor', count: 80, isCritical: false },
      { name: 'Fleet Manager', count: 12, isCritical: true },
      { name: 'Route Coordinator', count: 8, isCritical: true },
    ],
    assets: [
      { name: 'Buses', count: 90 },
      { name: 'Trains', count: 20 },
      { name: 'Depots', count: 4 },
    ],
  },
  {
    id: 'municipal',
    name: 'Municipal / Disaster Management',
    description: 'Emergency response, public services, and disaster recovery operations',
    icon: 'Shield',
    roles: [
      { name: 'Field Worker', count: 40, isCritical: false },
      { name: 'Emergency Responder', count: 50, isCritical: true },
      { name: 'Utility Technician', count: 30, isCritical: true },
      { name: 'Coordinator', count: 15, isCritical: true },
    ],
    assets: [
      { name: 'Rescue Vehicles', count: 25 },
      { name: 'Equipment Units', count: 100 },
    ],
  },
  {
    id: 'it',
    name: 'IT Operations',
    description: 'Monitor systems, manage incidents, and ensure infrastructure uptime',
    icon: 'Server',
    roles: [
      { name: 'Software Engineer', count: 35, isCritical: false },
      { name: 'DevOps Engineer', count: 20, isCritical: true },
      { name: 'Incident Manager', count: 10, isCritical: true },
      { name: 'Support Engineer', count: 25, isCritical: true },
      { name: 'System Admin', count: 15, isCritical: true },
    ],
    assets: [
      { name: 'Servers', count: 150 },
      { name: 'Cloud Systems', count: 50 },
      { name: 'Monitoring Tools', count: 30 },
    ],
  },
];
