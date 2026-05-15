/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Courses from './components/Courses';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import MeetTheInstructor from './components/MeetTheInstructor';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import SpecialOffer from './components/SpecialOffer';
import Areas from './components/Areas';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import StudentResources from './components/StudentResources';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <Hero />
        <Courses />
        <HowItWorks />
        <WhyChooseUs />
        <MeetTheInstructor />
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
  );
}

