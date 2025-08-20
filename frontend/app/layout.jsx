import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = { title: 'CloudyDrive', description: 'Personal cloud' }; // Next.js Metadata API

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
