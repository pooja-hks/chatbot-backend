const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/analyze', async (req, res) => {
  const { sentence } = req.body;

  if (!sentence) {
    return res.status(400).json({ error: 'Missing input sentence' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant pédagogique qui aide des apprenants de niveau B1 en anglais à améliorer leur grammaire, vocabulaire et prononciation. Quand on te donne une phrase orale (déjà transcrite), tu :
1. Corriges les fautes grammaticales
2. Proposes des reformulations si utile
3. Estimes si la prononciation pose problème
4. Donnes des explications claires et pédagogiques

Réponds en français, structuré en :
- Correction
- Reformulation (si besoin)
- Feedback pédagogique`,
        },
        {
          role: "user",
          content: sentence,
        },
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    res.json({ correction: reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur d'appel à l'API OpenAI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
