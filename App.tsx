import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { Honeypot } from './components/Honeypot';
import { XDRDashboard } from './components/XDRDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { AppView, AttackLog } from './types';
import { MAX_ATTEMPTS, MOCK_IP, REAL_ADMIN_PASS, INITIAL_LOGS, SIMULATION_COUNTRIES } from './constants';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [logs, setLogs] = useState<AttackLog[]>(INITIAL_LOGS);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSuspect, setIsSuspect] = useState(false);

  // Simulate background attacks when dashboard is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentView === AppView.XDR_DASHBOARD) {
      interval = setInterval(() => {
        const randomCountry = SIMULATION_COUNTRIES[Math.floor(Math.random() * SIMULATION_COUNTRIES.length)];
        // Generate random IP
        const randomIp = Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
        
        const statuses: AttackLog['status'][] = ['BLOCKED', 'SUSPECT', 'FAILED'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        const newLog: AttackLog = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          ip: randomIp,
          country: randomCountry,
          attemptedUser: 'bot_' + Math.floor(Math.random() * 9999),
          attemptedPassword: '***',
          status: randomStatus,
          capturedImage: undefined
        };
        
        setLogs(prev => [...prev, newLog]);
      }, 60000); // Every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView]);

  // Helper to add log
  const addLog = (user: string, pass: string, status: AttackLog['status'], image?: string) => {
    const newLog: AttackLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      ip: MOCK_IP,
      country: 'Unknown (Simulated)',
      attemptedUser: user,
      attemptedPassword: pass,
      status: status,
      capturedImage: image
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleLoginAttempt = (user: string, pass: string, image?: string) => {
    // 1. Check if it's the REAL admin trying to access dashboard
    if (user === 'admin' && pass === REAL_ADMIN_PASS && !isSuspect) {
      setCurrentView(AppView.XDR_DASHBOARD);
      return;
    }

    // 2. If user is already a suspect, ALWAYS trap them (even if pass is correct now)
    if (isSuspect) {
      addLog(user, pass, 'BLOCKED', image);
      setCurrentView(AppView.HONEYPOT);
      return;
    }

    // 3. Normal validation failure
    if (pass !== REAL_ADMIN_PASS) {
      const newFailCount = failedAttempts + 1;
      setFailedAttempts(newFailCount);

      if (newFailCount >= MAX_ATTEMPTS) {
        setIsSuspect(true);
        addLog(user, pass, 'SUSPECT', image);
        // Once suspect, immediately route to honeypot or wait for next interaction? 
        // Requirement says "attempts to log in... must be redirected". 
        // We will wait for the next attempt to redirect, OR redirect immediately if we want to be aggressive.
        // Let's redirect immediately for dramatic effect.
        setTimeout(() => setCurrentView(AppView.HONEYPOT), 1500);
      } else {
        addLog(user, pass, 'FAILED', image);
      }
    }
  };

  const handleLogout = () => {
    setCurrentView(AppView.LOGIN);
  };

  const resetSimulation = () => {
    setLogs(INITIAL_LOGS);
    setFailedAttempts(0);
    setIsSuspect(false);
    setCurrentView(AppView.LOGIN);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LOGIN:
        return <LoginForm onAttempt={handleLoginAttempt} failedAttempts={failedAttempts} />;
      case AppView.HONEYPOT:
        // Pass the image from the most recent log (the current intruder)
        return <Honeypot intruderImage={logs[logs.length - 1]?.capturedImage} onGoBack={() => setCurrentView(AppView.LOGIN)} />;
      case AppView.XDR_DASHBOARD:
        return <XDRDashboard logs={logs} onLogout={handleLogout} onReset={resetSimulation} />;
      default:
        return <LoginForm onAttempt={handleLoginAttempt} failedAttempts={failedAttempts} />;
    }
  };

  return (
    <div className="antialiased">
      {/* Dev tools hidden for production simulation */}
      {isLoading ? <LoadingScreen onComplete={() => setIsLoading(false)} /> : renderView()}
    </div>
  );
}

export default App;