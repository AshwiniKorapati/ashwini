
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Briefcase, User, Code, Send, Linkedin, Download, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  { name: 'About', href: '#about', icon: <User className="mr-2 h-4 w-4" /> },
  { name: 'Experience', href: '#experience', icon: <Briefcase className="mr-2 h-4 w-4" /> },
  { name: 'Projects', href: '#projects', icon: <Code className="mr-2 h-4 w-4" /> },
  { name: 'Skills', href: '#skills', icon: <Code className="mr-2 h-4 w-4" /> },
  { name: 'Contact', href: '#contact', icon: <Send className="mr-2 h-4 w-4" /> },
];

const resumePdfPath = "/resume/Ashwini_Korapati_Resume.pdf";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const ThemeToggleButton = () => {
    if (!mounted) return null;
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold text-primary">
          Ashwini M.
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggleButton />
        </nav>
        <div className="md:hidden flex items-center">
          <ThemeToggleButton />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="ml-2">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg py-4">
          <nav className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={toggleMobileMenu}
                className="flex items-center text-lg font-medium text-foreground hover:text-primary transition-colors"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <a
              href="https://www.linkedin.com/in/ashwini123"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </a>
             <a
              href={resumePdfPath}
              download="Ashwini_Korapati_Resume.pdf"
              className="flex items-center text-lg font-medium text-foreground hover:text-primary transition-colors"
            >
              <Download className="mr-2 h-4 w-4" />
              Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
