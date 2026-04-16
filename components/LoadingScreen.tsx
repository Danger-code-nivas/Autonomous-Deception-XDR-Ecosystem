import React, { useEffect, useState } from 'react';
import { Shield, Activity, Lock, Camera, AlertTriangle } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [needsCamera, setNeedsCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    const duration = 4000; // 4 seconds to reach 99%
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      
      if (nextProgress >= 99) {
        setProgress(99);
        setNeedsCamera(true);
        clearInterval(interval);
      } else {
        setProgress(nextProgress);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const handleCameraAccess = async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop the stream immediately, we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setProgress(100);
      setNeedsCamera(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (err) {
      setCameraError(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center font-mono overflow-hidden relative">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

      <div className="z-20 flex flex-col items-center max-w-2xl w-full px-8">
        <div className="flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
          <Shield className="w-24 h-24 text-green-500 relative z-10 animate-[spin_4s_linear_infinite]" />
          <Lock className="w-10 h-10 text-black absolute z-20" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-widest uppercase text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
          Autonomous Deception
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-12 tracking-widest uppercase text-green-500/80">
          & XDR Ecosystem
        </h2>

        <div className="w-full bg-gray-900 border border-green-500/30 rounded-sm h-6 mb-4 relative overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-75 ease-linear relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.2)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.2)_75%,rgba(0,0,0,0.2)_100%)] bg-[length:20px_20px] animate-slide" />
          </div>
        </div>

        <div className="flex justify-between w-full text-xs text-green-500/70 mb-8">
          <span>{progress === 100 ? 'SYSTEM READY' : 'INITIALIZING CORE SYSTEMS...'}</span>
          <span>{Math.floor(progress)}%</span>
        </div>

        {needsCamera && (
          <div className="flex flex-col items-center space-y-4 mb-8">
            <button
              onClick={handleCameraAccess}
              className="flex items-center space-x-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500 text-green-400 px-6 py-2 rounded transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
            >
              <Camera className="w-5 h-5" />
              <span>ENABLE SECURITY CAMERA</span>
            </button>
            {cameraError && (
              <div className="flex items-center space-x-2 text-red-500 text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>CAMERA ACCESS DENIED. REQUIRED TO PROCEED.</span>
              </div>
            )}
          </div>
        )}

        <div className="w-full grid grid-cols-2 gap-4 text-xs text-green-500/50">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>NEURAL NET: ONLINE</span>
          </div>
          <div className="flex items-center space-x-2 justify-end">
            <Shield className="w-4 h-4" />
            <span>DECEPTION MATRIX: {progress === 100 ? 'ONLINE' : 'LOADING'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
