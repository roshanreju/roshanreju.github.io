import { MouseEvent, ReactNode, useState } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = '' }: TiltCardProps) {
  const [style, setStyle] = useState({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
    glowX: 50,
    glowY: 50,
    hovering: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 7;
    const rotateX = (0.5 - y) * 7;
    setStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`,
      glowX: Math.round(x * 100),
      glowY: Math.round(y * 100),
      hovering: true,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      glowX: 50,
      glowY: 50,
      hovering: false,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: style.transform }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0a0a0e]/75 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-transform duration-200 ease-out hover:border-red-500/35 ${className}`}
    >
      {/* Subtle spatial cursor-tracking crimson light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: style.hovering ? 1 : 0,
          background: `radial-gradient(360px circle at ${style.glowX}% ${style.glowY}%, rgba(239,68,68,0.12), transparent 65%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
