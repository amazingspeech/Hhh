interface MascotteProps {
  size?: number
  className?: string
  animated?: boolean
}

export default function Mascotte({ size = 60, className = '', animated = true }: MascotteProps) {
  return (
    <div className={`${animated ? 'animate-float' : ''} ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        {/* Glow */}
        <circle cx="50" cy="50" r="38" fill="#fbbf24" opacity="0.15" />
        {/* Star body */}
        <polygon
          points="50,8 61,38 93,38 68,57 78,88 50,70 22,88 32,57 7,38 39,38"
          fill="#fbbf24"
          stroke="#f59e0b"
          strokeWidth="1"
        />
        {/* Eyes */}
        <ellipse cx="40" cy="48" rx="5" ry="5.5" fill="#1e293b" />
        <ellipse cx="60" cy="48" rx="5" ry="5.5" fill="#1e293b" />
        {/* Eye shine */}
        <circle cx="42" cy="46" r="1.5" fill="white" />
        <circle cx="62" cy="46" r="1.5" fill="white" />
        {/* Smile */}
        <path d="M 38 60 Q 50 71 62 60" stroke="#92400e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Rosy cheeks */}
        <circle cx="32" cy="57" r="5" fill="#fca5a5" opacity="0.5" />
        <circle cx="68" cy="57" r="5" fill="#fca5a5" opacity="0.5" />
      </svg>
    </div>
  )
}
