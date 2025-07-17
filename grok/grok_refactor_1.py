import os
import subprocess
import sys

# This script applies all refactoring suggestions to the Next.js website.
# Run this in the root of the cloned repo (where 'website' folder is).
# It will:
# - Install Tailwind CSS dependencies (requires npm).
# - Create/update files in website/src/app, utils, components, etc.
# - Backup existing files before overwriting.

def main():
    # Change to website directory
    website_dir = os.path.join(os.getcwd(), 'website')
    if not os.path.exists(website_dir):
        print("Error: 'website' directory not found. Run this in the repo root.")
        sys.exit(1)
    os.chdir(website_dir)

    # Step 1: Install Tailwind CSS and dependencies
    print("Installing Tailwind CSS dependencies...")
    subprocess.run(['npm', 'install', '-D', 'tailwindcss', 'postcss', 'autoprefixer'], check=True)
    subprocess.run(['npx', 'tailwindcss', 'init', '-p'], check=True)

    # Step 2: Create directories if needed
    src_dir = os.path.join('src')
    app_dir = os.path.join(src_dir, 'app')
    utils_dir = os.path.join(src_dir, 'utils')
    components_dir = os.path.join(src_dir, 'components')
    os.makedirs(utils_dir, exist_ok=True)
    os.makedirs(components_dir, exist_ok=True)

    # Helper to write file with backup
    def write_file(path, content):
        full_path = os.path.join(website_dir, path)
        if os.path.exists(full_path):
            backup_path = full_path + '.bak'
            os.rename(full_path, backup_path)
            print(f"Backed up {path} to {backup_path}")
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Wrote {path}")

    # tailwind.config.js
    tailwind_config = """\
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        vintage: {
          dark: '#1f2937',
          gold: '#d97706',
          sepia: '#713f12',
        },
      },
    },
  },
  plugins: [],
};
"""
    write_file('tailwind.config.js', tailwind_config)

    # src/app/globals.css
    globals_css = """\
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-vintage-dark text-white font-inter;
  }
  h1, h2, h3 {
    @apply font-playfair;
  }
}
"""
    write_file(os.path.join(app_dir, 'globals.css'), globals_css)

    # src/app/layout.tsx
    layout_tsx = """\
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Ernest K. Gann 1933 Logbook',
  description: 'Digital archive of Ernest K. Gann\\'s 1933 world tour logbook',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} \${playfair.variable} bg-vintage-dark min-h-screen antialiased\`}>
        <header className="sticky top-0 bg-vintage-dark/80 backdrop-blur-md py-4 px-6 flex justify-between items-center shadow-md z-50">
          <Link href="/" className="text-2xl font-bold text-vintage-gold font-playfair">Ernest K. Gann 1933</Link>
          <nav className="space-x-6 text-white">
            <Link href="/about" className="hover:text-vintage-gold transition-colors">About</Link>
            <Link href="/logbook" className="hover:text-vintage-gold transition-colors">Logbook</Link>
            <Link href="/logbook/timeline" className="hover:text-vintage-gold transition-colors">Timeline</Link>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          {children}
        </main>
        <footer className="bg-vintage-dark py-4 text-center text-sm text-gray-400 mt-auto">
          © 2024 Ernest K. Gann Archive | Digitized with AI
        </footer>
      </body>
    </html>
  );
}
"""
    write_file(os.path.join(app_dir, 'layout.tsx'), layout_tsx)

    # src/utils/formatters.ts
    formatters_ts = """\
export const cleanupOCRText = (text: string): string => {
  const nonsensicalPatterns = [
    /^GD JO AMBAT[^.]*?\\.\\s*/,
    /^[A-Z]{2,}\\s+[A-Z]{2,}\\s+[A-Z]{2,}[^.]*?\\.\\s*/,
    /^[a-zA-Z0-9\\s]{0,10}[^a-zA-Z\\s][^.]*?\\.\\s*/,
    /^[0-9]+\\s+[A-Z]{2,}\\s+[A-Z]{2,}[^.]*?\\.\\s*/,
    /^[^\\w\\s]+[^.]*?\\.\\s*/
  ];
  let cleanedText = text;
  for (const pattern of nonsensicalPatterns) {
    if (pattern.test(cleanedText)) {
      cleanedText = cleanedText.replace(pattern, '...\\n\\n');
      break;
    }
  }
  cleanedText = cleanedText.replace(/[^\\w\\s.,!?;:'"()\\-–—]+/g, '');
  return cleanedText;
};

export const formatContentForReading = (content: string): string[] => {
  const cleanedContent = cleanupOCRText(content);
  const paragraphs = cleanedContent.split('\\n').filter(p => p.trim().length > 0);
  const formattedParagraphs: string[] = [];
  paragraphs.forEach(paragraph => {
    if (paragraph.length > 500) {
      const sentences = paragraph.split(/(?<=[.!?])\\s+(?=[A-Z])/);
      let currentParagraph = '';
      sentences.forEach(sentence => {
        if (currentParagraph.length + sentence.length > 400 && currentParagraph.length > 0) {
          formattedParagraphs.push(currentParagraph.trim());
          currentParagraph = sentence;
        } else {
          currentParagraph += (currentParagraph ? ' ' : '') + sentence;
        }
      });
      if (currentParagraph.trim()) {
        formattedParagraphs.push(currentParagraph.trim());
      }
    } else {
      formattedParagraphs.push(paragraph);
    }
  });
  return formattedParagraphs;
};

export const formatTextWithIndentation = (text: string): string => {
  const cleanedText = cleanupOCRText(text);
  const paragraphs = cleanedText.split(/\\n\\s*\\n/);
  return paragraphs
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .join('\\n\\n');
};
"""
    write_file(os.path.join(utils_dir, 'formatters.ts'), formatters_ts)

    # src/components/EntryCard.tsx
    entry_card_tsx = """\
import { formatContentForReading } from '@/utils/formatters';

interface EntryCardProps {
  entry: LogbookEntry; // Use your LogbookEntry interface
}

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold mb-2 text-vintage-gold">{entry.date_entry || 'Undated'} - {entry.location || 'Unknown'}</h3>
      {formatContentForReading(entry.content).map((para, i) => (
        <p key={i} className="mb-4 text-gray-300">{para}</p>
      ))}
      <p className="text-sm text-gray-500 mt-4">Confidence: {(entry.confidence_score * 100).toFixed(1)}%</p>
    </div>
  );
}
"""
    write_file(os.path.join(components_dir, 'EntryCard.tsx'), entry_card_tsx)

    # src/app/page.tsx
    home_tsx = """\
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-20 bg-gradient-to-b from-gray-800 to-vintage-dark rounded-lg shadow-xl">
        <h1 className="text-5xl font-bold mb-4 text-vintage-gold font-playfair">ERNEST K. GANN 1933 World Tour</h1>
        <p className="text-xl max-w-2xl mx-auto mb-8 text-gray-300">A young man's journey around the world to review telephone companies in Europe and Asia, setting the stage for one of aviation's greatest storytellers.</p>
        <div className="space-x-4">
          <Link href="/logbook/timeline" className="bg-vintage-gold text-vintage-dark px-6 py-3 rounded-md font-bold hover:bg-amber-500 transition">Explore the Journey</Link>
          <Link href="/about" className="border border-vintage-gold px-6 py-3 rounded-md text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark transition">About Ernest</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-vintage-gold">The Journey Begins - 1933</h2>
          <h3 className="text-xl mb-2">The Assignment</h3>
          <p className="text-gray-300">George Kellogg Gann sends his son on a world tour...</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-vintage-gold">The Traveler</h2>
          <h3 className="text-xl mb-2">Young Ernest</h3>
          <p className="text-gray-300">At 23, Ernest K. Gann was a Yale dropout...</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-vintage-gold">The Legacy</h2>
          <h3 className="text-xl mb-2">Aviation Pioneer</h3>
          <p className="text-gray-300">This journey would later inspire...</p>
        </div>
      </section>

      <section className="text-center py-12 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Discover the Logbook</h2>
        <p className="text-gray-300 mb-6">Explore the carefully preserved pages...</p>
        <div className="space-x-4">
          <Link href="/logbook" className="bg-vintage-gold text-vintage-dark px-6 py-3 rounded-md font-bold hover:bg-amber-500 transition">View the Logbook 📖</Link>
          <Link href="/logbook/timeline" className="border border-vintage-gold px-6 py-3 rounded-md text-vintage-gold hover:bg-vintage-gold hover:text-vintage-dark transition">Timeline View 🗓️</Link>
        </div>
      </section>
    </div>
  );
}
"""
    write_file(os.path.join(app_dir, 'page.tsx'), home_tsx)

    # src/app/about/page.tsx
    about_tsx = """\
'use client';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <Link href="/" className="text-vintage-gold hover:underline block mb-4">Back to Home</Link>
      <h1 className="text-4xl font-bold text-center mb-8 text-vintage-gold font-playfair">About Ernest K. Gann</h1>
      <p className="text-center text-gray-300 mb-8">From telephone company reviewer to aviation pioneer and bestselling author - the remarkable life of Ernest Kellogg Gann.</p>

      <section className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Early Life (1910-1933)</h2>
        <h3 className="text-2xl font-semibold mb-2 text-gray-200">Birth and Family</h3>
        <p className="mb-4 text-gray-300">Ernest Kellogg Gann was born on October 13, 1910, in Lincoln, Nebraska...</p>
        <h3 className="text-2xl font-semibold mb-2 text-gray-200">Education and Early Career</h3>
        <p className="mb-4 text-gray-300">After struggling in school...</p>
      </section>

      <section className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">The 1933 World Tour</h2>
        <p className="mb-4 text-gray-300">In 1933, at age 23, Gann embarked on a world tour...</p>
        <Link href="/logbook/timeline" className="text-vintage-gold hover:underline">Explore the Journey →</Link>
      </section>

      <section className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Aviation Career</h2>
        <p className="mb-4 text-gray-300">Gann's true passion emerged in aviation...</p>
      </section>

      <section className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Published Works</h2>
        <p className="mb-4 text-gray-300">Gann authored 24 books...</p>
      </section>

      <section className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Later Life and Legacy</h2>
        <p className="mb-4 text-gray-300">Gann passed away on December 19, 1991...</p>
      </section>

      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-vintage-gold">24 Books Published</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-vintage-gold">8 Film Adaptations</div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-vintage-gold">81 Years of Life</div>
      </div>

      <section className="text-center py-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-vintage-gold">Explore the 1933 Logbook</h2>
        <p className="text-gray-300">Discover the actual pages from Ernest's world tour logbook...</p>
        <Link href="/logbook" className="mt-4 inline-block bg-vintage-gold text-vintage-dark px-6 py-3 rounded-md font-bold hover:bg-amber-500 transition">View Logbook</Link>
      </section>
    </div>
  );
}
"""
    write_file(os.path.join(app_dir, 'about', 'page.tsx'), about_tsx)

    # Note: For logbook/page.tsx and logbook/timeline/page.tsx, since full code was partial, this script doesn't overwrite them.
    # Manually update as per instructions: Add classes, use EntryCard, etc.
    # If you provide full code, I can add them here.

    print("Refactoring applied! Run 'npm run dev' in website/ to test.")
    print("For logbook and timeline pages, manually integrate EntryCard and classes as per previous feedback.")

if __name__ == "__main__":
    main()