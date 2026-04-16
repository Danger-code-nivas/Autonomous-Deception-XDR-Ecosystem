import React, { useState } from 'react';
import { Download, AlertTriangle, Database, FolderOpen, FileText, ScanFace, X, FileCode } from 'lucide-react';
import { FAKE_DB_DATA } from '../constants';

interface HoneypotProps {
  intruderImage?: string;
  onGoBack: () => void;
}

const SERVER_CONFIG_YAML = `# INTERNAL SERVER CONFIGURATION - LEVEL 4 SECURITY
# WARNING: UNAUTHORIZED MODIFICATION TRIGGERS AUTOMATIC LOCKDOWN

system:
  hostname: "XDR-CORE-NODE-01"
  kernel: "Linux 5.15.0-hardened"
  timezone: "UTC"
  
network:
  interface: "eth0"
  ip_binding: "10.20.4.55" # Internal Private VLAN
  dns: ["1.1.1.1", "8.8.8.8"]
  
security:
  firewall:
    status: "ACTIVE"
    policy: "DROP_ALL"
    whitelist_path: "/etc/xdr/whitelist.conf"
  
  encryption:
    tls_version: "1.3"
    cipher_suite: "TLS_AES_256_GCM_SHA384"
    cert_path: "/etc/ssl/private/server_v2.key"

  intrusion_detection:
    engine: "Suricata"
    mode: "IPS" (Prevention)
    rules_update: "HOURLY"
    alert_threshold: "MEDIUM"

services:
  database:
    port: 5432
    max_connections: 50
    ssl_mode: "verify-full"
  
  admin_panel:
    port: 8443
    auth_method: "MFA_REQUIRED"
    session_timeout: "15m"

# DEPLOYMENT SECRETS (HASHED)
# jwt_secret: "sk_live_51M0...[REDACTED]"
# api_key_master: "xdr_pk_...[REDACTED]"`;

const AUDIT_LOG_CSV = `TIMESTAMP,SEVERITY,SOURCE_IP,EVENT_TYPE,USER,DETAILS,STATUS
2023-10-24 23:14:01,HIGH,45.227.254.12,AUTH_FAILURE,root,Failed password for root,401
2023-10-24 23:14:02,HIGH,45.227.254.12,AUTH_FAILURE,root,Failed password for root,401
2023-10-24 23:14:04,HIGH,45.227.254.12,AUTH_FAILURE,root,Failed password for root,401
2023-10-24 23:14:05,CRITICAL,45.227.254.12,BRUTE_FORCE_DETECTED,root,Multiple failures in 5s,BLOCKED
2023-10-25 04:20:11,MEDIUM,103.145.12.55,PORT_SCAN,N/A,Scanning ports 22-8080,LOGGED
2023-10-25 04:20:15,HIGH,103.145.12.55,AUTH_ATTEMPT,admin,Invalid credential pair,403
2023-10-25 09:12:33,LOW,89.24.11.23,FILE_ACCESS,guest,Read /var/www/html/robots.txt,200
2023-10-25 14:01:00,HIGH,192.168.1.105,SQL_INJECTION,admin,Payload: ' OR 1=1 --,BLOCKED
2023-10-25 14:01:02,CRITICAL,192.168.1.105,XSS_ATTEMPT,admin,Payload: <script>alert(1)</script>,BLOCKED
2023-10-25 16:45:01,HIGH,192.168.1.105,AUTH_FAILURE,admin,Pass: admin123,401
2023-10-25 16:45:03,HIGH,192.168.1.105,AUTH_FAILURE,admin,Pass: password,401
2023-10-25 16:45:05,HIGH,192.168.1.105,AUTH_FAILURE,admin,Pass: 123456,401`;

export const Honeypot: React.FC<HoneypotProps> = ({ intruderImage, onGoBack }) => {
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [viewingFile, setViewingFile] = useState<{name: string, content: string} | null>(null);

  const handleDownload = () => {
    setDownloadTriggered(true);
    // Simulate a download logic or just show the trap message
    setTimeout(() => alert("WARNING: DOWNLOADING CLASSIFIED MATERIAL. THIS INCIDENT HAS BEEN LOGGED."), 100);
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-green-500 font-mono p-4 border-[16px] border-red-900/30">
      {/* Fake Header */}
      <header className="flex justify-between items-center border-b border-green-800 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8 text-red-500 animate-pulse" />
          <div>
            <h1 className="text-2xl font-bold text-red-500">RESTRICTED SERVER: LEVEL 5 CLEARANCE</h1>
            <p className="text-xs text-red-400">RESTRICTED ENVIRONMENT - LOGGING ACTIVE</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs">SERVER: <span className="text-white">INTERNAL-V2</span></p>
          <p className="text-xs">UPTIME: <span className="text-white">99.9992%</span></p>
          <button 
            onClick={onGoBack}
            className="mt-2 text-xs bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-800 px-2 py-1 rounded transition-colors"
          >
            ← RETURN TO LOGIN
          </button>
        </div>
      </header>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-cyber-900 border border-green-500 w-full max-w-2xl shadow-[0_0_50px_rgba(0,255,157,0.2)] flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-3 border-b border-green-800 bg-green-900/20">
              <div className="flex items-center gap-2 text-green-400">
                <FileCode className="w-4 h-4" />
                <span className="font-bold">{viewingFile.name}</span>
              </div>
              <button onClick={() => setViewingFile(null)} className="text-green-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-4 overflow-auto text-xs md:text-sm text-green-300 font-mono whitespace-pre-wrap">
              {viewingFile.content}
            </pre>
            <div className="p-2 border-t border-green-800 text-xs text-green-700 bg-black text-center">
              READ-ONLY MODE // WRITE ACCESS DENIED
            </div>
          </div>
        </div>
      )}

      {/* Trap Modal */}
      {downloadTriggered && (
        <div className="fixed inset-0 bg-red-500/20 z-50 flex items-center justify-center backdrop-blur-sm">
           <div className="bg-black border-2 border-red-500 p-8 max-w-lg text-center shadow-[0_0_100px_rgba(255,0,0,0.5)]">
              <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-4" />
              <h2 className="text-4xl font-display font-bold text-red-500 mb-4 animate-pulse">YOU HAVE BEEN DETECTED</h2>
              <p className="text-red-300 font-mono mb-6">
                Your IP has been geolocated and reported to the authorities. 
                This system is a honeypot surveillance node.
              </p>
              <button 
                onClick={() => setDownloadTriggered(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 font-bold uppercase"
              >
                Acknowledge & Terminate
              </button>
           </div>
        </div>
      )}

      {/* Fake File System / Breadcrumbs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-black/50 border border-green-900 p-6 rounded-sm">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
             <Database className="w-5 h-5" /> Database Tables
           </h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead>
                 <tr className="border-b border-green-800 text-green-300">
                   <th className="p-2">ID</th>
                   <th className="p-2">Table Name</th>
                   <th className="p-2">Records</th>
                   <th className="p-2">Size</th>
                 </tr>
               </thead>
               <tbody>
                 {FAKE_DB_DATA.map(row => (
                   <tr key={row.id} className="border-b border-green-900/50 hover:bg-green-900/20 cursor-pointer">
                     <td className="p-2 text-green-600">#{row.id}</td>
                     <td className="p-2 font-bold">{row.table}</td>
                     <td className="p-2">{row.records}</td>
                     <td className="p-2 text-green-600">{row.size}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div className="bg-black/50 border border-green-900 p-6 rounded-sm flex flex-col h-full">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
            <FolderOpen className="w-5 h-5" /> Quick Access
          </h3>
          <ul className="space-y-3 flex-grow">
             <li 
               onClick={() => setViewingFile({ name: 'server_config.yaml', content: SERVER_CONFIG_YAML })}
               className="flex items-center justify-between p-3 bg-green-900/10 border border-green-800 hover:bg-green-900/30 cursor-pointer transition-colors"
             >
                <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4" />
                   <span>server_config.yaml</span>
                </div>
                <span className="text-xs opacity-50">4KB</span>
             </li>
             <li 
                onClick={() => setViewingFile({ name: 'audit_log_2023.csv', content: AUDIT_LOG_CSV })}
                className="flex items-center justify-between p-3 bg-green-900/10 border border-green-800 hover:bg-green-900/30 cursor-pointer transition-colors"
             >
                <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4" />
                   <span>audit_log_2023.csv</span>
                </div>
                <span className="text-xs opacity-50">12MB</span>
             </li>
             {/* THE TRAP FILE */}
             <li 
               onClick={handleDownload}
               className="flex items-center justify-between p-3 bg-red-900/10 border border-red-800/50 hover:bg-red-900/30 cursor-pointer group"
             >
                <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300">
                   <FileText className="w-4 h-4" />
                   <span className="font-bold">passwords.txt</span>
                </div>
                <Download className="w-4 h-4 text-red-500" />
             </li>
          </ul>
          
          {/* Intruder Image Display */}
          {intruderImage && (
            <div className="mt-6 pt-4 border-t border-red-900/50 animate-pulse">
              <div className="flex items-center gap-2 text-red-500 mb-2 font-bold uppercase text-xs tracking-wider">
                 <ScanFace className="w-4 h-4" /> Biometric Match Found
              </div>
              <div className="relative border-2 border-red-500/50 rounded overflow-hidden">
                 <img src={intruderImage} alt="Intruder" className="w-full h-auto filter grayscale contrast-125 hover:filter-none transition-all duration-300" />
                 <div className="absolute inset-x-0 bottom-0 bg-red-600/90 text-black text-[10px] font-bold text-center py-1 font-mono uppercase">
                   Target Locked: 98% Match
                 </div>
                 {/* Crosshair overlay */}
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-red-500"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-red-500"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-red-500"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-red-500"></div>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 border-t border-green-900 text-xs text-green-700">
             SYSTEM MESSAGE: Backup daemon running. Do not interrupt power supply.
          </div>
        </div>
      </div>
    </div>
  );
};