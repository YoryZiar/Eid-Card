import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Moon, Star, Volume2, VolumeX } from 'lucide-react';

const MosqueIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 10 C50 10, 35 30, 35 45 L35 90 L65 90 L65 45 C65 30, 50 10, 50 10 Z M20 40 C20 40, 10 55, 10 65 L10 90 L30 90 L30 65 C30 55, 20 40, 20 40 Z M80 40 C80 40, 70 55, 70 65 L70 90 L90 90 L90 65 C90 55, 80 40, 80 40 Z" />
    <circle cx="50" cy="5" r="3" />
    <circle cx="20" cy="35" r="2" />
    <circle cx="80" cy="35" r="2" />
  </svg>
);

const LanternIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M40 20 L60 20 L65 40 L35 40 Z M30 45 L70 45 L65 80 L35 80 Z M45 10 L55 10 L55 20 L45 20 Z M35 85 L65 85 L65 90 L35 90 Z" />
  </svg>
);

const KetupatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="4">
    <polygon points="50,10 90,50 50,90 10,50" fill="currentColor" fillOpacity="0.2" />
    <line x1="30" y1="30" x2="70" y2="70" />
    <line x1="70" y1="30" x2="30" y2="70" />
    <line x1="50" y1="10" x2="50" y2="90" />
    <line x1="10" y1="50" x2="90" y2="50" />
  </svg>
);

const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; className?: string; number?: number }>((props, ref) => {
  return (
    <div className={`page shadow-2xl overflow-hidden relative ${props.className || ''}`} ref={ref}>
      <div className="page-content w-full h-full flex flex-col relative z-10">
        {props.children}
      </div>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      {/* Page border/edge effect */}
      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
});

export default function EidCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bookRef = useRef<any>(null);
  const playPromiseRef = useRef<Promise<void> | undefined>(undefined);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        playPromiseRef.current = audioRef.current.play();
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Silently ignore autoplay restrictions
          });
        }
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        setIsPlaying(false);
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.then(() => {
            audioRef.current?.pause();
          }).catch(() => {
            audioRef.current?.pause();
          });
        } else {
          audioRef.current.pause();
        }
      } else {
        playPromiseRef.current = audioRef.current.play();
        if (playPromiseRef.current !== undefined) {
          playPromiseRef.current.then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src="https://archive.org/download/GemaTakbirIdulFitriMerdu/Gema%20Takbir%20Opick.mp3" type="audio/mpeg" />
      </audio>

      {/* Audio Control */}
      <button 
        onClick={toggleAudio}
        className="fixed top-4 right-4 z-50 p-3 bg-emerald-800/80 text-amber-400 rounded-full backdrop-blur-sm hover:bg-emerald-700 transition-colors shadow-lg"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* Book Container */}
      <div className="w-full max-w-4xl h-[80vh] max-h-[600px] flex justify-center perspective-1000">
        {/* @ts-ignore - react-pageflip types might be missing or incompatible */}
        <HTMLFlipBook 
          width={320} 
          height={480} 
          size="stretch" 
          minWidth={280} 
          maxWidth={400} 
          minHeight={400} 
          maxHeight={600} 
          maxShadowOpacity={0.5} 
          showCover={true} 
          mobileScrollSupport={true}
          className="eid-book"
          ref={bookRef}
          onFlip={(e: any) => setCurrentPage(e.data)}
        >
          {/* Page 1: Front Cover */}
          <Page className="bg-gradient-to-br from-emerald-800 to-emerald-950 border-r border-emerald-700 text-emerald-50">
            <div className="absolute top-10 right-10 text-amber-400 opacity-80 animate-[float_4s_ease-in-out_infinite]">
              <Moon size={64} strokeWidth={1.5} fill="currentColor" />
            </div>
            <div className="absolute top-16 right-24 text-amber-400 opacity-60 animate-[twinkle_3s_ease-in-out_infinite]">
              <Star size={24} fill="currentColor" />
            </div>
            
            <MosqueIcon className="w-48 h-48 text-emerald-600 opacity-50 absolute bottom-0 left-1/2 -translate-x-1/2 animate-[float_6s_ease-in-out_infinite]" />
            
            <div className="relative z-10 text-center mt-24 px-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-4 drop-shadow-lg leading-tight">
                Selamat Hari Raya<br/>Idul Fitri
              </h1>
              <div className="w-24 h-1 bg-amber-400 mx-auto mb-4 rounded-full opacity-80"></div>
              <h2 className="text-xl sm:text-2xl text-emerald-100 font-medium tracking-widest">
                1447 H
              </h2>
            </div>

            <div className="absolute bottom-10 w-full text-center animate-bounce">
              <p className="text-sm text-amber-200/70 bg-emerald-900/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-emerald-700/50">
                Klik atau geser untuk membuka
              </p>
            </div>
          </Page>

          {/* Page 2: Inside Left */}
          <Page className="bg-emerald-50 text-emerald-900 border-r border-emerald-200">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
            
            <div className="flex flex-col items-center justify-between h-full py-12 px-6 relative z-10">
              <div className="flex justify-center gap-8 w-full">
                <div className="animate-[swing_3s_ease-in-out_infinite] origin-top">
                  <div className="w-1 h-8 bg-amber-600 mx-auto"></div>
                  <LanternIcon className="w-16 h-24 text-amber-500" />
                </div>
                <div className="animate-[swing_4s_ease-in-out_infinite_reverse] origin-top mt-8">
                  <div className="w-1 h-12 bg-amber-600 mx-auto"></div>
                  <LanternIcon className="w-12 h-20 text-amber-500" />
                </div>
              </div>

              <div className="text-center px-2 mt-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-6 leading-relaxed font-serif">
                  تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ
                </h3>
                <p className="text-lg sm:text-xl text-emerald-700 font-medium">
                  Taqabbalallahu minna wa minkum
                </p>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-6"></div>
              </div>

              <div className="flex justify-center gap-8 w-full opacity-80 mt-auto">
                <KetupatIcon className="w-12 h-12 text-emerald-600 animate-[breathe_4s_ease-in-out_infinite]" />
                <KetupatIcon className="w-12 h-12 text-emerald-600 animate-[breathe_4s_ease-in-out_infinite_1s]" />
              </div>
            </div>
          </Page>

          {/* Page 3: Inside Right */}
          <Page className="bg-emerald-50 text-emerald-900 border-l border-emerald-200">
             <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
             
             <div className="flex flex-col items-center justify-center h-full py-10 px-6 relative z-10">
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-emerald-100 relative w-full">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star size={16} className="text-emerald-900" fill="currentColor" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Star size={16} className="text-emerald-900" fill="currentColor" />
                  </div>
                  
                  <p className="text-base sm:text-lg text-emerald-800 leading-relaxed text-center mb-6 font-medium">
                    "Semoga amal ibadah kita diterima dan diberikan kesempatan untuk bertemu kembali dengan bulan suci ramadhan tahun depan.
                    <br/><br/>
                    Selamat Hari Raya Idul Fitri. Mohon maaf lahir dan batin atas segala khilaf dan salah."
                  </p>

                  <div className="mt-8 pt-4 border-t border-emerald-200 text-center">
                    <p className="text-sm text-emerald-600 mb-1">Dari:</p>
                    <p className="text-xl font-bold text-emerald-800 font-serif">Yory Ziar</p>
                  </div>
                </div>
             </div>
          </Page>

          {/* Page 4: Back Cover */}
          <Page className="bg-gradient-to-bl from-emerald-900 to-emerald-950 border-l border-emerald-700 text-emerald-50">
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <MosqueIcon className="w-32 h-32 text-amber-400 mb-8 animate-[float_5s_ease-in-out_infinite]" />
              <div className="flex gap-2">
                <Star size={16} className="text-amber-400 animate-[twinkle_3s_ease-in-out_infinite]" fill="currentColor" />
                <Star size={16} className="text-amber-400 animate-[twinkle_3s_ease-in-out_infinite_1s]" fill="currentColor" />
                <Star size={16} className="text-amber-400 animate-[twinkle_3s_ease-in-out_infinite_2s]" fill="currentColor" />
              </div>
              <p className="mt-8 text-emerald-200 text-sm tracking-widest uppercase">Idul Fitri 1447 H</p>
            </div>
          </Page>
        </HTMLFlipBook>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-emerald-500/60 text-sm font-medium tracking-widest z-40 pointer-events-none transition-opacity duration-300">
        Halaman {currentPage + 1} dari 4
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes swing {
          0% { transform: rotate(5deg); }
          50% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .stf__wrapper {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
