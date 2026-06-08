import { useState } from "react";
import { UltrasoundReport, ProtocolType } from "../types";
import { Search, Calendar, FileText, Printer, Trash2, Copy, RefreshCw, Layers } from "lucide-react";

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
  const [filterType, setFilterType] = useState<"ALL" | ProtocolType>("ALL");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.patient.patientCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.patient.clinicalDiagnosis || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || report.protocolType === filterType;

    return matchesSearch && matchesType;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers size={18} className="text-slate-500" />
            <span>Lịch Sử Ca Siêu Âm ({reports.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem, sửa, in lại hoặc tái sử dụng thông tin bệnh nhân đã lưu.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên, mã BN, chẩn đoán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-64 text-xs border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg outline-none transition"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-slate-200 text-xs py-2 px-3 rounded-lg bg-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="ALL">Tất cả siêu âm</option>
            <option value={ProtocolType.Obstetric}>Siêu âm Sản khoa</option>
            <option value={ProtocolType.Gynecologic}>Siêu âm Phụ khoa</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
          <FileText size={40} className="stroke-1 text-slate-300" />
          <p className="text-xs font-medium">Không tìm thấy báo cáo kết quả siêu âm nào.</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-indigo-600 hover:underline font-semibold"
            >
              Xóa bộ lọc tìm kiếm
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4 rounded-l-lg">Mã BN / Ngày Khám</th>
                <th className="py-3 px-4">Thông tin bệnh nhân</th>
                <th className="py-3 px-4">Loại hình</th>
                <th className="py-3 px-4">Kết luận</th>
                <th className="py-3 px-4">Hình ảnh</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReports.map((report) => {
                const ageText = report.patient.birthYear ? `${new Date().getFullYear() - parseInt(report.patient.birthYear)} tuổi (${report.patient.birthYear})` : "Chưa nhập";
                const conclusion = report.protocolType === ProtocolType.Obstetric
                  ? report.obstetric?.conclusion
                  : report.gynecologic?.conclusion;

                return (
                  <tr key={report.id} className="hover:bg-slate-50 transition group">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{report.patient.patientCode || "N/A"}</div>
                      <div className="text-[10px] text-slate-400 flex items-center mt-1">
                        <Calendar size={10} className="mr-1" />
                        {formatDate(report.createdAt)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <div className="text-sm font-bold text-slate-900">{report.patient.fullName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {ageText} • {report.patient.address || "Không rõ địa chỉ"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          report.protocolType === ProtocolType.Obstetric
                            ? "bg-pink-50 text-pink-700 border border-pink-100"
                            : "bg-teal-50 text-teal-700 border border-teal-100"
                        }`}
                      >
                        {report.protocolType === ProtocolType.Obstetric ? "Sản Khoa" : "Phụ Khoa"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[240px]">
                      <p className="line-clamp-2 text-slate-600 font-medium italic">
                        {conclusion || "Chưa nhập kết luận"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex -space-x-2">
                        {report.images.map((img, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded border border-white bg-slate-200 overflow-hidden ring-1 ring-slate-200 aspect-square"
                          >
                            <img src={img} alt="Thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {report.images.length === 0 && (
                          <span className="text-[10px] text-slate-400">Không có ảnh</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center space-x-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => onSelectPrint(report)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition"
                          title="In phiếu siêu âm"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => onLoadReport(report)}
                          className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition"
                          title="Chỉnh sửa ca này"
                        >
                          <FileText size={15} />
                        </button>
                        <button
                          onClick={() => onReusePatient(report)}
                          className="p-1.5 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded transition"
                          title="Dùng lại thông tin hành chính"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xác nhận xóa hoàn toàn bệnh án ${report.patient.fullName}?`)) {
                              onDeleteReport(report.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                          title="Xóa bệnh án"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
