import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

export function StudentCarousel({ fotos = [], studentName = 'Aluno', useThumbnail = true, onClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Ordenar fotos: principal primeiro ou pela ordem
  const sortedFotos = [...fotos].sort((a, b) => {
    if (a.principal && !b.principal) return -1;
    if (!a.principal && b.principal) return 1;
    return (a.ordem || 0) - (b.ordem || 0);
  });

  const totalFotos = sortedFotos.length;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalFotos - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < totalFotos - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swipe left -> Next
      handleNext(e);
    } else if (distance < -minSwipeDistance) {
      // Swipe right -> Prev
      handlePrev(e);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (totalFotos === 0) {
    return (
      <div
        onClick={onClick}
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          backgroundColor: 'var(--senai-blue-50)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--senai-blue-700)',
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative'
        }}
      >
        <User size={54} strokeWidth={1.5} opacity={0.6} />
        <span style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>Sem foto</span>
      </div>
    );
  }

  const currentFoto = sortedFotos[currentIndex] || sortedFotos[0];
  const imgSrc = useThumbnail ? (currentFoto.thumbnail || currentFoto.arquivo) : currentFoto.arquivo;

  return (
    <div
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '3 / 4',
        backgroundColor: '#f1f5f9',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <img
        src={imgSrc}
        alt={`Foto de ${studentName}`}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform var(--transition-normal)'
        }}
      />

      {/* Controles Desktop (Setas) */}
      {totalFotos > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: 'var(--senai-blue-900)',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              backdropFilter: 'blur(2px)'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima foto"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              color: 'var(--senai-blue-900)',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              backdropFilter: 'blur(2px)'
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicadores (Dots) */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 2,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {sortedFotos.map((_, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                style={{
                  width: idx === currentIndex ? '16px' : '6px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
