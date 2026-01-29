/**
 * 背景音乐配置
 * 1. 设置环境变量 NEXT_PUBLIC_BGM_URL 可指定音乐（如 /audio/bgm.mp3 使用本地文件）
 * 2. 将 MP3 放入 public/audio/bgm.mp3 并设置 NEXT_PUBLIC_BGM_URL=/audio/bgm.mp3
 * 3. 或修改下方 DEFAULT_BGM_URL 为任意可访问的 MP3 直链
 */
// 默认背景音乐 URL，可替换为 Mixkit/Pixabay 等免费浪漫音乐直链
const DEFAULT_BGM_URL =
  "https://cdn.pixabay.com/audio/2022/05/27/audio_306c1e2c2e.mp3";

export const MUSIC_CONFIG = {
  audioSrc: process.env.NEXT_PUBLIC_BGM_URL || DEFAULT_BGM_URL
};
