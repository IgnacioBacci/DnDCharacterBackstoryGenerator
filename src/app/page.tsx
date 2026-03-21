"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Plus, Trash2, Sparkles, Wand2, Shield, Heart, Skull, Zap } from "lucide-react";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

type CharacterClass = {
  name: string;
  level: string;
};

type BackstoryResult = {
  backstory: string;
  ideals: string;
  bonds: string;
  flaws: string;
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t = lang === "en" ? en : es;

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [classes, setClasses] = useState<CharacterClass[]>([{ name: "", level: "1" }]);
  const [background, setBackground] = useState("");
  const [pronouns, setPronouns] = useState("");
  
  // Optional fields
  const [subclasses, setSubclasses] = useState("");
  const [tone, setTone] = useState("");
  const [characters, setCharacters] = useState("");
  const [lifeEvents, setLifeEvents] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BackstoryResult | null>(null);

  const addClass = () => setClasses([...classes, { name: "", level: "1" }]);
  const removeClass = (index: number) => setClasses(classes.filter((_, i) => i !== index));
  const updateClass = (index: number, field: keyof CharacterClass, value: string) => {
    const newClasses = [...classes];
    newClasses[index][field] = value;
    setClasses(newClasses);
  };

  const generateBackstory = async () => {
    if (!name || !species || classes.some(c => !c.name) || !background || !pronouns) {
      alert(lang === "en" ? "Please fill all mandatory fields" : "Por favor rellena todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, species, classes, background, pronouns,
          subclasses, tone, characters, lifeEvents,
          language: lang
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t.title}</h1>
          <p style={{ color: '#94a3b8' }}>{t.subtitle}</p>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => setLang(lang === "en" ? "es" : "en")}
          style={{ padding: '0.5rem 1rem' }}
        >
          <Languages size={18} />
          {lang === "en" ? "Español" : "English"}
        </button>
      </header>

      <div className="glass-card">
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">{t.name} *</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.name} 
              value={name} 
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">{t.species} *</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.species} 
              value={species} 
              onChange={e => setSpecies(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">{t.class} *</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {classes.map((c, i) => (
              <div key={i} className="multiclass-item" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">{t.class} {i + 1}</label>
                  <input 
                    className="input-field" 
                    placeholder={t.placeholders.class} 
                    value={c.name} 
                    onChange={e => updateClass(i, "name", e.target.value)}
                  />
                </div>
                <div style={{ width: '100px' }}>
                  <label className="input-label">{t.level}</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    min="1" max="20" 
                    value={c.level} 
                    onChange={e => updateClass(i, "level", e.target.value)}
                  />
                </div>
                {classes.length > 1 && (
                  <button className="btn btn-secondary" onClick={() => removeClass(i)} style={{ color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button className="btn btn-secondary" onClick={addClass} style={{ alignSelf: 'flex-start' }}>
              <Plus size={18} /> {t.addClass}
            </button>
          </div>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">{t.background} *</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.background} 
              value={background} 
              onChange={e => setBackground(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">{t.pronouns} *</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.pronouns} 
              value={pronouns} 
              onChange={e => setPronouns(e.target.value)}
            />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '2rem 0' }} />
        
        <h3 style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>Optional Details</h3>
        
        <div className="grid-2">
          <div className="input-group">
            <label className="input-label">{t.subclass}</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.subclass} 
              value={subclasses} 
              onChange={e => setSubclasses(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">{t.tone}</label>
            <input 
              className="input-field" 
              placeholder={t.placeholders.tone} 
              value={tone} 
              onChange={e => setTone(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">{t.importantCharacters}</label>
          <textarea 
            className="input-field" 
            style={{ height: '80px', resize: 'none' }}
            placeholder={t.placeholders.importantCharacters + " (" + t.relationships + ")"} 
            value={characters} 
            onChange={e => setCharacters(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">{t.lifeEvents}</label>
          <textarea 
            className="input-field" 
            style={{ height: '80px', resize: 'none' }}
            placeholder={t.placeholders.lifeEvents} 
            value={lifeEvents} 
            onChange={e => setLifeEvents(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1rem', height: '3.5rem', fontSize: '1.1rem' }}
          disabled={loading}
          onClick={generateBackstory}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles size={20} />
              </motion.div>
              {t.generating}
            </>
          ) : (
            <><Wand2 size={20} /> {t.generate}</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="result-section"
          >
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Sparkles className="gradient-text" />
                <h2 className="heading-font">{t.backstory}</h2>
              </div>
              <p style={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#e2e8f0', lineHeight: '1.8' }}>
                {result.backstory}
              </p>

              <div className="grid-2" style={{ marginTop: '3rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#fbbf24' }}>
                    <Zap size={18} /> {t.ideals}
                  </h3>
                  <p style={{ color: '#cbd5e1' }}>{result.ideals}</p>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981' }}>
                    <Heart size={18} /> {t.bonds}
                  </h3>
                  <p style={{ color: '#cbd5e1' }}>{result.bonds}</p>
                </div>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)', marginTop: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ef4444' }}>
                  <Skull size={18} /> {t.flaws}
                </h3>
                <p style={{ color: '#cbd5e1' }}>{result.flaws}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem', paddingBottom: '2rem' }}>
        &copy; 2026 D&D Character Backstory Generator. Powered by AI.
      </footer>
    </main>
  );
}
