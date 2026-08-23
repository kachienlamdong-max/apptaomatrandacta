import React, { useState } from 'react';
import { X, Star, Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TeacherProfile } from '../../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherProfile | null;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, teacher }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [featureRequests, setFeatureRequests] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherName: teacher?.fullName || 'Thầy/Cô giáo',
          school: teacher?.school || 'Trường học',
          province: teacher?.province || 'Việt Nam',
          rating,
          comment,
          featureRequests
        })
      });

      // Launch joyful confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        setFeatureRequests('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Đánh Giá & Góp Ý Nâng Cấp</h3>
              <p className="text-xs text-amber-100">Ý kiến của Thầy/Cô giúp hoàn thiện phần mềm tốt hơn</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Star rating */}
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-slate-700">Mức độ hài lòng của Thầy/Cô:</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-600 font-medium">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Rất hài lòng - Tuyệt vời!' :
               rating === 4 ? '⭐⭐⭐⭐ Hài lòng' :
               rating === 3 ? '⭐⭐⭐ Bình thường' :
               rating === 2 ? '⭐⭐ Cần cải thiện' : '⭐ Chưa hài lòng'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cảm nhận & đánh giá của Thầy/Cô:
            </label>
            <textarea
              id="input-feedback-comment"
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ví dụ: Ma trận rất chuẩn phom Bộ GD&ĐT, xuất Word rất tiện lợi và không bị lỗi công thức Toán..."
              className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tính năng hoặc môn học Thầy/Cô mong muốn bổ sung thêm:
            </label>
            <input
              id="input-feedback-features"
              type="text"
              value={featureRequests}
              onChange={(e) => setFeatureRequests(e.target.value)}
              placeholder="Ví dụ: Bổ sung thêm ngân hàng câu hỏi môn Hóa học 11, xuất thêm bảng soi nhanh..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
            >
              Để sau
            </button>

            <button
              id="btn-submit-feedback"
              type="submit"
              disabled={loading || submitted}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg shadow-sm transition-all"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cảm ơn Thầy/Cô đã góp ý!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
