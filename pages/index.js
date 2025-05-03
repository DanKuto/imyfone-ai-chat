import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const generateStory = async () => {
    setLoading(true);
    setStory('');
    setAudioUrl('');

    try {
      // 1. 呼叫本地 API 產生故事
      const { data } = await axios.post('/api/story');
      setStory(data.story);

      // 2. 呼叫 TTS 伺服器生成語音
      const ttsRes = await fetch('https://storymama-tts-ready.vercel.app/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: data.story,
          voice: 'zh-TW-Wavenet-A', // 女聲、柔和
        }),
      });

      const tts = await ttsRes.json();

      if (tts.audioUrl) {
        setAudioUrl(tts.audioUrl);
      } else {
        alert('語音產生失敗');
      }
    } catch (err) {
      console.error('TTS 發生錯誤', err);
      alert('發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button
        onClick={generateStory}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? '生成中...' : '生成親子故事'}
      </button>

      {story && (
        <div className="bg-white p-4 border rounded mb-4 whitespace-pre-line">{story}</div>
      )}

      {audioUrl && (
        <audio controls autoPlay className="w-full">
          <source src={audioUrl} type="audio/mpeg" />
          您的瀏覽器不支援 audio 播放
        </audio>
      )}
    </div>
  );
}
