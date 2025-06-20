



'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
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


const floatAnimation = {
  initial: { y: -20, rotate: -5 },
  animate: { 
    y: 0,
    rotate: 5,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Pirate() {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef(null);
  const progress = useMotionValue(0);
  const [currentSpotIndex, setCurrentSpotIndex] = useState(0);
  const position = useTransform(progress, (p) => {
    if (!pathRef.current) return { x: 0, y: 0 };
    const length = pathRef.current.getTotalLength();
    const point = pathRef.current.getPointAtLength(p * length);
    const translatedX = point.x + 140;
    const translatedY = point.y + 70;
    
    return { x: translatedX, y: translatedY };
  });


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
  
    animate(progress, groupedTreasureStops[nextIndex].progress, {
      duration: 3,
      ease: 'easeInOut',
      onComplete: () => {
        setCurrentSpotIndex(nextIndex);
  
        // ✅ Trigger confetti if final stop
        if (nextIndex === groupedTreasureStops.length - 1) {
          confetti({
            particleCount: 300,
            spread: 150,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFFACD', '#FFEC8B'],
            scalar : 1.2
          });
        }
      },
    });
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
      <h1 className="text-3xl font-bold mb-4 text-yellow-800">Pirate's Treasure Map</h1>
      <audio autoPlay loop className="hidden">
  <source src="/images/pirates_theme.mp3" type="audio/mpeg" />
  
</audio>


       <motion.div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute w-32 h-32 bg-red-500/10 blur-2xl top-1/4 left-1/4 animate-pulse" />
        <div className="absolute w-48 h-48 bg-yellow-500/10 blur-2xl top-1/2 right-1/4 animate-pulse delay-1000" />
      </motion.div>


      <div
        ref={containerRef}
        className="relative w-full h-[600px] rounded-xl shadow-lg bg-cover bg-center transform perspective-1000"
        style={{ backgroundImage: 'url("/images/map_image.jpg")' }}
      >
        <svg className="absolute w-full h-full" viewBox="0 0 800 600">
          <g transform="translate(220,130)">
            <motion.path
              ref={pathRef}
              id="pirate-path"
              className="path-glow"
              d="M251.5 316L190 307.5L152 288L123.5 299V328.5L110.5 358L54 369L9.5 328.5L1 288L9.5 240.5L43.5 206.5H84L118 201L152 196L190 206.5L234.5 170.5L229.5 125L208 100.5H169H118L84 79V61L98 39L110.5 17.5H133H152H176L197.5 27.5L216.5 39L229.5 55L251.5 79L263 100.5L280 107L316.5 100.5L334.5 79V55L339.5 27.5V9L356.5 1H371.5L383 9L400 27.5"
              // stroke="transparent"
              stroke="url(#path-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 4 }}
//             />
              fill="none"
              // strokeWidth="2"
            />

        
          </g>
        </svg>

        <motion.div
          className="absolute w-24 h-24 bg-contain bg-no-repeat clipped"
          style={{
            backgroundImage: 'url("/images/ship_image.png")',
            translateX: useTransform(position, ({ x }) => x - 32),
            translateY: useTransform(position, ({ y }) => y - 32),
             filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))'
          }}
          {...floatAnimation}
        />

        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="absolute z-50  p-4 rounded-xl shadow-lg w-[420px] "
              // initial={{ opacity: 0, y: 50 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: 50 }}
              // transition={{ duration: 0.6 }}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                left: `${position.get().x +220}px` ,
                top: `${position.get().y - 80}px`,
                transform: `translate(-50%, -100%)`,
                transformOrigin: position.get().y > containerCenterY ? 'center top' : 'center bottom'
              }}
            >
              <div className="flex flex-wrap gap-4 justify-center right-[84%] bottom-24">
              

{groupedTreasureStops[currentSpotIndex].images.map((img, idx) => {
  const tilt = (idx - (groupedTreasureStops[currentSpotIndex].images.length - 1) / 2) * 15;
  return (
    <motion.div
      key={idx}
      initial={{ scale: 0.8, rotate: -45 }}
      animate={{ scale: 1, rotate: (idx % 2) * 10 - 5 }}
      // transition={{ delay: idx * 0.1 }}
      transition={{ delay: idx * 0.2, type: 'spring' }}
      className="relative w-60 h-60 overflow-hidden rounded-lg shadow-md right-[84%] bottom-24 border-yellow-700 border-4"
    >
      <motion.div
        className="absolute w-full h-full top-0 left-0 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,215,0,0.6), transparent 30%)',
          zIndex: -1,
          width: '60%'
        }}
      />
      <motion.img
        src={img.image}
        alt="Treasure"
        className="w-full h-full object-cover"
      />
      {img.description && (
        <motion.div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-sm text-center rounded-b-lg"
                                variants={textReveal}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5 + idx * 0.1 }}
        >
          {/* {img.description} */}
                                 {img.description.split('').map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            {char}
                          </motion.span>
                        ))}
        </motion.div>
      )}
    </motion.div>
  );
})}


              </div>
            </motion.div>
          )}
        </AnimatePresence>
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



