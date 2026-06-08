import { ObstetricMeasurements, GynecologicMeasurements } from "../types";

/**
 * Calculates Estimated Fetal Weight (EFW) using Hadlock formulas based on available parameters.
 * Measurements (bpd, ac, fl, hc) should be passed in millimeters (mm).
 * Returns estimated weight in grams (g) rounded to nearest integer, or null if insufficient parameters.
 */
export function calculateFetalWeight(params: {
  bpd?: number;
  ac?: number;
  fl?: number;
  hc?: number;
}): number | null {
  const { bpd, ac, fl, hc } = params;

  // Convert to centimeters (cm) for standard Hadlock formulas
  const bpdCm = bpd ? bpd / 10 : undefined;
  const acCm = ac ? ac / 10 : undefined;
  const flCm = fl ? fl / 10 : undefined;
  const hcCm = hc ? hc / 10 : undefined;

  try {
    // 1. Hadlock 4 (BPD, HC, AC, FL) - Most comprehensive
    if (bpdCm && hcCm && acCm && flCm) {
      const log10Efw =
        1.3596 -
        0.00386 * acCm * flCm +
        0.0064 * hcCm +
        0.00061 * bpdCm * acCm +
        0.04242 * acCm +
        0.174 * flCm;
      return Math.round(Math.pow(10, log10Efw));
    }

    // 2. Hadlock 3 (BPD, AC, FL) - Very standard
    if (bpdCm && acCm && flCm) {
      const log10Efw =
        1.335 -
        0.0034 * acCm * flCm +
        0.0316 * bpdCm +
        0.0457 * acCm +
        0.19 * flCm;
      return Math.round(Math.pow(10, log10Efw));
    }

    // 3. Hadlock (HC, AC, FL)
    if (hcCm && acCm && flCm) {
      const log10Efw =
        1.326 -
        0.00326 * acCm * flCm +
        0.0107 * hcCm +
        0.0438 * acCm +
        0.158 * flCm;
      return Math.round(Math.pow(10, log10Efw));
    }

    // 4. Hadlock (AC, FL) - Best if head measurements unavailable
    if (acCm && flCm) {
      const log10Efw =
        1.304 + 0.05281 * acCm + 0.1938 * flCm - 0.004 * acCm * flCm;
      return Math.round(Math.pow(10, log10Efw));
    }

    // 5. Hadlock (BPD, AC)
    if (bpdCm && acCm) {
      const log10Efw =
        1.095 + 0.0766 * acCm + 0.108 * bpdCm - 0.0019 * acCm * bpdCm;
      return Math.round(Math.pow(10, log10Efw));
    }
  } catch (error) {
    console.error("Error calculating fetal weight", error);
  }

  return null;
}

/**
 * Calculates Estimated Gestational Age (EGA) and Estimated Due Date (EDD)
 * based on Last Menstrual Period (LMP).
 * Standard pregnancy is exactly 280 days (40 weeks) from LMP.
 */
export function calculateAgeFromLMP(lmpDateStr: string, benchmarkDateStr?: string) {
  const lmp = new Date(lmpDateStr);
  const benchmark = benchmarkDateStr ? new Date(benchmarkDateStr) : new Date();

  // Reset hours to avoid DST rounding discrepancies
  lmp.setHours(12, 0, 0, 0);
  benchmark.setHours(12, 0, 0, 0);

  const diffTime = benchmark.getTime() - lmp.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { weeks: "0", days: "0", edd: "" };
  }

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  // EDD = LMP + 280 days
  const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  const eddStr = edd.toISOString().split("T")[0];

  return {
    weeks: weeks.toString(),
    days: days.toString(),
    edd: eddStr,
  };
}

/**
 * Calculates Gestational Age and EDD for IVF pregnancies
 * - Day 3 transfer: EDD = Transfer Date + 263 days. Fetal age in days = Transfer Date diff + 17 days
 * - Day 5 transfer: EDD = Transfer Date + 261 days. Fetal age in days = Transfer Date diff + 19 days
 */
export function calculateAgeFromIVF(
  transferDateStr: string,
  embryoType: "day3" | "day5",
  benchmarkDateStr?: string
) {
  const transfer = new Date(transferDateStr);
  const benchmark = benchmarkDateStr ? new Date(benchmarkDateStr) : new Date();

  transfer.setHours(12, 0, 0, 0);
  benchmark.setHours(12, 0, 0, 0);

  const diffTime = benchmark.getTime() - transfer.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const offset = embryoType === "day5" ? 19 : 17;
  const totalFetalAgeInDays = diffDays + offset;

  if (totalFetalAgeInDays < 0) {
    return { weeks: "0", days: "0", edd: "" };
  }

  const weeks = Math.floor(totalFetalAgeInDays / 7);
  const days = totalFetalAgeInDays % 7;

  // EDD = Transfer + 263 (for Day 3) or 261 (for Day 5)
  const eddOffsetDays = embryoType === "day5" ? 261 : 263;
  const edd = new Date(transfer.getTime() + eddOffsetDays * 24 * 60 * 60 * 1000);
  const eddStr = edd.toISOString().split("T")[0];

  return {
    weeks: weeks.toString(),
    days: days.toString(),
    edd: eddStr,
  };
}

// Default Professional Normal Templates for Vietnamese OB-GYN Clinics
export const GYNECOLOGIC_NORMAL_PRESET: Partial<GynecologicMeasurements> = {
  uterusPosition: "Ngả trước",
  uterusSizeLength: "52",
  uterusSizeAP: "36",
  uterusStructure: "Cấu trúc cơ tử cung đều, mịn, không phát hiện khối u khu trú.",
  endometriumThickness: "8",
  endometriumStructure: "Nội mạc tử cung đều, cấu trúc đồng nhất, ba lá rõ.",
  rightOvaryStructure: "Kích thước bình thường, nhu mô đều, có vài nang nhỏ sinh lý.",
  rightOvarySize: "24",
  leftOvaryStructure: "Kích thước bình thường, nhu mô đều, không có khối u bất thường.",
  leftOvarySize: "22",
  douglasPouchFluid: "none",
  douglasPouchParams: "Không có dịch túi lách, túi cùng Douglas xẹp.",
  extraFindings: "Phần phụ hai bên không sưng đau, nhu mạc thông thường.",
  conclusion: "Hình ảnh siêu âm tử cung, phần phụ hiện tại chưa phát hiện thấy bệnh lý bất thường.",
  recommendations: "Tái khám định kỳ theo lịch khám phụ khoa hoặc khi có triệu chứng đau bụng bụng dưới hay rối loạn kinh nguyệt.",
};

export const OBSTETRIC_FIRST_TRIMESTER_PRESET: Partial<ObstetricMeasurements> = {
  fetalCount: "Đơn thai",
  presentation: "Di động (Thai nhỏ)",
  cardiacActivity: "Có",
  fetalHeartRate: "162",
  fetalMovement: "Có",
  bpd: "20",
  fl: "8",
  ac: "55",
  hc: "70",
  crl: "54",
  calculationMethod: "lmp",
  placentaLocation: "Mặt sau tử cung",
  placentaGrade: "Độ 0",
  amnioticFluidVolume: "Bình thường",
  amnioticFluidIndex: "Xoang lớn nhất 35mm",
  extraFindings: "Cấu trúc hộp sọ, cột sống, bốn chi thai nhi sơ bộ liên tục bình thường.",
  conclusion: "Một thai sống trong tử cung phát triển tương đương khoảng 12 tuần 0 ngày.",
  recommendations: "Ăn uống dinh dưỡng, bổ sung sắt, canxi. Tái khám thai định kỳ theo lịch để khảo sát hình thái học mốc 20-22 tuần.",
};

export const OBSTETRIC_LATE_PRESET: Partial<ObstetricMeasurements> = {
  fetalCount: "Đơn thai",
  presentation: "Ngôi đầu",
  cardiacActivity: "Có",
  fetalHeartRate: "142",
  fetalMovement: "Có",
  bpd: "82",
  fl: "62",
  ac: "282",
  hc: "305",
  crl: "",
  calculationMethod: "lmp",
  placentaLocation: "Mặt trước, bám nhóm I (đáy - thân phụ)",
  placentaGrade: "Độ II",
  amnioticFluidVolume: "Bình thường",
  amnioticFluidIndex: "AFI = 120mm",
  extraFindings: "Các cấu trúc tim thai 4 buồng bốc, vách ngăn não thất trung tâm, thận và bàng quang nằm trong giới hạn sinh lý.",
  conclusion: "Một thai sống trong tử cung (Ngôi đầu) phát triển bình thường tương đương khoảng 32 tuần.",
  recommendations: "Đếm cử động thai hàng ngày. Tái khám thai sau 2 tuần hoặc ngay khi có dấu hiệu bất thường (đau bụng, ra huyết, ra nước âm đạo, thai máy yếu).",
};
