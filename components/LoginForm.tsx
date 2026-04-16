import React, { useState, useRef } from 'react';
import { MAX_ATTEMPTS, REAL_ADMIN_PASS } from '../constants';
import { ShieldAlert, Fingerprint, Lock, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onAttempt: (user: string, pass: string, image?: string) => void;
  failedAttempts: number;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onAttempt, failedAttempts }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureIntruder = async (): Promise<string | undefined> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      return new Promise((resolve) => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          video.srcObject = stream;
          
          video.onloadedmetadata = () => {
            video.play();
            // Short delay to allow camera to adjust exposure/white balance
            setTimeout(() => {
              if (canvasRef.current && videoRef.current) {
                const context = canvasRef.current.getContext('2d');
                if (context) {
                   context.drawImage(videoRef.current, 0, 0, 320, 240);
                   const image = canvasRef.current.toDataURL('image/jpeg', 0.8);
                   // Stop stream immediately after capture
                   stream.getTracks().forEach(track => track.stop());
                   video.srcObject = null;
                   resolve(image);
                }
              }
              // Cleanup if context missing
              if (stream.active) {
                stream.getTracks().forEach(track => track.stop());
              }
            }, 400); // 400ms delay for frame stabilization
          };
        } else {
           stream.getTracks().forEach(track => track.stop());
           resolve(undefined);
        }
      });
    } catch (err) {
      console.log("Surveillance camera unavailable or denied:", err);
      return undefined;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsCapturing(true);
      
      let evidencePhoto: string | undefined = undefined;

      // Only activate camera surveillance if the password is WRONG and it's the final attempt
      if (password !== REAL_ADMIN_PASS && failedAttempts >= MAX_ATTEMPTS - 1) {
         evidencePhoto = await captureIntruder();
      }

      onAttempt(username, password, evidencePhoto);
      setPassword('');
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-900 relative overflow-hidden">
      {/* Hidden Surveillance Elements */}
      <div className="fixed top-0 left-0 opacity-0 pointer-events-none">
         <video ref={videoRef} playsInline muted width="320" height="240" />
         <canvas ref={canvasRef} width="320" height="240" />
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
         <div className="absolute top-10 left-10 w-64 h-64 bg-cyber-500 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyber-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-cyber-800/80 backdrop-blur-md border border-cyber-700 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.1)]">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-cyber-900 border border-cyber-500/30 relative">
            <Fingerprint className="w-12 h-12 text-cyber-500" />
            {isCapturing && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black" title="Acquiring Biometrics..."></div>
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-center text-white mb-2 tracking-wider">
          SECURE ACCESS GATEWAY
        </h2>
        <p className="text-center text-cyber-500/60 text-sm mb-8 font-mono">
          UNAUTHORIZED ACCESS IS PROHIBITED
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-400 uppercase">Identity</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-cyber-900 border border-cyber-700 text-white p-3 rounded focus:outline-none focus:border-cyber-500 transition-colors font-mono"
              placeholder="usr_idx_882"
              disabled={isCapturing}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-cyber-400 uppercase">Access Key</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-900 border border-cyber-700 text-white p-3 rounded focus:outline-none focus:border-cyber-500 transition-colors font-mono"
                placeholder="••••••••••••"
                disabled={isCapturing}
              />
              <Lock className="absolute right-3 top-3.5 w-4 h-4 text-cyber-700" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isCapturing}
            className="w-full bg-cyber-500/10 hover:bg-cyber-500/20 text-cyber-500 border border-cyber-500 font-display font-bold py-3 rounded transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {isCapturing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...
              </>
            ) : (
              'AUTHENTICATE'
            )}
          </button>
        </form>

        {failedAttempts > 0 && (
          <div className="mt-6 flex items-center justify-center gap-2 text-cyber-300 bg-cyber-300/10 p-3 rounded border border-cyber-300/20">
             <ShieldAlert className="w-5 h-5" />
             <span className="text-sm font-mono font-bold">
               ATTEMPT {failedAttempts}/{MAX_ATTEMPTS} FAILED
             </span>
          </div>
        )}
        
        <div className="mt-4 text-center">
             <span className="text-xs text-slate-500 font-mono">System ID: 44-XDR-ALPHA</span>
        </div>
      </div>
    </div>
  );
};