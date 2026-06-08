import React, { useState, useEffect } from "react";
import { ProtocolType, ClinicProfile, UltrasoundReport, PatientInfo, ObstetricMeasurements, GynecologicMeasurements } from "../types";
import { calculateGAAndEDDFromLMP, calculateGAAndEDDFromIVF, calculateHadlockEFW } from "../utils/calc";
import ImagePasteArea from "./ImagePasteArea";
import { User, Clipboard, Calendar, FileText, ArrowRight, Baby, Sparkles, Wand2 } from "lucide-react";

interface UltrasoundFormProps {
  initialReport?: UltrasoundReport;
  onPreview: (report: UltrasoundReport) => void;
}

export default function UltrasoundForm({ initialReport, onPreview }: UltrasoundFormProps) {
  // 1. Protocol select
  const [protocolType, setProtocolType] = useState<ProtocolType>(
    initialReport?.protocolType || ProtocolType.Obstetric
  );

  // 2. Patient demographics
  const [patientCode, setPatientCode] = useState(initialReport?.patient.patientCode || "");
  const [fullName, setFullName] = useState(initialReport?.patient.fullName || "");
  const [birthYear, setBirthYear] = useState(initialReport?.patient.birthYear || "");
  const [address, setAddress] = useState(initialReport?.patient.address || "");
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState(initialReport?.patient.clinicalDiagnosis || "");
  const [reasonForExam, setReasonForExam] = useState(initialReport?.patient.reasonForExam || "");
  const [examDate, setExamDate] = useState(initialReport?.patient.examDate || new Date().toISOString().split("T")[0]);

  // Generate random code on mount if editing brand new
  useEffect(() => {
    if (!initialReport && !patientCode) {
      setPatientCode(`BN-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`);
    }
  }, [initialReport, patientCode]);

  // 3. Obstetric fields State
  const [obFetalCount, setObFetalCount] = useState(initialReport?.obstetric?.fetalCount || "Đơn thai");
  const [obPresentation, setObPresentation] = useState(initialReport?.obstetric?.presentation || "Ngôi đầu / Ngôi thuận");
  const [obCardiacActivity, setObCardiacActivity] = useState(initialReport?.obstetric?.cardiacActivity || "Có");
  const [obFetalHeartRate, setObFetalHeartRate] = useState(initialReport?.obstetric?.fetalHeartRate || "150");
  const [obFetalMovement, setObFetalMovement] = useState(initialReport?.obstetric?.fetalMovement || "Có");
  
  const [obBpd, setObBpd] = useState(initialReport?.obstetric?.bpd || "");
  const [obFl, setObFl] = useState(initialReport?.obstetric?.fl || "");
  const [obAc, setObAc] = useState(initialReport?.obstetric?.ac || "");
  const [obHc, setObHc] = useState(initialReport?.obstetric?.hc || "");
  const [obCrl, setObCrl] = useState(initialReport?.obstetric?.crl || "");
  const [obEfw, setObEfw] = useState(initialReport?.obstetric?.efw || "");
  
  const [obCalcMethod, setObCalcMethod] = useState<"lmp" | "embryo" | "manual">(
    initialReport?.obstetric?.calculationMethod || "lmp"
  );
  const [obLmpDate, setObLmpDate] = useState(initialReport?.obstetric?.lmpDate || "");
  const [obEmbryoAge, setObEmbryoAge] = useState<"day3" | "day5">(
    initialReport?.obstetric?.embryoAge || "day5"
  );
  const [obEmbryoTransferDate, setObEmbryoTransferDate] = useState(
    initialReport?.obstetric?.embryoTransferDate || ""
  );
  const [obGestWeeks, setObGestWeeks] = useState(initialReport?.obstetric?.gestationalWeeks || "");
  const [obGestDays, setObGestDays] = useState(initialReport?.obstetric?.gestationalDays || "");
  const [obEddDate, setObEddDate] = useState(initialReport?.obstetric?.eddDate || "");
  
  const [obPlacentaLocation, setObPlacentaLocation] = useState(initialReport?.obstetric?.placentaLocation || "Mặt sau tử cung");
  const [obPlacentaGrade, setObPlacentaGrade] = useState(initialReport?.obstetric?.placentaGrade || "Độ I");
  const [obAmnioticFluidVolume, setObAmnioticFluidVolume] = useState(initialReport?.obstetric?.amnioticFluidVolume || "Bình thường");
  const [obAmnioticFluidIndex, setObAmnioticFluidIndex] = useState(initialReport?.obstetric?.amnioticFluidIndex || "Xoang lớn nhất 35-40mm");
  
  const [obExtraFindings, setObExtraFindings] = useState(
    initialReport?.obstetric?.extraFindings || "Chưa phát hiện thấy khối u lạ buồng trứng hai bên. Trọng lượng thai nhi phát triển khoảng bách phân vị thứ 50."
  );
  const [obConclusion, setObConclusion] = useState(initialReport?.obstetric?.conclusion || "");
  const [obRecommendations, setObRecommendations] = useState(initialReport?.obstetric?.recommendations || "Ăn uống bồi bổ bổ sung sắt, canxi, theo dõi cơn đau bụng hoặc ra máu âm đạo bất ngờ. Tái khám tuần tới hoặc khám thai theo định kỳ.");

  // 4. Gynecologic fields State
  const [gUterusPosition, setGUterusPosition] = useState(initialReport?.gynecologic?.uterusPosition || "Ngả trước");
  const [gUterusLength, setGUterusLength] = useState(initialReport?.gynecologic?.uterusSizeLength || "50");
  const [gUterusAP, setGUterusAP] = useState(initialReport?.gynecologic?.uterusSizeAP || "35");
  const [gUterusStructure, setGUterusStructure] = useState(initialReport?.gynecologic?.uterusStructure || "Đều, nhu mô cơ tử cung đồng nhất, không nhân xơ.");
  const [gEndoThickness, setGEndoThickness] = useState(initialReport?.gynecologic?.endometriumThickness || "8.0");
  const [gEndoStructure, setGEndoStructure] = useState(initialReport?.gynecologic?.endometriumStructure || "Đồng nhất, cấu trúc ba lá rõ.");
  
  const [gRightOvaryStructure, setGRightOvaryStructure] = useState(initialReport?.gynecologic?.rightOvaryStructure || "Bình thường, nhu mô có vài nang noãn sinh lý kích cỡ nhỏ.");
  const [gRightOvarySize, setGRightOvarySize] = useState(initialReport?.gynecologic?.rightOvarySize || "25");
  const [gLeftOvaryStructure, setGLeftOvaryStructure] = useState(initialReport?.gynecologic?.leftOvaryStructure || "Bình thường, nhu mô đều lành tính.");
  const [gLeftOvarySize, setGLeftOvarySize] = useState(initialReport?.gynecologic?.leftOvarySize || "23");
  
  const [gDouglasFluid, setGDouglasFluid] = useState<"none" | "few" | "much">(
    initialReport?.gynecologic?.douglasPouchFluid || "none"
  );
  const [gDouglasParams, setGDouglasParams] = useState(initialReport?.gynecologic?.douglasPouchParams || "Túi cùng Douglas khô ráo, không tụ dịch bệnh lý.");
  
  const [gExtraFindings, setGExtraFindings] = useState(initialReport?.gynecologic?.extraFindings || "Chưa phát hiện bất thường sùi loét cổ tử cung.");
  const [gConclusion, setGConclusion] = useState(initialReport?.gynecologic?.conclusion || "");
  const [gRecommendations, setGRecommendations] = useState(initialReport?.gynecologic?.recommendations || "Khám phụ khoa kiểm tra tế bào học PAP định kỳ mỗi năm một lần.");

  // Images state
  const [images, setImages] = useState<string[]>(initialReport?.images || []);
  const [imageCaptions, setImageCaptions] = useState<string[]>(
    initialReport?.imageCaptions || (protocolType === ProtocolType.Obstetric ? ["Mặt cắt 1", "Mặt cắt 2"] : ["Mặt cắt nội mạc tử cung"])
  );

  // Auto calculate EFW on biometric inputs
  useEffect(() => {
    if (protocolType === ProtocolType.Obstetric) {
      const calcWeight = calculateHadlockEFW(obBpd, obFl, obAc, obHc);
      if (calcWeight) {
        setObEfw(calcWeight);
      }
    }
  }, [obBpd, obFl, obAc, obHc, protocolType]);

  // Auto calculate Gestational Age and EDD on LMP/IVF inputs
  useEffect(() => {
    if (protocolType === ProtocolType.Obstetric) {
      if (obCalcMethod === "lmp" && obLmpDate) {
        const results = calculateGAAndEDDFromLMP(obLmpDate);
        if (results) {
          setObGestWeeks(results.gestationalWeeks);
          setObGestDays(results.gestationalDays);
          setObEddDate(results.eddDate);
        }
      } else if (obCalcMethod === "embryo" && obEmbryoTransferDate) {
        const results = calculateGAAndEDDFromIVF(obEmbryoTransferDate, obEmbryoAge);
        if (results) {
          setObGestWeeks(results.gestationalWeeks);
          setObGestDays(results.gestationalDays);
          setObEddDate(results.eddDate);
        }
      }
    }
  }, [obCalcMethod, obLmpDate, obEmbryoTransferDate, obEmbryoAge, protocolType]);

  // Adjust default conclusion templates based on values typed
  const handleAutoSuggestConclusion = () => {
    if (protocolType === ProtocolType.Obstetric) {
      const weeksStr = obGestWeeks ? `${obGestWeeks} tuần` : "";
      const daysStr = obGestDays ? ` ${obGestDays} ngày` : "";
      const gestationText = weeksStr || daysStr ? `phát triển khoảng ${weeksStr}${daysStr}` : "sinh lý tử cung.";
      
      let dynamicConclusion = "";
      if (obFetalCount === "Đơn thai") {
        dynamicConclusion = `MỘT THAI SỐNG TRONG TỬ CUNG PHÁT TRIỂN TƯƠNG ĐƯƠNG KHOẢNG ${obGestWeeks || "12"} TUẦN ${obGestDays || "0"} NGÀY.`;
      } else {
        dynamicConclusion = `SONG THAI SỐNG TRONG TỬ CUNG KHOẢNG ${obGestWeeks || "12"} TUẦN.`;
      }
      setObConclusion(dynamicConclusion);
    } else {
      let dynamicConclusion = "HÌNH ẢNH SIÊU ÂM TỬ CUNG PHẦN PHỤ BÌNH THƯỜNG.";
      if (parseFloat(gEndoThickness) > 14) {
        dynamicConclusion = `NỘI MẠC TỬ CUNG DÀY (${gEndoThickness}mm) • THEO DÕI QUÁ SẢN NỘI MẠC TỬ CUNG.`;
      } else if (gUterusStructure.toLowerCase().includes("u xơ") || gUterusStructure.toLowerCase().includes("nhân xơ")) {
        dynamicConclusion = `THEO DÕI U XƠ TỬ CUNG KÈM NỘI MẠC SINH LÝ.`;
      }
      setGConclusion(dynamicConclusion);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const patient: PatientInfo = {
      patientCode,
      fullName: fullName.toUpperCase().trim(),
      birthYear: birthYear.trim(),
      address: address.trim(),
      clinicalDiagnosis: clinicalDiagnosis.trim(),
      reasonForExam: reasonForExam.trim(),
      examDate,
    };

    let obstetric: ObstetricMeasurements | undefined;
    let gynecologic: GynecologicMeasurements | undefined;

    if (protocolType === ProtocolType.Obstetric) {
      obstetric = {
        fetalCount: obFetalCount,
        presentation: obPresentation,
        cardiacActivity: obCardiacActivity,
        fetalHeartRate: obFetalHeartRate,
        fetalMovement: obFetalMovement,
        bpd: obBpd,
        fl: obFl,
        ac: obAc,
        hc: obHc,
        crl: obCrl,
        efw: obEfw,
        calculationMethod: obCalcMethod,
        lmpDate: obCalcMethod === "lmp" ? obLmpDate : undefined,
        embryoAge: obCalcMethod === "embryo" ? obEmbryoAge : undefined,
        embryoTransferDate: obCalcMethod === "embryo" ? obEmbryoTransferDate : undefined,
        gestationalWeeks: obGestWeeks,
        gestationalDays: obGestDays,
        eddDate: obEddDate,
        placentaLocation: obPlacentaLocation,
        placentaGrade: obPlacentaGrade,
        amnioticFluidVolume: obAmnioticFluidVolume,
        amnioticFluidIndex: obAmnioticFluidIndex,
        extraFindings: obExtraFindings,
        conclusion: obConclusion || `MỘT THAI SỐNG TRONG TỬ CUNG KHOẢNG ${obGestWeeks || "12"} TUẦN.`,
        recommendations: obRecommendations,
      };
    } else {
      gynecologic = {
        uterusPosition: gUterusPosition,
        uterusSizeLength: gUterusLength,
        uterusSizeAP: gUterusAP,
        uterusStructure: gUterusStructure,
        endometriumThickness: gEndoThickness,
        endometriumStructure: gEndoStructure,
        rightOvaryStructure: gRightOvaryStructure,
        rightOvarySize: gRightOvarySize,
        leftOvaryStructure: gLeftOvaryStructure,
        leftOvarySize: gLeftOvarySize,
        douglasPouchFluid: gDouglasFluid,
        douglasPouchParams: gDouglasParams,
        extraFindings: gExtraFindings,
        conclusion: gConclusion || "HÌNH ẢNH TOÀN BỘ TỬ CUNG & PHẦN PHỤ CÓ CẤU TRÚC ĐỀU BÌNH THƯỜNG.",
        recommendations: gRecommendations,
      };
    }

    const report: UltrasoundReport = {
      id: initialReport?.id || `REP-${Date.now()}`,
      patient,
      protocolType,
      obstetric,
      gynecologic,
      images,
      imageCaptions: imageCaptions.slice(0, images.length),
      createdAt: initialReport?.createdAt || new Date().toISOString(),
    };

    onPreview(report);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      
      {/* 2-COLUMN STRUCTURE: Demographics on left, calculations or type select */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ROW 1 COLUMN 1 & 2: DEMOGRAPHICS (Mã BN, tên...) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
            <User size={18} className="text-indigo-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Thông Tin Hành Chính Bệnh Nhân</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Mã Hồ Sơ Bệnh Nhân</label>
              <input
                type="text"
                required
                value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden font-mono text-indigo-950"
              />
            </div>

            <div className="sm:col-span-1 lg:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Họ Tên Thai Phụ / Bệnh Nhân <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="VD: NGUYỄN THỊ THAO"
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Năm Sinh / Tuổi <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="Năm sinh (VD: 1992) hoặc tuổi"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Địa Chỉ Cư Trú</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, Quận/Huyện, Tỉnh thành"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Ngày Làm Siêu Âm</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Lý Do Đến Khám</label>
              <input
                type="text"
                value={reasonForExam}
                onChange={(e) => setReasonForExam(e.target.value)}
                placeholder="VD: Trễ kinh khám thai, đau dội"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase">Chẩn Đoán Lâm Sàng</label>
              <input
                type="text"
                value={clinicalDiagnosis}
                onChange={(e) => setClinicalDiagnosis(e.target.value)}
                placeholder="VD: Theo dõi thai 10 tuần khám sàng lọc"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* ROW 1 COLUMN 3: PROTOCOL TYPE SELECT (Sản vs Phụ) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Clipboard size={18} className="text-indigo-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Chỉ Định Phương Pháp Siêu Âm</h3>
            </div>
            
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Vui lòng chọn giao thức phù hợp để hệ thống phân giải các trường đo chỉ số sinh học tương ứng.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setProtocolType(ProtocolType.Obstetric);
                setImages([]);
                setImageCaptions(["Hình siêu âm thai 1", "Hình siêu âm thai 2"]);
              }}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition select-none ${
                protocolType === ProtocolType.Obstetric
                  ? "border-pink-500 bg-pink-50/45 text-pink-900 shadow-xs"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <Baby size={22} className={protocolType === ProtocolType.Obstetric ? "text-pink-600" : "text-slate-400"} />
              <span className="text-xs font-black">🤱 SIÊU ÂM SẢN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setProtocolType(ProtocolType.Gynecologic);
                setImages([]);
                setImageCaptions(["Quét dọc thân tử cung đo nội mạc"]);
              }}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition select-none ${
                protocolType === ProtocolType.Gynecologic
                  ? "border-teal-500 bg-teal-50/45 text-teal-900 shadow-xs"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <span className="text-lg font-black leading-none">🌸</span>
              <span className="text-xs font-black">🌸 SIÊU ÂM PHỤ</span>
            </button>
          </div>
        </div>
      </div>

      {/* PROTOCOL MEASUREMENTS BOX */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* OBSTETRICAL PROTOCOL FORM FIELDS */}
        {protocolType === ProtocolType.Obstetric ? (
          <div>
            <div className="bg-gradient-to-r from-pink-850 to-pink-900 px-5 py-4 text-white flex justify-between items-center border-b border-pink-950/20">
              <div className="flex items-center space-x-2">
                <Baby size={20} className="text-pink-300" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Chỉ Số Khảo Sát Siêu Âm Sản Khoa (Thai Kỳ)</h3>
              </div>
              <span className="text-[10px] font-bold bg-pink-900/50 border border-pink-700/60 text-pink-200 py-0.5 px-2 rounded-md">HADLOCK '85 COMPLIANT</span>
            </div>

            <div className="p-5 space-y-6">
              
              {/* SECTION: NHỊP TIM THAI & SỐ THAI */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">1. Khảo sát sinh tồn Thai nhi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Số lượng thai</label>
                    <select
                      value={obFetalCount}
                      onChange={(e) => setObFetalCount(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Đơn thai">Đơn thai</option>
                      <option value="Song thai">Song thai (2 thai)</option>
                      <option value="Tam thai">Tam thai</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Ngôi thai</label>
                    <input
                      type="text"
                      value={obPresentation}
                      onChange={(e) => setObPresentation(e.target.value)}
                      placeholder="VD: Di động, đầu"
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Hoạt động tim</label>
                    <select
                      value={obCardiacActivity}
                      onChange={(e) => setObCardiacActivity(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Có">Đều, bình thường (Có)</option>
                      <option value="Không">Không hoạt động (Không)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tần số tim (bpm)</label>
                    <input
                      type="text"
                      value={obFetalHeartRate}
                      onChange={(e) => setObFetalHeartRate(e.target.value)}
                      placeholder="VD: 155 bpm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-rose-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Cử động thai</label>
                    <select
                      value={obFetalMovement}
                      onChange={(e) => setObFetalMovement(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Có">Có cử động thai</option>
                      <option value="Không">Chưa thấy cử động</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION: TUỔI THAI & DỰ SINH */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center space-x-1.5">
                  <Calendar size={14} className="text-pink-600" />
                  <span>2. Tuổi thai & Ngày dự sinh lâm sàng</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-150">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Phương pháp tính</label>
                    <select
                      value={obCalcMethod}
                      onChange={(e) => setObCalcMethod(e.target.value as "lmp" | "embryo" | "manual")}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="lmp">Kinh cuối cùng (LMP)</option>
                      <option value="embryo">Chuyển phôi IVF</option>
                      <option value="manual">Nhập thủ công</option>
                    </select>
                  </div>

                  {obCalcMethod === "lmp" && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-pink-600 uppercase">Ngày kinh cuối cùng (LMP) <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={obLmpDate}
                        onChange={(e) => setObLmpDate(e.target.value)}
                        className="w-full text-xs font-bold px-3 py-2 bg-white border border-pink-200 rounded-lg outline-hidden"
                      />
                    </div>
                  )}

                  {obCalcMethod === "embryo" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-pink-600 uppercase">Tuổi Phôi Chuyển</label>
                        <select
                          value={obEmbryoAge}
                          onChange={(e) => setObEmbryoAge(e.target.value as "day3" | "day5")}
                          className="w-full text-xs font-bold px-3 py-2 bg-white border border-pink-200 rounded-lg outline-hidden"
                        >
                          <option value="day5">Embryo Day 5 (Phôi ngày 5)</option>
                          <option value="day3">Embryo Day 3 (Phôi ngày 3)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-pink-600 uppercase">Ngày Chuyển Phôi <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          required
                          value={obEmbryoTransferDate}
                          onChange={(e) => setObEmbryoTransferDate(e.target.value)}
                          className="w-full text-xs font-bold px-3 py-2 bg-white border border-pink-200 rounded-lg outline-hidden"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Tuổi Thai (Tuần)</label>
                      <input
                        type="number"
                        min="0"
                        max="45"
                        required
                        value={obGestWeeks}
                        onChange={(e) => setObGestWeeks(e.target.value)}
                        disabled={obCalcMethod !== "manual"}
                        className="w-full text-xs font-black px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-center disabled:opacity-85 disabled:bg-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Ngày lẻ</label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        required
                        value={obGestDays}
                        onChange={(e) => setObGestDays(e.target.value)}
                        disabled={obCalcMethod !== "manual"}
                        className="w-full text-xs font-black px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden text-center disabled:opacity-85 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Dự kiến sinh (EDD)</label>
                    <input
                      type="date"
                      required
                      value={obEddDate}
                      onChange={(e) => setObEddDate(e.target.value)}
                      disabled={obCalcMethod !== "manual"}
                      className="w-full text-xs font-bold px-3 py-2 bg-white border border-slate-200 rounded-lg outline-hidden disabled:opacity-85 disabled:bg-slate-100 text-indigo-600 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: CHỈ SỐ SINH HỌC THAI */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">3. Trắc lượng chỉ số sinh học của Thai nhi</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Đường kính lưỡng đỉnh BPD (mm)</label>
                    <input
                      type="text"
                      value={obBpd}
                      onChange={(e) => setObBpd(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Chiều dài xương đùi FL (mm)</label>
                    <input
                      type="text"
                      value={obFl}
                      onChange={(e) => setObFl(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Chu vi vòng bụng AC (mm)</label>
                    <input
                      type="text"
                      value={obAc}
                      onChange={(e) => setObAc(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Chu vi vòng đầu HC (mm)</label>
                    <input
                      type="text"
                      value={obHc}
                      onChange={(e) => setObHc(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Chiều dài đầu mông CRL (mm)</label>
                    <input
                      type="text"
                      value={obCrl}
                      onChange={(e) => setObCrl(e.target.value)}
                      placeholder="Dùng cho thai sớm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-indigo-700">Trọng lượng dự đoán (g)</label>
                    <input
                      type="text"
                      value={obEfw}
                      onChange={(e) => setObEfw(e.target.value)}
                      placeholder="Hadlock tự tính"
                      className="w-full text-xs font-black px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg outline-hidden text-center text-indigo-700"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: NHAU VÀ NƯỚC ỐI */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">4. Khảo sát Phần phụ (Bánh nhau và Nước ối)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Vị trí bám bánh nhau</label>
                    <select
                      value={obPlacentaLocation}
                      onChange={(e) => setObPlacentaLocation(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Mặt trước tử cung">Mặt trước tử cung</option>
                      <option value="Mặt sau tử cung">Mặt sau tử cung</option>
                      <option value="Đáy tử cung">Đáy tử cung</option>
                      <option value="Nhau bám thấp">Nhau bám thấp</option>
                      <option value="Nhau bám mặt sau rộng rộng">Nhau bám mặt sau rộng rộng</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Độ trưởng thành nhau (độ)</label>
                    <select
                      value={obPlacentaGrade}
                      onChange={(e) => setObPlacentaGrade(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Độ 0">Độ 0 (Chưa biệt hoá)</option>
                      <option value="Độ I">Độ I (Thai quý II)</option>
                      <option value="Độ II">Độ II (Bắt đầu trưởng thành)</option>
                      <option value="Độ III">Độ III (Trưởng thành lớn)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Thể tích nước ối</label>
                    <select
                      value={obAmnioticFluidVolume}
                      onChange={(e) => setObAmnioticFluidVolume(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Bình thường">Bình thường</option>
                      <option value="Thiếu ối">Thiểu ối (Ít dịch)</option>
                      <option value="Đa ối">Đa ối (Nhiều)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Chỉ số ối (AFI / Xoang ối)</label>
                    <input
                      type="text"
                      value={obAmnioticFluidIndex}
                      onChange={(e) => setObAmnioticFluidIndex(e.target.value)}
                      placeholder="VD: Xoang lớn nhất 35mm"
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* GYNECOLOGICAL PROTOCOL FORM FIELDS */
          <div>
            <div className="bg-gradient-to-r from-teal-850 to-teal-900 px-5 py-4 text-white flex justify-between items-center border-b border-teal-950/20">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🌸</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Chỉ Số Siêu Âm Tử Cung - Phần Phụ (Phụ Khoa)</h3>
              </div>
              <span className="text-[10px] font-bold bg-teal-900/50 border border-teal-700/60 text-teal-200 py-0.5 px-2 rounded-md">GYN PROTOCOL</span>
            </div>

            <div className="p-5 space-y-6">
              
              {/* SECTION: TỬ CUNG */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">1. Khảo sát cấu trúc Tử cung</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tư thế tử cung</label>
                    <select
                      value={gUterusPosition}
                      onChange={(e) => setGUterusPosition(e.target.value)}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="Ngả trước">Ngả trước (Anteverted)</option>
                      <option value="Ngả sau">Ngả sau (Retroverted)</option>
                      <option value="Trung gian">Tư thế trung gian</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Chiều dài Tử cung (mm)</label>
                    <input
                      type="text"
                      value={gUterusLength}
                      onChange={(e) => setGUterusLength(e.target.value)}
                      placeholder="VD: 50"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Đường kính trước sau AP (mm)</label>
                    <input
                      type="text"
                      value={gUterusAP}
                      onChange={(e) => setGUterusAP(e.target.value)}
                      placeholder="VD: 35"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Đoạn eo & Cổ tử cung</label>
                    <input
                      type="text"
                      disabled
                      value="Cấu trúc bình thường, lành tính."
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg outline-hidden text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Cơ tử cung & Nhu mô</label>
                    <input
                      type="text"
                      value={gUterusStructure}
                      onChange={(e) => setGUterusStructure(e.target.value)}
                      placeholder="Nhu mô tử cung đều đồng nhất..."
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: NỘI MẠC */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">2. Khảo sát Nội mạc tử cung (Endometrium)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Độ dày nội mạc tử cung (mm)</label>
                    <input
                      type="text"
                      value={gEndoThickness}
                      onChange={(e) => setGEndoThickness(e.target.value)}
                      placeholder="mm (VD: 8.0)"
                      className="w-full text-xs font-black px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-teal-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Cấu trúc lớp nội mạc tử cung</label>
                    <input
                      type="text"
                      value={gEndoStructure}
                      onChange={(e) => setGEndoStructure(e.target.value)}
                      placeholder="Đồng nhất, lớp 3 lá rõ sinh lý..."
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: BUỒNG TRỨNG HAI BEN */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">3. Khảo sát cụm hai buồng trứng (Phần phụ)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="sm:col-span-1 md:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Buồng trứng PHẢI (Cấu trúc & Nhu mô)</label>
                    <input
                      type="text"
                      value={gRightOvaryStructure}
                      onChange={(e) => setGRightOvaryStructure(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Kích thước BT phải (mm)</label>
                    <input
                      type="text"
                      value={gRightOvarySize}
                      onChange={(e) => setGRightOvarySize(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-1 md:col-span-3 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Buồng trứng TRÁI (Cấu trúc & Nhu mô)</label>
                    <input
                      type="text"
                      value={gLeftOvaryStructure}
                      onChange={(e) => setGLeftOvaryStructure(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-500">Kích thước BT trái (mm)</label>
                    <input
                      type="text"
                      value={gLeftOvarySize}
                      onChange={(e) => setGLeftOvarySize(e.target.value)}
                      placeholder="mm"
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-center text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: TÚI CÙNG DOUGLAS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">4. Khảo sát Túi cùng sau (Túi cùng Douglas)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Trạng thái phát hiện Dịch túi cùng</label>
                    <select
                      value={gDouglasFluid}
                      onChange={(e) => setGDouglasFluid(e.target.value as "none" | "few" | "much")}
                      className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    >
                      <option value="none">Túi cùng khô ráo (Không dịch)</option>
                      <option value="few">Phát hiện túi cùng ít dịch sinh lý</option>
                      <option value="much">Phát hiện nhiều dịch bất thường</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Ghi nhận chi tiết / Chỉ số túi cùng</label>
                    <input
                      type="text"
                      value={gDouglasParams}
                      onChange={(e) => setGDouglasParams(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* PASTE / DUYỆT HÌNH ẢNH SIÊU ÂM */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📷</span>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Hình Ảnh Siêu Âm Chọn Lọc Đính Kèm</h3>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 uppercase">
            Hạn mức: tối đa {protocolType === ProtocolType.Obstetric ? "2" : "1"} ảnh
          </span>
        </div>

        <ImagePasteArea
          images={images}
          onChange={(newImages) => {
            setImages(newImages);
            // Re-sync captions
            if (newImages.length > imageCaptions.length) {
              const capList = [...imageCaptions];
              for (let i = imageCaptions.length; i < newImages.length; i++) {
                capList.push(`Hình siêu âm số ${i + 1}`);
              }
              setImageCaptions(capList);
            }
          }}
          maxImages={protocolType === ProtocolType.Obstetric ? 2 : 1}
        />

        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {images.map((_, i) => (
              <div key={i} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Ghi chú chú thích ảnh {i + 1}</label>
                <input
                  type="text"
                  value={imageCaptions[i] || ""}
                  onChange={(e) => {
                    const updated = [...imageCaptions];
                    updated[i] = e.target.value;
                    setImageCaptions(updated);
                  }}
                  className="w-full text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-250 focus:bg-white rounded-lg outline-hidden"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* KL & DẶN DÒ BÁC SĨ */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <FileText size={18} className="text-indigo-600" />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Kết Luận Chẩn Đoán & Chỉ Định Dặn Dò</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Các ghi nhận bổ sung / Bất thường khác</label>
            <textarea
              rows={2}
              value={protocolType === ProtocolType.Obstetric ? obExtraFindings : gExtraFindings}
              onChange={(e) => protocolType === ProtocolType.Obstetric ? setObExtraFindings(e.target.value) : setGExtraFindings(e.target.value)}
              className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-red-650 uppercase">Kết Luận Siêu Âm <span className="text-red-500">*</span></label>
              
              <button
                type="button"
                onClick={handleAutoSuggestConclusion}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-1 rounded flex items-center space-x-1"
                title="Tự động kiến tạo mẫu kết luận dựa trên chỉ số trắc lượng đã điền"
              >
                <Wand2 size={11} />
                <span>Gợi ý chẩn đoán nhanh</span>
              </button>
            </div>
            <textarea
              rows={3}
              required
              value={protocolType === ProtocolType.Obstetric ? obConclusion : gConclusion}
              onChange={(e) => protocolType === ProtocolType.Obstetric ? setObConclusion(e.target.value) : setGConclusion(e.target.value)}
              placeholder="VD: MỘT THAI SỐNG TRONG TỬ CUNG PHÁT TRIỂN KHOẢNG 12 TUẦN."
              className="w-full text-xs font-bold p-3 bg-slate-50 border border-red-150 focus:bg-white rounded-lg outline-hidden leading-relaxed text-indigo-950"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Lời khuyên dặn dò điều trị bác sĩ</label>
            <textarea
              rows={3}
              value={protocolType === ProtocolType.Obstetric ? obRecommendations : gRecommendations}
              onChange={(e) => protocolType === ProtocolType.Obstetric ? setObRecommendations(e.target.value) : setGRecommendations(e.target.value)}
              className="w-full text-xs font-medium p-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-lg outline-hidden leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* FORM ACTION SUBMIT */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 hover:shadow-xs transition duration-200 text-white rounded-xl text-xs font-black tracking-wider uppercase flex items-center space-x-2 shadow-sm cursor-pointer"
        >
          <span>Xem trước &amp; Xác nhận Tạo kết quả siêu âm</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </form>
  );
}
