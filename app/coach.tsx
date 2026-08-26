'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import interviewContent from '../content/questions.json';

type Question = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type Deck = {
  id: string;
  label: string;
  locale: string;
  name: string;
  description: string;
  categories: Record<string, string>;
  questions: Question[];
};

type Copy = {
  eyebrow: string;
  lede: string;
  publicTemplate: string;
  audioCount: string;
  privateData: string;
  language: string;
  category: string;
  playQuestion: string;
  playAnswer: string;
  stop: string;
  showAnswer: string;
  hideAnswer: string;
  exampleAnswer: string;
  answerNotice: string;
  previous: string;
  next: string;
  markComplete: string;
  completed: string;
  localProgress: string;
  audioReady: string;
  browserVoice: string;
  loading: string;
  playing: string;
  keyboard: string;
  privacy: string;
  disclosure: string;
};

const COPY: Record<string, Copy> = {
  ja: {
    eyebrow: 'オープンソース · プライバシー重視 · 多言語対応',
    lede: '汎用質問、AI生成音声、ブラウザー音声フォールバックを使って、大学院・研究・就職面接を練習できます。',
    publicTemplate: '公開テンプレート',
    audioCount: '54 本のAI音声',
    privateData: '実在の個人情報なし',
    language: '言語',
    category: 'カテゴリー',
    playQuestion: '質問を再生',
    playAnswer: '回答例を再生',
    stop: '停止',
    showAnswer: '回答例を表示',
    hideAnswer: '回答例を隠す',
    exampleAnswer: '汎用回答例',
    answerNotice: 'これは架空の構成例です。本番では必ず自分の経験と根拠に置き換えてください。',
    previous: '前の質問',
    next: '次の質問',
    markComplete: '練習済みにする',
    completed: '練習済み',
    localProgress: '進捗はこのブラウザー内だけに保存されます。',
    audioReady: '高品質 MP3',
    browserVoice: 'ブラウザー音声',
    loading: '音声を読み込み中',
    playing: '再生中',
    keyboard: 'ショートカット: ← / → で移動、Space で質問を再生',
    privacy: 'APIキーをブラウザーに入力しないでください。音声生成はローカルのコマンドラインで行います。',
    disclosure: '収録MP3はOpenAIの音声合成で生成されたAI音声です。',
  },
  en: {
    eyebrow: 'OPEN SOURCE · PRIVACY-FIRST · MULTILINGUAL',
    lede: 'Practice graduate, research, and job interviews with reusable prompts, AI-generated audio, and a browser-voice fallback.',
    publicTemplate: 'PUBLIC TEMPLATE',
    audioCount: '54 AI AUDIO CLIPS',
    privateData: 'NO REAL PERSONAL DATA',
    language: 'LANGUAGE',
    category: 'CATEGORY',
    playQuestion: 'Play question',
    playAnswer: 'Play sample answer',
    stop: 'Stop',
    showAnswer: 'Show sample answer',
    hideAnswer: 'Hide sample answer',
    exampleAnswer: 'GENERIC SAMPLE ANSWER',
    answerNotice: 'This is a fictional structure example. Replace it with your own experience and evidence before a real interview.',
    previous: 'Previous',
    next: 'Next',
    markComplete: 'Mark as practiced',
    completed: 'Practiced',
    localProgress: 'Progress is stored only in this browser.',
    audioReady: 'High-quality MP3',
    browserVoice: 'Browser voice',
    loading: 'Loading audio',
    playing: 'Playing',
    keyboard: 'Shortcuts: ← / → to navigate, Space to play the question',
    privacy: 'Never enter an API key in this website. Generate audio from the local command line.',
    disclosure: 'Bundled MP3 files are AI-generated voices created with OpenAI text-to-speech.',
  },
  zh: {
    eyebrow: '开源 · 隐私优先 · 多语言',
    lede: '使用通用问题、AI生成音频和浏览器语音回退功能，练习研究生、科研与求职面试。',
    publicTemplate: '公开模板',
    audioCount: '54 段AI音频',
    privateData: '不含真实个人信息',
    language: '语言',
    category: '分类',
    playQuestion: '播放问题',
    playAnswer: '播放示例回答',
    stop: '停止',
    showAnswer: '显示示例回答',
    hideAnswer: '隐藏示例回答',
    exampleAnswer: '通用示例回答',
    answerNotice: '这是虚构的结构示例，正式面试前请务必替换为你自己的经历和依据。',
    previous: '上一题',
    next: '下一题',
    markComplete: '标记为已练习',
    completed: '已练习',
    localProgress: '进度只保存在当前浏览器中。',
    audioReady: '高质量 MP3',
    browserVoice: '浏览器语音',
    loading: '正在加载音频',
    playing: '正在播放',
    keyboard: '快捷键：← / → 切题，空格播放问题',
    privacy: '请勿在网页中输入API密钥。音频应在本地命令行中生成。',
    disclosure: '项目内置MP3由OpenAI语音合成生成，属于AI音频。',
  },
};

const decks = interviewContent.decks as Deck[];

function audioUrl(deckId: string, questionId: string, answer = false) {
  const suffix = answer ? '-a' : '';
  return new URL(`audio/${deckId}/${questionId}${suffix}.mp3`, document.baseURI).href;
}

export default function CoachApp() {
  const [deckId, setDeckId] = useState(decks[0].id);
  const [category, setCategory] = useState('all');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [audioKind, setAudioKind] = useState<'question' | 'answer' | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [usingBrowserVoice, setUsingBrowserVoice] = useState(false);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const playTokenRef = useRef(0);

  const deck = useMemo(() => decks.find((item) => item.id === deckId) ?? decks[0], [deckId]);
  const copy = COPY[deck.id] ?? COPY.en;
  const filteredQuestions = useMemo(
    () => category === 'all' ? deck.questions : deck.questions.filter((item) => item.category === category),
    [category, deck],
  );
  const question = filteredQuestions[questionIndex] ?? filteredQuestions[0] ?? deck.questions[0];
  const completedInDeck = deck.questions.filter((item) => completed.includes(item.id)).length;

  const stopPlayback = useCallback(() => {
    playTokenRef.current += 1;
    const player = playerRef.current;
    if (player) {
      player.pause();
      player.removeAttribute('src');
      player.load();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setAudioState('idle');
    setAudioKind(null);
    setAudioProgress(0);
    setUsingBrowserVoice(false);
  }, []);

  useEffect(() => {
    const player = new Audio();
    player.preload = 'metadata';
    playerRef.current = player;
    const updateProgress = () => {
      if (Number.isFinite(player.duration) && player.duration > 0) {
        setAudioProgress((player.currentTime / player.duration) * 100);
      }
    };
    const finish = () => {
      setAudioState('idle');
      setAudioKind(null);
      setAudioProgress(0);
    };
    player.addEventListener('timeupdate', updateProgress);
    player.addEventListener('ended', finish);
    return () => {
      player.pause();
      player.removeEventListener('timeupdate', updateProgress);
      player.removeEventListener('ended', finish);
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const saved = window.localStorage.getItem('openinterview-completed');
      if (saved) timer = setTimeout(() => setCompleted(JSON.parse(saved) as string[]), 0);
    } catch {
      // The coach still works when storage is blocked.
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('openinterview-completed', JSON.stringify(completed));
    } catch {
      // Progress persistence is optional.
    }
  }, [completed]);

  function changeDeck(nextDeckId: string) {
    setCategory('all');
    setQuestionIndex(0);
    setAnswerVisible(false);
    stopPlayback();
    setDeckId(nextDeckId);
  }

  function changeCategory(nextCategory: string) {
    setQuestionIndex(0);
    setAnswerVisible(false);
    stopPlayback();
    setCategory(nextCategory);
  }

  const speakWithBrowser = useCallback((text: string, token: number) => {
    if (!('speechSynthesis' in window)) {
      setAudioState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = deck.locale;
    utterance.onend = () => {
      if (token !== playTokenRef.current) return;
      setAudioState('idle');
      setAudioKind(null);
      setUsingBrowserVoice(false);
    };
    utterance.onerror = utterance.onend;
    setUsingBrowserVoice(true);
    setAudioState('playing');
    window.speechSynthesis.speak(utterance);
  }, [deck.locale]);

  const playAudio = useCallback(async (kind: 'question' | 'answer') => {
    stopPlayback();
    const token = playTokenRef.current;
    const text = kind === 'question' ? question.question : question.answer;
    const player = playerRef.current;
    setAudioKind(kind);
    setAudioState('loading');
    if (!player) {
      speakWithBrowser(text, token);
      return;
    }
    player.src = audioUrl(deck.id, question.id, kind === 'answer');
    try {
      await player.play();
      if (token === playTokenRef.current) setAudioState('playing');
    } catch {
      player.removeAttribute('src');
      if (token === playTokenRef.current) speakWithBrowser(text, token);
    }
  }, [deck.id, question, speakWithBrowser, stopPlayback]);

  const go = useCallback((direction: number) => {
    stopPlayback();
    setAnswerVisible(false);
    setQuestionIndex((current) => {
      const count = filteredQuestions.length;
      return (current + direction + count) % count;
    });
  }, [filteredQuestions.length, stopPlayback]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('button, input, textarea, select, a')) return;
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
      if (event.key === ' ') {
        event.preventDefault();
        void playAudio('question');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, playAudio]);

  function toggleCompleted() {
    setCompleted((current) => current.includes(question.id)
      ? current.filter((id) => id !== question.id)
      : [...current, question.id]);
  }

  const isCompleted = completed.includes(question.id);
  const audioLabel = usingBrowserVoice
    ? copy.browserVoice
    : audioState === 'loading'
      ? copy.loading
      : audioState === 'playing'
        ? copy.playing
        : copy.audioReady;

  return (
    <main className="site-shell">
      <header className="masthead">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>OpenInterview<br />Coach</h1>
          <p className="lede">{copy.lede}</p>
        </div>
        <div className="issue-box" aria-label="Project status">
          <span>{copy.publicTemplate}</span>
          <strong>{copy.audioCount}</strong>
          <small>{copy.privateData}</small>
        </div>
      </header>

      <section className="control-strip" aria-label="Practice settings">
        <div className="control-group">
          <span className="label">{copy.language}</span>
          <div className="tab-row" role="tablist">
            {decks.map((item) => (
              <button
                aria-selected={item.id === deck.id}
                className={item.id === deck.id ? 'tab active' : 'tab'}
                data-testid={`deck-${item.id}`}
                key={item.id}
                onClick={() => changeDeck(item.id)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group category-control">
          <label className="label" htmlFor="category-select">{copy.category}</label>
          <select id="category-select" onChange={(event) => changeCategory(event.target.value)} value={category}>
            {Object.entries(deck.categories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <p className="counter">{String(questionIndex + 1).padStart(2, '0')} / {String(filteredQuestions.length).padStart(2, '0')}</p>
      </section>

      <section className="deck-intro">
        <div>
          <p className="label">{deck.name}</p>
          <p>{deck.description}</p>
        </div>
        <div className="progress-copy">
          <strong>{completedInDeck} / {deck.questions.length}</strong>
          <span>{copy.completed}</span>
        </div>
      </section>

      <article className="question-card" data-testid="question-card">
        <div className="card-meta">
          <span>Q{String(questionIndex + 1).padStart(2, '0')}</span>
          <span>{deck.categories[question.category]}</span>
          <span>{question.id}</span>
        </div>
        <h2>{question.question}</h2>
        <div className="audio-status" aria-live="polite">
          <span className={audioState === 'playing' ? 'status-square live' : 'status-square'} />
          <span>{audioLabel}{audioKind ? ` · ${audioKind === 'question' ? 'Q' : 'A'}` : ''}</span>
          <div className="audio-progress" aria-hidden="true"><span style={{ width: `${audioProgress}%` }} /></div>
        </div>
        <div className="action-row">
          <button className="primary-action" data-testid="play-question" onClick={() => void playAudio('question')} type="button">▶ {copy.playQuestion}</button>
          <button className="secondary-action" onClick={() => void playAudio('answer')} type="button">▶ {copy.playAnswer}</button>
          <button className="secondary-action" onClick={stopPlayback} type="button">■ {copy.stop}</button>
          <button className="secondary-action" onClick={() => setAnswerVisible((value) => !value)} type="button">
            {answerVisible ? copy.hideAnswer : copy.showAnswer}
          </button>
        </div>
        <section className="answer-sheet" hidden={!answerVisible}>
          <p className="label">{copy.exampleAnswer}</p>
          <p>{question.answer}</p>
          <p className="answer-notice">{copy.answerNotice}</p>
        </section>
        <div className="question-navigation">
          <button className="nav-action" onClick={() => go(-1)} type="button">← {copy.previous}</button>
          <button aria-pressed={isCompleted} className={isCompleted ? 'complete-action active' : 'complete-action'} onClick={toggleCompleted} type="button">
            {isCompleted ? '■' : '□'} {isCompleted ? copy.completed : copy.markComplete}
          </button>
          <button className="nav-action" onClick={() => go(1)} type="button">{copy.next} →</button>
        </div>
      </article>

      <aside className="notice-grid">
        <section><p className="label">PRIVACY</p><p>{copy.privacy}</p></section>
        <section><p className="label">AI AUDIO</p><p>{copy.disclosure}</p></section>
        <section><p className="label">LOCAL PROGRESS</p><p>{copy.localProgress}</p></section>
      </aside>

      <footer className="site-footer">
        <p>{copy.keyboard}</p>
        <p><a href="https://github.com/Fengmc2001/OpenInterview-Coach">GitHub</a><span aria-hidden="true"> · </span>MIT / CC BY 4.0</p>
      </footer>
    </main>
  );
}
