import React from 'react';
import { X, Globe, Terminal, Cloud, CheckCircle2, Rocket, ExternalLink, Key, Code } from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Hướng Dẫn Đưa Ứng Dụng Lên Mạng (Miễn Phí 100%)</h3>
              <p className="text-xs text-emerald-100">Triển khai Cloud nhanh chóng để chia sẻ cho giáo viên toàn trường</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Option 1: Render.com or Vercel */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Cách 1: Triển khai Full-Stack lên Render / Railway (Khuyên dùng)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>Đẩy mã nguồn lên tài khoản GitHub của Thầy/Cô (Public hoặc Private).</li>
              <li>Truy cập <strong className="text-slate-800">Render.com</strong> hoặc <strong className="text-slate-800">Railway.app</strong> và đăng nhập bằng GitHub.</li>
              <li>Chọn <strong>New Web Service</strong> & kết nối với Repository vừa tạo.</li>
              <li>Cấu hình lệnh Build & Start:
                <div className="mt-1.5 p-2.5 bg-slate-900 text-emerald-400 font-mono rounded-lg text-[11px] space-y-1">
                  <p>Build Command: <span className="text-white">npm install && npm run build</span></p>
                  <p>Start Command: <span className="text-white">npm start</span></p>
                </div>
              </li>
              <li>Trong mục <strong>Environment Variables</strong>, thêm:
                <div className="mt-1 p-2 bg-indigo-950 text-indigo-200 font-mono rounded-md text-[11px]">
                  GEMINI_API_KEY = your_gemini_api_key_here
                </div>
              </li>
              <li>Nhấn <strong>Deploy Web Service</strong>. Sau 1 phút, hệ thống sẽ cấp đường dẫn tên miền miễn phí dạng <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">https://ten-ung-dung.onrender.com</code>.</li>
            </ol>
          </div>

          {/* Option 2: Vercel / Netlify (Client Mode) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>Cách 2: Triển khai lên Vercel / Netlify</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
              <li>Truy cập <strong className="text-slate-800">Vercel.com</strong> và bấm <strong>Import Project</strong> từ GitHub.</li>
              <li>Vercel tự động nhận diện Vite/React Framework.</li>
              <li>Thêm biến môi trường <code className="text-slate-900 font-mono">GEMINI_API_KEY</code> trong cài đặt dự án.</li>
              <li>Nhấn <strong>Deploy</strong>. Ứng dụng sẽ hoạt động trên tên miền <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded">*.vercel.app</code> với chứng chỉ SSL HTTPS hoàn toàn miễn phí.</li>
            </ol>
          </div>

          {/* Option 3: Google Cloud Run */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Terminal className="w-4 h-4 text-amber-600" />
              <span>Cách 3: Deploy trên Google Cloud Run bằng lệnh CLI</span>
            </div>
            <div className="p-2.5 bg-slate-900 text-slate-100 font-mono rounded-lg text-[11px] overflow-x-auto space-y-1">
              <p className="text-slate-400"># 1. Build container</p>
              <p>gcloud builds submit --tag gcr.io/PROJECT_ID/matran-dethi</p>
              <p className="text-slate-400 mt-1"># 2. Deploy Cloud Run</p>
              <p>gcloud run deploy matran-dethi --image gcr.io/PROJECT_ID/matran-dethi --platform managed --allow-unauthenticated</p>
            </div>
          </div>

          {/* Tips */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-800">
              <strong>Mẹo nhỏ:</strong> Thầy/Cô có thể gắn tên miền riêng của trường (ví dụ: <code className="font-semibold">dethi.thptchuyen.edu.vn</code>) vào Vercel hoặc Render hoàn toàn miễn phí thông qua bản ghi CNAME của nhà cung cấp tên miền.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
          >
            Đã hiểu
          </button>
        </div>

      </div>
    </div>
  );
};
