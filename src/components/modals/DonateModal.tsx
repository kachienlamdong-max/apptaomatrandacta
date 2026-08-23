import React, { useState } from 'react';
import { X, Heart, Copy, Check, Coffee, ShieldCheck } from 'lucide-react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [hasConfirmedSupport, setHasConfirmedSupport] = useState(false);

  if (!isOpen) return null;

  const accountNumber = '5495215016444';
  const bankName = 'Agribank (Ngân hàng Nông nghiệp & PTNT Việt Nam)';

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cảm Ơn & Ủng Hộ Tác Giả</h3>
              <p className="text-xs text-rose-100">Tiếp thêm động lực phát triển công cụ miễn phí cho giáo dục</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-700 leading-relaxed">
              Ứng dụng được xây dựng hoàn toàn miễn phí nhằm hỗ trợ quý Thầy/Cô trên toàn quốc tiết kiệm thời gian soạn ma trận, bản đặc tả và đề kiểm tra chuẩn Bộ GD&ĐT.
            </p>
            <p className="text-xs text-slate-500">
              Nếu thấy ứng dụng hữu ích, Thầy/Cô có thể gửi tặng tác giả 1 ly trà đá / cà phê <span className="font-semibold text-rose-600">5.000đ</span> để duy trì máy chủ.
            </p>
          </div>

          {!hasConfirmedSupport ? (
            <div className="text-center pt-2">
              <button
                id="btn-confirm-support-5k"
                onClick={() => setHasConfirmedSupport(true)}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-rose-200 transition-all hover:scale-[1.01]"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Ủng hộ / Cảm ơn 5.000đ</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Hoặc quý Thầy/Cô có thể bấm đóng bỏ qua để tiếp tục sử dụng miễn phí trọn đời
              </p>
            </div>
          ) : (
            <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>Thông tin chuyển khoản ủng hộ:</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-rose-100">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <span className="font-bold text-slate-800">{bankName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-rose-100">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-base text-rose-700">{accountNumber}</span>
                    <button
                      id="btn-copy-stk"
                      onClick={handleCopyAccount}
                      title="Sao chép số tài khoản"
                      className="p-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nội dung CK:</span>
                  <span className="font-medium text-slate-700">Cam on phan mem de thi</span>
                </div>
              </div>
            </div>
          )}

          {/* Close / Skip button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Đóng lại / Tiếp tục sử dụng
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
