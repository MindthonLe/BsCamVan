export enum ProtocolType {
  Obstetric = "OBSTETRIC", // Sản khoa
  Gynecologic = "GYNECOLOGIC", // Phụ khoa
}

export interface ClinicProfile {
  clinicName: string;
  doctorName: string;
  specialty: string;
  address: string;
  phone: string;
  logoUrl?: string; // Optional custom logo (base64)
  websiteEmail?: string;
}

export interface PatientInfo {
  patientCode: string; // Mã bệnh nhân
  fullName: string; // Họ tên
  birthYear: string; // Năm sinh / Tuổi
  address: string; // Địa chỉ
  clinicalDiagnosis: string; // Chẩn đoán lâm sàng
  reasonForExam: string; // Lý do khám
  examDate: string; // Ngày khám (YYYY-MM-DD)
}

// Biometrics for Obstetrical Ultrasound (Siêu âm Sản khoa)
export interface ObstetricMeasurements {
  fetalCount: string; // Số thai (Đơn thai, Song thai...)
  presentation: string; // Ngôi thai (Đầu, mông, di động)
  cardiacActivity: string; // Tim thai (Có/Không)
  fetalHeartRate: string; // Tần số tim thai (bpm)
  fetalMovement: string; // Cử động thai

  // Biometry
  bpd: string; // Đường kính lưỡng đỉnh (mm)
  fl: string; // Chiều dài xương đùi (mm)
  ac: string; // Chu vi vòng bụng (mm)
  hc: string; // Chu vi vòng đầu (mm)
  crl: string; // Chiều dài đầu mông (mm) - dùng cho thai kỳ sớm
  efw: string; // Cân nặng ước lượng (g)

  // Gestational Age & EDD
  calculationMethod: "lmp" | "embryo" | "manual";
  lmpDate?: string; // Ngày kinh cuối cùng
  embryoAge?: "day3" | "day5"; // Tuổi phôi IVF
  embryoTransferDate?: string; // Ngày chuyển phôi IVF
  gestationalWeeks: string; // Tuổi thai tuần
  gestationalDays: string; // Tuổi thai ngày
  eddDate: string; // Ngày dự sinh (YYYY-MM-DD)

  // Placenta & Amniotic Fluid
  placentaLocation: string; // Vị trí bám nhau
  placentaGrade: string; // Độ trưởng thành bánh nhau (Độ 0, I, II, III)
  amnioticFluidVolume: string; // Lượng nước ối (Bình thường, Đa ối, Thiểu ối)
  amnioticFluidIndex: string; // Chỉ số ối (AFI hoặc xoang ối lớn nhất - mm)

  extraFindings: string; // Bất thường khác (nếu có)
  conclusion: string; // Kết luận
  recommendations: string; // Dặn dò của bác sĩ
}

// Gynecological Ultrasound (Siêu âm Phụ khoa)
export interface GynecologicMeasurements {
  uterusPosition: string; // Tư thế tử cung (ngả trước, ngả sau, trung gian)
  uterusSizeLength: string; // Chiều dài tử cung (mm)
  uterusSizeAP: string; // Đường kính trước sau (AP) (mm)
  uterusStructure: string; // Cấu trúc cơ tử cung (đều, u xơ...)
  endometriumThickness: string; // Chiều dày nội mạc tử cung (mm)
  endometriumStructure: string; // Cấu trúc nội mạc (đồng nhất, ba lá, không đều...)

  rightOvaryStructure: string; // Cấu trúc buồng trứng phải (bình thường, nang chứa dịch...)
  rightOvarySize: string; // Kích thước BT phải (mm)
  leftOvaryStructure: string; // Cấu trúc buồng trứng trái (bình thường, nang chứa dịch...)
  leftOvarySize: string; // Kích thước BT trái (mm)

  douglasPouchFluid: "none" | "few" | "much"; // Dịch túi cùng Douglas (không, ít, nhiều)
  douglasPouchParams: string; // Chi tiết lượng dịch hoặc bất thường khác (mm)

  extraFindings: string; // Các bất thường khác
  conclusion: string; // Kết luận
  recommendations: string; // Dặn dò bác sĩ
}

export interface UltrasoundReport {
  id: string;
  patient: PatientInfo;
  protocolType: ProtocolType;
  obstetric?: ObstetricMeasurements;
  gynecologic?: GynecologicMeasurements;
  images: string[]; // Base64 images (Gynecological: 1 image, Obstetric: up to 2 images)
  imageCaptions: string[]; // Captions for images
  createdAt: string;
}
