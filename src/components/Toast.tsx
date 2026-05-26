import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export function Toast({ message, visible, onDismiss }: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        setTimeout(onDismiss, 300);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900 border border-green-400/30 shadow-2xl shadow-black/40 transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
      <span className="text-white text-sm font-medium whitespace-nowrap">{message}</span>
      <button
        onClick={() => { setShow(false); setTimeout(onDismiss, 300); }}
        className="text-white/30 hover:text-white transition-colors ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}
