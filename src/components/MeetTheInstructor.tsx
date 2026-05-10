import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Heart, Quote, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from './ui/button';

export default function MeetTheInstructor() {
  const achievements = [
    {
      icon: <Award className="w-5 h-5 text-amber" />,
      text: "DVSA Approved Grade A Instructor"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-amber" />,
      text: "15+ Years teaching in Sheffield"
    },
    {
      icon: <Heart className="w-5 h-5 text-amber" />,
      text: "Specialist in Nervous Learners"
    }
  ];

  return (
    <section id="instructor" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative group">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-amber/10 rounded-full blur-3xl group-hover:bg-amber/20 transition-all duration-500" />
              <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-charcoal/5 rounded-full blur-3xl group-hover:bg-charcoal/10 transition-all duration-500" />
              
              <div className="relative z-10 overflow-hidden rounded-sm border-4 border-charcoal bg-white shadow-[20px_20px_0px_0px_rgba(255,191,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(33,37,41,1)] transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=1000" 
                  alt="Instructor Kaz" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Quote Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 md:-left-12 bg-charcoal text-white p-6 md:p-8 max-w-xs z-20 shadow-xl"
              >
                <Quote className="w-8 h-8 text-amber mb-4 opacity-50" />
                <p className="font-display font-medium italic text-lg leading-relaxed">
                  "My goal isn't just to help you pass, but to make you a safe, confident driver for life."
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Column */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block py-1 px-4 bg-amber/10 text-charcoal text-xs font-black uppercase tracking-[0.3em] mb-4">
                Lead Driving Instructor
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mb-6 uppercase tracking-tight leading-none">
                Meet <span className="text-amber">Kaz</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                With over a decade of experience navigating the roads of South Yorkshire, Kaz founded PSL Driving Academy to provide more than just "standard" lessons. 
                <br /><br />
                His methodology focuses on building deep technical competence and road awareness. Kaz has helped hundreds of students in Sheffield and Rotherham gain their independence, with a specialized focus on helping nervous learners overcome their anxiety behind the wheel.
              </p>

              <div className="space-y-4 mb-10">
                {achievements.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-amber/10 transition-colors">
                      {item.icon}
                    </div>
                    <span className="font-display font-bold text-charcoal/80 uppercase tracking-wide text-sm">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Button className="bg-charcoal hover:bg-charcoal/90 text-white px-8 py-6 rounded-sm font-display font-bold uppercase tracking-wider">
                  Read Full Story
                </Button>
                
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-charcoal/40 hover:text-amber hover:border-amber transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-charcoal/40 hover:text-amber hover:border-amber transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-charcoal/40 hover:text-amber hover:border-amber transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
