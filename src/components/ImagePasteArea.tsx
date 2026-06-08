import React, { useRef, useState, useEffect } from "react";
import { Camera, Image as ImageIcon, Trash2, Clipboard, ArrowUpDown } from "lucide-react";

interface ImagePasteAreaProps {
  label: string;
  placeholder?: string;
  value?: string; // Base64 string
  onChange: (base64Data: string) => void;
  onClear: () => void;
  caption?: string;
  onCaptionChange?: (text: string) => void;
}

export default function ImagePasteArea({
  label,
  placeholder = "Click để chọn, thả tệp, hoặc click vào đây rồi nhấn Ctrl+V để dán ảnh",
  value,
  onChange,
  onClear,
  caption,
  onCaptionChange,
}: ImagePasteAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng tải tệp tin hình ảnh!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Paste Event Handler on click/focus
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            break;
          }
        }
      }
    }
  };

  // Helper notice if clipboard permission is accessible
  const handleClipboardClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith("image/")) {
              const blob = await item.getType(type);
              const file = new File([blob], "clipboard_image.png", { type });
              processFile(file);
              return;
            }
          }
        }
      } else {
        // Fallback for browsers with restricted clipboard read
        fileInputRef.current?.click();
      }
    } catch (err) {
      // Standard clipboard.read() is rejected in many context without explicit user clicks/permissions,
      // so fallback to file dialog or standard keyboard paste is correct.
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center space-x-1 py-1 px-2 rounded hover:bg-red-50 transition"
            title="Xóa hình ảnh"
          >
            <Trash2 size={13} />
            <span>Xóa ảnh</span>
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        ref={containerRef}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!value) {
            fileInputRef.current?.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center min-h-[220px] rounded-lg border-2 border-dashed transition-all cursor-pointer outline-none bg-slate-50 overflow-hidden ${
          value ? "border-slate-300" : "border-slate-300 hover:border-indigo-500 hover:bg-slate-100/80"
        } ${isHovered ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" : ""} ${
          isFocused ? "ring-2 ring-indigo-500/30 border-indigo-500 bg-indigo-50/10" : ""
        }`}
      >
        {value ? (
          <div className="relative w-full h-[220px] flex items-center justify-center p-2 bg-zinc-950">
            <img
              src={value}
              alt={label}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain rounded"
            />
            <div className="absolute top-2 right-2 flex bg-slate-900/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur">
              Trực quan 2D
            </div>
            
            {/* Overlay click to change */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition duration-150 flex flex-col items-center justify-center text-white"
            >
              <ArrowUpDown size={22} className="mb-1" />
              <p className="text-xs font-semibold">Bấm để thay thế ảnh khác</p>
              <p className="text-[10px] text-zinc-300 mt-1">Hoặc nhấn Ctrl+V để dán ảnh mới</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 transition group-hover:scale-110">
              <Camera size={26} />
            </div>
            <div className="space-y-1 px-4">
              <p className="text-sm font-medium text-slate-800">
                Nhấn <span className="font-bold text-indigo-600 px-1 py-0.5 bg-slate-200 rounded">Ctrl + V</span> để dán ảnh trực tiếp
              </p>
              <p className="text-xs text-slate-500">
                Hoặc kéo thả file ảnh, click chuột để chọn file từ máy tính
              </p>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClipboardClick();
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 font-semibold px-3 py-1.5 rounded transition"
            >
              <Clipboard size={13} />
              <span>Dán nhanh từ bộ nhớ tạm</span>
            </button>
          </div>
        )}
      </div>

      {value && onCaptionChange && (
        <div className="mt-1">
          <input
            type="text"
            value={caption || ""}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Chú thích cho hình ảnh này (Ví dụ: Mặt cắt lưỡng đỉnh, ĐK trước-sau...)"
            className="w-full text-xs text-slate-600 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-300 rounded-md px-2.5 py-1.5 outline-none transition font-medium italic"
          />
        </div>
      )}
    </div>
  );
}
