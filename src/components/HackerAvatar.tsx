export default function HackerAvatar() {
  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center sm:h-44 sm:w-44">
      {/* Ambient crimson glow */}
      <div
        aria-hidden="true"
        className="absolute inset-2 rounded-full bg-red-600/25 blur-2xl animate-pulse-crimson"
      />

      {/* Rotating HUD radar ring */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-spin-slow"
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="#ef4444"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="10 8 3 8"
        />
        <circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="#dc2626"
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>

      {/* Main animated hooded hacker SVG */}
      <svg
        viewBox="0 0 200 200"
        className="relative h-32 w-32 drop-shadow-[0_0_24px_rgba(220,38,38,0.4)] animate-float-slow sm:h-40 sm:w-40"
        role="img"
        aria-label="Animated Red Team Hacker Avatar"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#1c0a0d" />
            <stop offset="100%" stopColor="#07070a" />
          </radialGradient>
          <linearGradient id="hoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f1f27" />
            <stop offset="55%" stopColor="#101016" />
            <stop offset="100%" stopColor="#060609" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <clipPath id="circleClip">
            <circle cx="100" cy="100" r="76" />
          </clipPath>
        </defs>

        {/* Circular dark backdrop */}
        <circle
          cx="100"
          cy="100"
          r="76"
          fill="url(#bgGlow)"
          stroke="#ef4444"
          strokeOpacity="0.45"
          strokeWidth="2"
        />

        <g clipPath="url(#circleClip)">
          {/* Subtle matrix binary background */}
          <text
            x="36"
            y="58"
            fill="#ef4444"
            fillOpacity="0.18"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
          >
            01001101
          </text>
          <text
            x="118"
            y="68"
            fill="#ef4444"
            fillOpacity="0.14"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
          >
            C4PTR4
          </text>
          <text
            x="32"
            y="124"
            fill="#ef4444"
            fillOpacity="0.15"
            fontFamily="JetBrains Mono, monospace"
            fontSize="9"
          >
            &gt;_ROOT
          </text>

          {/* Shoulders & hoodie torso */}
          <path
            d="M32 182 C36 142, 62 128, 100 128 C138 128, 164 142, 168 182 Z"
            fill="url(#hoodGrad)"
            stroke="#ef4444"
            strokeOpacity="0.32"
            strokeWidth="1.5"
          />

          {/* Hoodie hood */}
          <path
            d="M54 128 C48 92, 58 46, 100 42 C142 46, 152 92, 146 128 C132 136, 68 136, 54 128 Z"
            fill="url(#hoodGrad)"
            stroke="#ef4444"
            strokeOpacity="0.55"
            strokeWidth="1.75"
          />

          {/* Deep shadow inside hood */}
          <path
            d="M68 118 C65 92, 72 60, 100 58 C128 60, 135 92, 132 118 C120 126, 80 126, 68 118 Z"
            fill="#040406"
          />

          {/* Cyber visor frame */}
          <rect
            x="73"
            y="84"
            width="54"
            height="14"
            rx="7"
            fill="#18080a"
            stroke="#ef4444"
            strokeOpacity="0.85"
            strokeWidth="1.5"
          />

          {/* Glowing visor core */}
          <rect x="78" y="88" width="44" height="6" rx="3" fill="url(#visorGrad)" />

          {/* Sweeping scanner highlight */}
          <rect
            x="92"
            y="87"
            width="16"
            height="8"
            rx="4"
            fill="#fecaca"
            className="animate-visor-scan"
          />

          {/* Laptop silhouette & crimson screen glow */}
          <path
            d="M58 144 L142 144 L136 176 L64 176 Z"
            fill="#0b0b10"
            stroke="#ef4444"
            strokeOpacity="0.6"
            strokeWidth="1.5"
          />
          <path d="M91 156 L98 161 L91 166" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="102" y1="166" x2="112" y2="166" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Online red badge */}
        <circle cx="152" cy="152" r="8" fill="#050507" />
        <circle cx="152" cy="152" r="5" fill="#ef4444" className="animate-pulse" />
      </svg>
    </div>
  );
}
