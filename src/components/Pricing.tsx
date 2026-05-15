import { motion } from 'motion/react';
import { Check, Star } from 'lucide-react';
import { Button } from './ui/button';

const plans = [
  {
    name: "Starter",
    price: "175",
    unit: "5 hours",
    description: "Perfect for getting started on your driving journey",
    features: [
      "5 one-hour lessons",
      "Flexible scheduling",
      "Theory test guide"
    ],
    popular: false
  },
  {
    name: "Popular",
    price: "332.50",
    unit: "10 hours",
    description: "Our most popular package with great savings",
    features: [
      "10 one-hour lessons (5% discount)",
      "Flexible scheduling",
      "Theory test guide",
      "Mock test included"
    ],
    popular: true
  },
  {
    name: "Intensive",
    price: "630",
    unit: "20 hours",
    description: "Best value for complete beginners",
    features: [
      "20 one-hour lessons (10% discount)",
      "Priority booking",
      "Theory test guide",
      "2 mock tests",
      "Dedicated instructor"
    ],
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            Pricing
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-4">
            Flexible <span className="text-amber">Pricing Plans</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose the package that works best for your budget and schedule.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative bg-white border rounded-sm p-6 flex flex-col ${
                plan.popular 
                  ? 'border-amber shadow-lg shadow-amber/10 ring-1 ring-amber/20' 
                  : 'border-border hover:shadow-lg'
              } transition-shadow duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber text-charcoal text-xs font-bold uppercase tracking-wider px-3 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-charcoal" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-5">
                <h3 className="font-display text-lg font-semibold text-charcoal mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-charcoal">£{plan.price}</span>
                </div>
                <span className="text-muted-foreground text-sm">{plan.unit}</span>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" />
                    <span className="text-charcoal/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full font-display font-semibold uppercase tracking-wider text-sm ${
                  plan.popular ? 'bg-amber hover:bg-amber-dark text-charcoal' : 'bg-charcoal hover:bg-charcoal-light text-white'
                }`}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
