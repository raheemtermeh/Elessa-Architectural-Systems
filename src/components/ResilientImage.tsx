import { useState } from 'react';
import { Layers } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#F1F5F9] via-[#E5EEFF] to-[#FAFCFB] text-[#565E74] p-6 text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center justify-center text-[#006C49]">
          <Layers className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-[#334155]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
