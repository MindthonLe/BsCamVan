import React, { useState } from "react";
import { ClinicProfile } from "../types";
import { Save, Building, Phone, Mail, MapPin, User, FileText, Upload, Trash2 } from "lucide-react";

interface ClinicProfileSettingsProps {
  profile: ClinicProfile;
  onSave: (newProfile: ClinicProfile) => void;
}

export default function ClinicProfileSettings({ profile, onSave }: ClinicProfileSettingsProps) {
  const [clinicName, setClinicName] = useState(profile.clinicName || "");
  const [doctorName, setDoctorName] = useState(profile.doctorName || "");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [address, setAddress] = useState(profile.address || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [websiteEmail, setWebsiteEmail] = useState(profile.websiteEmail || "");
  const [logoUrl, setLogoUrl] = useState<string | undefined>(profile.logoUrl);
  const [message, setMessage] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước tệp quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setLogoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clinicName,
      doctorName,
      specialty,
      address,
      phone,
      websiteEmail,
      logoUrl,
    });
    setMessage("Đã lưu thông tin phòng khám thành công!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div id="clinic-profile-settings" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-850 px-6 py-4 border-b border-indigo-950/40 text-white flex items-center space-x-3">
        <Building size={20} className="text-yellow-400" />
        <div>
          <h2 className="text-md font-bold text-white uppercase tracking-wider">Cấu Hình Thông Tin Phòng Khám</h2>
          <p className="text-xs text-indigo-200 mt-0.5">Thông tin hiển thị trên tiêu đề của phiếu in kết quả siêu âm</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs font-bold rounded-lg animate-fade-in">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tên phòng khám */}
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Building size={14} className="text-indigo-600" />
              <span>Tên Phòng Khám <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="VD: Phòng khám Sản Phụ khoa & Siêu âm Lan Anh"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>

          {/* Bác sĩ phụ trách */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <User size={14} className="text-indigo-600" />
              <span>Bác Sĩ Phụ Trách <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="VD: ThS. BS. Nguyễn Thị Lan Anh"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>

          {/* Chuyên khoa */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <FileText size={14} className="text-indigo-600" />
              <span>Chuyên Khoa Hỗ Trợ <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="VD: Sản Phụ khoa & Siêu âm Chẩn đoán hình ảnh"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>

          {/* Điện thoại liên hệ */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Phone size={14} className="text-indigo-600" />
              <span>Số Điện Thoại Liên Hệ <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="VD: 0908 123 456"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>

          {/* Email / Website */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <Mail size={14} className="text-indigo-600" />
              <span>Địa Chỉ Email / Website</span>
            </label>
            <input
              type="text"
              value={websiteEmail}
              onChange={(e) => setWebsiteEmail(e.target.value)}
              placeholder="VD: sanphukhoalananh@gmail.com"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>

          {/* Địa chỉ */}
          <div className="col-span-1 md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <MapPin size={14} className="text-indigo-600" />
              <span>Địa Chỉ Phòng Khám <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Số 45 Đường Cách Mạng Tháng Tám, Quận 1, TP. Hồ Chí Minh"
              className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl transition outline-hidden"
            />
          </div>
        </div>

        {/* LOGO UPLOAD */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">Logo phòng khám hiển thị trên phiếu in</h4>
            <p className="text-[11px] text-slate-400">Định dạng PNG/JPG, kích thước khuyến nghị tối đa 2MB.</p>
          </div>

          <div className="flex items-center space-x-4">
            {logoUrl ? (
              <div className="flex items-center space-x-3">
                <img
                  src={logoUrl}
                  alt="Clinic Logo Preview"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-contain p-1 border border-slate-200 rounded-lg bg-slate-50"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                  title="Xoá logo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200/80 rounded-xl cursor-pointer text-xs font-bold text-slate-700 transition">
                <Upload size={14} className="text-slate-600" />
                <span>Tải ảnh Logo lên</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-5 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl flex items-center space-x-2 shadow-xs transition cursor-pointer"
          >
            <Save size={14} />
            <span>Xác nhận Lưu thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
