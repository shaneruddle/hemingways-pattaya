import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { FirebaseImage } from './FirebaseImage';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  /** Optional item details shown in large, readable type beneath the image. */
  title?: string;
  price?: string;
  description?: string;
  extra?: React.ReactNode;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src, alt, title, price, description, extra }) => {
  // Keyboard access: Escape closes the modal, matching the click-outside behavior.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const hasDetails = Boolean(title || price || description || extra);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative max-w-5xl w-full max-h-[90vh] rounded-[32px] shadow-2xl z-[10000] flex ${
              hasDetails ? 'flex-col bg-white overflow-y-auto' : 'items-center justify-center bg-black/20 overflow-hidden'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Enlarged image'}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all z-20 backdrop-blur-md"
              aria-label="Close modal"
            >
              <X size={28} />
            </button>
            <div className={`w-full flex items-center justify-center ${hasDetails ? 'bg-black shrink-0' : 'h-full'}`}>
              <FirebaseImage
                src={src}
                alt={alt}
                className={`${hasDetails ? 'max-h-[55vh]' : 'max-h-[90vh]'} w-full object-contain`}
                useSkeleton={true}
                width="800"
              />
            </div>
            {hasDetails && (
              <div className="p-6 sm:p-8 text-left">
                {(title || price) && (
                  <div className="flex items-baseline w-full gap-3 mb-3">
                    {title && (
                      <h2 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">{title}</h2>
                    )}
                    {price && (
                      <>
                        <div className="flex-1 border-b border-dotted border-gray-300 mb-1" />
                        <span className="text-3xl sm:text-4xl font-black text-gold whitespace-nowrap shrink-0">{price}</span>
                      </>
                    )}
                  </div>
                )}
                {description && (
                  <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">{description}</p>
                )}
                {extra && <div className="mt-2 text-xl sm:text-2xl">{extra}</div>}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
