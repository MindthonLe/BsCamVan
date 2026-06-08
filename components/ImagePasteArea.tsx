import React, { useEffect, useRef, useState } from "react";
import { Upload, Clipboard, Trash2, Maximize, Smile, Image as ImageIcon } from "lucide-react";

interface ImagePasteAreaProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages: number;
}

export default function ImagePasteArea({ images, onChange, maxImages }: ImagePasteAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle Ctrl+V / Cmd+V paste globally when focusing this area
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Check if document active element is input or textarea to avoid intercepting normal text pastes
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            readAndAppendImage(file);
          }
          e.preventDefault();
          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [images]);

  const readAndAppendImage = (file: File) => {
    if (images.length >= maxImages) {
      alert(`Đã đạt giới hạn tối đa ${maxImages} hình ảnh cho loại siêu âm này.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onChange([...images, e.target.result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files) as File[];
    let currentImagesCount = images.length;

    filesArray.forEach((file: File) => {
      if (currentImagesCount < maxImages) {
        readAndAppendImage(file);
        currentImagesCount++;
      } else {
        alert(`Số lượng tệp tối đa được cấu hình là ${maxImages} ảnh.`);
      }
    });

    e.target.value = ""; // Clear input
  };

  const handleDeleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      if (file.type.indexOf("image") !== -1) {
        readAndAppendImage(file);
      }
    });
  };

  return (
    <div id="image-paste-area" className="space-y-4">
      
      {/* DRAG AND DROP / PASTE CAPTURE BOX */}
      {images.length < maxImages && (
        <div
          ref={containerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center space-y-3 cursor-pointer group ${
            isDragging 
              ? "border-indigo-500 bg-indigo-50/50" 
              : "border-slate-350 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
          }`}
        >
          <div className="p-3 bg-white text-indigo-600 rounded-full border border-indigo-100 shadow-xs group-hover:scale-105 transition duration-200">
            <Clipboard size={22} className="animate-bounce" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800">
              Nhấn <kbd className="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded font-mono text-[10px] text-slate-700">Ctrl + V</kbd> (hoặc <kbd className="px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded font-mono text-[10px] text-slate-700">Cmd + V</kbd>) để DÁN nhanh ảnh siêu âm
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Hoặc Kéo thả tệp ảnh vào đây, hoặc nhấn để duyệt tìm tập tin hình ảnh từ máy tính
            </p>
          </div>

          <label className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 hover:shadow-md transition cursor-pointer select-none">
            <input
              type="file"
              accept="image/*"
              multiple={maxImages > 1}
              onChange={handleFileUpload}
              className="hidden"
            />
            Duyệt & chọn tập tin ảnh
          </label>
        </div>
      )}

      {/* RENDER CURRENT ATTACHED IMAGES */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative group bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 shadow-sm flex flex-col items-center justify-center min-h-[180px]">
              <img
                src={img}
                alt={`Ultrasound Fetal Image ${index + 1}`}
                referrerPolicy="no-referrer"
                className="max-h-[160px] object-contain rounded-lg"
              />
              
              <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition duration-200">
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="p-2 text-white bg-red-600/90 hover:bg-red-700 rounded-lg shadow-sm transition"
                  title="Xoá ảnh này"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 bg-black/75 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-bold text-slate-300">
                Ảnh siêu âm {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
