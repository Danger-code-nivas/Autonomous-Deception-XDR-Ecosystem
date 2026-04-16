import React, { useState, useMemo } from 'react';
import { AttackLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Shield, Radio, MapPin, Terminal, RefreshCw, Zap, LogOut, Camera, Unlock } from 'lucide-react';
import { generateThreatReport } from '../services/geminiService';

interface XDRDashboardProps {
  logs: AttackLog[];
  onLogout: () => void;
  onReset: () => void;
}

export const XDRDashboard: React.FC<XDRDashboardProps> = ({ logs, onLogout, onReset }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [unblockedIps, setUnblockedIps] = useState<Set<string>>(new Set());

  const initialRandomMember = useMemo(() => ({
    id: 'rand-1',
    ip: '192.168.1.105',
    user: 'unknown_device',
    reason: 'Multiple failed login attempts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  }), []);

  const blockList = useMemo(() => {
    const list: any[] = [];
    if (!unblockedIps.has(initialRandomMember.ip)) {
      list.push(initialRandomMember);
    }
    
    logs.forEach(log => {
      if ((log.status === 'BLOCKED' || log.status === 'SUSPECT' || log.status === 'FAILED') && !unblockedIps.has(log.ip)) {
        list.push({
          id: log.id,
          ip: log.ip,
          user: log.attemptedUser,
          reason: `Wrong password attempt (${log.status})`,
          timestamp: log.timestamp
        });
      }
    });
    
    const uniqueList = [];
    const seenIps = new Set();
    for (const item of list) {
      if (!seenIps.has(item.ip)) {
        seenIps.add(item.ip);
        uniqueList.push(item);
      }
    }
    return uniqueList;
  }, [logs, unblockedIps, initialRandomMember]);

  const handleUnblock = (ip: string) => {
    setUnblockedIps(prev => {
      const newSet = new Set(prev);
      newSet.add(ip);
      return newSet;
    });
  };

  // Process data for charts
  const countryData = logs.reduce((acc: any, log) => {
    acc[log.country] = (acc[log.country] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = Object.keys(countryData).map(key => ({
    name: key,
    attempts: countryData[key]
  }));

  const statusData = [
    { name: 'Blocked', value: logs.filter(l => l.status === 'BLOCKED').length },
    { name: 'Suspect', value: logs.filter(l => l.status === 'SUSPECT').length },
    { name: 'Failed', value: logs.filter(l => l.status === 'FAILED').length },
  ];
  const COLORS = ['#ff003c', '#00f0ff', '#64748b'];

  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    const report = await generateThreatReport(logs);
    setAiReport(report);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 p-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-8 pb-4 border-b border-cyber-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-500/10 rounded-lg border border-cyber-500 text-cyber-500">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">XDR <span className="text-cyber-500">SENTINEL</span></h1>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
           <div className="flex items-center gap-2 text-cyber-400">
             <span className="w-2 h-2 bg-cyber-400 rounded-full animate-pulse"></span>
             SYSTEM ACTIVE
           </div>
           <button 
             onClick={onLogout}
             className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1 rounded border border-red-500/50 transition-colors"
           >
             <LogOut className="w-3 h-3" /> LOGOUT
           </button>
           <button 
             onClick={onReset}
             className="flex items-center gap-2 bg-cyber-800 hover:bg-cyber-700 px-3 py-1 rounded border border-cyber-700 transition-colors"
           >
             <RefreshCw className="w-3 h-3" /> RESET SIMULATION
           </button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Stats & Map Placeholder */}
        <div className="space-y-6">
          <div className="bg-cyber-800 border border-cyber-700 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-cyber-500 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> GEO-ORIGIN HEATMAP
            </h3>
            <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} layout="vertical">
                   <XAxis type="number" stroke="#475569" hide />
                   <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{backgroundColor: '#050a14', borderColor: '#112240', color: '#fff'}}
                     itemStyle={{color: '#00f0ff'}}
                   />
                   <Bar dataKey="attempts" fill="#00f0ff" barSize={15}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f0ff' : '#00ff9d'} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-cyber-800 border border-cyber-700 p-6 rounded-xl">
             <h3 className="text-lg font-bold text-cyber-500 mb-4 flex items-center gap-2">
               <Radio className="w-4 h-4" /> THREAT STATUS
             </h3>
             <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie 
                        data={statusData} 
                        innerRadius={40} 
                        outerRadius={70} 
                        paddingAngle={5} 
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#050a14', borderColor: '#112240'}} />
                   </PieChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Center Col: Attack Logs (Payload Capture) */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-cyber-800 border border-cyber-700 rounded-xl overflow-hidden flex flex-col h-full max-h-[600px]">
              <div className="p-4 border-b border-cyber-700 flex justify-between items-center bg-cyber-900/50">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <Terminal className="w-4 h-4 text-cyber-400" /> 
                   INTERCEPTED PAYLOADS
                 </h3>
                 <span className="text-xs text-slate-500 font-mono">LIVE FEED // PORT 80</span>
              </div>
              <div className="overflow-auto flex-1 p-0">
                 <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-cyber-900 text-cyber-500 sticky top-0">
                       <tr>
                          <th className="p-3">TIMESTAMP</th>
                          <th className="p-3">EVIDENCE</th>
                          <th className="p-3">ORIGIN</th>
                          <th className="p-3">USER</th>
                          <th className="p-3 text-cyber-300">PAYLOAD (PASS)</th>
                          <th className="p-3">STATUS</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-700">
                       {logs.slice().reverse().map(log => (
                          <tr key={log.id} className="hover:bg-white/5 transition-colors">
                             <td className="p-3 text-slate-400 text-xs whitespace-nowrap align-middle">
                               {new Date(log.timestamp).toLocaleTimeString()}
                             </td>
                             <td className="p-3 align-middle">
                               {log.capturedImage ? (
                                 <div className="group relative">
                                    <img 
                                      src={log.capturedImage} 
                                      alt="Intruder" 
                                      className="w-10 h-10 rounded border border-cyber-500/50 object-cover cursor-zoom-in" 
                                    />
                                    <div className="absolute top-0 left-12 hidden group-hover:block z-50">
                                      <img src={log.capturedImage} className="w-48 rounded border-2 border-cyber-500 shadow-xl" />
                                    </div>
                                 </div>
                               ) : (
                                 <div className="w-10 h-10 rounded bg-cyber-900 border border-cyber-700 flex items-center justify-center opacity-50">
                                    <Camera className="w-4 h-4 text-cyber-700" />
                                 </div>
                               )}
                             </td>
                             <td className="p-3 align-middle">
                                <div className="flex flex-col">
                                   <span className="text-white">{log.ip}</span>
                                   <span className="text-xs text-slate-500">{log.country}</span>
                                </div>
                             </td>
                             <td className="p-3 text-cyan-200 align-middle">{log.attemptedUser}</td>
                             <td className="p-3 text-cyber-300 font-bold tracking-wider align-middle">{log.attemptedPassword}</td>
                             <td className="p-3 align-middle">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                   log.status === 'BLOCKED' ? 'border-red-500 text-red-500 bg-red-500/10' :
                                   log.status === 'SUSPECT' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                                   'border-slate-500 text-slate-500'
                                }`}>
                                   {log.status}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {logs.length === 0 && (
                   <div className="p-8 text-center text-slate-500 italic">No threats detected yet.</div>
                 )}
              </div>
           </div>
        </div>
      </div>
      
      {/* AI Analysis Section */}
      <div className="mt-6 bg-cyber-800 border border-cyber-700 p-6 rounded-xl">
         <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
               <Zap className="w-5 h-5 text-yellow-400" /> AI THREAT ASSESSMENT
            </h3>
            <button 
              onClick={handleAIAnalysis}
              disabled={analyzing}
              className="bg-cyber-500 text-cyber-900 font-bold px-4 py-2 rounded hover:bg-cyber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'ANALYZING NEURAL NET...' : 'GENERATE REPORT'}
            </button>
         </div>
         
         <div className="bg-black/30 p-4 rounded border border-cyber-700/50 min-h-[100px] font-mono text-sm whitespace-pre-wrap text-cyber-400">
            {analyzing ? (
              <div className="flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-cyber-500 rounded-full"></div>
                Processing telemetry data...
              </div>
            ) : aiReport ? (
              aiReport
            ) : (
              <span className="text-slate-600">Waiting for analyst command... Click 'Generate Report' to analyze current threat vector logs.</span>
            )}
         </div>
      </div>

      {/* Block List Section */}
      <div className="mt-6 bg-cyber-800 border border-cyber-700 p-6 rounded-xl">
         <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
               <Shield className="w-5 h-5 text-red-500" /> DEVICE BLOCK LIST
            </h3>
         </div>
         <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-left text-sm font-mono">
               <thead className="bg-cyber-900 text-cyber-500 sticky top-0">
                  <tr>
                     <th className="p-3">IP ADDRESS</th>
                     <th className="p-3">USER/DEVICE</th>
                     <th className="p-3">REASON</th>
                     <th className="p-3">TIMESTAMP</th>
                     <th className="p-3 text-right">ACTION</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-cyber-700">
                  {blockList.map(member => (
                     <tr key={member.ip} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 text-white">{member.ip}</td>
                        <td className="p-3 text-cyan-200">{member.user}</td>
                        <td className="p-3 text-red-400">{member.reason}</td>
                        <td className="p-3 text-slate-400 text-xs">{new Date(member.timestamp).toLocaleString()}</td>
                        <td className="p-3 text-right">
                           <button 
                             onClick={() => handleUnblock(member.ip)}
                             className="bg-cyber-700 hover:bg-cyber-600 text-white px-3 py-1 rounded text-xs transition-colors flex items-center gap-1 ml-auto"
                           >
                             <Unlock className="w-3 h-3" /> UNBLOCK
                           </button>
                        </td>
                     </tr>
                  ))}
                  {blockList.length === 0 && (
                     <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500 italic">No devices currently blocked.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      {/* Global Admin Access Indicator */}
      <div className="mt-4 flex justify-center pb-8">
         <div className="px-4 py-2 bg-cyber-900/50 border border-cyber-700 rounded-full flex items-center gap-2 text-xs font-mono text-cyber-500/70">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            GLOBAL ADMIN ACCESS GRANTED
         </div>
      </div>
    </div>
  );
};