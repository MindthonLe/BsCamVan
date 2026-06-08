import { useState } from "react";
import { UltrasoundReport, ProtocolType } from "../types";
import { Search, Loader, Printer, Edit3, Trash2, Copy, FileSpreadsheet, Sparkles } from "lucide-react";

interface PatientHistoryProps {
  reports: UltrasoundReport[];
  onLoadReport: (report: UltrasoundReport) => void;
  onReusePatient: (report: UltrasoundReport) => void;
  onDeleteReport: (id: string) => void;
  onSelectPrint: (report: UltrasoundReport) => void;
}

export default function PatientHistory({
  reports,
  onLoadReport,
  onReusePatient,
  onDeleteReport,
  onSelectPrint,
}: PatientHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      r.patient.fullName.toLowerCase().includes(searchLower) ||
      r.patient.patientCode.toLowerCase().includes(searchLower) ||
      (r.patient.address && r.patient.address.toLowerCase().includes(searchLower))
    );
  });

  const getProtocolTag = (type: ProtocolType) => {
    switch (type) {
      case ProtocolType.Obstetric:
        return (
          <span className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-pink-700 bg-pink-50 border border-pink-100 rounded-md">
            🤰 Siêu âm Sản khoa
          </span>
        );
      case ProtocolType.Gynecologic:
        return (
          <span className="inline-flex items-center px-2 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 border border-teal-100 rounded-md">
            🌸 Siêu âm Phụ khoa
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="patient-history" className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-md font-bold text-slate-800 uppercase flex items-center space-x-2">
            <span>Danh Sách Hồ Sơ Khám Bệnh ({reports.length})</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Tìm kiếm bệnh nhân nhanh, sửa đổi báo cáo hoặc sao chép thông tin hành chính nhanh chóng</p>
        </div>

        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Mã bệnh nhân, Họ tên hoặc Địa chỉ..."
            className="w-full text-xs font-semibold pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
          />
        </div>
      </div>

      {/* Main Listing Grid/Table */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
            <FileSpreadsheet size={32} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">Không tìm thấy bệnh nhân nào</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {searchTerm 
                ? "Không khớp với từ khoá tìm kiếm của bạn. Hãy kiểm tra lại chính tả hoặc thử tìm kiếm khác." 
                : "Hệ thống hiện chưa lưu lịch sử siêu âm nào. Bạn hãy khởi tạo ca khám đầu tiên ở Tab 'Khám Siêu Âm Mới'."}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Responsive Table for md+ screens */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150 text-[11px] font-bold text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 font-black">MÃ BN</th>
                  <th className="py-3.5 px-4">HỌ VÀ TEN BỆNH NHÂN</th>
                  <th className="py-3.5 px-4">ĐỊA CHỈ & THÔNG TIN</th>
                  <th className="py-3.5 px-4 text-center">LOẠI SIÊU ÂM</th>
                  <th className="py-3.5 px-4 text-center">NGÀY KHÁM</th>
                  <th className="py-3.5 px-4">KẾT LUẬN CHẨN ĐOÁN</th>
                  <th className="py-3.5 px-4 text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-indigo-50/10 transition-colors">
                    <td className="py-4 px-4 text-xs font-bold text-indigo-950 font-mono">
                      {report.patient.patientCode}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-xs font-black text-slate-800 uppercase">{report.patient.fullName}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Năm sinh: {report.patient.birthYear}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs max-w-xs text-slate-500 truncate">
                      {report.patient.address || "-"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getProtocolTag(report.protocolType)}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-500 text-center">
                      {report.patient.examDate}
                    </td>
                    <td className="py-4 px-4 text-xs font-bold text-indigo-900/90 max-w-xs truncate" title={report.obstetric?.conclusion || report.gynecologic?.conclusion}>
                      {report.protocolType === ProtocolType.Obstetric 
                        ? report.obstetric?.conclusion 
                        : report.gynecologic?.conclusion}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onSelectPrint(report)}
                          className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 rounded-lg transition"
                          title="Xem bản in / In kết quả"
                        >
                          <Printer size={13.5} />
                        </button>
                        <button
                          onClick={() => onLoadReport(report)}
                          className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-150 rounded-lg transition"
                          title="Sửa báo cáo"
                        >
                          <Edit3 size={13.5} />
                        </button>
                        <button
                          onClick={() => onReusePatient(report)}
                          className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 rounded-lg transition"
                          title="Tái dụng hành chính (Nhân bản)"
                        >
                          <Copy size={13.5} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa báo cáo siêu âm của bệnh nhân này?")) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-150 rounded-lg transition"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 size={13.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards Layout for smaller screens (Sm, Md) */}
          <div className="block lg:hidden divide-y divide-slate-100">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-mono">
                      {report.patient.patientCode}
                    </span>
                    <h3 className="text-xs font-black text-slate-800 uppercase mt-2">{report.patient.fullName}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sinh năm: {report.patient.birthYear} • Ngày: {report.patient.examDate}</p>
                  </div>
                  <div>
                    {getProtocolTag(report.protocolType)}
                  </div>
                </div>

                <div className="text-xs font-semibold text-indigo-950 bg-slate-50/80 p-2.5 border border-slate-150 rounded-xl space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Kết luận siêu âm:</span>
                  <p className="line-clamp-2 leading-relaxed">
                    {report.protocolType === ProtocolType.Obstetric 
                      ? report.obstetric?.conclusion 
                      : report.gynecologic?.conclusion}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    📍 {report.patient.address || "Không địa chỉ"}
                  </span>
                  
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onSelectPrint(report)}
                      className="px-2 py-1 flex items-center space-x-1 text-[11px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-150 rounded-lg"
                    >
                      <Printer size={12} />
                      <span>In</span>
                    </button>
                    <button
                      onClick={() => onLoadReport(report)}
                      className="px-2 py-1 flex items-center space-x-1 text-[11px] text-amber-600 font-bold bg-amber-50 border border-amber-150 rounded-lg"
                    >
                      <Edit3 size={12} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => onReusePatient(report)}
                      className="p-1 text-emerald-600 bg-emerald-50 border border-emerald-150 rounded-lg"
                      title="Nhân bản"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Chắc chắn muốn xóa?")) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="p-1 text-red-600 bg-red-50 border border-red-150 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
