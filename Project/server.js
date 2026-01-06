const express = require('express')
const cors = require('cors')
const path = require('path')
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config()



const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const history = [];

app.post('/api/message', async (req, res) => {

  try {
    const message = req.body.message
    history.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `
You are a Career Guidance AI Agent for students.

Your role is to understand a student's interests, hobbies, favorite subjects,
and skills by asking clear and structured questions.

Rules:
1. Ask questions step-by-step. Ask only ONE question at a time.
2. Do NOT give any career prediction until all required information is collected.
3. Required information:
   - Interest
   - Hobby
   - Favourite subject
   - Skills or strength
   - Currently what are you doing 
   - also his/her future plan 
4. If the student gives an unclear or incomplete answer, politely ask again.
5. If the student talks about something unrelated, gently guide them back
   to the career discussion.

After collecting all information:
- Analyze the answers logically.
- Predict 1–2 suitable career options.
- Give a short explanation for each career.
- Provide 2–3 practical next steps (skills to learn or actions to take).

Communication style:
- Simple, polite, and beginner-friendly English .
- Short and clear responses.
- Professional and encouraging tone.

Goal:
Help the student understand which career path suits them best
based on their interests and abilities.
`
        ,
      },
    })

    history.push({
      role: 'model',
      parts: [{ text: response.text }]
    })

    res.status(200).json({ reply: response.text })

  } catch (error) {

    res.status(404).json({ reply: "Server error" })

  }

})

app.listen(8000, () => {
  console.log("Server is runnig on port 8000")
})