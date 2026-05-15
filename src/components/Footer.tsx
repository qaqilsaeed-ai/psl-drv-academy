import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/psl-logo_90453986.webp" 
                alt="PSL Driving Academy" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Professional driving tuition from DVSA approved instructors. Covering Sheffield and Rotherham with expert instruction from Kaz.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-sm bg-white/5 hover:bg-amber/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-sm bg-white/5 hover:bg-amber/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a 
                href="https://wa.me/447429494921?text=Hi%20Kaz%2C%20I%27d%20like%20to%20enquire%20about%20driving%20lessons" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm bg-white/5 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors" 
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Services', href: '#services' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Areas', href: '#areas' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/50 hover:text-amber transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              {['Manual Lessons', 'Automatic Lessons', 'Intensive Course', 'Advanced Training'].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-white/50 hover:text-amber transition-colors text-sm">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:07429494921" className="flex items-center gap-2 text-white/50 hover:text-amber transition-colors text-sm">
                  <Phone className="w-4 h-4 shrink-0" />
                  07429 494 921
                </a>
              </li>
              <li>
                <a href="tel:07533322689" className="flex items-center gap-2 text-white/50 hover:text-amber transition-colors text-sm">
                  <Phone className="w-4 h-4 shrink-0" />
                  07533 322 689
                </a>
              </li>
              <li>
                <a href="mailto:qaqilsaeed@gmail.com" className="flex items-center gap-2 text-white/50 hover:text-amber transition-colors text-sm">
                  <Mail className="w-4 h-4 shrink-0" />
                  qaqilsaeed@gmail.com
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <MapPin className="w-4 h-4 shrink-0" />
                  Sheffield & Rotherham
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} PSL Driving Academy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-amber transition-colors text-xs">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-amber transition-colors text-xs">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
