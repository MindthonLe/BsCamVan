import { useState, useEffect } from "react";
import {
  ProtocolType,
  ClinicProfile,
  UltrasoundReport,
} from "./types";
import UltrasoundForm from "./components/UltrasoundForm";
import PatientHistory from "./components/PatientHistory";
import ClinicProfileSettings from "./components/ClinicProfileSettings";
import ReportPrintView from "./components/ReportPrintView";
import { printReportInNewTab } from "./utils/printHelper";
import {
  Activity,
  UserCheck,
  Building,
  History,
  Clock,
  Printer,
  X,
  Sparkles,
  Info,
} from "lucide-react";

// Pre-packaged medical-grade SVG placeholders representing real 2D ultrasounds 
// to make mock patient records look highly realistic and professional out-of-the-box!
const OB_MOCK_IMAGE_1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2309090b'/><circle cx='200' cy='150' r='120' fill='none' stroke='%233f3f46' stroke-width='2' stroke-dasharray='5,5'/><path d='M 120 180 Q 150 110 200 150 T 280 120' fill='none' stroke='%2371717a' stroke-width='3' opacity='0.7'/><circle cx='200' cy='150' r='10' fill='%23a1a1aa' opacity='0.8'/><circle cx='170' cy='130' r='6' fill='%23d4d4d8' opacity='0.6'/><path d='M100 250 L 150 250 M100 245 L100 255 M150 245 L150 255' stroke='%233b82f6' stroke-width='2'/><text x='110' y='240' fill='%233b82f6' font-family='monospace' font-size='10'>CRL = 50mm</text><text x='15' y='25' fill='%2322c55e' font-family='monospace' font-size='11'>2D GA: 12W0D</text><text x='15' y='45' fill='%23e11d48' font-family='monospace' font-size='10'>FHR: 155 bpm</text><text x='310' y='25' fill='%23a1a1aa' font-family='monospace' font-size='9'>C1-5 / OBSTETRIC</text></svg>";
const OB_MOCK_IMAGE_2 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2309090b'/><circle cx='200' cy='150' r='110' fill='none' stroke='%233f3f46' stroke-width='2' stroke-dasharray='8,4'/><path d='M 140 140 A 50 50 0 0 1 260 140' fill='none' stroke='%23a1a1aa' stroke-width='4' opacity='0.6'/><path d='M 142 140 L 258 140' stroke='%23f43f5e' stroke-width='1.5' stroke-dasharray='3,3'/><path d='M 142 135 L 142 145 M 258 135 L 258 145' stroke='%23f43f5e' stroke-width='1.5'/><text x='170' y='130' fill='%23f43f5e' font-family='monospace' font-size='10'>BPD = 82mm</text><text x='15' y='25' fill='%2322c55e' font-family='monospace' font-size='11'>2D GA: 32W0D</text><text x='310' y='25' fill='%23a1a1aa' font-family='monospace' font-size='9'>C1-5 / OBSTETRIC</text></svg>";
const GYN_MOCK_IMAGE_1 = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2309090b'/><circle cx='200' cy='150' r='120' fill='none' stroke='%2327272a' stroke-width='1.5'/><path d='M 130 160 C 160 110, 240 110, 270 160 C 250 210, 150 210, 130 160 Z' fill='none' stroke='%2352525b' stroke-width='3' opacity='0.7'/><ellipse cx='200' cy='160' rx='40' ry='10' fill='none' stroke='%233f3f46' stroke-width='2' opacity='0.8'/><path d='M 160 160 L 240 160' stroke='%2314b8a6' stroke-width='1.5' stroke-dasharray='2,2'/><text x='180' y='150' fill='%2314b8a6' font-family='monospace' font-size='10'>Endo = 8.0mm</text><text x='15' y='25' fill='%230f766e' font-family='monospace' font-size='11'>2D / L12-5 / GYN</text></svg>";

export default function App() {
  const [activeTab, setActiveTab] = useState<"form" | "history" | "settings" | "preview">("form");

  // Clinic profile default state
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(() => {
    const saved = localStorage.getItem("obgyn_clinic_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      clinicName: "Phòng khám Sản Phụ khoa & Siêu âm Lan Anh",
      doctorName: "ThS. BS. Nguyễn Thị Lan Anh",
      specialty: "Sản Phụ khoa & Siêu âm Chẩn đoán hình ảnh",
      address: "Số 45 Đường Cách Mạng Tháng Tám, Quận 1, TP. Hồ Chí Minh",
      phone: "0908 123 456",
      websiteEmail: "sanphukhoalananh@gmail.com",
    };
  });

  // Reports state
  const [reports, setReports] = useState<UltrasoundReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<UltrasoundReport | undefined>(undefined);

  // Load and seed default reports under localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ultrasound_reports");
    if (saved) {
      try {
        setReports(JSON.parse(saved));
        return;
      } catch (err) {
        console.error("Error reading storage reports", err);
      }
    }

    // Seed realistic Vietnamese patient data if empty for a highly robust developer/user demo experience
    const mockReports: UltrasoundReport[] = [
      {
        id: "REP-MOCK-1",
        patient: {
          patientCode: "BN-20381",
          fullName: "HOÀNG THỊ THẢO VY",
          birthYear: "1994",
          address: "Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
          clinicalDiagnosis: "Thai con so 12 tuần / Khám sàng lọc thai kì sớm",
          reasonForExam: "Trễ kinh tầm soát dị tật sớm",
          examDate: new Date().toISOString().split("T")[0],
        },
        protocolType: ProtocolType.Obstetric,
        obstetric: {
          fetalCount: "Đơn thai",
          presentation: "Di động",
          cardiacActivity: "Có",
          fetalHeartRate: "155",
          fetalMovement: "Có",
          bpd: "20",
          fl: "8",
          ac: "55",
          hc: "70",
          crl: "54",
          efw: "15",
          calculationMethod: "lmp",
          lmpDate: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          gestationalWeeks: "12",
          gestationalDays: "0",
          eddDate: new Date(Date.now() + 28 * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          placentaLocation: "Mặt sau tử cung",
          placentaGrade: "Độ 0",
          amnioticFluidVolume: "Bình thường",
          amnioticFluidIndex: "Xoang lớn nhất 35mm",
          extraFindings: "Xương mũi thai nhi thấy rõ. Cột sống và tủy sống sơ bộ liên tục. Nhịp tim đều nội mạc.",
          conclusion: "MỘT THAI SỐNG TRONG TỬ CUNG PHÁT TRIỂN TƯƠNG ĐƯƠNG KHOẢNG 12 TUẦN 0 NGÀY.",
          recommendations: "Tái khám thai siêu âm 4D hình thái bốc 20-22 tuần theo lịch hẹn.",
        },
        images: [OB_MOCK_IMAGE_1, OB_MOCK_IMAGE_2],
        imageCaptions: ["Mặt cắt CRL đo chiều dài đầu mông", "Mặt cắt BPD đo đường kính lưỡng đỉnh"],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "REP-MOCK-2",
        patient: {
          patientCode: "BN-44293",
          fullName: "TRẦN MINH TÚ QUYÊN",
          birthYear: "1991",
          address: "Thảo Điền, Quận 2, TP. Thủ Đức",
          clinicalDiagnosis: "Rối loạn kinh nguyệt / Siêu âm tử cung phần phụ",
          reasonForExam: "Đau tức bụng vùng hố chậu nhẹ",
          examDate: new Date().toISOString().split("T")[0],
        },
        protocolType: ProtocolType.Gynecologic,
        gynecologic: {
          uterusPosition: "Ngả trước",
          uterusSizeLength: "52",
          uterusSizeAP: "36",
          uterusStructure: "Nhu mô mịn, không có u vách u cơ.",
          endometriumThickness: "8.0",
          endometriumStructure: "Nội mạc đều, cấu trúc đồng nhất, ba lá rõ.",
          rightOvaryStructure: "Bình thường, có nang nhỏ sinh lý",
          rightOvarySize: "24",
          leftOvaryStructure: "Bình thường",
          leftOvarySize: "22",
          douglasPouchFluid: "none",
          douglasPouchParams: "Túi cùng Douglas khô ráo, không tụ dịch.",
          extraFindings: "Không phát hiện thấy tụ huyết dịch vòi trứng phần phụ.",
          conclusion: "HÌNH ẢNH SIÊU ÂM TỬ CUNG VÀ HAI PHÂN PHỤ HIỆN TẠI CHƯA PHÁT HIỆN HÌNH ẢNH BỆNH LÝ BẤT THƯỜNG.",
          recommendations: "Tái khám kiểm tra định kỳ 6 tháng hoặc khi hốt bụng đau hạ vị đột xuất.",
        },
        images: [GYN_MOCK_IMAGE_1],
        imageCaptions: ["Quét dọc thân tử cung đo nội mạc"],
        createdAt: new Date(Date.now() - 3 * 2 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setReports(mockReports);
    localStorage.setItem("ultrasound_reports", JSON.stringify(mockReports));
  }, []);

  // Save Reports list back to local storage on changes
  const saveReportsList = (updatedList: UltrasoundReport[]) => {
    setReports(updatedList);
    localStorage.setItem("ultrasound_reports", JSON.stringify(updatedList));
  };

  // Save Clinic profile on change
  const handleClinicProfileSave = (newProfile: ClinicProfile) => {
    setClinicProfile(newProfile);
    localStorage.setItem("obgyn_clinic_profile", JSON.stringify(newProfile));
  };

  // Preview generated Report
  const handlePreviewReport = (report: UltrasoundReport) => {
    setSelectedReport(report);
    setActiveTab("preview");
  };

  // Accept/Verify draft and save to report history
  const handleSaveReport = (silent = false) => {
    if (!selectedReport) return;

    // Check if report already exists in history list
    const index = reports.findIndex((r) => r.id === selectedReport.id);
    let updated: UltrasoundReport[];
    
    if (index !== -1) {
      // Modify existing
      updated = [...reports];
      updated[index] = selectedReport;
    } else {
      // Create new
      updated = [selectedReport, ...reports];
    }
    
    saveReportsList(updated);

    if (!silent) {
      alert(`Đã lưu kết quả siêu âm bệnh nhân "${selectedReport.patient.fullName}" thành công!`);
      setActiveTab("history");
    }
  };

  const handleTriggerPrint = () => {
    handleSaveReport(true);

    if (selectedReport) {
      printReportInNewTab(selectedReport, clinicProfile);
    }
  };

  const handleSaveOnly = () => {
    handleSaveReport(false);
  };

  const handleEditReportBack = () => {
    setActiveTab("form");
  };

  const handleDeleteReport = (id: string) => {
    const filtered = reports.filter((r) => r.id !== id);
    saveReportsList(filtered);
    if (selectedReport?.id === id) {
      setSelectedReport(undefined);
    }
  };

  const handleLoadReport = (report: UltrasoundReport) => {
    setSelectedReport(report);
    setActiveTab("form");
  };

  const handleReusePatient = (report: UltrasoundReport) => {
    // Keep patient details but generate a new report code
    const clonedPatient = {
      ...report.patient,
      patientCode: `BN-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`,
      examDate: new Date().toISOString().split("T")[0],
    };

    const newReportDraft: UltrasoundReport = {
      id: `REP-${Date.now()}`,
      patient: clonedPatient,
      protocolType: report.protocolType,
      obstetric: report.obstetric ? { ...report.obstetric, bpd: "", fl: "", ac: "", hc: "", crl: "", efw: "", conclusion: "" } : undefined,
      gynecologic: report.gynecologic ? { ...report.gynecologic, endometriumThickness: "8", conclusion: "" } : undefined,
      images: [],
      imageCaptions: report.protocolType === ProtocolType.Obstetric ? ["Hình siêu âm 1", "Hình siêu âm 2"] : ["Hình siêu âm"],
      createdAt: new Date().toISOString(),
    };

    setSelectedReport(newReportDraft);
    setActiveTab("form");
  };

  const startNewReport = () => {
    setSelectedReport(undefined);
    setActiveTab("form");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* PROFESSIONAL TITLE BAR */}
      <header className="bg-indigo-950 text-white shadow-md border-b border-indigo-900/40 no-print select-none">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600/30 text-indigo-300 rounded-xl border border-indigo-500/20">
              <Activity size={24} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-md md:text-lg font-black tracking-wide uppercase">
                  Trợ Lý Siêu Âm Sản Phụ Khoa
                </h1>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-800">
                  Phù hợp Máy 2D
                </span>
              </div>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                Chẩn đoán nhanh • Dán ảnh Clipboard cực nhạy • Xuất PDF A4 chuẩn Bộ Y Tế Việt Nam
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-300 bg-indigo-900/60 p-2 rounded-lg border border-indigo-800/85">
            <span className="text-indigo-400 font-bold block">Bác sĩ phụ trách:</span>
            <span className="text-white block font-black">{clinicProfile.doctorName}</span>
          </div>
        </div>

        {/* TOP TAB NAV BAR */}
        <div className="border-t border-indigo-900 bg-indigo-950/80">
          <div className="max-w-7xl mx-auto px-4 flex">
            <button
              onClick={() => {
                setSelectedReport(undefined);
                setActiveTab("form");
              }}
              className={`py-3 px-5 text-xs font-bold tracking-wider transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === "form" && !selectedReport
                  ? "text-yellow-400 border-yellow-400 bg-indigo-900/40"
                  : "text-slate-300 border-transparent hover:text-white"
              }`}
            >
              <span>🤰 Khám Siêu Âm Mới</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-3 px-5 text-xs font-bold tracking-wider transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === "history"
                  ? "text-yellow-400 border-yellow-400 bg-indigo-900/40"
                  : "text-slate-300 border-transparent hover:text-white"
              }`}
            >
              <History size={13} />
              <span>🗄️ Danh Sách Bệnh Nhân ({reports.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-3 px-5 text-xs font-bold tracking-wider transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === "settings"
                  ? "text-yellow-400 border-yellow-400 bg-indigo-900/40"
                  : "text-slate-300 border-transparent hover:text-white"
              }`}
            >
              <Building size={13} />
              <span>⚙️ Cài Đặt Phòng Khám</span>
            </button>
            {selectedReport && (
              <button
                onClick={() => setActiveTab("preview")}
                className={`py-3 px-5 text-xs font-bold tracking-wider transition-all border-b-2 flex items-center space-x-1.5 ml-auto ${
                  activeTab === "preview"
                    ? "text-pink-400 border-pink-400 bg-indigo-900/40 font-black"
                    : "text-pink-300 border-transparent hover:text-white"
                }`}
              >
                <span>🔍 Xem Thử Mẫu In A4</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CORE DESKTOP VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "form" && (
          <div className="space-y-6 no-print">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-slate-700">
                <Info size={16} className="text-indigo-600 flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  {selectedReport 
                    ? `Bạn đang chỉnh sửa báo cáo bệnh nhân: ` 
                    : `Khai báo bệnh nhân mới. Bạn có thể bấm vào mục danh sách bệnh nhân để xem lại ca khám cũ.`}
                  {selectedReport && <strong className="text-indigo-600 uppercase">{selectedReport.patient.fullName}</strong>}
                </p>
              </div>
              {selectedReport && (
                <button
                  onClick={startNewReport}
                  className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-150 px-3 py-1.5 rounded-lg transition"
                >
                  Huỷ bỏ & Tạo ca siêu âm mới
                </button>
              )}
            </div>

            <UltrasoundForm
              initialReport={selectedReport}
              onPreview={handlePreviewReport}
            />
          </div>
        )}

        {activeTab === "history" && (
          <div className="no-print">
            <PatientHistory
              reports={reports}
              onLoadReport={handleLoadReport}
              onReusePatient={handleReusePatient}
              onDeleteReport={handleDeleteReport}
              onSelectPrint={(report) => {
                setSelectedReport(report);
                setActiveTab("preview");
              }}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto no-print">
            <ClinicProfileSettings
              profile={clinicProfile}
              onSave={handleClinicProfileSave}
            />
          </div>
        )}

        {activeTab === "preview" && selectedReport && (
          <div>
            <ReportPrintView
              report={selectedReport}
              clinicProfile={clinicProfile}
              onPrint={handleTriggerPrint}
              onSave={handleSaveOnly}
              onEdit={handleEditReportBack}
            />
          </div>
        )}
      </main>

      {/* ON-SCREEN CAPTION NOTES ABOUT SAVED DATA */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-400 text-xs text-center space-y-2 select-none no-print">
        <p className="font-semibold text-slate-500 flex items-center justify-center space-x-1.5">
          <UserCheck size={14} />
          <span>Hệ thống hoạt động hoàn toàn Offline & An toàn bảo mật thông tin trên trình duyệt của Bác sĩ.</span>
        </p>
        <p className="text-[11px]">
          Mẫu báo cáo tuân thủ tiêu chuẩn siêu âm thực nghiệm của Sở Y Tế, tích hợp Hadlock Fetal Weight và IVF Gestation calculator.
        </p>
      </footer>
    </div>
  );
}
