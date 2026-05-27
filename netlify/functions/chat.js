import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Metodo non consentito" }) };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: "OPENAI_API_KEY mancante su Netlify" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const mode = body.mode || "general";
    const history = Array.isArray(body.history) ? body.history : [];

    const systemPrompt = mode === "casentino"
      ? `Sei NeuroBrain Nexus in modalità Casentino Shopping AI.
Rispondi in italiano, in modo chiaro, elegante e utile.
Aiuti utenti e attività locali del Casentino con negozi, offerte, eventi, servizi, contatti e idee promozionali.
Non inventare dati specifici non forniti. Se non sai un'informazione, dillo e chiedi i dettagli necessari.`
      : `Sei NeuroBrain Nexus, un assistente AI futuristico ma professionale.
Rispondi in italiano, con tono chiaro, adulto, utile e diretto.
Aiuti con idee, testi, strategie, spiegazioni, grafica, social, app e comunicazione.
Non essere prolisso. Dai risposte concrete.`;

    const previousMessages = history.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text || ""
    }));

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...previousMessages,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 450
    });

    const reply = completion.choices?.[0]?.message?.content || "Non ho ricevuto una risposta valida.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore nella funzione chat", detail: error.message })
    };
  }
}
