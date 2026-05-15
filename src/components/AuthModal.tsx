import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { 
  auth, 
  signInWithGoogle, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from '../firebase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Signed in successfully!');
      }
      onClose();
    } catch (error: any) {
      console.error('Auth error detail:', error);
      let message = error.message || 'An error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use.';
      if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      if (error.code === 'auth/weak-password') message = 'Password is too weak (min 6 characters).';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      }
      if (error.code === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-up is not enabled in Firebase Console.';
      }
      if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection or disable any ad-blockers/extensions blocking Google services.';
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google!');
      onClose();
    } catch (error: any) {
      console.error('Google Auth error detail:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google sign-in is not enabled in your Firebase project. Please enable it in the Firebase Console.');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for Firebase Auth. Add this URL to "Authorized domains" in Firebase Console.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your internet connection or disable any ad-blockers blocking Google services.');
      } else if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message || 'Failed to sign in with Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-sm shadow-2xl overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-charcoal uppercase tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {mode === 'signin' 
                ? 'Sign in to access your bookings and resources.' 
                : 'Join PSL Drawing Academy to start your journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <input 
                    type="text" 
                    required 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-charcoal hover:bg-charcoal/90 text-white py-6 rounded-sm font-display font-bold uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full border-slate-200 text-charcoal hover:bg-slate-50 py-6 rounded-sm font-semibold transition-all flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Sign in with Google
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="ml-1 text-amber hover:underline font-bold transition-all"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-tight">
            By continuing, you agree to our Terms of Service and Privacy Policy. Password must be at least 6 characters.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
