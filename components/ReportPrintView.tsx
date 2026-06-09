import { UltrasoundReport, ClinicProfile, ProtocolType } from "../types";
import { Printer, Edit3, ArrowLeft, Calendar, User, Phone, MapPin, Building, Check } from "lucide-react";

interface ReportPrintViewProps {
  report: UltrasoundReport;
  clinicProfile: ClinicProfile;
  onPrint: () => void;
  onSave: () => void;
  onEdit: () => void;
}

export default function ReportPrintView({ report, clinicProfile, onPrint, onSave, onEdit }: ReportPrintViewProps) {
  const isObstetric = report.protocolType === ProtocolType.Obstetric;
  const patient = report.patient;

  return (
    <div id="report-print-view" className="space-y-6 max-w-4xl mx-auto">
      
      {/* 1. PROFESSIONAL ACTIONS TOP BAR (Hidden on Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print select-none">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-250 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Quay lại chỉnh sửa</span>
        </button>

        <div className="flex items-center space-x-3 gap-2">
          <button
            onClick={onPrint}
            type="button"
            className="px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>IN KẾT QUẢ SIÊU ÂM (A4)</span>
          </button>

          <button
            onClick={onSave}
            type="button"
            className="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Check size={15} />
            <span>LƯU HỒ SƠ BỆNH NHÂN</span>
          </button>
        </div>
      </div>

      {/* 2. THE ACTUAL MEDICAL REPORT PAGE BODY (Designed for A4 Printing) */}
      <div className="print-page bg-white text-black p-8 md:p-12 border border-slate-300 rounded-3xl shadow-sm space-y-6 mx-auto leading-relaxed relative font-sans text-sm md:text-sm">
        
        {/* REPORT CLINIC HEADER */}
        <div className="flex items-start justify-between border-b-2 border-indigo-950 pb-5">
          <div className="flex items-start space-x-4">
            {clinicProfile.logoUrl && (
              <img
                src={clinicProfile.logoUrl}
                alt="Clinic Logo"
                referrerPolicy="no-referrer"
                className="w-16 h-16 object-contain rounded bg-slate-50 border border-slate-100"
              />
            )}
            <div className="space-y-1">
              <h2 className="text-sm md:text-md font-extrabold uppercase text-slate-900 tracking-wide">{clinicProfile.clinicName}</h2>
              <p className="text-xs font-black text-indigo-950 flex items-center space-x-1">
                <span>Bác sĩ phụ trách:</span>
                <span className="text-slate-800 font-bold">{clinicProfile.doctorName}</span>
              </p>
              <p className="text-[11px] text-slate-500 font-medium">{clinicProfile.specialty}</p>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 space-y-0.5">
            <p className="font-semibold flex items-center justify-end space-x-1">
              <Phone size={10} className="text-indigo-600" />
              <span>SĐT: {clinicProfile.phone}</span>
            </p>
            {clinicProfile.websiteEmail && (
              <p className="truncate max-w-[200px]">Email: {clinicProfile.websiteEmail}</p>
            )}
            <p className="font-medium max-w-[250px] leading-tight text-slate-400">
              Đ/C: {clinicProfile.address}
            </p>
          </div>
        </div>

        {/* CLINICAL DOCUMENT TITLE */}
        <div className="text-center space-y-1 py-1">
          <h1 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-widest">
            {isObstetric ? "KẾT QUẢ SIÊU ÂM SẢN KHOA" : "KẾT QUẢ SIÊU ÂM PHỤ KHOA"}
          </h1>
          <p className="text-[10px] uppercase font-black tracking-wide text-slate-400 font-mono">
            Mẫu kiểm tra khảo sát 2D thường quy
          </p>
        </div>

        {/* ADMINISTRATIVE PATIENT BLOCK */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-xs font-semibold text-slate-800">
          <div className="md:col-span-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Họ và tên bệnh nhân:</span>
            <span className="font-extrabold uppercase text-slate-900 text-sm">{patient.fullName}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Mã bệnh nhân (PID):</span>
            <span className="font-mono font-bold text-indigo-950 text-slate-800">{patient.patientCode}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Năm sinh / Tuổi:</span>
            <span className="font-bold">{patient.birthYear}</span>
          </div>

          <div className="md:col-span-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Địa chỉ cư trú:</span>
            <span className="font-medium text-slate-700">{patient.address || "Chưa ghi nhận"}</span>
          </div>

          <div className="md:col-span-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Chẩn đoán lâm sàng:</span>
            <span className="font-semibold text-slate-800 italic">{patient.clinicalDiagnosis || "N/A"}</span>
          </div>

          <div>
            <span className="text-slate-400 font-semibold uppercase text-[10px] block">Ngày siêu âm khám:</span>
            <span className="font-bold">{patient.examDate}</span>
          </div>
        </div>

        {/* MEDICAL RESULTS CONTAINER */}
        <div className="space-y-5">
          <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-1 flex items-center space-x-1.5">
            <span>I. MÔ TẢ HÌNH ẢNH SIÊU ÂM TRỰC QUAN</span>
          </h3>

          {isObstetric && report.obstetric ? (
            /* OBSTETRICS REPORT TEXT LAYOUT */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 text-xs text-slate-800">
              <div className="space-y-2 border-r border-slate-100 pr-4">
                <h4 className="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">1. Tình trạng Thai nhi</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <span className="text-slate-500">Số lượng thai:</span>
                  <span className="font-bold">{report.obstetric.fetalCount}</span>
                  
                  <span className="text-slate-500">Ngôi thai:</span>
                  <span className="font-bold">{report.obstetric.presentation}</span>

                  <span className="text-slate-500">Hoạt động tim thai:</span>
                  <span className="font-bold text-rose-650">{report.obstetric.cardiacActivity}</span>

                  <span className="text-slate-500">Tần số tim thai:</span>
                  <span className="font-black text-rose-600">{report.obstetric.fetalHeartRate} bpm</span>

                  <span className="text-slate-500">Cử động thai:</span>
                  <span className="font-bold">{report.obstetric.fetalMovement}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">2. Chỉ số Sinh học (Biometry)</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  {report.obstetric.bpd && (
                    <>
                      <span className="text-slate-500">Đường kính lưỡng đỉnh (BPD):</span>
                      <span className="font-bold">{report.obstetric.bpd} mm</span>
                    </>
                  )}
                  {report.obstetric.fl && (
                    <>
                      <span className="text-slate-500">Chiều dài xương đùi (FL):</span>
                      <span className="font-bold">{report.obstetric.fl} mm</span>
                    </>
                  )}
                  {report.obstetric.ac && (
                    <>
                      <span className="text-slate-500">Chu vi vòng bụng (AC):</span>
                      <span className="font-bold">{report.obstetric.ac} mm</span>
                    </>
                  )}
                  {report.obstetric.hc && (
                    <>
                      <span className="text-slate-500">Chu vi vòng đầu (HC):</span>
                      <span className="font-bold">{report.obstetric.hc} mm</span>
                    </>
                  )}
                  {report.obstetric.crl && (
                    <>
                      <span className="text-slate-500">Chiều dài đầu mông (CRL):</span>
                      <span className="font-bold">{report.obstetric.crl} mm</span>
                    </>
                  )}
                  {report.obstetric.efw && (
                    <>
                      <span className="text-slate-500 font-black text-indigo-900">Trọng lượng thai ước tính (EFW):</span>
                      <span className="font-extrabold text-indigo-600">{report.obstetric.efw} gram</span>
                    </>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2 mt-2 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">3. Phần Phụ (Nhau, Ối)</h4>
                  <div className="grid grid-cols-2 gap-y-1.5">
                    <span className="text-slate-500">Vị trí bám bánh nhau:</span>
                    <span className="font-bold">{report.obstetric.placentaLocation}</span>

                    <span className="text-slate-500">Độ trưởng thành nhau:</span>
                    <span className="font-bold">{report.obstetric.placentaGrade}</span>

                    <span className="text-slate-500 font-bold text-teal-800">Lượng nước ối:</span>
                    <span className="font-extrabold text-teal-700">{report.obstetric.amnioticFluidVolume}</span>

                    <span className="text-slate-500">Chỉ số ối (AFI):</span>
                    <span className="font-semibold text-slate-800">{report.obstetric.amnioticFluidIndex}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">4. Tuổi thai & ngày sinh tính toán</h4>
                  <div className="grid grid-cols-2 gap-y-1.5">
                    <span className="text-slate-500">Phương pháp xác định:</span>
                    <span className="font-bold text-slate-600">{report.obstetric.calculationMethod === "lmp" ? "Kinh cuối cùng (LMP)" : report.obstetric.calculationMethod === "embryo" ? "Chuyển phôi IVF" : "Khoảng siêu âm thủ công"}</span>

                    <span className="text-slate-500 font-black text-indigo-900">Tuổi thai sinh học ước tính:</span>
                    <span className="font-extrabold text-indigo-950">{report.obstetric.gestationalWeeks} tuần {report.obstetric.gestationalDays} ngày</span>

                    <span className="text-slate-500 font-black text-rose-900">Dự kiến ngày sinh (EDD):</span>
                    <span className="font-extrabold text-rose-600 font-mono text-xs">{report.obstetric.eddDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : report.gynecologic ? (
            /* GYNECOLOGY REPORT TEXT LAYOUT */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 text-xs text-slate-800">
              <div className="space-y-2 border-r border-slate-100 pr-4">
                <h4 className="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">1. Mô tả Tử Cung</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <span className="text-slate-500">Tư thế cổ tử cung:</span>
                  <span className="font-bold">{report.gynecologic.uterusPosition}</span>
                  
                  <span className="text-slate-500">Đường dọc thân (Từ cung dài):</span>
                  <span className="font-bold">{report.gynecologic.uterusSizeLength} mm</span>

                  <span className="text-slate-500">Đường kính trước sau (AP):</span>
                  <span className="font-bold">{report.gynecologic.uterusSizeAP} mm</span>

                  <span className="text-slate-450 col-span-2 border-t border-slate-100/50 mt-1 pt-1 italic">
                    Nhu mô: {report.gynecologic.uterusStructure}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">2. Nội Mạc Tử Cung</h4>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <span className="text-indigo-900 font-semibold">Độ dày nội mạc tử cung:</span>
                  <span className="font-extrabold text-indigo-650">{report.gynecologic.endometriumThickness} mm</span>

                  <span className="text-slate-500 col-span-2 text-[11px] bg-indigo-50/50 p-2 border border-indigo-100 rounded-lg mt-1 block">
                    Cấu trúc: {report.gynecologic.endometriumStructure}
                  </span>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2 mt-2 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">3. Bộ Hai Buồng Trứng</h4>
                  <div className="space-y-1">
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Buồng trứng PHẢI ({report.gynecologic.rightOvarySize}mm):</strong> {report.gynecologic.rightOvaryStructure}
                    </p>
                    <p className="text-slate-700 mt-2">
                      <strong className="text-slate-900">Buồng trứng TRÁI ({report.gynecologic.leftOvarySize}mm):</strong> {report.gynecologic.leftOvaryStructure}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-0.5 text-slate-400">4. Trạng thái ổ bụng (Túi cùng Douglas)</h4>
                  <div className="grid grid-cols-2 gap-y-1.5">
                    <span className="text-slate-500">Dịch túi cùng sau:</span>
                    <span className="font-bold">{report.gynecologic.douglasPouchFluid === "none" ? "Không có dịch" : report.gynecologic.douglasPouchFluid === "few" ? "Có ít dịch sinh lý" : "Có nhiều dịch bất thường"}</span>

                    <span className="text-slate-500 col-span-2 text-[11px] block mt-1 italic">
                      Ghi chú: {report.gynecologic.douglasPouchParams}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* ULTRASOUND DOCK ATTACHED IMAGES (Hidden on Print if no images) */}
        {report.images && report.images.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-150">
            <h3 className="text-xs font-black uppercase text-slate-950 border-b border-slate-150 pb-1 flex items-center space-x-1.5">
              <span>II. HÌNH ẢNH MINH THUẬT SIÊU ÂM (PHOTO DOCK)</span>
            </h3>

            <div className={`grid ${report.images.length === 2 ? "grid-cols-2" : "grid-cols-1 max-w-sm mx-auto"} gap-4`}>
              {report.images.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-2 border border-slate-250 bg-slate-50 rounded-2xl">
                  <img
                    src={img}
                    alt={`Attached ultrasound ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-[175px] object-contain rounded-lg shadow-xs"
                  />
                  {report.imageCaptions && report.imageCaptions[idx] && (
                    <p className="text-[10px] text-center font-bold text-slate-500 italic mt-2">
                      Hình {idx + 1}: {report.imageCaptions[idx]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXTRA FINDINGS (Ghi chú khác) */}
        <div className="space-y-1.5 pt-4 border-t border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Một số bất thường phụ / Ghi chú cơ thể sinh học khác:</span>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isObstetric ? report.obstetric?.extraFindings : report.gynecologic?.extraFindings || "Chưa ghi nhận bất thường nào khác."}
          </p>
        </div>

        {/* MAJOR CLINICAL CONCLUSION & ADVICE */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-5 border-t-2 border-indigo-950">
          <div className="md:col-span-3 p-4 bg-indigo-50/20 border border-indigo-150 rounded-2xl select-all space-y-2">
            <span className="text-red-650 font-extrabold uppercase text-[10px] tracking-widest block">KẾT LUẬN CHẨN ĐOÁN CHÍNH:</span>
            <p className="text-xs md:text-sm font-black text-indigo-950 leading-relaxed uppercase whitespace-pre-line tracking-wide">
              {isObstetric ? report.obstetric?.conclusion : report.gynecologic?.conclusion}
            </p>
          </div>

          <div className="md:col-span-2 p-4 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-700">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] block">CHỈ ĐỊNH DẶN DÒ:</span>
            <p className="font-semibold leading-relaxed">
              {isObstetric ? report.obstetric?.recommendations : report.gynecologic?.recommendations}
            </p>
          </div>
        </div>

        {/* REPORT SIGNATURE STAMP */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-slate-800 gap-6">
          <div className="text-[11px] text-slate-400 leading-tight">
            <p>Hệ thống hỗ trợ chuyên khoa siêu âm sản phụ khoa v1.0.0</p>
            <p className="font-mono mt-0.5">Report ID: {report.id}</p>
          </div>

          <div className="text-center space-y-1.5">
            <p className="italic text-slate-500">Hồ Chí Minh, {new Date(report.createdAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p className="font-extrabold uppercase tracking-wide text-slate-900 text-[11px]">BÁC SĨ CHUYÊN KHOA SIÊU ÂM</p>
            <div className="h-16"></div> {/* Placeholder for signature stamp */}
            <p className="font-black text-slate-905 mt-2 underline decoration-indigo-600 decoration-2">{clinicProfile.doctorName}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
