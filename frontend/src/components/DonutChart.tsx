import { CSSProperties } from 'react';

type Segment = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  segments: Segment[];
  size?: number;
  ringWidth?: number;
  centerText?: string;
  centerLabel?: string;
};

export default function DonutChart({ segments, size = 110, ringWidth = 14, centerText, centerLabel }: Props) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - ringWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="donut-chart" style={{ width: size, height: size } as CSSProperties}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={ringWidth}
          fill="transparent"
        />
        {segments.map((segment) => {
          const segmentLength = total > 0 ? (segment.value / total) * circumference : 0;
          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const dashOffset = offset;
          offset -= segmentLength;
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={ringWidth}
              fill="transparent"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="donut-chart-center">
        {centerText && <span>{centerText}</span>}
        {centerLabel && <small>{centerLabel}</small>}
      </div>
    </div>
  );
}
