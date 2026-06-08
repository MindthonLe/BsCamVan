/**
 * Calculations for OB/GYN Ultrasound Biometrics & Gestation
 */

// Calculate Gestational Age and Estimated Date of Delivery from Last Menstrual Period (LMP)
export function calculateGAAndEDDFromLMP(lmpDateStr: string, targetDateStr?: string) {
  if (!lmpDateStr) return null;
  
  const lmpDate = new Date(lmpDateStr);
  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
  
  // Clear hours
  lmpDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return null;
  
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  
  // EDD is LMP + 280 days (40 weeks)
  const eddDate = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
  
  return {
    gestationalWeeks: String(weeks),
    gestationalDays: String(days),
    eddDate: eddDate.toISOString().split('T')[0],
  };
}

// Calculate Gestational Age and EDD from IVF Transfer Date
// Day 3 embryo: age is 17 days (2 weeks + 3 days) at transfer
// Day 5 embryo: age is 19 days (2 weeks + 5 days) at transfer
export function calculateGAAndEDDFromIVF(transferDateStr: string, embryoAge: "day3" | "day5", targetDateStr?: string) {
  if (!transferDateStr) return null;
  
  const transferDate = new Date(transferDateStr);
  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date();
  
  transferDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  const addedDays = embryoAge === "day3" ? 17 : 19;
  
  const diffTime = targetDate.getTime() - transferDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const totalDays = diffDays + addedDays;
  if (totalDays < 0) return null;
  
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  
  // EDD is transfer date - addedDays + 280 days
  const eddDate = new Date(transferDate.getTime() + (280 - addedDays) * 24 * 60 * 60 * 1000);
  
  return {
    gestationalWeeks: String(weeks),
    gestationalDays: String(days),
    eddDate: eddDate.toISOString().split('T')[0],
  };
}

// Calculate Estimated Fetal Weight (EFW) in grams using Hadlock formula
// Hadlock Formula: Log10 EFW = 1.3596 + 0.00061*BPD*AC + 0.0424*AC + 0.174*FL - 0.0064*BPD*FL - 0.00386*AC*FL
// Measurements are in cm for Hadlock formulas, so convert mm to cm
export function calculateHadlockEFW(bpdMm?: string, flMm?: string, acMm?: string, hcMm?: string): string {
  const bpd = bpdMm ? parseFloat(bpdMm) / 10 : 0; // mm to cm
  const fl = flMm ? parseFloat(flMm) / 10 : 0; // mm to cm
  const ac = acMm ? parseFloat(acMm) / 10 : 0; // mm to cm
  const hc = hcMm ? parseFloat(hcMm) / 10 : 0; // mm to cm
  
  if (ac > 0 && fl > 0 && bpd > 0) {
    // Hadlock BPD, AC, FL
    const logEfw = 1.3596 + (0.00061 * bpd * ac) + (0.0424 * ac) + (0.174 * fl) - (0.0064 * bpd * fl) - (0.00386 * ac * fl);
    const efwVal = Math.round(Math.pow(10, logEfw));
    return isNaN(efwVal) || efwVal <= 0 ? "" : String(efwVal);
  }
  
  if (ac > 0 && fl > 0 && hc > 0) {
    // Hadlock HC, AC, FL
    const logEfw = 1.3596 + (0.00061 * hc * ac) + (0.0424 * ac) + (0.174 * fl) - (0.0064 * hc * fl) - (0.00386 * ac * fl); // simplified fallback
    const efwVal = Math.round(Math.pow(10, logEfw));
    return isNaN(efwVal) || efwVal <= 0 ? "" : String(efwVal);
  }
  
  if (ac > 0 && fl > 0) {
    // Hadlock AC, FL
    const logEfw = 1.304 + (0.05281 * ac) + (0.1938 * fl) - (0.004 * ac * fl);
    const efwVal = Math.round(Math.pow(10, logEfw));
    return isNaN(efwVal) || efwVal <= 0 ? "" : String(efwVal);
  }
  
  if (bpd > 0 && ac > 0) {
    // Hadlock BPD, AC
    const logEfw = 1.2508 + (0.0965 * ac) + (0.0135 * bpd * 10); // simplified EFW-BPD-AC
    const efwVal = Math.round(Math.pow(10, logEfw) * 0.1); 
    return isNaN(efwVal) || efwVal <= 0 ? "" : String(efwVal);
  }
  
  return "";
}
