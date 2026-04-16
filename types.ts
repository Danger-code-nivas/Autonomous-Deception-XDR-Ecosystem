export enum AppView {
  LOGIN = 'LOGIN',
  HONEYPOT = 'HONEYPOT',
  XDR_DASHBOARD = 'XDR_DASHBOARD',
}

export interface AttackLog {
  id: string;
  timestamp: string;
  ip: string;
  country: string;
  attemptedUser: string;
  attemptedPassword: string; // "Payload Capture"
  status: 'BLOCKED' | 'SUSPECT' | 'FAILED';
  capturedImage?: string; // Base64 photo of the intruder
}

export interface Suspect {
  ip: string;
  failedAttempts: number;
  firstSeen: string;
  riskScore: number;
}

export interface GeoStats {
  country: string;
  count: number;
}