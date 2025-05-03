// pages/api/story.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: '請幫我寫一篇約500字的親子故事，要有想像力、有溫暖結局，適合媽媽講給孩子聽。',
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
      });

      const story = completion.choices[0].message.content;
      res.status(200).json({ story });
    } catch (error) {
      console.error('❌ 故事生成失敗:', error);
      res.status(500).json({ error: '故事生成失敗' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
