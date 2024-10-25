'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollArea } from "@/components/ui/scroll-area";

const tabs = [
  { path: '/discover', label: 'Trending Collections' },
  { path: '/discover/new-releases', label: 'New Releases' },
  { path: '/discover/top-artists', label: 'Featured Artisans' },
];

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-navy">
      <div className="container mx-auto p-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-bold mb-8 text-cream text-center"
        >
          Digital Haberdashery
        </motion.h1>
        <nav className="mb-12">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex space-x-4 p-2 min-w-max">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`relative px-6 py-3 rounded-lg whitespace-nowrap font-serif transition-colors duration-300 ${
                    pathname === tab.path
                      ? 'text-navy bg-gradient-to-r from-yellow to-orange'
                      : 'text-cream hover:text-yellow'
                  }`}
                >
                  {tab.label}
                  {pathname === tab.path && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-yellow to-orange rounded-lg -z-10"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </nav>
        <div className="relative">
          {/* Grain texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
          {children}
        </div>
      </div>
    </div>
  );
}