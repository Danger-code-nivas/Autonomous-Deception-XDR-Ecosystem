import { AttackLog } from '../types';

export const generateThreatReport = async (logs: AttackLog[]): Promise<string> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recentLogs = logs.slice(0, 10);
    const uniqueIps = new Set(recentLogs.map(l => l.ip)).size;
    const uniqueCountries = new Set(recentLogs.map(l => l.country)).size;
    
    const patterns = [
      "Distributed Brute Force",
      "Credential Stuffing",
      "Targeted Dictionary Attack",
      "Automated Botnet Sweep",
      "Low-and-Slow Password Spraying"
    ];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    const countermeasures = [
      "Implement IP-based rate limiting immediately.",
      "Deploy geo-fencing for high-risk regions.",
      "Enforce multi-factor authentication (MFA) across all endpoints.",
      "Update firewall rules to block known malicious subnets.",
      "Initiate deep packet inspection on incoming traffic."
    ];
    const randomCountermeasure = countermeasures[Math.floor(Math.random() * countermeasures.length)];

    const report = `TACTICAL THREAT REPORT
======================
STATUS: CRITICAL

1. ATTACK PATTERN IDENTIFICATION
Detected signature consistent with ${randomPattern}. 
Observed ${recentLogs.length} recent attempts originating from ${uniqueIps} unique IP addresses.

2. GEOGRAPHIC DISTRIBUTION
Threat actors are distributed across ${uniqueCountries} distinct regions. 
Coordination suggests a decentralized attack infrastructure.

3. PASSWORD COMPLEXITY ASSESSMENT
Analysis of intercepted payloads indicates systematic testing of common weak credentials and default administrative passwords.

4. RECOMMENDED COUNTERMEASURES
- ${randomCountermeasure}
- Continue monitoring honeypot telemetry for evolving tactics.
- Isolate affected network segments if lateral movement is detected.

END OF REPORT`;

    return report;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "System Error: Unable to generate threat report.";
  }
};
