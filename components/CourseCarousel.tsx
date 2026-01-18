
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseCarouselProps {
  courses: Course[];
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ courses }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs para a funcionalidade de arrastar para rolar
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const didDragRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const tolerance = 5;
      setIsAtStart(scrollLeft < tolerance);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - tolerance);
      
      const items = Array.from(carouselRef.current.children).filter(child => (child as Element).classList.contains('carousel-item'));
      let bestVisibleIndex = 0;
      let minDistance = Infinity;

      items.forEach((item, index) => {
          const htmlItem = item as HTMLElement;
          const itemLeft = htmlItem.offsetLeft - scrollLeft;
          const itemCenter = itemLeft + htmlItem.clientWidth / 2;
          const viewportCenter = clientWidth / 2;
          const distance = Math.abs(itemCenter - viewportCenter);
          
          if (distance < minDistance) {
              minDistance = distance;
              bestVisibleIndex = index;
          }
      });
      setActiveIndex(bestVisibleIndex);
    }
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const timer = setTimeout(checkScrollPosition, 100);
      carousel.addEventListener('scroll', checkScrollPosition, { passive: true });
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        clearTimeout(timer);
        carousel.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [courses, checkScrollPosition]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = clientWidth * 0.8; 
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const scrollToItem = (index: number) => {
    const carousel = carouselRef.current;
    const items = Array.from(carousel?.children || []).filter(child => (child as Element).classList.contains('carousel-item'));
    const item = items[index] as HTMLElement;

    if (carousel && item) {
      const scrollPosition = item.offsetLeft - (carousel.clientWidth / 2) + (item.clientWidth / 2);
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  };

  // --- Handlers para Arrastar ---
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!carouselRef.current || e.button !== 0) return; // Apenas botão principal
    isDraggingRef.current = true;
    didDragRef.current = false; // Reseta o status de arrasto
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftStartRef.current = carouselRef.current.scrollLeft;
    carouselRef.current.style.cursor = 'grabbing';
    carouselRef.current.style.userSelect = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startXRef.current;
    
    // Se mover mais que um limiar, considera como arrasto
    if (Math.abs(walk) > 10) {
      didDragRef.current = true;
    }
    
    carouselRef.current.scrollLeft = scrollLeftStartRef.current - (walk * 2); // *2 para rolagem mais rápida
  };
  
  const handlePointerUp = () => {
    isDraggingRef.current = false;
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
      carouselRef.current.style.userSelect = 'auto';
    }
  };

  // Previne cliques em links/botões dentro dos cards após arrastar
  const handleClickCapture = (e: React.MouseEvent) => {
    if (didDragRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-600">Nenhum curso disponível no momento.</p>;
  }

  return (
    <div className="course-carousel-container">
      <button 
        onClick={() => scroll('left')}
        className="carousel-arrow left-arrow"
        aria-label="Cursos anteriores"
        disabled={isAtStart}
      >
        <ChevronLeft size={32} />
      </button>

      <div 
        className="course-carousel" 
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // Termina o arrasto se o mouse sair
        onClickCapture={handleClickCapture}
      >
        {courses.map(course => (
          <div key={course.id} className="carousel-item">
            <CourseCard course={course} displayMode="summary" />
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="carousel-arrow right-arrow"
        aria-label="Próximos cursos"
        disabled={isAtEnd}
      >
        <ChevronRight size={32} />
      </button>

      <div className="carousel-dots">
        {courses.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => scrollToItem(index)}
            aria-label={`Ir para o curso ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseCarousel;