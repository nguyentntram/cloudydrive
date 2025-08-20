const tones = {
  green:  'bg-green-100 text-green-700',
  blue:   'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
};

export default function StatCard({ kind, size, badge, tone='green' }) {
  return (
    <div className="bg-surface rounded-2xl shadow-soft p-5">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full grid place-items-center font-semibold ${tones[tone]}`}>{badge}</div>
        <div className="text-slate-400 text-sm">Last update</div>
      </div>
      <div className="mt-6">
        <div className="text-slate-500">{kind}</div>
        <div className="text-xl font-semibold mt-2">{size}</div>
      </div>
    </div>
  );
}
