import React from "react";
import { UltrasoundReport, ProtocolType, ClinicProfile } from "../types";

interface ReportPrintViewProps {
  report: UltrasoundReport;
  clinicProfile: ClinicProfile;
  onPrint?: () => void;
  onEdit?: () => void;
}

export default function ReportPrintView({
  report,
  clinicProfile,
  onPrint,
  onEdit,
}: ReportPrintViewProps) {
  const { patient, protocolType, obstetric, gynecologic, images, imageCaptions } = report;

  // Format Date for Vietnam
  const formatVietnameseDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          return `Ngày ${parts[2]} tháng ${parts[1]} năm ${parts[0]}`;
        }
        return `Ngày ... tháng ... năm 20...`;
      }
      return `Ngày ${String(d.getDate()).padStart(2, "0")} tháng ${String(d.getMonth() + 1).padStart(2, "0")} năm ${d.getFullYear()}`;
    } catch {
      return `Ngày ... tháng ... năm 20...`;
    }
  };

  const getAge = (birthYear?: string) => {
    if (!birthYear) return "";
    const currentYear = new Date().getFullYear();
    const parsed = parseInt(birthYear);
    if (isNaN(parsed)) return birthYear;
    return `${currentYear - parsed}`;
  };

  return (
    <div className="flex flex-col items-center bg-slate-100 p-2 md:p-6 rounded-2xl w-full min-h-screen">
      {/* ON SCREEN OPTIONS PANEL */}
      <div className="w-full max-w-[210mm] mb-4 bg-white rounded-xl border border-slate-200/80 shadow-xs px-6 py-4 flex flex-wrap items-center justify-between gap-4 no-print select-none">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block">Xem thử kết quả in</span>
          <h3 className="text-sm font-bold text-slate-800">
            Xem trước bản in A4 ({protocolType === ProtocolType.Obstetric ? "Sản Khoa" : "Phụ Khoa"})
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            >
              ← Quay lại chỉnh sửa
            </button>
          )}
          {onPrint && (
            <button
              onClick={onPrint}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 rounded-lg shadow-sm transition flex items-center space-x-1"
            >
              <span>🖨️ In kết quả (Xuất PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER BODY FOR A4 PRINT PREVIEW */}
      <div 
        id="ultrasound-print-sheet" 
        className="w-full max-w-[210mm] min-h-[297mm] bg-white text-black p-[15mm] md:p-[20mm] rounded-lg shadow-md border border-slate-200 flex flex-col justify-between print:shadow-none print:border-none print:m-0 print:p-0"
        style={{ contentVisibility: "auto" }}
      >
        {/* UPPER PART */}
        <div className="space-y-6">
          {/* HEADER SECTION */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-start space-x-4">
              {clinicProfile.logoUrl && (
                <img
                  src={clinicProfile.logoUrl}
                  alt="Clinic Logo"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-contain print:w-14 print:h-14 flex-shrink-0 mt-1"
                />
              )}
              <div className="space-y-1">
                <h1 className="text-sm md:text-md uppercase font-black tracking-wide text-slate-900">
                  {clinicProfile.clinicName}
                </h1>
                <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Chuyên khoa: {clinicProfile.specialty}
                </p>
                <p className="text-[10px] text-slate-600 leading-normal">
                  Địa chỉ: {clinicProfile.address}
                </p>
                <p className="text-[10px] font-bold text-slate-800">
                  Hotline: {clinicProfile.phone} {clinicProfile.websiteEmail && ` • Email: ${clinicProfile.websiteEmail}`}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 text-[10px] font-semibold text-slate-500">
              <div>Mã BN: <span className="font-bold text-slate-900">{patient.patientCode || "N/A"}</span></div>
              <div className="mt-1">Ngày: {patient.examDate?.split("-").reverse().join("/")}</div>
            </div>
          </div>

          {/* REPORT TITLE */}
          <div className="text-center space-y-1 py-1">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-indigo-950">
              KẾT QUẢ SIÊU ÂM {protocolType === ProtocolType.Obstetric ? "SẢN KHOA" : "PHỤ KHOA"} (2D)
            </h2>
            <div className="text-[10px] text-slate-500 italic max-w-sm mx-auto">
              Hệ thống khảo sát siêu âm 2D độ phân giải cao kết hợp chẩn đoán lâm sàng
            </div>
          </div>

          {/* PATIENT ADMINISTRATIVE DEMOGRAPHICS */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80 text-[12px] grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-2">
            <div className="sm:col-span-5">
              <span className="text-slate-500">Họ và tên bệnh nhân: </span>
              <strong className="text-slate-900 uppercase font-black text-[13px]">{patient.fullName || "Chưa nhập"}</strong>
            </div>
            <div className="sm:col-span-3">
              <span className="text-slate-500">Tuổi/Năm sinh: </span>
              <strong className="text-slate-900">{getAge(patient.birthYear)} tuổi ({patient.birthYear || "N/A"})</strong>
            </div>
            <div className="sm:col-span-4">
              <span className="text-slate-500">Điện thoại liên hệ: </span>
              <strong className="text-slate-900">{clinicProfile.phone}</strong>
            </div>

            <div className="sm:col-span-12">
              <span className="text-slate-500">Địa chỉ: </span>
              <span className="text-slate-900 font-medium">{patient.address || "Chưa nhập"}</span>
            </div>

            <div className="sm:col-span-12 border-t border-slate-200 mt-1 pt-1.5 flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="text-slate-500">Lý do khám: </span>
                <span className="text-slate-900 font-medium">{patient.reasonForExam || "Khám định kỳ"}</span>
              </div>
              <div className="flex-1">
                <span className="text-slate-500">Chẩn đoán lâm sàng: </span>
                <span className="text-slate-900 font-semibold">{patient.clinicalDiagnosis || "Theo dõi sản phụ khoa"}</span>
              </div>
            </div>
          </div>

          {/* MAIN ULTRASOUND ULTRASONOGRAPHY METRICS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1e293b] border-l-4 border-slate-950 pl-2">
              Mô tả kết quả siêu âm chi tiết
            </h3>

            {protocolType === ProtocolType.Obstetric && obstetric ? (
              /* OBSTETRIC TABULATION */
              <div className="space-y-3">
                {/* Gestational Age Banner */}
                <div className="p-2 border border-pink-100 bg-pink-50/50 rounded-md flex justify-between items-center text-[12px]">
                  <div>
                    <span className="text-pink-900 font-medium">Phương pháp tính: </span>
                    <strong className="text-pink-950 uppercase">{obstetric.calculationMethod === "lmp" ? "Kinh cuối cùng (LMP)" : obstetric.calculationMethod === "embryo" ? "Chuyển phôi IVF" : "Chẩn đoán lâm sàng"}</strong>
                  </div>
                  <div>
                    <span className="text-pink-900 font-medium">Tuổi thai: </span>
                    <strong className="text-pink-950 text-[13px] bg-white border border-pink-100 px-2 py-0.5 rounded">
                      {obstetric.gestationalWeeks} tuần {obstetric.gestationalDays} ngày
                    </strong>
                    {obstetric.eddDate && (
                      <span className="ml-3 text-pink-900">
                        (Dự sinh: <strong className="text-pink-950">{obstetric.eddDate.split("-").reverse().join("/")}</strong>)
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[12px] border border-slate-200 rounded-lg p-3 bg-white">
                  <div>
                    <span className="text-slate-500">Số thai sản: </span>
                    <strong className="text-slate-900">{obstetric.fetalCount || "Đơn thai"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Ngôi thai: </span>
                    <strong className="text-slate-900">{obstetric.presentation}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500">Hoạt động tim thai: </span>
                    <strong className="text-slate-900">{obstetric.cardiacActivity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Cử động thai: </span>
                    <strong className="text-slate-900">{obstetric.fetalMovement}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500">Nhịp tim thai: </span>
                    <span className="text-slate-950"><strong className="text-slate-900">{obstetric.fetalHeartRate}</strong> chu kỳ/phút</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Tình trạng nước ối: </span>
                    <span className="text-slate-950">{obstetric.amnioticFluidVolume} {obstetric.amnioticFluidIndex && `(${obstetric.amnioticFluidIndex})`}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Nhau thai: </span>
                    <span className="text-slate-900">Vị trí bám: <strong>{obstetric.placentaLocation}</strong>. Độ trưởng thành: <strong>{obstetric.placentaGrade}</strong></span>
                  </div>
                </div>

                {/* Submetrics table */}
                <div className="overflow-hidden border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse text-[11px] font-medium text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-900">
                        <th className="py-2 px-3 text-left w-1/3">Chỉ số sinh trắc học</th>
                        <th className="py-2 px-3 text-center">Giá trị đo (mm / gram)</th>
                        <th className="py-2 px-3 text-left">Đọc kết quả chuẩn y khoa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {obstetric.bpd && (
                        <tr>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">Đường kính lưỡng đỉnh (BPD)</td>
                          <td className="py-1.5 px-3 text-center font-bold text-slate-900">{obstetric.bpd} mm</td>
                          <td className="py-1.5 px-3 text-slate-500 italic">Khảo sát vòng sọ đại não, cấu trúc não đối xứng tốt.</td>
                        </tr>
                      )}
                      {obstetric.fl && (
                        <tr>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">Chiều dài xương đùi (FL)</td>
                          <td className="py-1.5 px-3 text-center font-bold text-slate-900">{obstetric.fl} mm</td>
                          <td className="py-1.5 px-3 text-slate-500 italic">Hình thái xương dài chi dưới phát triển liên lục, cân đối.</td>
                        </tr>
                      )}
                      {obstetric.ac && (
                        <tr>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">Chu vi vòng bụng (AC)</td>
                          <td className="py-1.5 px-3 text-center font-bold text-slate-900">{obstetric.ac} mm</td>
                          <td className="py-1.5 px-3 text-slate-500 italic">Khảo sát nhu mô gan, dạ dày và mạch máu rốn nằm vị trí đúng.</td>
                        </tr>
                      )}
                      {obstetric.hc && (
                        <tr>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">Chu vi đầu (HC)</td>
                          <td className="py-1.5 px-3 text-center font-bold text-slate-900">{obstetric.hc} mm</td>
                          <td className="py-1.5 px-3 text-slate-500 italic">Đường chu vi sọ đo trực tiếp qua trục hốc sọ trung tâm.</td>
                        </tr>
                      )}
                      {obstetric.crl && (
                        <tr>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">Chiều dài đầu mông (CRL)</td>
                          <td className="py-1.5 px-3 text-center font-bold text-slate-900">{obstetric.crl} mm</td>
                          <td className="py-1.5 px-3 text-slate-500 italic">Thường dùng đo đạc tuổi thai quý I lý tưởng.</td>
                        </tr>
                      )}
                      {obstetric.efw && (
                        <tr className="bg-indigo-50/40">
                          <td className="py-2 px-3 font-bold text-indigo-950">Ước lượng cân nặng thai nhi (EFW)</td>
                          <td className="py-2 px-3 text-center font-bold text-indigo-950 text-xs">{obstetric.efw} gram</td>
                          <td className="py-2 px-3 text-indigo-900 font-semibold italic">Công thức Hadlock tối ưu sai số tối đa 10%.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {obstetric.extraFindings && (
                  <div className="text-[12px] p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-800">Ghi nhận hình thái học: </span>
                    <span className="text-slate-700">{obstetric.extraFindings}</span>
                  </div>
                )}
              </div>
            ) : gynecologic ? (
              /* GYNECOLOGICAL GRID */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px] border border-slate-200 rounded-lg p-3 bg-white">
                  {/* Uterus detailed */}
                  <div className="space-y-1 sm:border-r sm:border-slate-100 sm:pr-4">
                    <h4 className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider pb-1 border-b border-indigo-50">Tử Cung</h4>
                    <div className="mt-2">
                      <span className="text-slate-500">Tư thế tử cung: </span>
                      <strong className="text-slate-900">{gynecologic.uterusPosition}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Đường kính trước - sau (AP): </span>
                      <strong className="text-slate-900">{gynecologic.uterusSizeAP} mm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Chiều dài tử cung: </span>
                      <strong className="text-slate-900">{gynecologic.uterusSizeLength} mm</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Độ dày nội mạc: </span>
                      <span className="text-slate-950 font-bold bg-slate-100 px-1 py-0.5 rounded">{gynecologic.endometriumThickness} mm</span>
                    </div>
                    <div className="text-[11px] text-slate-600 italic">
                      {gynecologic.endometriumStructure}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      <span className="text-slate-500">Mô tả cơ: </span>{gynecologic.uterusStructure}
                    </div>
                  </div>

                  {/* Overies & Pouch */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-indigo-950 text-[11px] uppercase tracking-wider pb-1 border-b border-indigo-50">Buồng trứng & Phần phụ</h4>
                    <div className="mt-2">
                      <span className="text-slate-500">Buồng trứng Phải: </span>
                      <span className="text-slate-900">{gynecologic.rightOvaryStructure} {gynecologic.rightOvarySize && `(${gynecologic.rightOvarySize} mm)`}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Buồng trứng Trái: </span>
                      <span className="text-slate-900">{gynecologic.leftOvaryStructure} {gynecologic.leftOvarySize && `(${gynecologic.leftOvarySize} mm)`}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Túi cùng Douglas: </span>
                      <strong className="text-slate-900">
                        {gynecologic.douglasPouchFluid === "none" ? "Không có dịch" : gynecologic.douglasPouchFluid === "few" ? "Có ít dịch" : "Có nhiều dịch"}
                      </strong>
                    </div>
                    {gynecologic.douglasPouchParams && (
                      <div className="text-[11px] text-slate-600 italic">
                        {gynecologic.douglasPouchParams}
                      </div>
                    )}
                  </div>
                </div>

                {gynecologic.extraFindings && (
                  <div className="text-[12px] p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-800">Bất thường khác ghi nhận: </span>
                    <span className="text-slate-700">{gynecologic.extraFindings}</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* ULTRASOUND IMAGES DISPLAY CONTAINER */}
          {images && images.length > 0 && (
            <div className="space-y-3 py-1 page-break-avoid">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#1e293b] border-l-4 border-slate-950 pl-2 no-print">
                Hình ảnh siêu âm chụp cắt từ máy (2D)
              </h3>
              
              <div 
                className={`grid gap-4 ${
                  images.length === 1 
                    ? "grid-cols-1 max-w-sm mx-auto" 
                    : "grid-cols-2"
                }`}
              >
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col items-center bg-zinc-950 border-2 border-slate-900 rounded-lg p-2.5 shadow-sm"
                  >
                    <div className="w-full flex items-center justify-center bg-black aspect-[4/3] rounded overflow-hidden">
                      <img
                        src={img}
                        alt={`Ultrasound Capture ${i+1}`}
                        referrerPolicy="no-referrer"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-2 text-center text-white/90 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded italic break-all max-w-full">
                      {imageCaptions?.[i] || `Hình ${i + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM PART (CONCLUSION, DATE, SIGNATURE) - Forces page-break-avoid */}
        <div className="mt-6 pt-4 border-t border-slate-300 space-y-4 page-break-avoid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px]">
            {/* Left Side: Conclusion */}
            <div className="space-y-1.5 p-3.5 bg-slate-100 rounded-lg border-l-4 border-slate-950">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider">KẾT LUẬN:</span>
              <div className="text-[13px] font-black text-slate-900 leading-normal uppercase whitespace-pre-wrap">
                {protocolType === ProtocolType.Obstetric 
                  ? obstetric?.conclusion || "CHƯA PHÁT HIỆN BẤT THƯỜNG TRÊN SIÊU ÂM SẢN KHOA." 
                  : gynecologic?.conclusion || "CHƯA PHÁT HIỆN BẤT THƯỜNG TRÊN SIÊU ÂM TỬ CUNG VÀ PHẦN PHỤ."
                }
              </div>

              {((protocolType === ProtocolType.Obstetric && obstetric?.recommendations) || 
                (protocolType === ProtocolType.Gynecologic && gynecologic?.recommendations)) && (
                <div className="mt-2 text-[11px] text-slate-700 border-t border-slate-200/60 pt-1.5">
                  <span className="font-bold text-slate-500">Lời khuyên / Dặn dò của bác sĩ:</span>
                  <p className="italic font-semibold text-slate-800 mt-0.5">
                    {protocolType === ProtocolType.Obstetric ? obstetric?.recommendations : gynecologic?.recommendations}
                  </p>
                </div>
              )}
            </div>

            {/* Right Side: Signature Block */}
            <div className="text-center flex flex-col justify-between items-center py-2 h-full">
              <span className="text-[11px] font-medium text-slate-500 tracking-wide">
                {formatVietnameseDate(patient.examDate)}
              </span>
              <div className="mt-2">
                <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">BÁC SĨ SIÊU ÂM</span>
                <span className="text-[10px] text-slate-400 italic block mt-0.5">(Ký, ghi rõ họ tên và đóng dấu)</span>
              </div>
              <div className="mt-10 md:mt-12 text-[13px] font-black text-slate-900 uppercase">
                {clinicProfile.doctorName}
              </div>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-2 pb-1 leading-normal">
            Hồ sơ điện tử lưu hành nội bộ phòng khám. Quý bệnh nhân vui lòng giữ gìn sạch sẽ để đối chiếu lần tái khám sau.
          </div>
        </div>
      </div>
    </div>
  );
}
