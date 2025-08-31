import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
}

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const colors = ['#F8D7E3', '#E6A9C0', '#D68BA7'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const directionX = (Math.random() * 0.4) - 0.2;
        const directionY = (Math.random() * 0.4) - 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesRef.current.push({
          x,
          y,
          directionX,
          directionY,
          size,
          color
        });
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
    };

    const updateParticle = (particle: Particle) => {
      if (particle.x > canvas.width || particle.x < 0) {
        particle.directionX = -particle.directionX;
      }
      if (particle.y > canvas.height || particle.y < 0) {
        particle.directionY = -particle.directionY;
      }
      
      particle.x += particle.directionX;
      particle.y += particle.directionY;
      drawParticle(particle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(updateParticle);
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70"
      style={{ pointerEvents: 'none' }}
    />
  );
};