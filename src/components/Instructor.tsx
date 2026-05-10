import { motion } from 'motion/react';
import { Award, Shield, Clock, Star } from 'lucide-react';

export default function Instructor() {
  return (
    <section id="instructor" className="py-20 lg:py-28 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber font-semibold text-sm tracking-wider uppercase">
              Meet Your Instructor
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-6">
              Learn with <span className="text-amber">Kaz</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-3xl mx-auto">
              With over 15 years of experience teaching in Sheffield and Rotherham, Kaz has helped over 1,000 students gain their independence on the road. His patient, calm, and professional approach makes him the perfect choice for nervous beginners and advanced learners alike.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="flex flex-col items-center gap-3 p-6 bg-charcoal/5 rounded-sm border-b-2 border-transparent hover:border-amber transition-all group">
                <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-charcoal transition-colors">
                  <Award className="w-6 h-6 text-amber group-hover:text-charcoal" />
                </div>
                <div className="text-center">
                  <h4 className="font-display font-bold text-charcoal text-base">DVSA Approved</h4>
                  <p className="text-xs text-muted-foreground">Fully qualified ADI</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 bg-charcoal/5 rounded-sm border-b-2 border-transparent hover:border-amber transition-all group">
                <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-charcoal transition-colors">
                  <Shield className="w-6 h-6 text-amber group-hover:text-charcoal" />
                </div>
                <div className="text-center">
                  <h4 className="font-display font-bold text-charcoal text-base">High Pass Rate</h4>
                  <p className="text-xs text-muted-foreground">98% first-time pass</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 bg-charcoal/5 rounded-sm border-b-2 border-transparent hover:border-amber transition-all group">
                <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-charcoal transition-colors">
                  <Clock className="w-6 h-6 text-amber group-hover:text-charcoal" />
                </div>
                <div className="text-center">
                  <h4 className="font-display font-bold text-charcoal text-base">Flexible Hours</h4>
                  <p className="text-xs text-muted-foreground">Evenings & Weekends</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-6 bg-charcoal/5 rounded-sm border-b-2 border-transparent hover:border-amber transition-all group">
                <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-charcoal transition-colors">
                  <Star className="w-6 h-6 text-amber group-hover:text-charcoal" />
                </div>
                <div className="text-center">
                  <h4 className="font-display font-bold text-charcoal text-base">5-Star Rated</h4>
                  <p className="text-xs text-muted-foreground">Highly recommended</p>
                </div>
              </div>
            </div>

            <div className="bg-charcoal p-8 lg:p-12 rounded-sm border-t-4 border-amber relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber/5 blur-3xl rounded-full -ml-16 -mb-16" />
              
              <div className="relative z-10">
                <div className="inline-block bg-amber text-charcoal px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6">
                  Instructor's Philosophy
                </div>
                <p className="text-white italic text-xl lg:text-2xl mb-6 leading-relaxed max-w-2xl mx-auto">
                  "My goal isn't just to help you pass your test, but to make you a safe, confident driver for life. Every student is different, and I tailor my teaching to your specific learning style."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[1px] w-8 bg-amber/50" />
                  <span className="text-amber font-display font-bold text-lg uppercase tracking-wider">Kaz, Lead Instructor</span>
                  <div className="h-[1px] w-8 bg-amber/50" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
