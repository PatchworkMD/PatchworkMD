import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './portfolio.css';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
export const metadata: Metadata = { title: 'patchwork.md | Independent software', description: 'Orbit, OpenNGP, 2D0, Dreamer, and LocalModelMatch. Native apps, campaign software, and tools for working with AI.', icons: { icon: '/icon.svg' }, openGraph: { title: 'PatchworkMD', description: 'Native apps, campaign software, and tools for working with AI.', type: 'website' }, twitter: { card: 'summary', creator: '@patchworkmd' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>; }
