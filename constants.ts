import { AttackLog } from './types';

export const MAX_ATTEMPTS = 3;
export const MOCK_IP = '192.168.1.105'; // Simulating the user's IP
export const REAL_ADMIN_PASS = 'admin'; 

export const INITIAL_LOGS: AttackLog[] = [
  { id: '1', timestamp: new Date(Date.now() - 10000000).toISOString(), ip: '45.227.254.12', country: 'Russia', attemptedUser: 'root', attemptedPassword: 'password123', status: 'BLOCKED' },
  { id: '2', timestamp: new Date(Date.now() - 8000000).toISOString(), ip: '103.145.12.55', country: 'China', attemptedUser: 'admin', attemptedPassword: 'admin', status: 'BLOCKED' },
  { id: '3', timestamp: new Date(Date.now() - 5000000).toISOString(), ip: '185.220.101.9', country: 'Germany', attemptedUser: 'sysadmin', attemptedPassword: 'letmein123', status: 'SUSPECT' },
  { id: '4', timestamp: new Date(Date.now() - 200000).toISOString(), ip: '89.24.11.23', country: 'Brazil', attemptedUser: 'support', attemptedPassword: '12345678', status: 'FAILED' },
  { id: '5', timestamp: new Date(Date.now() - 150000).toISOString(), ip: MOCK_IP, country: 'Unknown (Simulated)', attemptedUser: 'admin', attemptedPassword: 'wrongpassword1', status: 'FAILED' },
  { id: '6', timestamp: new Date(Date.now() - 100000).toISOString(), ip: MOCK_IP, country: 'Unknown (Simulated)', attemptedUser: 'admin', attemptedPassword: 'wrongpassword2', status: 'FAILED' },
  { id: '7', timestamp: new Date(Date.now() - 50000).toISOString(), ip: MOCK_IP, country: 'Unknown (Simulated)', attemptedUser: 'admin', attemptedPassword: 'wrongpassword3', status: 'SUSPECT' },
];

export const SIMULATION_COUNTRIES = [
  'Russia', 'China', 'Germany', 'Brazil', 'USA', 'North Korea', 'Iran', 'France', 'India', 'UK', 'Vietnam', 'Ukraine'
];

export const FAKE_DB_DATA = [
  { id: 101, table: 'users_master', records: 15420, size: '2.4GB', last_modified: '2023-10-25' },
  { id: 102, table: 'financial_records_2024', records: 8500, size: '4.1GB', last_modified: '2023-10-26' },
  { id: 103, table: 'executive_emails', records: 120, size: '150MB', last_modified: '2023-10-27' },
  { id: 104, table: 'project_chimera_blueprints', records: 5, size: '12GB', last_modified: '2023-10-27' },
];