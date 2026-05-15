import { motion } from 'motion/react';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const OFFER_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/passed-test-8BTmFNT8ob8ZpGpiyTkYwp.webp";

export default function SpecialOffer() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="relative rounded-sm overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0">
            <img 
              src={OFFER_IMAGE} 
              alt="Student celebrating passing driving test" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/50" />
          </div>

          <div className="relative z-10 p-8 lg:p-14 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-amber" />
                <span className="text-amber font-semibold text-sm tracking-wider uppercase">Special Offer</span>
              </div>
              
              <h2 className="font-display text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Save 10% on 20-Hour Package
              </h2>
              
              <p className="text-white/60 text-lg max-w-lg mb-6">
                Book our Intensive 20-hour package and save 10% — that is just £630 for 20 hours of expert tuition. Perfect for complete beginners wanting the best value.
              </p>

              <Button 
                size="lg" 
                className="bg-amber hover:bg-amber-dark text-charcoal font-display font-semibold uppercase tracking-wider text-sm px-8 h-14"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="hidden lg:block">
              <div className="bg-amber/10 border border-amber/30 rounded-sm p-8 text-center backdrop-blur-sm">
                <span className="font-display text-amber text-6xl font-bold block">10%</span>
                <span className="font-display text-white text-xl font-semibold block mt-1">
                  DISCOUNT
                </span>
                <span className="text-white/50 text-sm block mt-2">
                  On 20-hour package
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
