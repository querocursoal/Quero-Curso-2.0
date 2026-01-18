
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { DEFAULT_WHATSAPP_NUMBER, DEFAULT_HERO_SLIDES, DEFAULT_INSTAGRAM_URL, DEFAULT_LINKEDIN_URL } from '../constants';
import { HeroSlide } from '../types';
import { supabase } from '../lib/supabaseClient';

interface Settings {
  whatsappNumber: string;
  lowStockThreshold: number; // Fixed number threshold
  heroSlides: HeroSlide[];
  instagramUrl: string;
  facebookUrl: string; // Kept for retro-compatibility, but not used.
  linkedinUrl: string;
  siteLogoUrl: string;
  footerLogoUrl: string;
}

interface SettingsContextType {
  settings: Settings;
  saveSettings: (newSettings: Settings) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  lowStockThreshold: 5,
  heroSlides: DEFAULT_HERO_SLIDES,
  instagramUrl: DEFAULT_INSTAGRAM_URL,
  facebookUrl: '', // Defaulting to empty
  linkedinUrl: DEFAULT_LINKEDIN_URL,
  siteLogoUrl: '',
  footerLogoUrl: '',
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // 1. Try to load from Session Storage for instant render
        const cached = sessionStorage.getItem('site_settings');
        if (cached) {
          try {
            setSettings(JSON.parse(cached));
            setLoading(false);
          } catch (e) {
            console.error("Error parsing cached settings");
          }
        }

        // 2. Fetch from Supabase for fresh data
        const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching settings:", error.message);
          if (!cached) setSettings(defaultSettings);
        } else if (data) {
          const mappedSettings: Settings = {
            whatsappNumber: data.whatsappnumber || defaultSettings.whatsappNumber,
            lowStockThreshold: data.lowstockthreshold || defaultSettings.lowStockThreshold,
            heroSlides: Array.isArray(data.heroslides) ? data.heroslides : defaultSettings.heroSlides,
            instagramUrl: data.instagramurl || defaultSettings.instagramUrl,
            facebookUrl: data.facebookurl || defaultSettings.facebookUrl,
            linkedinUrl: data.linkedinurl || defaultSettings.linkedinUrl,
            siteLogoUrl: data.sitelogourl || defaultSettings.siteLogoUrl,
            footerLogoUrl: data.footerlogourl || defaultSettings.footerLogoUrl,
          };

          setSettings(mappedSettings);
          sessionStorage.setItem('site_settings', JSON.stringify(mappedSettings));
        } else {
          if (!cached) {
            console.log("No settings found, seeding with defaults.");
            await saveSettings(defaultSettings);
          }
        }
      } catch (err) {
        console.error("Unexpected error in fetchSettings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const saveSettings = async (newSettings: Settings): Promise<{ success: boolean; error?: string }> => {
    try {
      // Map Frontend (camelCase) to Database (lowercase)
      const dbData = {
        id: 1,
        whatsappnumber: newSettings.whatsappNumber,
        lowstockthreshold: newSettings.lowStockThreshold,
        heroslides: newSettings.heroSlides,
        instagramurl: newSettings.instagramUrl,
        facebookurl: newSettings.facebookUrl,
        linkedinurl: newSettings.linkedinUrl,
        sitelogourl: newSettings.siteLogoUrl,
        footerlogourl: newSettings.footerLogoUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('settings').upsert(dbData);

      if (error) {
        console.error("Error saving settings:", error.message);
        return { success: false, error: error.message };
      } else {
        setSettings(newSettings);
        // Update cache after successful save
        sessionStorage.setItem('site_settings', JSON.stringify(newSettings));
        return { success: true };
      }
    } catch (err: any) {
      console.error("Unexpected error saving settings:", err);
      return { success: false, error: err.message || 'Erro desconhecido' };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
