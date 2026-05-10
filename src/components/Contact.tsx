import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, User, MapPin, Send, MessageCircle, Calendar as CalendarIcon, Clock, LogIn, LogOut, X, Loader2, CheckCircle2, AlertCircle, Share2, Download, CalendarPlus } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { format, addDays, isBefore, startOfToday, parse } from 'date-fns';
import { auth, db, logout, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, doc, setDoc, onSnapshot, query, where, writeBatch } from 'firebase/firestore';
import { generateGoogleCalendarUrl, generateOutlookCalendarUrl, generateIcsFile } from '../lib/calendar';
import AuthModal from './AuthModal';

export default function Contact() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [contactMode, setContactMode] = useState<'booking' | 'inquiry'>('booking');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [monthBookings, setMonthBookings] = useState<Record<string, number>>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: 'Sheffield',
    postcode: '',
    service: 'Manual Lessons',
    message: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email
        }));
        
        // Save user profile to Firestore
        const userPath = `users/${currentUser.uid}`;
        setDoc(doc(db, 'users', currentUser.uid), {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          role: 'user'
        }, { merge: true }).catch(error => handleFirestoreError(error, OperationType.WRITE, userPath));
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to availability for the next 90 days to show on calendar highlights
  useEffect(() => {
    const endRange = addDays(new Date(), 90);
    
    const q = query(
      collection(db, 'availability'),
      where('date', '>=', format(startOfToday(), 'yyyy-MM-dd')),
      where('date', '<=', format(endRange, 'yyyy-MM-dd'))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        counts[data.date] = (counts[data.date] || 0) + 1;
      });
      setMonthBookings(counts);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'availability');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    
    setIsLoadingSlots(true);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const q = query(collection(db, 'availability'), where('date', '==', dateStr));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booked = snapshot.docs.map(doc => doc.data().time);
      setBookedSlots(booked);
      setIsLoadingSlots(false);
      
      // Reset selected time if it's now booked
      if (selectedTime && booked.includes(selectedTime)) {
        setSelectedTime('');
        toast.info("The slot you selected was just booked. Please pick another one.");
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `availability/${dateStr}`);
      setIsLoadingSlots(false);
    });
    
    return () => unsubscribe();
  }, [selectedDate]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  const durations = [
    { label: '1 Hour', value: 60 },
    { label: '1.5 Hours', value: 90 },
    { label: '2 Hours', value: 120 },
    { label: '3 Hours', value: 180 }
  ];

  const getRequiredSlots = (startTime: string, durationMinutes: number) => {
    const slots = [];
    const [hours, minutes] = startTime.split(':').map(Number);
    const numSlots = durationMinutes / 30;
    
    for (let i = 0; i < numSlots; i++) {
      const totalMinutes = hours * 60 + minutes + (i * 30);
      const sHours = Math.floor(totalMinutes / 60);
      const sMinutes = totalMinutes % 60;
      slots.push(`${sHours.toString().padStart(2, '0')}:${sMinutes.toString().padStart(2, '0')}`);
    }
    return slots;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (contactMode === 'booking') {
      if (!selectedDate) {
        toast.error("Please select a preferred date.");
        return;
      }
      
      if (!selectedTime) {
        toast.error("Please select a preferred time.");
        return;
      }

      setShowConfirmDialog(true);
    } else {
      // General Inquiry mode
      confirmBooking();
    }
  };

  const confirmBooking = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        ...formData,
        userId: user?.uid || null,
        type: contactMode,
        date: contactMode === 'booking' ? format(selectedDate!, 'yyyy-MM-dd') : null,
        time: contactMode === 'booking' ? selectedTime : null,
        duration: contactMode === 'booking' ? selectedDuration : null,
        createdAt: serverTimestamp()
      };

      // 1. Save to Firestore (Atomic Batch)
      const collectionName = contactMode === 'booking' ? 'bookings' : 'inquiries';
      
      if (contactMode === 'booking') {
        const batch = writeBatch(db);
        const bookingRef = doc(collection(db, 'bookings'));
        const requiredSlots = getRequiredSlots(bookingData.time!, bookingData.duration!);

        batch.set(bookingRef, bookingData);
        
        requiredSlots.forEach(slotTime => {
          const slotId = `${bookingData.date}_${slotTime}`;
          const slotRef = doc(db, 'availability', slotId);
          batch.set(slotRef, {
            date: bookingData.date,
            time: slotTime,
            bookingId: bookingRef.id
          });
        });
        
        try {
          await batch.commit();
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, 'bookings/availability-batch');
          return;
        }
      } else {
        try {
          await addDoc(collection(db, 'inquiries'), bookingData);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'inquiries');
          return;
        }
      }

      // 3. Submit to Formspree
      const formspreeData = new FormData();
      Object.entries(bookingData).forEach(([key, value]) => {
        formspreeData.append(key, value as string);
      });

      const response = await fetch("https://formspree.io/f/xeepkyzp", {
        method: "POST",
        body: formspreeData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        if (contactMode === 'booking') {
          const lastBookingInfo = {
            ...formData,
            date: format(selectedDate!, 'yyyy-MM-dd'),
            time: selectedTime,
          };
          setLastBooking(lastBookingInfo);
          
          toast.success("Booking Request Received!", {
            description: `We've scheduled your preferred slot for ${format(selectedDate!, 'PPP')} at ${selectedTime}. Kaz will confirm shortly.`
          });

          setShowSuccessDialog(true);
        } else {
          toast.success("Message Sent!", {
            description: "Thanks for getting in touch. Kaz will get back to you as soon as possible."
          });
        }

        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          address1: '',
          address2: '',
          city: 'Sheffield',
          postcode: '',
          service: 'Manual Lessons',
          message: ''
        });
        setSelectedTime('');
      } else {
        toast.error("There was a problem with the notification, but your request is saved in our database.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Oops! There was a problem processing your booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = () => {
    if (lastBooking) {
      const { date, time, ...rest } = lastBooking;
      setFormData(rest as any);
      setContactMode('booking');
      setShowSuccessDialog(false);
      
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      toast.info("Form restored. Please select a new date and time.");
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="container">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            Contact Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-4">
            Ready to <span className="text-amber">Start?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Contact us today to book your first lesson or get more information about our services.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Info Column */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-charcoal p-1 mb-8 flex">
              <button
                onClick={() => setContactMode('booking')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  contactMode === 'booking' 
                    ? 'bg-amber text-charcoal shadow-lg' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                Book a Lesson
              </button>
              <button
                onClick={() => setContactMode('inquiry')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  contactMode === 'inquiry' 
                    ? 'bg-amber text-charcoal shadow-lg' 
                    : 'text-white/40 hover:text-white'
                }`}
              >
                General Inquiry
              </button>
            </div>

            <div className="bg-charcoal rounded-sm p-6">
              <h3 className="font-display text-white text-xl font-semibold mb-6">Get in Touch</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                    <a href="tel:07429494921" className="text-white hover:text-amber transition-colors font-medium block">
                      07429 494 921
                    </a>
                    <a href="tel:07533322689" className="text-white hover:text-amber transition-colors font-medium block">
                      07533 322 689
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Your Instructor</p>
                    <p className="text-white font-medium">Kaz</p>
                  </div>
                </div>

                <a href="mailto:qaqilsaeed@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white group-hover:text-amber transition-colors font-medium">qaqilsaeed@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Service Areas</p>
                    <p className="text-white font-medium">Sheffield & Rotherham</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-display font-semibold uppercase tracking-wider text-sm h-12"
                  onClick={() => window.open('https://wa.me/447429494921?text=Hi%20Kaz%2C%20I%27d%20like%20to%20book%20a%20driving%20lesson', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Book via WhatsApp
                </Button>
              </div>
            </div>

            <div className="bg-amber rounded-sm p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <span className="font-display text-charcoal text-3xl font-bold block">1000+</span>
                  <span className="text-charcoal/70 text-sm">
                    Students Passed
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-display text-charcoal text-3xl font-bold block">98%</span>
                  <span className="text-charcoal/70 text-sm">
                    Pass Rate
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-display text-charcoal text-3xl font-bold block">15+</span>
                  <span className="text-charcoal/70 text-sm">
                    Expert Instructors
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-display text-charcoal text-3xl font-bold block">4.9</span>
                  <span className="text-charcoal/70 text-sm">
                    Star Rating
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white border border-border rounded-sm p-6 lg:p-8 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-charcoal text-xl font-semibold">
                    {contactMode === 'booking' ? '1. Select Date & Time' : 'Send us a Message'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {contactMode === 'booking' 
                      ? 'Pick a slot that works for you' 
                      : 'Have a question? We typically respond within 2 hours.'}
                  </p>
                </div>
                {!user ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-amber text-charcoal hover:bg-amber/10"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign in {contactMode === 'booking' ? 'for faster booking' : 'to save your message'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-charcoal">{user.displayName}</p>
                      <button onClick={logout} className="text-[10px] text-amber hover:underline uppercase font-bold">Sign Out</button>
                    </div>
                    {user.photoURL && (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-amber" referrerPolicy="no-referrer" />
                    )}
                  </div>
                )}
              </div>

              {contactMode === 'booking' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-charcoal/5 p-6 rounded-sm border border-charcoal/10 overflow-y-auto max-h-[500px]">
                    <div className="flex items-center gap-2 text-charcoal font-bold mb-4">
                      <CalendarIcon className="w-4 h-4 text-amber" />
                      <span>Select Preferred Date</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)).map((date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        const bookingCount = monthBookings[dateStr] || 0;
                        const isFullyBooked = bookingCount >= timeSlots.length;
                        const isPartiallyBooked = bookingCount > 0 && bookingCount < timeSlots.length;
                        const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateStr;
                        
                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => setSelectedDate(date)}
                            className={`relative p-4 rounded-sm transition-all duration-300 border-2 text-center group ${
                              isSelected
                                ? 'bg-charcoal border-charcoal text-white shadow-xl -translate-y-1' 
                                : isFullyBooked
                                  ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                                  : 'bg-white border-slate-100 text-charcoal hover:border-amber hover:bg-slate-50 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span className={`text-[10px] uppercase font-black tracking-widest mb-1 ${
                                isSelected ? 'text-amber' : 'text-charcoal/40'
                              }`}>
                                {format(date, 'EEE')}
                              </span>
                              <span className="text-2xl font-display font-bold leading-none mb-1">
                                {format(date, 'd')}
                              </span>
                              <span className={`text-[10px] uppercase font-bold tracking-tighter ${
                                isSelected ? 'text-white/60' : 'text-charcoal/40'
                              }`}>
                                {format(date, 'MMM')}
                              </span>
                            </div>

                            {/* Status Indicator Dot */}
                            <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                              isSelected 
                                ? 'bg-amber animate-pulse' 
                                : isFullyBooked 
                                  ? 'bg-rose-500' 
                                  : isPartiallyBooked 
                                    ? 'bg-amber' 
                                    : 'bg-emerald-500'
                            }`} />

                            <div className={`mt-2 text-[8px] uppercase font-black tracking-wider ${
                              isSelected ? 'text-amber/80' : isFullyBooked ? 'text-rose-300' : 'text-charcoal/20'
                            }`}>
                              {isSelected ? 'Selected' : isFullyBooked ? 'Fully Booked' : isPartiallyBooked ? 'Partial' : 'Available'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-charcoal font-bold">
                        <Clock className="w-4 h-4 text-amber" />
                        <span>Available Slots</span>
                      </div>
                      {isLoadingSlots && (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Live
                        </div>
                      )}
                    </div>

                    {/* Availability Legend */}
                    <div className="mb-6 p-4 bg-charcoal/5 rounded-sm border border-charcoal/10">
                      <p className="text-[10px] uppercase font-black text-charcoal/40 tracking-[0.2em] mb-3">Availability Key</p>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-x-6 gap-y-3 pb-3 border-b border-charcoal/10">
                          <p className="w-full text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Time Slots</p>
                          <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-sm bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-charcoal/80">Available</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-sm bg-rose-50 border border-rose-200 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            </div>
                            <span className="text-xs font-bold text-charcoal/80">Booked</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-sm bg-amber border border-charcoal/20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-charcoal/40" />
                            </div>
                            <span className="text-xs font-bold text-charcoal/80">Selected</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                          <p className="w-full text-[8px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Calendar Days</p>
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                            <span className="text-xs font-bold text-charcoal/80">Available</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber shadow-sm" />
                            <span className="text-xs font-bold text-charcoal/80">Partial</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                            <span className="text-xs font-bold text-charcoal/80">Full</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Duration Selection */}
                    <div className="mb-6">
                      <p className="text-[10px] uppercase font-black text-charcoal/40 tracking-[0.2em] mb-3">Select Duration</p>
                      <div className="flex flex-wrap gap-2">
                        {durations.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => {
                              setSelectedDuration(d.value);
                              setSelectedTime(''); // Reset time when duration changes to re-validate
                            }}
                            className={`flex-1 min-w-[80px] py-2 px-3 rounded-sm text-xs font-bold transition-all border-2 ${
                              selectedDuration === d.value
                                ? 'bg-amber border-amber text-charcoal shadow-sm'
                                : 'bg-white border-slate-100 text-slate-500 hover:border-amber/50 hover:bg-slate-50'
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-2">
                      {timeSlots.map((time) => {
                        const requiredSlots = getRequiredSlots(time, selectedDuration);
                        
                        // Check if any part of the requested duration goes beyond the available slots
                        const lastPossibleSlot = timeSlots[timeSlots.length - 1];
                        const lastRequestedSlot = requiredSlots[requiredSlots.length - 1];
                        
                        // Simple string comparison works for HH:mm format
                        const isOutOfBounds = lastRequestedSlot > lastPossibleSlot;
                        
                        const isBooked = requiredSlots.some(s => bookedSlots.includes(s));
                        const isSelected = selectedTime === time;
                        
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isBooked || isOutOfBounds || isLoadingSlots}
                            onClick={() => setSelectedTime(time)}
                            className={`group relative py-3 px-4 rounded-sm text-sm font-bold transition-all duration-300 border-2 ${
                              isSelected
                                ? 'bg-amber border-amber text-charcoal shadow-lg -translate-y-1' 
                                : isBooked || isOutOfBounds
                                  ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed'
                                  : 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 hover:-translate-y-0.5'
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{time}</span>
                              <span className={`text-[8px] uppercase tracking-tighter mt-0.5 ${
                                isSelected ? 'text-charcoal/60' : isBooked || isOutOfBounds ? 'text-rose-300' : 'text-emerald-600/60'
                              }`}>
                                {isSelected ? 'Selected' : isBooked ? 'Booked' : isOutOfBounds ? 'Too Long' : 'Available'}
                              </span>
                            </div>
                            
                            {(isBooked || isOutOfBounds) && (
                              <div className="absolute top-1 right-1">
                                <AlertCircle className="w-3 h-3 text-rose-400" />
                              </div>
                            )}
                            {!isBooked && !isSelected && !isOutOfBounds && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedDate && selectedTime && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-amber border-2 border-charcoal rounded-sm shadow-[4px_4px_0px_0px_rgba(18,18,18,1)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-charcoal flex items-center justify-center shrink-0">
                            <CalendarIcon className="w-5 h-5 text-amber" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-charcoal/60 tracking-widest leading-none mb-1">Your Selected Slot</p>
                            <p className="text-charcoal font-display font-bold text-lg leading-none">
                              {format(selectedDate, 'EEE, MMM do')} @ {selectedTime} ({durations.find(d => d.value === selectedDuration)?.label})
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <form 
              onSubmit={handleSubmit}
              className="bg-white border border-border rounded-sm p-6 lg:p-8 space-y-5"
            >
              <h3 className="font-display text-charcoal text-xl font-semibold mb-2">
                {contactMode === 'booking' ? '2. Your Details' : 'Your Details'}
              </h3>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                      placeholder="07429 494 921"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Address Line 1
                </label>
                <input 
                  type="text" 
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                  placeholder="House number and street"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    City
                  </label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                    placeholder="Sheffield"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Postcode
                  </label>
                  <input 
                    type="text" 
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                    placeholder="S1 1AA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Preferred Service
                </label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background"
                >
                  <option value="Manual Lessons">Manual Lessons</option>
                  <option value="Automatic Lessons">Automatic Lessons</option>
                  <option value="Intensive Course">Intensive Course</option>
                  <option value="Advanced Training">Advanced Training</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">
                  Your Message *
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required 
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber transition-colors bg-background resize-none"
                  placeholder="Tell us about your driving experience or any questions you have..."
                />
              </div>

              <Button 
                type="submit"
                size="lg" 
                disabled={isSubmitting}
                className="w-full bg-amber hover:bg-amber-dark text-charcoal font-display font-semibold uppercase tracking-wider text-sm h-12"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {contactMode === 'booking' ? 'Confirm Booking Request' : 'Send Message'}
                  </>
                )}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                By clicking confirm, you agree to our terms and conditions.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDialog(false)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-charcoal p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-amber" />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wider">Confirm Booking</h3>
                </div>
                <p className="text-white/60 text-sm">Please review your lesson details below.</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-sm border border-border">
                    <div className="w-8 h-8 rounded-sm bg-amber/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Date & Time</p>
                      <p className="text-charcoal font-display font-bold text-lg">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM do')}
                      </p>
                      <p className="text-amber-dark font-bold">at {selectedTime}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-sm border border-border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Duration</p>
                      <p className="text-charcoal font-bold text-sm">
                        {durations.find(d => d.value === selectedDuration)?.label}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-sm border border-border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Service</p>
                      <p className="text-charcoal font-bold text-sm">{formData.service}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-border">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Location</p>
                    <p className="text-charcoal font-bold text-sm">{formData.address1 ? `${formData.address1}, ` : ''}{formData.city}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-sm border border-border">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Student</p>
                    <p className="text-charcoal font-bold text-sm">{formData.name}</p>
                    <p className="text-muted-foreground text-xs">{formData.email}</p>
                  </div>

                  {formData.message && (
                    <div className="p-3 bg-slate-50 rounded-sm border border-border">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Message</p>
                      <p className="text-charcoal text-xs italic line-clamp-3">"{formData.message}"</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-border hover:bg-slate-50 text-charcoal font-bold uppercase tracking-wider text-xs h-12"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-amber hover:bg-amber-dark text-charcoal font-bold uppercase tracking-wider text-xs h-12"
                    onClick={confirmBooking}
                    disabled={isSubmitting}
                  >
                    Confirm & Book
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && lastBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessDialog(false)}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden border border-amber/20"
            >
              <div className="bg-emerald-500 p-8 text-center text-white relative">
                <button 
                  onClick={() => setShowSuccessDialog(false)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-wider mb-2">Booking Confirmed!</h3>
                <p className="text-white/80 text-sm">Your lesson has been scheduled in our system. Kaz will reach out shortly for final confirmation.</p>
              </div>

              <div className="p-8">
                <div className="bg-slate-50 border border-border rounded-sm p-6 mb-8 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/10 border border-amber/20 rounded-full mb-3">
                    <CalendarIcon className="w-3 h-3 text-amber" />
                    <span className="text-[10px] font-bold text-amber uppercase tracking-widest">Scheduled Event</span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-charcoal mb-1">
                    {format(parse(lastBooking.date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM do')}
                  </h4>
                  <p className="text-charcoal/60 font-bold text-lg mb-4">
                    at {lastBooking.time} ({durations.find(d => d.value === lastBooking.duration)?.label})
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-charcoal/5 rounded-sm text-[10px] font-bold text-charcoal/60 uppercase">{lastBooking.service}</span>
                    <span className="px-3 py-1 bg-charcoal/5 rounded-sm text-[10px] font-bold text-charcoal/60 uppercase">{lastBooking.city}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black text-charcoal/40 tracking-[0.2em] text-center mb-4">Add to your calendar</p>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-slate-50 text-charcoal font-bold uppercase tracking-wider text-[10px] h-12 gap-2"
                      onClick={() => {
                        const event = {
                          title: `Driving Lesson with PSL Academy`,
                          description: `Driving lesson with Kaz at PSL Driving Academy. Service: ${lastBooking.service}.`,
                          location: lastBooking.city,
                          startDate: parse(`${lastBooking.date} ${lastBooking.time}`, 'yyyy-MM-dd HH:mm', new Date()),
                          durationInHours: lastBooking.duration / 60
                        };
                        window.open(generateGoogleCalendarUrl(event), '_blank');
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-2.22 5.38-7.84 5.38-4.84 0-8.78-4.01-8.78-8.96s3.94-8.96 8.78-8.96c2.75 0 4.59 1.15 5.65 2.14l2.58-2.5c-1.66-1.55-3.82-2.5-8.23-2.5C5.39 0 0 5.37 0 12s5.39 12 12.48 12c7.4 0 12.31-5.2 12.31-12.55 0-.85-.09-1.5-.21-2.13h-12.02z"/>
                      </svg>
                      Google Calendar
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-slate-50 text-charcoal font-bold uppercase tracking-wider text-[10px] h-12 gap-2"
                      onClick={() => {
                        const event = {
                          title: `Driving Lesson with PSL Academy`,
                          description: `Driving lesson with Kaz at PSL Driving Academy. Service: ${lastBooking.service}.`,
                          location: lastBooking.city,
                          startDate: parse(`${lastBooking.date} ${lastBooking.time}`, 'yyyy-MM-dd HH:mm', new Date()),
                          durationInHours: lastBooking.duration / 60
                        };
                        window.open(generateOutlookCalendarUrl(event), '_blank');
                      }}
                    >
                      <Share2 className="w-4 h-4 text-sky-500" />
                      Outlook / Live
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-border hover:bg-slate-50 text-charcoal font-bold uppercase tracking-wider text-[10px] h-12 gap-2"
                    onClick={() => {
                      const event = {
                        title: `Driving Lesson with PSL Academy`,
                        description: `Driving lesson with Kaz at PSL Driving Academy. Service: ${lastBooking.service}.`,
                        location: lastBooking.city,
                        startDate: parse(`${lastBooking.date} ${lastBooking.time}`, 'yyyy-MM-dd HH:mm', new Date()),
                        durationInHours: lastBooking.duration / 60
                      };
                      const link = document.createElement('a');
                      link.href = generateIcsFile(event);
                      link.download = 'psl-driving-lesson.ics';
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    Download Apple / iCal (.ics)
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-border space-y-3">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">Need to make a change?</p>
                    <div className="flex w-full gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-amber/30 text-amber hover:bg-amber hover:text-charcoal font-bold uppercase tracking-wider text-xs h-12 gap-2"
                        onClick={handleReschedule}
                      >
                        <CalendarPlus className="w-4 h-4" />
                        Reschedule
                      </Button>
                      <Button
                        className="flex-1 bg-charcoal hover:bg-charcoal-light text-white font-bold uppercase tracking-wider text-xs h-12"
                        onClick={() => setShowSuccessDialog(false)}
                      >
                        Close & Finish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </section>
  );
}
