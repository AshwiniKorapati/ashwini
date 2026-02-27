'use client';

import * as React from 'react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Linkedin, Send, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { sendEmailAction, type SendEmailInput, type SendEmailResult } from '@/app/actions/send-email';

const resumePdfPath = "/resume/Ashwini_Korapati_Resume.pdf";

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SendEmailInput>({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result: SendEmailResult = await sendEmailAction(formData);

      if (result && result.success) {
        setFormData({ name: '', email: '', message: '' }); // Reset form
        toast({
          title: "Message Sent!",
          description: result.message,
          variant: "default",
        });
      } else {
        throw new Error(result?.message || 'Failed to send message. The server did not respond correctly.');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      let errorMessage = "There was a problem sending your message. Please try again later.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: "Error Sending Message",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch,
    // especially if form fields rely on client-side state initially.
    return (
      <section id="contact" className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get In <span className="text-primary">Touch</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <Card className="shadow-lg p-2">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <Send className="mr-3 h-7 w-7" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Placeholder for form or loading state */}
                <div className="space-y-6">
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-12 bg-gray-300 rounded w-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-8">
               <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-6 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                    <div className="h-12 bg-gray-300 rounded w-full sm:w-auto animate-pulse"></div>
                </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-muted">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-xl mx-auto">
            Have a question or want to work together? Feel free to reach out.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 p-2 transform hover:scale-105 hover:bg-card/90 dark:hover:bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Send className="mr-3 h-7 w-7" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 bg-background"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 bg-background"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground/80">Message</Label>
                  <Textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 bg-background"
                    placeholder="Your message..."
                  />
                </div>
                <Button type="submit" className="w-full group" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-card/90 dark:hover:bg-card/80">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-foreground/80 hover:text-primary transition-colors">
                  <Mail className="h-6 w-6 text-primary" />
                  <a href="mailto:korapatiashwini@gmail.com">korapatiashwini@gmail.com</a>
                </div>
                <div className="flex items-center space-x-3 text-foreground/80 hover:text-primary transition-colors">
                  <Linkedin className="h-6 w-6 text-primary" />
                  <Link href="https://www.linkedin.com/in/ashwini123" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/ashwini123
                  </Link>
                </div>
              </CardContent>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-card/90 dark:hover:bg-card/80">
                <CardHeader>
                    <CardTitle className="text-xl text-primary">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/80 mb-4">View my latest resume for more details about my experience and skills.</p>
                    <a href={resumePdfPath} download="Ashwini_Korapati_Resume.pdf">
                        <Button className="w-full sm:w-auto group">
                            Download Resume <Download className="ml-2 h-5 w-5 group-hover:animate-bounce" />
                        </Button>
                    </a>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
