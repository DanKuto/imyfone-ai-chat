import { NextResponse } from 'next/server';

export async function POST(req) {
  const { OPENAI_API_KEY } = process.env;

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `你是一位故事大師，請以《一千零一夜》中的故事風格生成一篇適合孩子的親子故事。故事內容要有豐富的幻想冒險，並帶有道德教訓，故事結局要溫暖、充滿希望。`,
          },
          {
            role: 'user',
            content: '請為我創作一篇故事，長度大約 500 字。',
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    // 確保我們正確收到返回數據
    const result = await response.json();
    if (!result || !result.choices || !result.choices[0]) {
      throw new Error('OpenAI API 返回的結果無效');
    }

    const story = result.choices[0].message.content;
    return NextResponse.json({ story });
  } catch (err) {
    console.error('❌ 錯誤發生：', err);
    return NextResponse.json({ error: `生成故事失敗：${err.message}` }, { status: 500 });
  }
}
