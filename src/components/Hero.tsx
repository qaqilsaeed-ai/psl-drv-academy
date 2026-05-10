import { motion } from 'motion/react';
import { ChevronRight, Award, Users, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/hero-driving-M9QSnhGbWMS2y42fs7uzoW.webp";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={HERO_IMAGE} 
          alt="Driving on a scenic road" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
      </div>

      <div className="container relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-amber/20 text-amber px-4 py-1.5 text-sm font-semibold tracking-wider uppercase mb-6 border border-amber/30">
              DVSA Approved Instructors
            </span>
          </motion.div>

          <motion.h1 
            className="font-display text-white text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Your Journey to <span className="text-amber">Confident Driving</span> Starts Here
          </motion.h1>

          <motion.p 
            className="text-white/70 text-lg lg:text-xl leading-relaxed mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Professional driving instruction with your instructor Kaz. Pass your test with confidence and become a safe, skilled driver.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Button 
              size="lg" 
              className="bg-amber hover:bg-amber-dark text-charcoal font-display font-semibold uppercase tracking-wider text-base px-8 h-14"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Your Lessons
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 font-display font-semibold uppercase tracking-wider text-base px-8 h-14"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-6 lg:gap-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber" />
              <span className="text-white/60 text-sm">1000+ Students Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber" />
              <span className="text-white/60 text-sm">98% Pass Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber" />
              <span className="text-white/60 text-sm">15+ Expert Instructors</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Curve/Diagonal */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 80L1440 80L1440 40L0 80Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
