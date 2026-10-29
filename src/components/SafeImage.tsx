import React, { useState } from 'react';
import { Flower } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Çiçek Tasarımı',
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center select-none ${containerClassName || className}`}
      >
        <Flower className="w-10 h-10 mb-2 text-stone-300 stroke-[1.5]" />
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
          {fallbackTitle || alt || 'Velvet Rose Çiçek'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center">
          <Flower className="w-6 h-6 text-stone-300 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};
