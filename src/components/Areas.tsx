import { motion } from 'motion/react';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

const areas = [
  {
    name: "Sheffield",
    description: "Covering all areas of Sheffield including City Centre, Hillsborough, Ecclesall, Dore, Woodseats, Gleadless, Manor, Firth Park, Burngreave, Crookes, and surrounding areas.",
    tags: ["City Centre", "Hillsborough", "Ecclesall", "Dore", "Woodseats", "Gleadless", "Manor", "Crookes"]
  },
  {
    name: "Rotherham",
    description: "Covering all areas of Rotherham including Town Centre, Brinsworth, Wickersley, Maltby, Rawmarsh, Wath-upon-Dearne, Swinton, Catcliffe, and surrounding areas.",
    tags: ["Town Centre", "Brinsworth", "Wickersley", "Maltby", "Rawmarsh", "Wath", "Swinton", "Catcliffe"]
  }
];

export default function Areas() {
  return (
    <section id="areas" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            Coverage
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-4">
            Areas We <span className="text-amber">Cover</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We provide professional driving lessons across Sheffield and Rotherham. Find your nearest area below.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          {areas.map((area, i) => (
            <motion.div 
              key={area.name}
              className="bg-white border border-border rounded-sm p-8 text-center hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="w-14 h-14 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-amber" />
              </div>
              <h3 className="font-display text-2xl font-bold text-charcoal mb-3">
                {area.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                {area.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {area.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">
            Not sure if we cover your area? Get in touch!
          </p>
          <Button 
            className="bg-[#25D366] hover:bg-[#1da851] text-white font-display font-semibold uppercase tracking-wider text-sm px-8 h-12"
            onClick={() => window.open('https://wa.me/447429494921?text=Hi%20Kaz%2C%20I%27d%20like%20to%20enquire%20about%20driving%20lessons', '_blank')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Ask Kaz on WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
