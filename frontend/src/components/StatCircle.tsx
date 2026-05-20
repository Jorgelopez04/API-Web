type StatCircleProps = {
  value: number;
  total: number;
  label: string;
  color: string;
  description: string;
};

const radius = 38;
const stroke = 10;
const normalizedRadius = radius - stroke * 0.5;
const circumference = normalizedRadius * 2 * Math.PI;

export default function StatCircle({ value, total, label, color, description }: StatCircleProps) {
  const ratio = total > 0 ? Math.min(1, value / total) : 0;
  const strokeDashoffset = circumference - ratio * circumference;
  const percentage = total > 0 ? Math.round(ratio * 100) : 0;

  return (
    <div className="stat-card-inner">
      <div className="stat-chart-wrap">
        <svg height={radius * 2} width={radius * 2} className="stat-chart">
          <circle
            stroke="rgba(255,255,255,0.12)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          <text x="50%" y="50%" textAnchor="middle" dy="0.2em" className="stat-chart-text">
            {percentage}%
          </text>
        </svg>
      </div>
      <div className="stat-card-content">
        <span className="stat-card-label">{label}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </div>
  );
}
