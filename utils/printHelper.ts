import { UltrasoundReport, ClinicProfile, ProtocolType } from "../types";

/**
 * Generates a beautiful, isolated, and print-optimized HTML page for standard A4 medical reports.
 * Opens a clean new tab, loads Google Fonts (Inter + JetBrains Mono), configures Tailwind,
 * scales layout parameters for single-page budgets, and runs the print dialogue flawlessly.
 */
export function printReportInNewTab(report: UltrasoundReport, clinicProfile: ClinicProfile) {
  const isObstetric = report.protocolType === ProtocolType.Obstetric;
  const patient = report.patient;
  
  // Format dates beautifully
  const examDateStr = patient.examDate || "N/A";
  const reportCreatedDate = new Date(report.createdAt);
  const formattedCreationDate = `ngày ${reportCreatedDate.getDate()} tháng ${reportCreatedDate.getMonth() + 1} năm ${reportCreatedDate.getFullYear()}`;

  // Build the specific metrics sections based on OB or GYN templates
  let clinicalSectionHtml = "";

  if (isObstetric && report.obstetric) {
    const ob = report.obstetric;
    const methodText = ob.calculationMethod === "lmp" 
      ? "Kinh cuối cùng (LMP)" 
      : ob.calculationMethod === "embryo" 
        ? "Chuyển phôi IVF" 
        : "Khoảng siêu âm thủ công";

    clinicalSectionHtml = `
      <div class="grid grid-cols-2 gap-6 text-xs text-slate-800">
        <!-- 1. Tình trạng Thai nhi -->
        <div class="space-y-2 border-r border-slate-100 pr-4">
          <h4 class="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">1. Tình trạng Thai nhi</h4>
          <div class="grid grid-cols-2 gap-y-1.5">
            <span class="text-slate-500">Số lượng thai:</span>
            <span class="font-bold text-slate-900">${ob.fetalCount || "N/A"}</span>
            
            <span class="text-slate-500">Ngôi thai:</span>
            <span class="font-bold text-slate-900">${ob.presentation || "N/A"}</span>

            <span class="text-slate-500">Hoạt động tim thai:</span>
            <span class="font-bold text-rose-600">${ob.cardiacActivity || "N/A"}</span>

            <span class="text-slate-500">Tần số tim thai:</span>
            <span class="font-black text-rose-650 font-mono">${ob.fetalHeartRate ? `${ob.fetalHeartRate} bpm` : "N/A"}</span>

            <span class="text-slate-500">Cử động thai:</span>
            <span class="font-bold text-slate-900">${ob.fetalMovement || "N/A"}</span>
          </div>
        </div>

        <!-- 2. Chỉ số Sinh học (Biometry) -->
        <div class="space-y-2">
          <h4 class="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">2. Chỉ số Sinh học (Biometry)</h4>
          <div class="grid grid-cols-2 gap-y-1.5">
            ${ob.bpd ? `
              <span class="text-slate-500">Đường lưỡng đỉnh (BPD):</span>
              <span class="font-bold text-slate-900">${ob.bpd} mm</span>
            ` : ""}
            
            ${ob.fl ? `
              <span class="text-slate-500">Chiều dài x.đùi (FL):</span>
              <span class="font-bold text-slate-900">${ob.fl} mm</span>
            ` : ""}
            
            ${ob.ac ? `
              <span class="text-slate-500">C.vòng bụng (AC):</span>
              <span class="font-bold text-slate-900">${ob.ac} mm</span>
            ` : ""}
            
            ${ob.hc ? `
              <span class="text-slate-500">C.vòng đầu (HC):</span>
              <span class="font-bold text-slate-900">${ob.hc} mm</span>
            ` : ""}
            
            ${ob.crl ? `
              <span class="text-slate-500">Chiều dài đầu mông (CRL):</span>
              <span class="font-bold text-slate-900">${ob.crl} mm</span>
            ` : ""}
            
            ${ob.efw ? `
              <span class="text-indigo-900 font-extrabold">Trọng lượng thai (EFW):</span>
              <span class="font-black text-indigo-650">${ob.efw} gram</span>
            ` : ""}
          </div>
        </div>

        <!-- 3. Phần Phụ (Nhau, Ối) & 4. Tuổi thai -->
        <div class="col-span-2 space-y-2 mt-2 pt-3 border-t border-slate-100 grid grid-cols-2 gap-6">
          <div class="space-y-2 border-r border-slate-100 pr-4">
            <h4 class="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">3. Phần Phụ (Nhau, Ối)</h4>
            <div class="grid grid-cols-2 gap-y-1.5">
              <span class="text-slate-500">Vị trí bám bánh nhau:</span>
              <span class="font-bold text-slate-900">${ob.placentaLocation || "N/A"}</span>

              <span class="text-slate-500">Độ trưởng thành nhau:</span>
              <span class="font-bold text-slate-900">${ob.placentaGrade || "N/A"}</span>

              <span class="text-teal-900 font-bold">Lượng nước ối:</span>
              <span class="font-extrabold text-teal-700">${ob.amnioticFluidVolume || "N/A"}</span>

              <span class="text-slate-500">Chỉ số ối (AFI):</span>
              <span class="font-semibold text-slate-800">${ob.amnioticFluidIndex || "N/A"}</span>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="font-bold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">4. Tuổi thai & Dự sinh</h4>
            <div class="grid grid-cols-2 gap-y-1.5">
              <span class="text-slate-500">Phương pháp tính:</span>
              <span class="font-bold text-slate-600">${methodText}</span>

              <span class="text-indigo-950 font-black">Tuổi thai sinh học ước tính:</span>
              <span class="font-extrabold text-indigo-955">${ob.gestationalWeeks} tuần ${ob.gestationalDays} ngày</span>

              <span class="text-rose-900 font-black">Dự kiến ngày sinh (EDD):</span>
              <span class="font-extrabold text-rose-600 font-mono text-xs">${ob.eddDate || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (!isObstetric && report.gynecologic) {
    const gyn = report.gynecologic;
    const fluidText = gyn.douglasPouchFluid === "none" 
      ? "Không có dịch" 
      : gyn.douglasPouchFluid === "few" 
        ? "Có ít dịch sinh lý" 
        : "Có nhiều dịch bất thường";

    clinicalSectionHtml = `
      <div class="grid grid-cols-2 gap-6 text-xs text-slate-800">
        <!-- 1. Mô tả Tử Cung -->
        <div class="space-y-2 border-r border-slate-100 pr-4">
          <h4 class="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">1. Mô tả Tử Cung</h4>
          <div class="grid grid-cols-2 gap-y-1.5">
            <span class="text-slate-500">Tư thế cổ tử cung:</span>
            <span class="font-bold text-slate-900">${gyn.uterusPosition || "N/A"}</span>
            
            <span class="text-slate-500">Tử cung dài (lọc dọc):</span>
            <span class="font-bold text-slate-900">${gyn.uterusSizeLength || "0"} mm</span>

            <span class="text-slate-500">Đường kính trước sau (AP):</span>
            <span class="font-bold text-slate-900">${gyn.uterusSizeAP || "0"} mm</span>

            <span class="text-slate-500 col-span-2 border-t border-slate-100/50 mt-1 pt-1 italic text-slate-600">
              Nhu mô: ${gyn.uterusStructure || "Bình thường"}
            </span>
          </div>
        </div>

        <!-- 2. Nội Mạc Tử Cung -->
        <div class="space-y-2">
          <h4 class="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">2. Nội Mạc Tử Cung</h4>
          <div class="grid grid-cols-2 gap-y-1.5">
            <span class="text-indigo-900 font-semibold">Độ dày nội mạc:</span>
            <span class="font-extrabold text-indigo-650">${gyn.endometriumThickness || "0"} mm</span>

            <span class="text-slate-500 col-span-2 text-[11px] bg-slate-50 p-2 border border-slate-150 rounded-lg mt-1 block leading-tight">
              Cấu trúc: ${gyn.endometriumStructure || "N/A"}
            </span>
          </div>
        </div>

        <!-- 3. Bộ Hai Buồng Trứng & 4. Douglas -->
        <div class="col-span-2 space-y-2 mt-2 pt-3 border-t border-slate-100 grid grid-cols-2 gap-6">
          <div class="space-y-2 border-r border-slate-100 pr-4">
            <h4 class="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">3. Bộ Hai Buồng Trứng</h4>
            <div class="space-y-1 text-[11px] leading-tight text-slate-700">
              <p>
                <strong class="text-slate-900">Buồng trứng PHẢI (${gyn.rightOvarySize || "0"}mm):</strong> 
                ${gyn.rightOvaryStructure || "Nhu mô bình thường"}
              </p>
              <p class="mt-2">
                <strong class="text-slate-900">Buồng trứng TRÁI (${gyn.leftOvarySize || "0"}mm):</strong> 
                ${gyn.leftOvaryStructure || "Nhu mô bình thường"}
              </p>
            </div>
          </div>

          <div class="space-y-2">
            <h4 class="font-semibold text-indigo-950 uppercase border-b border-slate-100 text-[10px] pb-1 text-slate-400">4. Trạng thái túi cùng (Douglas)</h4>
            <div class="grid grid-cols-2 gap-y-1.5">
              <span class="text-slate-500">Dịch túi cùng sau:</span>
              <span class="font-bold text-slate-900">${fluidText}</span>

              <span class="text-slate-500 col-span-2 text-[11px] block mt-1 italic text-slate-600">
                Ghi chú phụ: ${gyn.douglasPouchParams || "Không có bất thường."}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Build Image attachments gallery
  let imageGalleryHtml = "";
  if (report.images && report.images.length > 0) {
    const isDouble = report.images.length === 2;
    imageGalleryHtml = `
      <div class="space-y-3 pt-3 border-t border-slate-200">
        <h3 class="text-xs font-black uppercase text-slate-950 border-b border-slate-150 pb-0.5 flex items-center">
          <span>II. HÌNH ẢNH MINH THUẬT SIÊU ÂM (PHOTO DOCK)</span>
        </h3>
        <div class="grid ${isDouble ? "grid-cols-2" : "grid-cols-1 max-w-sm mx-auto"} gap-4">
          ${report.images.map((img, idx) => `
            <div class="flex flex-col items-center justify-center p-1.5 border border-slate-250 bg-slate-50 rounded-xl">
              <img
                src="${img}"
                alt="Ultrasound visual ${idx + 1}"
                class="rounded-md object-contain"
              />
              ${report.imageCaptions && report.imageCaptions[idx] ? `
                <p class="text-[9px] text-center font-bold text-slate-500 italic mt-1 leading-tight">
                  Hình ${idx + 1}: ${report.imageCaptions[idx]}
                </p>
              ` : `
                <p class="text-[9px] text-center font-bold text-slate-400 italic mt-1 leading-tight">
                  Hình ${idx + 1}
                </p>
              `}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  // Get dynamic values for extra findings, conclusion & recommendations safely
  const extraFindingsText = isObstetric 
    ? (report.obstetric?.extraFindings || "Chưa ghi nhận bất thường nào khác.") 
    : (report.gynecologic?.extraFindings || "Chưa ghi nhận bất thường nào khác.");

  const conclusionText = isObstetric 
    ? (report.obstetric?.conclusion || "N/A") 
    : (report.gynecologic?.conclusion || "N/A");

  const recommendationsText = isObstetric 
    ? (report.obstetric?.recommendations || "N/A") 
    : (report.gynecologic?.recommendations || "N/A");

  // Construct the absolute final full HTML wrapper string
  const finalHtmlCode = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>In Phiếu kết quả siêu âm - Patient: ${patient.fullName}</title>
  
  <!-- Tailwind Play CDN for layout compatibility -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Professional system print overrides -->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 8mm 12mm 8mm 12mm;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: white;
      color: black;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Print budget alignments */
    .print-page {
      font-size: 11px !important; 
      line-height: 1.35 !important;
      max-width: 210mm;
      margin: 0 auto;
      background: white;
    }

    /* Target standard spacings to squeeze cleanly onto exactly 1 single A4 sheet */
    .print-page .space-y-6 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 10px !important;
    }
    .print-page .space-y-5 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 8px !important;
    }
    .print-page .space-y-4 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 6px !important;
    }
    .print-page .space-y-2 > :not([hidden]) ~ :not([hidden]) {
      margin-top: 3px !important;
    }

    /* Ultrasound custom photo dock height constraint */
    .print-page img {
      max-height: 118px !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
      margin: 0 auto !important;
    }

    /* Ensure specific grid layouts always persist in A4 landscape/portrait blocks */
    .grid {
      display: grid !important;
    }
    
    h1 {
      font-size: 15px !important;
      margin-bottom: 2px !important;
    }
    h2 {
      font-size: 12px !important;
    }
    h3 {
      font-size: 10.5px !important;
      padding-bottom: 2px !important;
      margin-bottom: 4px !important;
    }
    h4 {
      font-size: 9.5px !important;
    }

    /* Compact clinical box wrappers */
    .clinical-box-left {
      background-color: rgb(239, 246, 255, 0.4) !important; /* bg-blue-50/40 */
      border: 1px solid rgb(191, 219, 254) !important;    /* border-blue-200 */
      padding: 8px 10px !important;
      border-radius: 12px !important;
    }

    .clinical-box-right {
      background-color: rgb(248, 250, 252) !important; /* bg-slate-50 */
      padding: 8px 10px !important;
      border-radius: 12px !important;
    }

    /* Signature budget height */
    .signature-pad {
      height: 38px !important;
    }

    /* Avoid page-breaks across specific child entities */
    .avoid-page-break {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    /* Chrome-specific hidden address bars and print margins fix */
    @media print {
      html, body {
        height: 99%;
        background: white;
      }
    }
  </style>
</head>
<body>

  <div class="print-page space-y-4 p-1">
    
    <!-- REPORT CLINIC HEADER -->
    <div class="flex items-start justify-between border-b-2 border-indigo-950 pb-3">
      <div class="flex items-start space-x-4">
        ${clinicProfile.logoUrl ? `
          <img
            src="${clinicProfile.logoUrl}"
            alt="Clinic Logo"
            class="w-14 h-14 object-contain rounded bg-slate-50 border border-slate-100"
          />
        ` : ""}
        <div class="space-y-0.5">
          <h2 class="text-xs md:text-sm font-extrabold uppercase text-slate-900 tracking-wide">${clinicProfile.clinicName}</h2>
          <p class="text-[11px] font-black text-indigo-950">
            <span>Bác sĩ phụ trách:</span>
            <span class="text-slate-800 font-bold">${clinicProfile.doctorName}</span>
          </p>
          <p class="text-[10px] text-slate-500 font-medium">${clinicProfile.specialty}</p>
        </div>
      </div>

      <div class="text-right text-[10px] text-slate-500 space-y-0.5">
        <p class="font-semibold">SĐT: ${clinicProfile.phone}</p>
        ${clinicProfile.websiteEmail ? `<p class="truncate max-w-[200px]">Email: ${clinicProfile.websiteEmail}</p>` : ""}
        <p class="font-medium max-w-[250px] leading-tight text-slate-400 text-[9px]">
          Đ/C: ${clinicProfile.address}
        </p>
      </div>
    </div>

    <!-- CLINICAL DOCUMENT TITLE -->
    <div class="text-center py-0.5">
      <h1 class="text-md md:text-lg font-black text-slate-900 uppercase tracking-widest">
        ${isObstetric ? "KẾT QUẢ SIÊU ÂM SẢN KHOA" : "KẾT QUẢ SIÊU ÂM PHỤ KHOA"}
      </h1>
      <p class="text-[9px] uppercase font-black tracking-wide text-slate-400 font-mono">
        Mẫu kiểm tra khảo sát 2D thường quy
      </p>
    </div>

    <!-- ADMINISTRATIVE PATIENT BLOCK -->
    <div class="p-3 bg-slate-50/70 border border-slate-200 rounded-xl grid grid-cols-3 gap-y-2 gap-x-4 text-[11px] font-semibold text-slate-800">
      <div class="col-span-2">
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Họ và tên bệnh nhân:</span>
        <span class="font-extrabold uppercase text-slate-900 text-[12px]">${patient.fullName}</span>
      </div>

      <div>
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Mã bệnh nhân (PID):</span>
        <span class="font-mono font-bold text-indigo-950 text-slate-800 text-[11px]">${patient.patientCode}</span>
      </div>

      <div>
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Năm sinh / Tuổi:</span>
        <span class="font-bold text-slate-900">${patient.birthYear}</span>
      </div>

      <div class="col-span-2">
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Địa chỉ cư trú:</span>
        <span class="font-medium text-slate-700 truncate block">${patient.address || "Chưa ghi nhận"}</span>
      </div>

      <div class="col-span-2">
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Chẩn đoán lâm sàng:</span>
        <span class="font-semibold text-slate-805 italic">${patient.clinicalDiagnosis || "N/A"}</span>
      </div>

      <div>
        <span class="text-slate-400 font-semibold uppercase text-[9px] block">Ngày siêu âm:</span>
        <span class="font-bold text-slate-900">${examDateStr}</span>
      </div>
    </div>

    <!-- I. MEDICAL TEXT RESULTS -->
    <div class="space-y-3">
      <h3 class="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-900 pb-0.5 mt-1 flex items-center">
        <span>I. MÔ TẢ HÌNH ẢNH SIÊU ÂM TRỰC QUAN</span>
      </h3>
      ${clinicalSectionHtml}
    </div>

    <!-- II. IMAGES DOCK -->
    ${imageGalleryHtml}

    <!-- EXTRA FINDINGS (Ghi chú khác) -->
    <div class="space-y-1 pt-2 border-t border-slate-200">
      <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Một số bất thường phụ / Ghi chú cơ thể sinh học khác:</span>
      <p class="text-[11px] text-slate-600 leading-tight font-medium font-sans">
        ${extraFindingsText}
      </p>
    </div>

    <!-- III. MAJOR CLINICAL CONCLUSION & RECOMMENDATIONS -->
    <div class="grid grid-cols-5 gap-4 pt-3 border-t-2 border-indigo-950 avoid-page-break">
      <div class="col-span-3 clinical-box-left space-y-1">
        <span class="text-red-650 font-extrabold uppercase text-[9px] tracking-widest block">KẾT LUẬN CHẨN ĐOÁN CHÍNH:</span>
        <p class="text-[12px] font-black text-indigo-950 leading-relaxed uppercase whitespace-pre-line tracking-wide">
          ${conclusionText}
        </p>
      </div>

      <div class="col-span-2 clinical-box-right space-y-1 text-[11px] text-slate-700">
        <span class="text-slate-400 font-extrabold uppercase text-[9px] block">CHỈ ĐỊNH DẶN DÒ:</span>
        <p class="font-semibold leading-normal">
          ${recommendationsText}
        </p>
      </div>
    </div>

    <!-- REPORT SIGNATURE STAMP -->
    <div class="pt-4 flex items-center justify-between text-[11px] font-semibold text-slate-800 avoid-page-break">
      <div class="text-[10px] text-slate-450 leading-tight">
        <p>Hệ thống hỗ trợ chuyên khoa siêu âm sản phụ khoa v1.0.0</p>
        <p class="font-mono mt-0.5">Report ID: ${report.id}</p>
      </div>

      <div class="text-center space-y-1">
        <p class="italic text-slate-500">TP. Hồ Chí Minh, ${formattedCreationDate}</p>
        <p class="font-extrabold uppercase tracking-wide text-slate-900 text-[10px]">BÁC SĨ CHUYÊN KHOA SIÊU ÂM</p>
        <div class="signature-pad"></div> <!-- Placeholder for signature stamp -->
        <p class="font-black text-slate-900 mt-1 underline decoration-indigo-650 decoration-2">${clinicProfile.doctorName}</p>
      </div>
    </div>

  </div>

  <!-- Auto print script -->
  <script>
    window.onload = function() {
      // Small timeout for Tailwind styles to apply and images to render completely
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`;

  // Open clean blank tab/window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(finalHtmlCode);
    printWindow.document.close();
  } else {
    // Fallback if browser blocked popups
    alert("Vui lòng cho phép mở popup trên trình duyệt của bạn để xuất bản bản in A4!");
  }
}
