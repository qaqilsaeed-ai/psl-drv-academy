import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    q: "How do I book a lesson?",
    a: "You can book a lesson by contacting us via phone on 07429 494 921, sending us a WhatsApp message, or filling out the booking form on this page. Our instructor Kaz will get back to you within 24 hours to arrange your first lesson at a time that suits you."
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 48 hours notice for cancellations or rescheduling. Lessons cancelled with less than 48 hours notice may be charged at the full lesson rate. This policy helps us manage our instructors' schedules effectively and ensure availability for all students."
  },
  {
    q: "Do you provide theory test support?",
    a: "Yes! All our packages include a comprehensive theory test guide to help you prepare. We provide study materials, practice questions, and guidance on hazard perception. Our instructors also incorporate theory knowledge into practical lessons to reinforce your learning."
  },
  {
    q: "How long does it take to pass my test?",
    a: "This varies depending on your natural ability and how often you practise. On average, most learners need between 30-45 hours of professional tuition combined with private practice. Our intensive courses can fast-track this process if you have a tight schedule."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept various payment methods for your convenience. Please contact Kaz directly to discuss the most suitable payment option for you when booking your lessons."
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "We are committed to providing the highest quality driving instruction. If you are not satisfied with your first lesson, please speak to your instructor or contact us directly. We will work with you to resolve any concerns and ensure you have the best possible learning experience."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-charcoal relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 0L1440 0L1440 60L0 20Z" className="fill-background" />
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            FAQ
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2 mb-4">
            Frequently Asked <span className="text-amber">Questions</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our driving lessons and services.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`faq-${i}`}
                className="bg-charcoal-light/50 border border-white/10 rounded-sm px-5 data-[state=open]:border-amber/30"
              >
                <AccordionTrigger className="text-white hover:text-amber text-left font-display font-medium text-[15px] py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/50 text-[15px] leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 0L0 40Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
