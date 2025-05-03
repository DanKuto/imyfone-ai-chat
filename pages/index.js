import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);

  const generateStory = async () => {
    setLoading(true);
    setStory('');

    try {
      // 1. 呼叫本地 API 產生故事
      const { data } = await axios.post('/api/story');
      setStory(data.story);

      // 2. 使用瀏覽器內建的 SpeechSynthesis 來讀出故事
      const newSpeech = new SpeechSynthesisUtterance();
      newSpeech.text = data.story;
      newSpeech.lang = 'zh-TW'; // 設定為中文
      newSpeech.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google 標準中文 女聲');
      newSpeech.rate = 1; // 語速設置（1為正常）
      newSpeech.pitch = 1; // 音調設置（1為正常）

      // 播放語音
      window.speechSynthesis.speak(newSpeech);
      setSpeech(newSpeech);
      setIsPlaying(true);
    } catch (err) {
      console.error('TTS 發生錯誤', err);
      alert('發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      // 暫停語音
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      // 繼續語音
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stopSpeech = () => {
    // 停止語音
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="container">
      <div className="button-container">
        <button
          onClick={generateStory}
          className="generate-button"
          disabled={loading}
        >
          {loading ? '生成中...' : '生成親子故事'}
        </button>

        <div className="audio-controls">
          <button
            onClick={toggleSpeech}
            className="control-button"
            disabled={!story}
          >
            {isPlaying ? '暫停' : '朗讀'}
          </button>
          <button
            onClick={stopSpeech}
            className="control-button"
            disabled={!story}
          >
            停止
          </button>
        </div>
      </div>

      {story && <div className="story-container">{story}</div>}
    </div>
  );
}
