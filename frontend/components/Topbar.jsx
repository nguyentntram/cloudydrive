import UploadButton from './UploadButton';

export default function Topbar() {
  return (
    <div className="flex items-center gap-4">
      <input
        placeholder="Search"
        className="flex-1 rounded-full bg-white shadow-soft px-5 py-3 outline-none border border-gray-100"
      />
      <UploadButton />
    </div>
  );
}
