



'use client';

import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';


// Grouped treasure stops with multiple images per spot
const groupedTreasureStops = [
  { 
    id: 1, 
    progress: 0, 
    images: [
      { image: '/images/madamji.jpeg', description: 'Toh shuru kare safar rani victoria' }
    ] 
  },
  { 
    id: 2, 
    progress: 0.1, 
    images: [
      { image: '/images/motigolu.jpg', description: 'ohhh moti chudiiii' }
    ] 
  },
  { 
    id: 3, 
    progress: 0.35, 
    images: [
      { image: '/images/lifeboat.jpg', description: 'goyaa main ghumi ghumi' }
    ] 
  },
  { 
    id: 4, 
    progress: 0.55, 
    images: [
      { image: '/images/singaporefountain.jpg', description: 'singapore main ghumi ghumi' },
      { image: '/images/singaporemetero.jpg', description: 'superwoman banke metro main ghum ri thi heinn bey' }
    ] 
  },
  { 
    id: 5, 
    progress: 0.70, 
    images: [
      { image: '/images/fullfam.jpg', description: 'Family time!' }
    ] 
  },
  { 
    id: 6, 
    progress: 1.0, 
    images: [
      { image: '/images/treasure1.jpg', description: 'moriii maiyaaaa mothers day di badaaaiyannn' },
      { image: '/images/treasure2.jpg', description: 'moriii maiyaaaa mothers day di badaaaiyannn' }
    ] 
  }
];

export default function Pirate() {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerCenterY, setContainerCenterY] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerCenterY(rect.top + rect.height / 2);
    }
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }

    const timer = setTimeout(() => setShowInfo(true), 2000);
    return () => clearTimeout(timer);
  }, [currentSpotIndex]);

  // Update position based on progress
  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    const point = pathRef.current.getPointAtLength(progress * length);
    setPosition({
      x: point.x + 140,
      y: point.y + 70
    });
  }, [progress]);

  // const sailToNextSpot = () => {
  //   setShowInfo(false);
  //   const nextIndex = (currentSpotIndex + 1) % groupedTreasureStops.length;
  //   animate(progress, groupedTreasureStops[nextIndex].progress, {
  //     duration: 3,
  //     ease: 'easeInOut',
  //     onComplete: () => {
  //       setCurrentSpotIndex(nextIndex);
  //     },
  //   });
  // };

  const sailToNextSpot = () => {
    setShowInfo(false);
    const nextIndex = (currentSpotIndex + 1) % groupedTreasureStops.length;
    const targetProgress = groupedTreasureStops[nextIndex].progress;
    
    // Animate progress with vanilla JS
    const startProgress = progress;
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // Ease in-out function
      const easeInOut = t < 0.5 
        ? 2 * t * t 
        : -1 + (4 - 2 * t) * t;
      
      const newProgress = startProgress + (targetProgress - startProgress) * easeInOut;
      setProgress(newProgress);
      
      if (t < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        setCurrentSpotIndex(nextIndex);
        
        // Trigger confetti if final stop
        if (nextIndex === groupedTreasureStops.length - 1) {
          confetti({
            particleCount: 300,
            spread: 150,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFFACD', '#FFEC8B'],
            scalar: 1.2
          });
        }
      }
    };
    
    requestAnimationFrame(animateProgress);
  };
  

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') sailToNextSpot();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpotIndex]);

  return (
    <div className="flex flex-col items-center p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-yellow-800">Pirate&apos;s Treasure Map</h1>
      <audio autoPlay loop className="hidden">
        <source src="/images/pirates_theme.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none animate-fade-in">
        <div className="absolute w-32 h-32 bg-red-500/10 blur-2xl top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-48 h-48 bg-yellow-500/10 blur-2xl top-1/2 right-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>


      <div
        ref={containerRef}
        className="relative w-full h-[600px] rounded-xl shadow-lg bg-cover bg-center transform perspective-1000"
        style={{ backgroundImage: 'url("/images/map_image.jpg")' }}
      >
        <svg className="absolute w-full h-full" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(220,130)">
            <path
              ref={pathRef}
              id="pirate-path"
              className="path-glow animate-draw-path"
              d="M251.5 316L190 307.5L152 288L123.5 299V328.5L110.5 358L54 369L9.5 328.5L1 288L9.5 240.5L43.5 206.5H84L118 201L152 196L190 206.5L234.5 170.5L229.5 125L208 100.5H169H118L84 79V61L98 39L110.5 17.5H133H152H176L197.5 27.5L216.5 39L229.5 55L251.5 79L263 100.5L280 107L316.5 100.5L334.5 79V55L339.5 27.5V9L356.5 1H371.5L383 9L400 27.5"
              stroke="url(#path-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
              fill="none"
            />
          </g>
        </svg>

        <div
          className="absolute w-24 h-24 bg-contain bg-no-repeat animate-float"
          style={{
            backgroundImage: 'url("/images/ship_image.png")',
            left: `${position.x - 32}px`,
            top: `${position.y - 32}px`,
            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
            transition: 'left 3s ease-in-out, top 3s ease-in-out'
          }}
        />

        {showInfo && (
          <div
            className="absolute z-50 p-4 rounded-xl shadow-lg w-[420px] animate-scale-in"
            style={{
              left: `${position.x + 220}px`,
              top: `${position.y - 80}px`,
              transform: `translate(-50%, -100%)`,
              transformOrigin: position.y > containerCenterY ? 'center top' : 'center bottom'
            }}
          >
            <div className="flex flex-wrap gap-4 justify-center right-[84%] bottom-24">
              {groupedTreasureStops[currentSpotIndex].images.map((img, idx) => {
                const delay = idx * 200; // 200ms delay per image
                return (
                  <div
                    key={idx}
                    className="relative w-60 h-60 overflow-hidden rounded-lg shadow-md right-[84%] bottom-24 border-yellow-700 border-4 animate-slide-in"
                    style={{
                      animationDelay: `${delay}ms`,
                      transform: `rotate(${(idx % 2) * 10 - 5}deg)`
                    }}
                  >
                    <div
                      className="absolute w-full h-full top-0 left-0 rounded-lg animate-fade-in"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,215,0,0.6), transparent 30%)',
                        zIndex: -1,
                        width: '60%',
                        animationDelay: '200ms'
                      }}
                    />
                    <img
                      src={img.image}
                      alt="Treasure"
                      className="w-full h-full object-cover"
                    />
                    {img.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-sm text-center rounded-b-lg">
                        {img.description.split('').map((char, i) => (
                          <span
                            key={i}
                            className="inline-block animate-fade-in"
                            style={{ animationDelay: `${500 + i * 30}ms` }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={sailToNextSpot}
        className="mt-6 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Next Stop ⚓
      </button>
    </div>
  );
}



