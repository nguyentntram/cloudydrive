export const fmtBytes = (b = 0) => {
  if (!b) return '0 B';
  const u = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(b)/Math.log(1024));
  return `${(b/1024**i).toFixed(i ? 1 : 0)} ${u[i]}`;
};

// export const fmtTime = (iso) =>
//   iso ? new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '';
export const fmtTime = (iso) => {
  if (!iso) return '';
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // ví dụ "America/Chicago"
  return new Date(iso).toLocaleString(undefined, {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const extFromName = (name='') => (name.split('.').pop() || '').toUpperCase();
