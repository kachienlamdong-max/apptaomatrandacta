import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Share2, Download, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://matrandethi.edu.vn';

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUrl, {
        width: 260,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error('QR generation error:', err);
      });
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'Ma-QR-He-Thong-Tao-De-Thi.png';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chia Sẻ Ứng Dụng</h3>
              <p className="text-xs text-blue-100">Gửi cho đồng nghiệp trong tổ bộ môn & nhà trường</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-5">
          
          {/* QR Code Container */}
          <div className="inline-block p-3 bg-white rounded-2xl border-2 border-indigo-100 shadow-md">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="QR Code ứng dụng" 
                className="w-52 h-52 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
            <p className="text-[11px] font-medium text-slate-500 mt-2">
              Quét mã QR bằng Camera điện thoại hoặc Zalo
            </p>
          </div>

          {/* Copy Link Field */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="w-full bg-transparent text-xs text-slate-700 px-2 outline-hidden font-mono"
            />
            <button
              id="btn-copy-share-link"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              id="btn-download-qr"
              onClick={handleDownloadQR}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Tải ảnh QR</span>
            </button>

            <a
              href={`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Gửi qua Zalo</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
