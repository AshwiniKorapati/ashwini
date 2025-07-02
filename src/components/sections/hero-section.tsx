
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Download, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';

const resumePdfPath = "/resume/Ashwini_Korapati_Resume.pdf";

export default function HeroSection() {
  return (
    <section id="home" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Hi, I&apos;m <span className="text-primary">Ashwini M.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Software Engineer
          </p>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto md:mx-0">
            Motivated and detail-oriented Software Engineer with 2 years of experience in developing dynamic web applications. Passionate about building scalable, user-centric solutions and continuously learning new technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a href={resumePdfPath} download="Ashwini_Korapati_Resume.pdf">
              <Button size="lg" className="w-full sm:w-auto group">
                Download Resume <Download className="ml-2 h-5 w-5 group-hover:animate-bounce" />
              </Button>
            </a>
            <Link href="#contact" passHref>
              <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                Get in Touch <Send className="ml-2 h-5 w-5 group-hover:animate-ping" />
              </Button>
            </Link>
            <Link href="https://www.linkedin.com/in/ashwini123" target="_blank" rel="noopener noreferrer" passHref>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto group">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative group w-80 h-80 md:w-96 md:h-96 mt-8 md:mt-0 mx-auto"> {/* Increased size */}
          {/* Outer circle effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Image
            src="/resume/ashwini-img_1.png"
            alt="Ashwini M Profile Picture"
            width={384} // Adjusted to match new larger size (24rem = 384px)
            height={384} // Adjusted to match new larger size (24rem = 384px)
            className="rounded-full shadow-2xl relative z-10 object-cover object-top transition-transform duration-500 transform group-hover:scale-105"
            style={{ width: '100%', height: '100%' }} // Ensure image fills the container
            data-ai-hint="professional portrait"
            priority
          />
        </div>
      </div>
    </section>
  );
}
