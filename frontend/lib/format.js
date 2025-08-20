export const fmtBytes = (b = 0) => {
  if (!b) return '0 B';
  const u = ['B','KB','MB','GB','TB'];
  const i = Math.floor(Math.log(b)/Math.log(1024));
  return `${(b/1024**i).toFixed(i ? 1 : 0)} ${u[i]}`;
};

export const fmtTime = (iso) =>
  iso ? new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit' }) : '';

export const extFromName = (name='') => (name.split('.').pop() || '').toUpperCase();
