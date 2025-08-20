export default function StorageGauge({ percent = 65 }) {
  const size = 140, stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#FFE5E6" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke="#FA7275" strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        <text x="50%" y="48%" textAnchor="middle" fontSize="20" fontWeight="700" fill="#111827">{percent}%</text>
        <text x="50%" y="62%" textAnchor="middle" fontSize="12" fill="#6B7280">Space used</text>
      </svg>
    </div>
  );
}
