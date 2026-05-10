import { useState, useEffect } from 'react';
import { Menu, X, Phone, LogIn, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { auth, logout, db } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save user profile to Firestore
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role: 'user',
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error("Error saving user profile:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const openAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Instructor', href: '#instructor' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Resources', href: '#resources' },
    { label: 'Areas', href: '#areas' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container flex items-center justify-between h-16 lg:h-20">
        <a href="#home" className="flex items-center">
          <img 
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663254855538/XoYrtSEkR3QaKKDDgYw9AZ/psl-logo_90453986.webp" 
            alt="PSL Driving Academy" 
            className="h-10 lg:h-14 w-auto"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-amber transition-colors text-sm font-medium tracking-wide uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:07429494921" className="flex items-center gap-2 text-white/80 hover:text-amber transition-colors text-sm">
            <Phone className="w-4 h-4" />
            07429 494 921
          </a>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-charcoal/50 hover:bg-charcoal border border-white/10 rounded-full p-1 pr-3 transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-amber" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-charcoal font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-white text-xs font-semibold">{user.displayName?.split(' ')[0]}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-3 border-b border-border bg-slate-50">
                    <p className="text-xs font-bold text-charcoal truncate">{user.displayName}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-amber/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-border"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="outline"
              className="border-amber text-amber hover:bg-amber hover:text-charcoal font-display font-semibold uppercase tracking-wider text-sm px-6"
              onClick={() => openAuth('signin')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign in
            </Button>
          )}

          <Button 
            className="bg-amber hover:bg-amber-dark text-charcoal font-display font-semibold uppercase tracking-wider text-sm px-6"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-charcoal/98 backdrop-blur-md border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="container py-6 flex flex-col gap-4">
            {user && (
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-sm mb-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border-2 border-amber" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber flex items-center justify-center text-charcoal text-xl font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">{user.displayName}</p>
                  <p className="text-white/40 text-xs">{user.email}</p>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-amber transition-colors text-sm font-medium tracking-wide uppercase py-2 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            
            <div className="pt-4 space-y-3">
              <a href="tel:07429494921" className="flex items-center gap-2 text-amber text-sm py-2">
                <Phone className="w-4 h-4" />
                07429 494 921
              </a>

              {user ? (
                <Button 
                  variant="outline"
                  className="border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-display font-semibold uppercase tracking-wider text-sm w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="border-amber text-amber hover:bg-amber/10 font-display font-semibold uppercase tracking-wider text-sm w-full"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuth('signin');
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in
                </Button>
              )}

              <Button 
                className="bg-amber hover:bg-amber-dark text-charcoal font-display font-semibold uppercase tracking-wider text-sm w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      )}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </nav>
  );
}
