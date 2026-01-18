import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

const HeroCarousel: React.FC = () => {
  const { settings, loading } = useSettings();
  const { heroSlides } = settings;
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Auto-play settings
  const SLIDE_DURATION = 7000;

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, heroSlides]);

  const handleNext = () => {
    if (!heroSlides || heroSlides.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const handlePrev = () => {
    if (!heroSlides || heroSlides.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };

  if (loading && (!heroSlides || heroSlides.length === 0)) {
    return (
      <section className="relative w-full overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: 'calc(100vh - 72px)', minHeight: '500px' }}>
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full md:w-2/3 lg:w-1/2 space-y-6">
            <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-16 w-full bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-16 w-3/4 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded-2xl animate-pulse" />
            <div className="pt-6">
              <div className="h-14 w-48 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-50/50 animate-pulse" />
      </section>
    );
  }

  if (!heroSlides || heroSlides.length === 0) {
    return (
      <section id="inicio" className="relative w-full overflow-hidden bg-gray-100 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Nenhum banner configurado ou carregando...</p>
      </section>
    );
  }

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-white group" style={{ height: 'calc(100vh - 72px)', minHeight: '500px' }}>
      {/* Slider Content */}
      <div
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative bg-gray-50"
          >
            {slide.linkUrl ? (
              slide.linkUrl.startsWith('http') ? (
                <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative text-decoration-none">
                  <SlideContent slide={slide} index={index} onImageLoad={() => handleImageLoad(slide.id)} isLoaded={!!imagesLoaded[slide.id]} />
                </a>
              ) : (
                <Link to={slide.linkUrl} className="block w-full h-full relative text-decoration-none">
                  <SlideContent slide={slide} index={index} onImageLoad={() => handleImageLoad(slide.id)} isLoaded={!!imagesLoaded[slide.id]} />
                </Link>
              )
            ) : (
              <SlideContent slide={slide} index={index} onImageLoad={() => handleImageLoad(slide.id)} isLoaded={!!imagesLoaded[slide.id]} />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {heroSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300 backdrop-blur-sm"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 text-white bg-black/20 hover:bg-black/50 p-3 rounded-full transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300 backdrop-blur-sm"
            aria-label="Próximo slide"
          >
            <ChevronRight size={32} />
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
            {heroSlides.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === slideIndex
                  ? 'bg-white w-8 shadow-lg'
                  : 'bg-white/40 w-2 hover:bg-white/60'
                  }`}
                aria-label={`Ir para o slide ${slideIndex + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

// Helper component to handle slide content (Image or HTML)
const SlideContent: React.FC<{ slide: any, index: number, onImageLoad: () => void, isLoaded: boolean }> = ({ slide, index, onImageLoad, isLoaded }) => {
  // HTML / Rich Banner Mode (Cinematic Full Width Revert)
  if (slide.type === 'html') {
    return (
      <div
        className="w-full h-full relative overflow-hidden group"
      >
        {/* Full Width Background Image */}
        {slide.overlayImageUrl && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 transition-transform duration-[20s] ease-linear group-hover:scale-110">
              <img
                src={slide.overlayImageUrl}
                alt={slide.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                style={{ objectPosition: `center ${slide.desktopAlignmentPercent ?? 50}%` }}
                onLoad={onImageLoad}
              />
              {/* Cinematic Overlay: Vibrant Deep Blue/Purple (Young FTD Style) */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a]/90 via-[#3b82f6]/40 to-transparent mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2e1065]/60 to-transparent opacity-60" />

              {/* Graphic Overlays (Young/Vibrant Style) */}
              <div className="absolute top-[-20%] right-[-10%] w-[80vh] h-[80vh] border-[60px] border-yellow-400/30 rounded-full blur-[4px] animate-pulse [animation-duration:8s]" />
              <div className="absolute bottom-[-10%] left-[40%] w-[400px] h-[400px] bg-cyan-400/20 rounded-full blur-3xl mix-blend-screen" />
            </div>
          </div>
        )}

        {/* Content Container (Floating over image) - Always visible but animated */}
        <div className="container mx-auto h-full flex flex-col justify-center items-start relative z-10 px-6 py-10 md:py-0">
          <div className={`w-full md:w-2/3 lg:w-1/2 text-left space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {slide.subtitle && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wide uppercase mb-2 border border-white/20 backdrop-blur-md text-white bg-white/10 shadow-lg"
              >
                {slide.subtitle}
              </span>
            )}

            {slide.title && (
              <h2
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg"
              >
                {slide.title}
              </h2>
            )}
            {slide.description && (
              <p
                className="text-lg md:text-xl font-medium max-w-lg leading-relaxed text-gray-100 drop-shadow-md"
              >
                {slide.description}
              </p>
            )}
            {slide.ctaText && (
              <div className="pt-6">
                <span
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transform hover:-translate-y-1 transition-all duration-300 group-btn bg-[#FACC15] text-black"
                >
                  {slide.ctaText}
                  <ArrowRight size={20} strokeWidth={3} className="text-black group-btn-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Classic Image Mode
  const getObjectPosition = (slide: any) => {
    if (slide.desktopAlignmentPercent !== undefined) {
      return `center ${slide.desktopAlignmentPercent}%`;
    }
    const mapping: { [key: string]: string } = {
      top: 'top',
      center: 'center',
      bottom: 'bottom'
    };
    return mapping[slide.desktopAlignment || 'center'];
  };

  return (
    <div className={`w-full h-full relative transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {slide.mobileImageUrl && (
        <img
          src={slide.mobileImageUrl}
          alt={`Banner ${index + 1}`}
          className="w-full h-full object-cover md:hidden"
          onLoad={index === 0 ? onImageLoad : undefined}
        />
      )}
      <img
        src={slide.imageUrl}
        alt={`Banner ${index + 1}`}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${slide.mobileImageUrl ? 'hidden md:block' : ''}`}
        style={{ objectPosition: getObjectPosition(slide) }}
        onLoad={onImageLoad}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 pointer-events-none" />
    </div>
  );
};

export default HeroCarousel;
