/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import SpecialOffer from './components/SpecialOffer';
import Areas from './components/Areas';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import StudentResources from './components/StudentResources';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-50 text-red-900 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="p-4 bg-white border border-red-200 overflow-auto max-h-[50vh]">
            {this.state.error?.toString()}
            {"\n\nStack:\n"}
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-center" richColors />
        <Navbar />
        <main>
          <Hero />
          <Courses />
          <HowItWorks />
          <WhyChooseUs />
          <Testimonials />
          <Pricing />
          <SpecialOffer />
          <Areas />
          <FAQ />
          <StudentResources />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </ErrorBoundary>
  );
}

