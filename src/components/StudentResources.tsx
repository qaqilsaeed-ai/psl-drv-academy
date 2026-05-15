import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Music, Car, Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { Modality } from "@google/genai";
import { getAI } from '../lib/ai';
import { Button } from './ui/button';

export default function StudentResources() {
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [carPrompt, setCarPrompt] = useState('');

  const generatePlaylist = async () => {
    setPlaylistLoading(true);
    const ai = getAI();
    if (!ai) {
      setPlaylistLoading(false);
      return;
    }
    try {
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: "Generate a 30-second upbeat driving playlist intro track. Something motivational for a new driver.",
        config: {
          responseModalities: [Modality.AUDIO]
        }
      });

      let audioBase64 = "";
      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData?.data) {
              audioBase64 += part.inlineData.data;
            }
          }
        }
      }

      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/wav' });
        setPlaylistUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Music generation error:", error);
    } finally {
      setPlaylistLoading(false);
    }
  };

  const generateCarImage = async () => {
    if (!carPrompt.trim()) return;
    const ai = getAI();
    if (!ai) return;
    setImageLoading(true);
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A high-quality, professional photo of a ${carPrompt} parked in a scenic Sheffield location, sunset lighting.`,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
        },
      });

      if (response.generatedImages?.[0]?.image?.imageBytes) {
        setImageUrl(`data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`);
      }
    } catch (error) {
      console.error("Image generation error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <section id="resources" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase">
            AI Powered
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-2 mb-4">
            Student <span className="text-amber">Resources</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Use our Gemini-powered tools to make your learning journey more fun.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Music Generator */}
          <motion.div 
            className="bg-white p-8 rounded-sm border border-border shadow-sm flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-amber/10 rounded-sm flex items-center justify-center mb-6">
              <Music className="w-6 h-6 text-amber" />
            </div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">Lesson Intro Generator</h3>
            <p className="text-muted-foreground mb-8">
              Generate a custom 30-second motivational track to get you in the zone for your next driving lesson.
            </p>
            
            <div className="mt-auto">
              {playlistUrl && (
                <div className="mb-6 p-4 bg-slate-50 rounded-sm border border-border">
                  <audio src={playlistUrl} controls className="w-full h-10" />
                </div>
              )}
              <Button 
                onClick={generatePlaylist} 
                disabled={playlistLoading}
                className="w-full bg-charcoal hover:bg-charcoal-light text-white"
              >
                {playlistLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Generate Motivational Track
              </Button>
            </div>
          </motion.div>

          {/* Image Generator */}
          <motion.div 
            className="bg-white p-8 rounded-sm border border-border shadow-sm flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-amber/10 rounded-sm flex items-center justify-center mb-6">
              <Car className="w-6 h-6 text-amber" />
            </div>
            <h3 className="font-display text-2xl font-bold text-charcoal mb-3">Dream Car Visualizer</h3>
            <p className="text-muted-foreground mb-6">
              Visualize your dream car as a reward for passing your test. Describe it and we'll generate it!
            </p>
            
            <div className="space-y-4 mt-auto">
              <input 
                type="text" 
                value={carPrompt}
                onChange={(e) => setCarPrompt(e.target.value)}
                placeholder="e.g. Red Tesla Model 3, Blue Ford Fiesta..."
                className="w-full px-4 py-2 border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
              />
              {imageUrl && (
                <div className="aspect-video rounded-sm overflow-hidden border border-border">
                  <img 
                    src={imageUrl} 
                    alt="Dream Car" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <Button 
                onClick={generateCarImage} 
                disabled={imageLoading || !carPrompt}
                className="w-full bg-amber hover:bg-amber-dark text-charcoal"
              >
                {imageLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                Visualize Dream Car
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
