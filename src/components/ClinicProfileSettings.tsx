import React, { useState } from "react";
import { ClinicProfile } from "../types";
import { Settings, Save, Sparkles, Building, Phone, MapPin, User, Mail, Upload, Trash2 } from "lucide-react";

interface ClinicProfileSettingsProps {
  profile: ClinicProfile;
  onSave: (newProfile: ClinicProfile) => void;
}

export default function ClinicProfileSettings({
  profile,
  onSave,
}: ClinicProfileSettingsProps) {
  const [formData, setFormData] = useState<ClinicProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng tải tệp tin hình ảnh làm logo!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setFormData((prev) => ({ ...prev, logoUrl: event.target.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated.logoUrl;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Cấu hình Thông Tin Phòng Khám
          </h2>
          <p className="text-xs text-slate-500">
            Thông tin này sẽ hiển thị ở phần tiêu đề (Header) của phiếu kết quả in ra.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* LOGO UPLOADER */}
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-150">
          <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Clinic Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building size={24} className="text-slate-400" />
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <span className="text-xs font-semibold text-slate-700 block">
              Logo Phòng Khám (Tùy chọn)
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center space-x-1 py-1 px-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 rounded shadow-xs transition"
              >
                <Upload size={12} />
                <span>Tải ảnh lên</span>
              </button>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="inline-flex items-center space-x-1 py-1 px-2.5 bg-red-50 hover:bg-red-100/80 text-[11px] font-semibold text-red-600 rounded transition"
                >
                  <Trash2 size={12} />
                  <span>Xóa logo</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-500">
              Khuyên dùng ảnh nền trắng hoặc trong suốt kích thước vuông.
            </p>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <Building size={13} className="text-slate-400" />
              <span>Tên phòng khám / Bệnh viện</span>
            </label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Phòng Khám Sản Phụ Khoa Tâm Đức"
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <User size={13} className="text-slate-400" />
              <span>Bác sĩ chịu trách nhiệm</span>
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              required
              placeholder="Ví dụ: ThS. BS. Nguyễn Thị Lan"
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 col-span-1 md:col-span-2 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Sparkles size={13} className="text-slate-400" />
                <span>Chuyên khoa / Chức danh</span>
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ví dụ: Bác sĩ Sản Phụ Khoa / Siêu âm màu"
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                <Phone size={13} className="text-slate-400" />
                <span>Số điện thoại nóng</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Ví dụ: 0912.345.678"
                className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <MapPin size={13} className="text-slate-400" />
              <span>Địa chỉ phòng khám</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 123 Đường Hải Thượng Lãn Ông, Phường 10, Quận 5, TP. HCM"
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <Mail size={13} className="text-slate-400" />
              <span>Email / Website phòng khám (Tùy chọn)</span>
            </label>
            <input
              type="text"
              name="websiteEmail"
              value={formData.websiteEmail || ""}
              onChange={handleChange}
              placeholder="Ví dụ: phongkhamsanphukhoatanduc@gmail.com - www.tanducclinic.com"
              className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {isSaved && (
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1.5 rounded-md animate-pulse">
                Đã lưu cấu hình thành công!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Save size={15} />
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  );
}
