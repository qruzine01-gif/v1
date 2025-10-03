import React from 'react';
import Head from 'next/head';
import { Inter, Playfair_Display, Poppins, Montserrat, Dancing_Script, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair-display' });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const dancingScript = Dancing_Script({ subsets: ['latin'], variable: '--font-dancing-script' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export function Layout({ children, title = 'Qruzine', description = 'Digital Ordering System - Fresh, Fast, Delicious' }) {
  return (
    <div className={`
      ${inter.variable} 
      ${playfairDisplay.variable} 
      ${poppins.variable}
      ${montserrat.variable}
      ${dancingScript.variable}
      ${jetbrainsMono.variable}
      font-sans antialiased min-h-screen flex flex-col
    `}>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* You can add a common footer here if needed */}
    </div>
  );
}

export default Layout;
