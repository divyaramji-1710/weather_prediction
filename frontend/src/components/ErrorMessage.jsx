import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-500/30 text-rose-200 px-5 py-4 rounded-2xl
                    text-sm max-w-md w-full shadow-lg backdrop-blur-md animate-shake">
      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
      <span className="font-semibold">{message}</span>
    </div>
  );
}

