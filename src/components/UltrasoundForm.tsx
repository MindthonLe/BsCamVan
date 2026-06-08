import React, { useState, useEffect } from "react";
import {
  ProtocolType,
  PatientInfo,
  ObstetricMeasurements,
  GynecologicMeasurements,
  UltrasoundReport,
} from "../types";
import {
  calculateFetalWeight,
  calculateAgeFromLMP,
  calculateAgeFromIVF,
  GYNECOLOGIC_NORMAL_PRESET,
  OBSTETRIC_FIRST_TRIMESTER_PRESET,
  OBSTETRIC_LATE_PRESET,
} from "../utils/calc";
import ImagePasteArea from "./ImagePasteArea";
import {
  User,
  Heart,
  Baby,
  Activity,
  FileText,
  Eye,
  Calendar,
  Sparkles,
  ClipboardList,
  Flame,
  Scale,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

interface UltrasoundFormProps {
  initialReport?: UltrasoundReport;
  onPreview: (report: UltrasoundReport) => void;
  onSaveDraft?: (report: UltrasoundReport) => void;
}

export default function UltrasoundForm({
  initialReport,
  onPreview,
  onSaveDraft,
}: UltrasoundFormProps) {
  // Protocol Type State
  const [protocol, setProtocol] = useState<ProtocolType>(
    initialReport?.protocolType || ProtocolType.Obstetric
  );

  // Patient Info State
  const [patient, setPatient] = useState<PatientInfo>(
    initialReport?.patient || {
      patientCode: `BN-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`,
      fullName: "",
      birthYear: "",
      address: "",
      clinicalDiagnosis: "Khám định kỳ",
      reasonForExam: "Siêu âm tầm soát sản phụ khoa",
      examDate: new Date().toISOString().split("T")[0],
    }
  );

  // Obstetric State
  const [obstetric, setObstetric] = useState<ObstetricMeasurements>(
    initialReport?.obstetric || {
      fetalCount: "Đơn thai",
      presentation: "Di động",
      cardiacActivity: "Có",
      fetalHeartRate: "145",
      fetalMovement: "Có",
      bpd: "",
      fl: "",
      ac: "",
      hc: "",
      crl: "",
      efw: "",
      calculationMethod: "lmp",
      lmpDate: "",
      embryoAge: "day5",
      embryoTransferDate: "",
      gestationalWeeks: "0",
      gestationalDays: "0",
      eddDate: "",
      placentaLocation: "Mặt sau tử cung",
      placentaGrade: "Độ 0",
      amnioticFluidVolume: "Bình thường",
      amnioticFluidIndex: "",
      extraFindings: "Khảo sát chưa phát hiện bất thường hình thái.",
      conclusion: "",
      recommendations: "Tái khám thai định kỳ theo lịch hẹn.",
    }
  );

  // Gynecological State
  const [gynecologic, setGynecologic] = useState<GynecologicMeasurements>(
    initialReport?.gynecologic || {
      uterusPosition: "Ngả trước",
      uterusSizeLength: "50",
      uterusSizeAP: "35",
      uterusStructure: "Cơ tử cung có cấu trúc đồng nhất, không xơ hóa.",
      endometriumThickness: "8",
      endometriumStructure: "Nội mạc đều, cấu trúc đồng nhất.",
      rightOvaryStructure: "Bình thường",
      rightOvarySize: "26",
      leftOvaryStructure: "Bình thường",
      leftOvarySize: "25",
      douglasPouchFluid: "none",
      douglasPouchParams: "Túi cùng Douglas không có dịch bất thường.",
      extraFindings: "Hai phần phụ nhu mô đều.",
      conclusion: "",
      recommendations: "Tái khám phụ khoa định kỳ mỗi 6 tháng.",
    }
  );

  // Captured Images State
  const [images, setImages] = useState<string[]>(initialReport?.images || []);
  const [imageCaptions, setImageCaptions] = useState<string[]>(
    initialReport?.imageCaptions || ["Hình siêu âm 1", "Hình siêu âm 2"]
  );

  // Generate automated conclusion based on parameters if empty
  useEffect(() => {
    if (protocol === ProtocolType.Obstetric) {
      const parts = [];
      parts.push(`${obstetric.fetalCount} sống trong tử cung`);
      if (obstetric.gestationalWeeks && parseInt(obstetric.gestationalWeeks) > 0) {
        parts.push(`phát triển tương đương khoảng ${obstetric.gestationalWeeks} tuần ${obstetric.gestationalDays} ngày`);
      }
      if (obstetric.presentation !== "Di động" && obstetric.presentation) {
        parts.push(`(${obstetric.presentation})`);
      }
      const generatedConclusion = parts.length > 0 ? parts.join(" ") + "." : "";

      if (!obstetric.conclusion) {
        setObstetric((prev) => ({ ...prev, conclusion: generatedConclusion }));
      }
    } else {
      const generatedConclusion = `${gynecologic.uterusPosition}, nội mạc tử cung dày ${gynecologic.endometriumThickness} mm. Hiện tại chưa phát hiện bất thường nhu mô hữu hình hai bên buồng trứng.`;
      if (!gynecologic.conclusion) {
        setGynecologic((prev) => ({ ...prev, conclusion: generatedConclusion }));
      }
    }
  }, [protocol]);

  // Handle auto-calculating fetal weight using Hadlock 2 (BPD, AC, FL) or standard available variables
  useEffect(() => {
    if (protocol === ProtocolType.Obstetric) {
      const bpdVal = parseFloat(obstetric.bpd);
      const flVal = parseFloat(obstetric.fl);
      const acVal = parseFloat(obstetric.ac);
      const hcVal = parseFloat(obstetric.hc);

      if (acVal && flVal) {
        const calculated = calculateFetalWeight({
          bpd: bpdVal || undefined,
          fl: flVal || undefined,
          ac: acVal || undefined,
          hc: hcVal || undefined,
        });
        if (calculated) {
          setObstetric((prev) => ({ ...prev, efw: calculated.toString() }));
        }
      }
    }
  }, [obstetric.bpd, obstetric.fl, obstetric.ac, obstetric.hc, protocol]);

  // Handle auto-calculating pregnancy age and due date (EDD)
  useEffect(() => {
    if (protocol === ProtocolType.Obstetric) {
      const benchmarkDate = patient.examDate || new Date().toISOString().split("T")[0];
      
      if (obstetric.calculationMethod === "lmp" && obstetric.lmpDate) {
        const { weeks, days, edd } = calculateAgeFromLMP(obstetric.lmpDate, benchmarkDate);
        setObstetric((prev) => ({
          ...prev,
          gestationalWeeks: weeks,
          gestationalDays: days,
          eddDate: edd,
        }));
      } else if (
        obstetric.calculationMethod === "embryo" &&
        obstetric.embryoTransferDate &&
        obstetric.embryoAge
      ) {
        const { weeks, days, edd } = calculateAgeFromIVF(
          obstetric.embryoTransferDate,
          obstetric.embryoAge,
          benchmarkDate
        );
        setObstetric((prev) => ({
          ...prev,
          gestationalWeeks: weeks,
          gestationalDays: days,
          eddDate: edd,
        }));
      }
    }
  }, [
    obstetric.calculationMethod,
    obstetric.lmpDate,
    obstetric.embryoTransferDate,
    obstetric.embryoAge,
    patient.examDate,
    protocol,
  ]);

  // Set limits on images based on selected type
  useEffect(() => {
    if (protocol === ProtocolType.Gynecologic && images.length > 1) {
      // Gynecological only needs 1 picture
      setImages([images[0]]);
      setImageCaptions(["Hình siêu âm Phụ khoa"]);
    } else if (protocol === ProtocolType.Obstetric && imageCaptions.length < 2) {
      setImageCaptions(["Hình siêu âm Sản khoa 1", "Hình siêu âm Sản khoa 2"]);
    }
  }, [protocol, images]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleObsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setObstetric((prev) => ({ ...prev, [name]: value }));
  };

  const handleGynChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGynecologic((prev) => ({ ...prev, [name]: value }));
  };

  const applyNormalPreset = (type: "OB_EARLY" | "OB_LATE" | "GYN") => {
    if (type === "GYN") {
      setProtocol(ProtocolType.Gynecologic);
      setGynecologic((prev) => ({ ...prev, ...GYNECOLOGIC_NORMAL_PRESET }));
      
      // Auto fill conclusion
      const gynConclusion = GYNECOLOGIC_NORMAL_PRESET.conclusion || "";
      setGynecologic((prev) => ({ ...prev, conclusion: gynConclusion }));
    } else if (type === "OB_EARLY") {
      setProtocol(ProtocolType.Obstetric);
      setObstetric((prev) => ({ ...prev, ...OBSTETRIC_FIRST_TRIMESTER_PRESET }));
      
      // Seed an LMP date 12 weeks ago to match
      const lmp = new Date();
      lmp.setDate(lmp.getDate() - 12 * 7);
      setObstetric((prev) => ({
        ...prev,
        lmpDate: lmp.toISOString().split("T")[0],
        gestationalWeeks: "12",
        gestationalDays: "0",
        conclusion: OBSTETRIC_FIRST_TRIMESTER_PRESET.conclusion || "",
      }));
    } else if (type === "OB_LATE") {
      setProtocol(ProtocolType.Obstetric);
      setObstetric((prev) => ({ ...prev, ...OBSTETRIC_LATE_PRESET }));
      
      // Seed an LMP date 32 weeks ago
      const lmp = new Date();
      lmp.setDate(lmp.getDate() - 32 * 7);
      setObstetric((prev) => ({
        ...prev,
        lmpDate: lmp.toISOString().split("T")[0],
        gestationalWeeks: "32",
        gestationalDays: "0",
        conclusion: OBSTETRIC_LATE_PRESET.conclusion || "",
      }));
    }
  };

  const handleImageChange = (index: number, base64Data: string) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = base64Data;
      return next;
    });
  };

  const handleImageClear = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleCaptionChange = (index: number, text: string) => {
    setImageCaptions((prev) => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalReport: UltrasoundReport = {
      id: initialReport?.id || `REP-${Date.now()}`,
      patient,
      protocolType: protocol,
      obstetric: protocol === ProtocolType.Obstetric ? obstetric : undefined,
      gynecologic: protocol === ProtocolType.Gynecologic ? gynecologic : undefined,
      images: images.filter(Boolean),
      imageCaptions: imageCaptions.slice(0, images.length),
      createdAt: initialReport?.createdAt || new Date().toISOString(),
    };

    onPreview(finalReport);
  };

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
      
      {/* LEFT FORM BLOCK */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* METRICS & PATIENT DECLARATION */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Thông Tin Hành Chính Bệnh Nhân</h3>
                <p className="text-[11px] text-slate-400">Khai báo mã hồ sơ, chi tiết thông tin và lý do thăm khám</p>
              </div>
            </div>

            {/* Quick Presets for normal findings */}
            <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 hidden sm:inline-block">Mẫu nhanh:</span>
              <button
                type="button"
                onClick={() => applyNormalPreset("GYN")}
                className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-100 hover:bg-teal-100 px-2 py-1 rounded transition"
              >
                Phụ Khoa Thường
              </button>
              <button
                type="button"
                onClick={() => applyNormalPreset("OB_EARLY")}
                className="text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-100 hover:bg-pink-100 px-2 py-1 rounded transition"
              >
                Sản Khoa 12T
              </button>
              <button
                type="button"
                onClick={() => applyNormalPreset("OB_LATE")}
                className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 hover:bg-purple-100 px-2 py-1 rounded transition"
              >
                Sản Khoa 32T
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Mã bệnh nhân</label>
              <div className="relative">
                <input
                  type="text"
                  name="patientCode"
                  value={patient.patientCode}
                  onChange={handlePatientChange}
                  required
                  placeholder="Mã BN..."
                  className="w-full text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-2 uppercase outline-none focus:border-indigo-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPatient((prev) => ({
                      ...prev,
                      patientCode: `BN-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`,
                    }))
                  }
                  className="absolute right-2 top-2 text-indigo-500 hover:text-indigo-700"
                  title="Tạo mã ngẫu nhiên"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Họ và tên bệnh nhân</label>
              <input
                type="text"
                name="fullName"
                value={patient.fullName}
                onChange={handlePatientChange}
                required
                placeholder="Nhập chữ IN HOA (Ví dụ: NGUYỄN THỊ LỆ ANH)"
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 font-bold uppercase text-slate-900 placeholder:normal-case placeholder:font-normal"
              />
            </div>

            <div className="sm:col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Năm sinh</label>
              <input
                type="number"
                name="birthYear"
                value={patient.birthYear}
                onChange={handlePatientChange}
                required
                min={1930}
                max={new Date().getFullYear()}
                placeholder="Ví dụ: 1995"
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-4 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Địa chỉ bệnh nhân</label>
              <input
                type="text"
                name="address"
                value={patient.address}
                onChange={handlePatientChange}
                placeholder="Thành phố, Quận, phường/thôn..."
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Ngày làm siêu âm</label>
              <input
                type="date"
                name="examDate"
                value={patient.examDate}
                onChange={handlePatientChange}
                required
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Lý do thăm khám</label>
              <input
                type="text"
                name="reasonForExam"
                value={patient.reasonForExam}
                onChange={handlePatientChange}
                placeholder="Trễ kinh, Đau bụng hạ vị, Xét nghiệm sảy thai..."
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-semibold text-slate-600">Chẩn đoán lâm sàng</label>
              <input
                type="text"
                name="clinicalDiagnosis"
                value={patient.clinicalDiagnosis}
                onChange={handlePatientChange}
                placeholder="Ví dụ: Thai con so 12 tuần / Nghi u xơ tử cung"
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 outline-none focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* PROTOCOL TYPE SELECTOR */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
          <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Lựa chọn đối tượng siêu âm chuyên khoa
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setProtocol(ProtocolType.Obstetric)}
              className={`p-4 rounded-xl border-2 text-left flex items-start space-x-3 transition duration-150 ${
                protocol === ProtocolType.Obstetric
                  ? "border-pink-500 bg-pink-50/40 ring-2 ring-pink-500/10 text-pink-950"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className={`p-2 rounded-lg ${protocol === ProtocolType.Obstetric ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                <Baby size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black block">SIÊU ÂM SẢN KHOA</span>
                <span className="text-[10px] opacity-80 block">Khảo sát thai nhi, tuổi thai, ối, nhau, tim thai (2D)</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setProtocol(ProtocolType.Gynecologic)}
              className={`p-4 rounded-xl border-2 text-left flex items-start space-x-3 transition duration-150 ${
                protocol === ProtocolType.Gynecologic
                  ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/10 text-teal-950"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className={`p-2 rounded-lg ${protocol === ProtocolType.Gynecologic ? "bg-teal-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                <Activity size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black block">SIÊU ÂM PHỤ KHOA</span>
                <span className="text-[10px] opacity-80 block">Khảo sát tử cung, nội mạc, buồng trứng, túi cùng (2D)</span>
              </div>
            </button>
          </div>
        </div>

        {/* CLINICAL MEASUREMENTS (OBSTETRIC OR GYNECOLOGIC) */}
        {protocol === ProtocolType.Obstetric ? (
          /* OBSTETRIC PARAMETERS FORM */
          <div className="bg-white rounded-xl border border-pink-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center space-x-2 pb-3 border-b border-pink-50">
              <div className="p-1.5 bg-pink-50 rounded text-pink-500">
                <Heart size={16} />
              </div>
              <h3 className="text-xs font-black uppercase text-pink-950 tracking-wider">
                Số liệu đo đạc siêu âm sản khoa
              </h3>
            </div>

            {/* Gestational calculations methods */}
            <div className="bg-pink-50/30 p-4 rounded-xl border border-pink-100/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-pink-950">Công cụ tính Tuổi thai & Dự sinh (EDD)</label>
                <div className="flex space-x-2">
                  <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="calculationMethod"
                      value="lmp"
                      checked={obstetric.calculationMethod === "lmp"}
                      onChange={handleObsChange}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span>Kinh cuối (LMP)</span>
                  </label>
                  <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="calculationMethod"
                      value="embryo"
                      checked={obstetric.calculationMethod === "embryo"}
                      onChange={handleObsChange}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span>Chuyển phôi (IVF)</span>
                  </label>
                  <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="calculationMethod"
                      value="manual"
                      checked={obstetric.calculationMethod === "manual"}
                      onChange={handleObsChange}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span>Tự nhập</span>
                  </label>
                </div>
              </div>

              {obstetric.calculationMethod === "lmp" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Ngày bắt đầu kỳ kinh cuối cùng (LMP)</span>
                    <input
                      type="date"
                      name="lmpDate"
                      value={obstetric.lmpDate || ""}
                      onChange={handleObsChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-pink-100 flex-1 md:col-span-2">
                    Tuổi thai tính toán: <strong>{obstetric.gestationalWeeks} tuần {obstetric.gestationalDays} ngày</strong>. Dự sinh: <strong>{obstetric.eddDate ? obstetric.eddDate.split("-").reverse().join("/") : "Chưa xác định"}</strong>
                  </div>
                </div>
              )}

              {obstetric.calculationMethod === "embryo" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 font-sans">Ngày chuyển phôi</span>
                    <input
                      type="date"
                      name="embryoTransferDate"
                      value={obstetric.embryoTransferDate || ""}
                      onChange={handleObsChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 font-sans">Loại phôi nuôi cấy</span>
                    <select
                      name="embryoAge"
                      value={obstetric.embryoAge || "day5"}
                      onChange={handleObsChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                    >
                      <option value="day3">Phôi ngày 3 (D3)</option>
                      <option value="day5">Phôi ngày 5 (D5)</option>
                    </select>
                  </div>
                  <div className="text-xs text-slate-600 bg-white p-2 rounded border border-pink-100 flex-1 md:col-span-2">
                    Tuổi thai IVF: <strong>{obstetric.gestationalWeeks} tuần {obstetric.gestationalDays} ngày</strong>. Dự sinh: <strong>{obstetric.eddDate ? obstetric.eddDate.split("-").reverse().join("/") : "Chưa xác định"}</strong>
                  </div>
                </div>
              )}

              {obstetric.calculationMethod === "manual" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Số tuần thai</span>
                    <input
                      type="number"
                      name="gestationalWeeks"
                      value={obstetric.gestationalWeeks}
                      onChange={handleObsChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Số ngày lẻ</span>
                    <input
                      type="number"
                      name="gestationalDays"
                      value={obstetric.gestationalDays}
                      onChange={handleObsChange}
                      required
                      min={0}
                      max={6}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Ngày dự sinh (EDD)</span>
                    <input
                      type="date"
                      name="eddDate"
                      value={obstetric.eddDate}
                      onChange={handleObsChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick biometric entries */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Số lượng thai</label>
                <input
                  type="text"
                  name="fetalCount"
                  value={obstetric.fetalCount}
                  onChange={handleObsChange}
                  placeholder="Đơn thai/Song thai..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Ngôi thai</label>
                <input
                  type="text"
                  name="presentation"
                  value={obstetric.presentation}
                  onChange={handleObsChange}
                  placeholder="Đầu/mông/di động..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tim thai</label>
                <select
                  name="cardiacActivity"
                  value={obstetric.cardiacActivity}
                  onChange={handleObsChange}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Có">Có hoạt động</option>
                  <option value="Không">Không khảo sát thấy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tần số tim thai (bpm)</label>
                <input
                  type="number"
                  name="fetalHeartRate"
                  value={obstetric.fetalHeartRate}
                  onChange={handleObsChange}
                  placeholder="Khoảng 120-160 bpm"
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Nước ối</label>
                <select
                  name="amnioticFluidVolume"
                  value={obstetric.amnioticFluidVolume}
                  onChange={handleObsChange}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Bình thường">Bình thường</option>
                  <option value="Thiểu ối">Thiểu ối (Oligohydramnios)</option>
                  <option value="Đa ối">Đa ối (Polyhydramnios)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Chỉ số ối chi tiết</label>
                <input
                  type="text"
                  name="amnioticFluidIndex"
                  value={obstetric.amnioticFluidIndex}
                  onChange={handleObsChange}
                  placeholder="Xoang lớn nhất / AFI (mm)..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Placenta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Vị trí bám bánh nhau</label>
                <input
                  type="text"
                  name="placentaLocation"
                  value={obstetric.placentaLocation}
                  onChange={handleObsChange}
                  placeholder="Mặt trước, mặt sau, bám thấp, nhóm I/II..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Độ trưởng thành nhau (Grannum)</label>
                <select
                  name="placentaGrade"
                  value={obstetric.placentaGrade}
                  onChange={handleObsChange}
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white"
                >
                  <option value="Độ 0">Độ 0</option>
                  <option value="Độ I">Độ I</option>
                  <option value="Độ II">Độ II</option>
                  <option value="Độ III">Độ III</option>
                </select>
              </div>
            </div>

            {/* Fetal Biometrics & Automatic Calculations Banner */}
            <div className="bg-indigo-50/20 rounded-xl p-5 border border-indigo-100 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">Số đo sinh trắc học thai (Biometry)</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-semibold">Tự hóa cân nặng theo Hadlock</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">ĐK Lưỡng Đỉnh (BPD)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="bpd"
                      value={obstetric.bpd}
                      onChange={handleObsChange}
                      placeholder="mm"
                      className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">mm</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Chiều Dài Xương Đùi (FL)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="fl"
                      value={obstetric.fl}
                      onChange={handleObsChange}
                      placeholder="mm"
                      className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">mm</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Chu Vi Vòng Bụng (AC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="ac"
                      value={obstetric.ac}
                      onChange={handleObsChange}
                      placeholder="mm"
                      className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">mm</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Chu Vi Vòng Đầu (HC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="hc"
                      value={obstetric.hc}
                      onChange={handleObsChange}
                      placeholder="mm"
                      className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">mm</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 block">Chiều dài đầu mông (CRL)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="crl"
                      value={obstetric.crl}
                      onChange={handleObsChange}
                      placeholder="mm (tuần thai 1)"
                      className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-2 font-bold"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-slate-400 font-bold">mm</span>
                  </div>
                </div>

                <div className="space-y-1 col-span-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-indigo-950 block">Ước lượng cân nặng thai nhi (EFW)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="efw"
                      value={obstetric.efw}
                      onChange={handleObsChange}
                      placeholder="Ước lượng theo công thức"
                      className="w-full text-xs border border-indigo-200 bg-indigo-50/40 rounded-lg pl-3 pr-12 py-2 font-black text-indigo-900 focus:bg-white"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-indigo-700 font-bold">gram</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text blocks: Extra findings, conclusions, recommendations */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Khảo sát hình thái học khác (Ghi chú)</label>
                <textarea
                  name="extraFindings"
                  rows={2}
                  value={obstetric.extraFindings}
                  onChange={handleObsChange}
                  placeholder="Khảo sát chi tiết hình khối hộp sọ, chi tiết cột sống, bàng quang cơ thể thai..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-medium text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">KẾT LUẬN SIÊU ÂM SẢN KHOA</label>
                <textarea
                  name="conclusion"
                  rows={3}
                  value={obstetric.conclusion}
                  onChange={handleObsChange}
                  required
                  placeholder="Ví dụ: 01 thai sống trong tử cung tương đương 12 tuần 0 ngày phát triển bình thường."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-black text-indigo-950 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Dặn dò của bác sĩ siêu âm</label>
                <input
                  type="text"
                  name="recommendations"
                  value={obstetric.recommendations}
                  onChange={handleObsChange}
                  placeholder="Ví dụ: Tái khám định kỳ theo lịch tư vấn dinh dưỡng của sản khoa."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 text-slate-850 font-semibold italic"
                />
              </div>
            </div>
          </div>
        ) : (
          /* GYNECOLOGIC PARAMETERS FORM */
          <div className="bg-white rounded-xl border border-teal-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center space-x-2 pb-3 border-b border-teal-50">
              <div className="p-1.5 bg-teal-50 rounded text-teal-500">
                <Activity size={16} />
              </div>
              <h3 className="text-xs font-black uppercase text-teal-950 tracking-wider">
                Mẫu khảo sát siêu âm phụ khoa
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Uterus measurements */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-black text-indigo-950 uppercase">Tử cung & Thân cơ</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Tư thế tử cung</span>
                    <select
                      name="uterusPosition"
                      value={gynecologic.uterusPosition}
                      onChange={handleGynChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-medium"
                    >
                      <option value="Ngả trước">Ngả trước (Anteverted)</option>
                      <option value="Ngả sau">Ngả sau (Retroverted)</option>
                      <option value="Trung gian">Trung gian (Midposed)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Nội mạc dày</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="endometriumThickness"
                        value={gynecologic.endometriumThickness}
                        onChange={handleGynChange}
                        placeholder="mm"
                        className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 font-bold text-slate-900"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-slate-400 font-bold">mm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Đường kính AP</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="uterusSizeAP"
                        value={gynecologic.uterusSizeAP}
                        onChange={handleGynChange}
                        placeholder="mm"
                        className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-slate-400">mm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Chiều dài cơ tử cung</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="uterusSizeLength"
                        value={gynecologic.uterusSizeLength}
                        onChange={handleGynChange}
                        placeholder="mm"
                        className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-slate-400">mm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Mô tả cấu trúc nội mạc</span>
                  <input
                    type="text"
                    name="endometriumStructure"
                    value={gynecologic.endometriumStructure}
                    onChange={handleGynChange}
                    placeholder="Đồng nhất, ba lá, không đều..."
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Mô tả cơ tử cung</span>
                  <textarea
                    name="uterusStructure"
                    rows={1.5}
                    value={gynecologic.uterusStructure}
                    onChange={handleGynChange}
                    placeholder="Mịn, không phát hiện thấy nhân u xơ tử cung phát triển ra ngoài..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Ovaries & Douglas details */}
              <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                <div className="flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                  <span className="text-xs font-black text-indigo-950 uppercase">Buồng Trứng & Douglas</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Buồng trứng Phải (Kích thước)</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="rightOvarySize"
                        value={gynecologic.rightOvarySize}
                        onChange={handleGynChange}
                        placeholder="mm"
                        className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-slate-400">mm</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Buồng trứng Trái (Kích thước)</span>
                    <div className="relative">
                      <input
                        type="number"
                        name="leftOvarySize"
                        value={gynecologic.leftOvarySize}
                        onChange={handleGynChange}
                        placeholder="mm"
                        className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5"
                      />
                      <span className="absolute right-2 top-2 text-[9px] text-slate-400">mm</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Kết cấu buồng trứng Phải</span>
                  <input
                    type="text"
                    name="rightOvaryStructure"
                    value={gynecologic.rightOvaryStructure}
                    onChange={handleGynChange}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Kết cấu buồng trứng Trái</span>
                  <input
                    type="text"
                    name="leftOvaryStructure"
                    value={gynecologic.leftOvaryStructure}
                    onChange={handleGynChange}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block">Dịch túi cùng Douglas</span>
                    <select
                      name="douglasPouchFluid"
                      value={gynecologic.douglasPouchFluid}
                      onChange={handleGynChange}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white font-medium"
                    >
                      <option value="none">Không có dịch</option>
                      <option value="few">Có ít dịch</option>
                      <option value="much">Có nhiều dịch</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 block font-sans">Mô tả dịch/ Douglas</span>
                    <input
                      type="text"
                      name="douglasPouchParams"
                      value={gynecologic.douglasPouchParams}
                      onChange={handleGynChange}
                      placeholder="Không có túi dịch bất thường..."
                      className="w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gynecology conclusions & extra notes */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Khảo sát lâm sàng khác (Hai vòi trứng, hạch hạ vị...)</label>
                <input
                  type="text"
                  name="extraFindings"
                  value={gynecologic.extraFindings}
                  onChange={handleGynChange}
                  placeholder="Khảo sát chưa ghi nhận hình ảnh tụ phì hai phần phụ..."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">KẾT LUẬN SIÊU ÂM PHỤ KHOA</label>
                <textarea
                  name="conclusion"
                  rows={2.5}
                  value={gynecologic.conclusion}
                  onChange={handleGynChange}
                  required
                  placeholder="Ví dụ: Tử cung ngả trước bình thường. Chưa thấy u ngoại lai hai bên buồng trứng."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 outline-none focus:border-teal-500 font-black text-indigo-950 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Dặn dò của bác sĩ phụ khoa</label>
                <input
                  type="text"
                  name="recommendations"
                  value={gynecologic.recommendations}
                  onChange={handleGynChange}
                  placeholder="Ví dụ: Kiểm tra lại sức khỏe và phần phụ định kỳ phòng u nang ẩn."
                  className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-850 font-semibold italic"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR: ULTRASOUND IMAGE ATTACHMENT AREA */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* CLIPIBOARD ATTACHMENT INSTRUCTIONS */}
        <div className="bg-slate-900 text-white rounded-xl shadow-xs p-5 space-y-3">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Sparkles size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Hướng dẫn dán ảnh chụp</span>
          </div>
          <p className="text-[11px] text-slate-350 leading-relaxed">
            Dành cho máy siêu âm 2D đời cũ không lưu trữ cloud: <strong className="text-yellow-300">Nhấn nút chụp hình trên máy hoặc chụp cắt góc màn hình PC (bấm Win+Shift+S hoặc PrintScreen)</strong>, quay lại ứng dụng này nhấp vào ô trống cần dán và nhấn tổ hợp phím <strong className="text-white bg-slate-800 px-1 py-0.5 rounded">Ctrl + V</strong>.
          </p>
          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 bg-slate-950/20 px-2 rounded">
            • Siêu âm sản khoa: dán <strong className="text-pink-400">02 hình ảnh</strong>.<br />
            • Siêu âm phụ khoa: dán <strong className="text-teal-400">01 hình ảnh</strong>.
          </div>
        </div>

        {/* IMAGE CONTAINERS */}
        {protocol === ProtocolType.Obstetric ? (
          /* OBSTETRIC: 2 IMAGES REQUIRED */
          <div className="space-y-4">
            <ImagePasteArea
              label="Hình ảnh Siêu âm 1 (Sản khoa)"
              value={images[0]}
              caption={imageCaptions[0]}
              onChange={(data) => handleImageChange(0, data)}
              onClear={() => handleImageClear(0)}
              onCaptionChange={(txt) => handleCaptionChange(0, txt)}
              placeholder="Nhấp vào đây rồi dán Hình 1 (Ctrl + V)"
            />

            <ImagePasteArea
              label="Hình ảnh Siêu âm 2 (Sản khoa)"
              value={images[1]}
              caption={imageCaptions[1]}
              onChange={(data) => handleImageChange(1, data)}
              onClear={() => handleImageClear(1)}
              onCaptionChange={(txt) => handleCaptionChange(1, txt)}
              placeholder="Nhấp vào đây rồi dán Hình 2 (Ctrl + V)"
            />
          </div>
        ) : (
          /* GYNECOLOGICAL: 1 IMAGE ONLY */
          <div>
            <ImagePasteArea
              label="Hình ảnh Siêu âm (Phụ khoa)"
              value={images[0]}
              caption={imageCaptions[0]}
              onChange={(data) => handleImageChange(0, data)}
              onClear={() => handleImageClear(0)}
              onCaptionChange={(txt) => handleCaptionChange(0, txt)}
              placeholder="Nhấp vào đây rồi dán Hình (Ctrl + V)"
            />
          </div>
        )}

        {/* VERIFY SUBMISSION TRIGGERS */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-md p-5 space-y-3.5">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            <Eye size={16} />
            <span>Xác nhận thông tin lần cuối →</span>
          </button>
          
          <p className="text-[10px] text-slate-500 text-center">
            Trang tiếp theo sẽ hiển thị một mẫu in khổ giấy A4 chuẩn hóa của bộ y tế tích hợp để in ra máy in nhiệt/A4 hoặc lưu file PDF ngay.
          </p>
        </div>
      </div>
    </form>
  );
}
