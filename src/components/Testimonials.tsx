import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Jenkins",
    location: "Sheffield",
    text: "Kaz was incredibly patient and calm. I was so nervous about my first lesson, but he made me feel at ease immediately. Passed first time with only 2 minors!",
    rating: 5
  },
  {
    name: "David Thompson",
    location: "Rotherham",
    text: "Highly recommend PSL Driving Academy. The intensive course was exactly what I needed to get my license quickly for a new job. Great value for money.",
    rating: 5
  },
  {
    name: "Emma Wilson",
    location: "Sheffield",
    text: "The best driving instructor in Sheffield! Kaz explains everything so clearly and doesn't just teach you to pass the test, but how to be a safe driver.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-charcoal relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-amber blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-amber blur-3xl" />
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
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
            What Our <span className="text-amber">Students Say</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Join hundreds of successful drivers who have passed their test with PSL Driving Academy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-sm hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 rounded-sm bg-amber/10 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-amber" />
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
              </div>
              
              <p className="text-white/80 text-lg italic mb-8 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="mt-auto">
                <h4 className="font-display font-bold text-white text-lg">{testimonial.name}</h4>
                <p className="text-amber text-sm font-medium">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-charcoal overflow-hidden bg-charcoal">
                  <img src={`https://picsum.photos/seed/student${i}/100/100`} alt="Student" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-white/80 text-sm">
              <span className="text-amber font-bold">4.9/5</span> based on 500+ Google reviews
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
