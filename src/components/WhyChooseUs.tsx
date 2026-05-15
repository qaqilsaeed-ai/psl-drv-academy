import { motion } from 'motion/react';
import { ShieldCheck, Clock, Car, Award, MapPin, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: ShieldCheck,
    title: "DVSA Approved",
    desc: "All our instructors are fully qualified, DVSA approved, and DBS checked for your safety."
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Lessons available 7 days a week, including evenings and weekends to fit your lifestyle."
  },
  {
    icon: Car,
    title: "Modern Dual-Control Cars",
    desc: "Learn in well-maintained, modern vehicles with dual controls for maximum safety."
  },
  {
    icon: Award,
    title: "98% Pass Rate",
    desc: "Our structured approach and experienced instructors deliver an exceptional first-time pass rate."
  },
  {
    icon: MapPin,
    title: "Sheffield & Rotherham",
    desc: "Covering all areas of Sheffield and Rotherham with convenient pick-up and drop-off."
  },
  {
    icon: HeartHandshake,
    title: "Patient & Friendly",
    desc: "We specialise in nervous drivers. Our calm, patient approach builds real confidence."
  }
];

const DASHBOARD_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/car-dashboard-YFYUqyMU5i6SETr2UbAnpB.webp";

export default function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-charcoal relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 60L0 20Z" className="fill-background" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber font-semibold text-sm tracking-wider uppercase">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 mb-6">
              Why Learn with <span className="text-amber">PSL Driving Academy</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((reason, i) => (
                <motion.div 
                  key={reason.title}
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                    <reason.icon className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <h4 className="font-display text-white font-semibold text-sm mb-1">
                      {reason.title}
                    </h4>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {reason.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-sm">
              <img 
                src={DASHBOARD_IMAGE} 
                alt="Modern car dashboard view while driving" 
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-amber p-5 rounded-sm shadow-xl">
              <div className="font-display text-charcoal">
                <span className="text-3xl font-bold block">98%</span>
                <span className="text-sm font-semibold uppercase tracking-wider">Pass Rate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 0L0 40Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
