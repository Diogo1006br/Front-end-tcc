import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ["latin"] });


const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className='bg-zinc-50'>
        <Sidebar />
        <div className="sm:ml-14">
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
