import { motion } from 'motion/react';

const steps = [
  {
    num: "01",
    title: "Contact Us",
    desc: "Get in touch via phone, WhatsApp, or our booking form. Speak directly with your instructor Kaz to discuss your needs.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/theory-test-58VNRymCBRpkwDxgkRPGNM.webp"
  },
  {
    num: "02",
    title: "Choose Your Package",
    desc: "Select the lesson package that suits your budget and schedule — from our Starter pack to our Intensive course.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/instructor-student-APXSsmXj4QVneK2sZAPNVt.webp"
  },
  {
    num: "03",
    title: "Start Your Lessons",
    desc: "Begin learning with expert instruction. We pick you up from your door in Sheffield or Rotherham and build your skills step by step.",
    img: null
  },
  {
    num: "04",
    title: "Pass Your Test",
    desc: "With thorough preparation and mock tests, you will feel confident and ready to pass your driving test first time.",
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/passed-test-8BTmFNT8ob8ZpGpiyTkYwp.webp"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-charcoal relative overflow-hidden">
      {/* Top Diagonal */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 60L0 20Z" className="fill-background" />
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
            Your Path to <span className="text-amber">Success</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Getting started is easy. Follow these simple steps to begin your driving journey with PSL.
          </p>
        </motion.div>

        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8 mb-20">
          {steps.map((step, i) => (
            <motion.div 
              key={step.num}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-amber/40 to-transparent" />
              )}
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-amber/10 border border-amber/30 mb-5">
                  <span className="font-display text-amber text-2xl font-bold">{step.num}</span>
                </div>
                
                {step.img && (
                  <div className="mb-4 overflow-hidden rounded-sm mx-auto max-w-[240px]">
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="w-full h-36 object-cover"
                    />
                  </div>
                )}
                
                <h3 className="font-display text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 text-[15px] leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* First Lesson Guide */}
        <motion.div 
          className="bg-white/5 border border-white/10 rounded-sm p-8 lg:p-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl font-bold text-white mb-2">Your First Lesson Guide</h3>
            <p className="text-white/50">Nervous? Don't be! Here's exactly what we'll do in your first hour.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber text-charcoal flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
              <h4 className="font-display font-bold text-white mb-2">License Check</h4>
              <p className="text-white/40 text-sm">We'll check your provisional license and perform a quick eyesight test.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber text-charcoal flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
              <h4 className="font-display font-bold text-white mb-2">Controls Briefing</h4>
              <p className="text-white/40 text-sm">In a quiet area, Kaz will explain the car's controls and safety features.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber text-charcoal flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
              <h4 className="font-display font-bold text-white mb-2">Move Off & Stop</h4>
              <p className="text-white/40 text-sm">You'll take the wheel and perform your first move off and safe stop.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diagonal */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 0L0 40Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
