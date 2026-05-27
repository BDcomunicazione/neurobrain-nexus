import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion } from "framer-motion";
import { Send, BrainCircuit, Cpu, ShieldCheck, Sparkles, Mic, Database, Zap, Globe2 } from "lucide-react";
import "./style.css";

function NeuroBrainNexusApp() {
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState([
    { role: "brain", text: "Sistema attivo. Sono NeuroBrain Nexus: sono pronto a rispondere alle tue domande." }
  ]);
  const [avatarReply, setAvatarReply] = useState("Sistema attivo. Sono pronto a rispondere.");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarImage, setAvatarImage] = useState("https://i.postimg.cc/g0j1wpLW/668f803e-7fcc-41b9-a8de-f344bb4d19bf.png");
  const [mode, setMode] = useState("general");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const particles = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 4,
    size: 1 + Math.random() * 3
  })), []);

  async function getAIReply(input) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, mode, history: messages.slice(-8) })
      });

      if (!response.ok) throw new Error("API non collegata");
      const data = await response.json();
      if (data?.reply) return data.reply;
      throw new Error("Risposta vuota");
    } catch {
      return generateDemoReply(input);
    }
  }

  function generateDemoReply(input) {
    const q = input.toLowerCase();

    if (["ciao", "buongiorno", "buonasera", "salve", "hey"].some((word) => q.includes(word))) {
      return "Ciao, sono NeuroBrain Nexus. Sono pronto: puoi farmi una domanda, chiedermi un’idea, un testo, una spiegazione o una strategia.";
    }

    if (q.includes("chi sei") || q.includes("cosa sei")) {
      return "Sono un assistente virtuale con volto AI. Questa versione è pronta per collegarsi a ChatGPT tramite API.";
    }

    if (mode === "casentino" || q.includes("casentino") || q.includes("negozi") || q.includes("shopping")) {
      return "Sono in modalità Casentino Shopping AI: posso aiutare gli utenti a trovare negozi, offerte, eventi, contatti, servizi e informazioni utili sulle attività del territorio.";
    }

    if (q.includes("grafica") || q.includes("post") || q.includes("social")) {
      return "Per la grafica e i social posso aiutarti a creare testi, idee visive, slogan, promozioni, caption e concept pubblicitari più efficaci.";
    }

    return "Ho ricevuto la tua domanda. Se la chiave OpenAI è collegata su Netlify, risponderò con ChatGPT vero; altrimenti uso questa risposta demo.";
  }

  useEffect(() => {
    if (!voiceEnabled || !avatarReply || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(
      avatarReply
        .replace(/\.{3,}/g, ".")
        .replace(/AI/gi, "A I")
        .replace(/ChatGPT/gi, "Chat G P T")
    );

    utterance.lang = "it-IT";
    utterance.pitch = 0.92;
    utterance.rate = 0.98;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const italianVoices = voices.filter(v => v.lang.toLowerCase().startsWith("it"));
    const preferredVoice =
      italianVoices.find(v => /google italiano|google italia|microsoft diego|microsoft cosimo/i.test(v.name)) ||
      italianVoices.find(v => /natural|premium|enhanced/i.test(v.name)) ||
      italianVoices.find(v => /google|microsoft/i.test(v.name)) ||
      italianVoices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);

    return () => {
      synth.cancel();
      setIsSpeaking(false);
    };
  }, [avatarReply, voiceEnabled]);

  async function handleAsk(e) {
    e?.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    setAvatarReply("Sto elaborando la tua domanda...");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: cleanQuestion },
      { role: "brain", text: "Sto elaborando la tua domanda..." }
    ]);
    setQuestion("");
    setThinking(true);

    const reply = await getAIReply(cleanQuestion);
    setAvatarReply(reply);
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { role: "brain", text: reply };
      return updated;
    });
    setThinking(false);
  }

  return (
    <div className="app-shell">
      <div className="bg-grid" />

      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="particle"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [-16, 18, -16], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: 4 + (p.id % 5), delay: p.delay, repeat: Infinity }}
        />
      ))}

      <div className="content">
        <header className="header">
          <div className="brand-row">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
              <BrainCircuit className="brand-icon" />
            </motion.div>
            <div>
              <h1>NEUROBRAIN NEXUS</h1>
              <p>Cervello tecnologico virtuale 3D • AI Assistant Experience</p>
            </div>
          </div>

          <div className="badge-row">
            <button onClick={() => setMode(mode === "general" ? "casentino" : "general")}>
              <Badge icon={<Zap />} text={mode === "general" ? "AI GENERALE" : "CASENTINO AI"} />
            </button>
            <button onClick={() => setVoiceEnabled(!voiceEnabled)}>
              <Badge icon={<Mic />} text={voiceEnabled ? "VOICE ON" : "VOICE OFF"} />
            </button>
            <Badge icon={<Globe2 />} text="API READY" />
          </div>
        </header>

        <main className="main-grid">
          <section className="avatar-section">
            <div className="section-label">Humanoid AI Interface</div>
            <div className="online-badge">ONLINE</div>

            <motion.div className="avatar-orbit" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }}>
              <motion.div className="orbit orbit-1" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
              <motion.div className="orbit orbit-2" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />

              <div className="avatar-card">
                <motion.img
                  src={avatarImage}
                  alt="Volto umanoide realistico NeuroBrain"
                  className="avatar-img"
                  animate={isSpeaking ? {
                    scale: [1.1, 1.115, 1.105, 1.12, 1.1],
                    y: [0, -1.5, 1.5, -1, 0],
                    filter: ["brightness(0.9)", "brightness(1)", "brightness(0.95)", "brightness(1.05)", "brightness(0.9)"]
                  } : { scale: [1.1, 1.105, 1.1], y: [0, -1, 0] }}
                  transition={{ duration: isSpeaking ? 0.35 : 4, repeat: Infinity }}
                />

                <div className="avatar-overlay" />
               

               

                <motion.div
                  className="avatar-reply"
                  animate={{ scale: thinking ? [1, 1.03, 1] : 1 }}
                  transition={{ duration: 0.8, repeat: thinking ? Infinity : 0 }}
                >
                  <div className="reply-head">
                    <span>NeuroBrain sta rispondendo</span>
                    <small>{voiceEnabled ? "VOCE ON" : "VOCE OFF"}</small>
                  </div>
                  <p>{avatarReply}</p>
                 <div className="mt-4 flex items-end justify-center gap-[4px] h-10">
  {Array.from({ length: 32 }).map((_, i) => (
    <motion.div
      key={i}
      className="w-[4px] rounded-full bg-gradient-to-t from-cyan-400 via-blue-400 to-fuchsia-400"
      animate={isSpeaking ? {
        height: [6, 18 + (i % 7) * 4, 10, 30, 8]
      } : {
        height: 6
      }}
      transition={{
        duration: 0.45 + i * 0.015,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  ))}

                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>

          <aside className="side-panel">
            <div className="control-panel">
              <div className="top-actions">
                <label>
                  Carica il mio volto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result;
                        if (typeof result === "string") {
                          setAvatarImage(result);
                          setUploadedFileName(file.name);
                          setAvatarReply("Volto aggiornato. Ora sto usando la tua immagine come avatar della demo.");
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>

                <button onClick={() => setMode(mode === "general" ? "casentino" : "general")}>
                  {mode === "general" ? "Attiva Casentino AI" : "Modalità Casentino AI"}
                </button>
              </div>

              {uploadedFileName && <div className="upload-ok">Volto caricato: {uploadedFileName}</div>}

              <h2><Sparkles /> Interroga il cervello</h2>

              <div className="chat-log">
                {messages.map((m, i) => (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
                    <small>{m.role === "user" ? "Tu" : "NeuroBrain"}</small>
                    <p>{m.text}</p>
                  </motion.div>
                ))}
                {thinking && <div className="thinking">NeuroBrain sta elaborando...</div>}
              </div>

              <form onSubmit={handleAsk} className="ask-form">
                <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Scrivi una domanda..." />
                <button type="submit">INVIA <Send size={18} /></button>
              </form>
            </div>

            <div className="info-grid">
              <Info icon={<Cpu />} title="Motore AI" text="Endpoint /api/chat pronto" />
              <Info icon={<Database />} title="Memoria" text="Database e cronologia" />
              <Info icon={<ShieldCheck />} title="Controllo" text="Risposte filtrate" />
              <Info icon={<BrainCircuit />} title="Personalità" text="Assistente su misura" />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Badge({ icon, text }) {
  return <div className="badge">{icon}{text}</div>;
}

function Info({ icon, title, text }) {
  return <div className="info-card"><div>{icon}</div><strong>{title}</strong><span>{text}</span></div>;
}

createRoot(document.getElementById("root")).render(<NeuroBrainNexusApp />);
