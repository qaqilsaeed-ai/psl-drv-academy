import { motion } from 'motion/react';
import { Car, Settings, Zap, Trophy, ArrowRight } from 'lucide-react';

const courses = [
  {
    icon: Car,
    title: "Manual Driving Lessons",
    description: "Master the art of manual transmission with our expert instructors. Perfect for learners who want complete control.",
    price: "£35/hour",
    color: "bg-amber/10 text-amber"
  },
  {
    icon: Settings,
    title: "Automatic Driving Lessons",
    description: "Learn to drive with ease using automatic transmission. Ideal for those who prefer a smoother learning experience.",
    price: "£36/hour",
    color: "bg-emerald-500/10 text-emerald-500"
  },
  {
    icon: Zap,
    title: "Intensive Driving Courses",
    description: "Fast-track your driving skills with our intensive 5-day or 10-day programs. Perfect for busy schedules.",
    price: "£175/5 days (£35/hour)",
    color: "bg-sky-500/10 text-sky-500"
  },
  {
    icon: Trophy,
    title: "Advanced Driving Training",
    description: "Master defensive driving techniques and advanced vehicle control. For experienced drivers wanting to improve.",
    price: "£40/hour",
    color: "bg-violet-500/10 text-violet-500"
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Courses() {
  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-4">
            Choose Your <span className="text-amber">Driving Course</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose the driving lesson package that best suits your needs and schedule.
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {courses.map((course) => (
            <motion.div 
              key={course.title}
              variants={itemVariants}
              className="group bg-white border border-border rounded-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-sm flex items-center justify-center mb-5 ${course.color}`}>
                <course.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-charcoal mb-3">
                {course.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px] mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-amber font-display font-bold text-lg">
                  {course.price}
                </span>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
