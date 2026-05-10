import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// dev 限定: アタリ動画 (public/movie/mv.mp4) があれば
// .video__placeholder を <video> に差し替えて表示確認できるようにする。
// 本番ビルド (apply: 'build') には適用されない。
const localVideoPreview = {
  name: 'inject-local-video-preview',
  apply: 'serve',
  transformIndexHtml(html) {
    const moviePath = resolve(__dirname, 'public/movie/mv.mp4');
    if (!existsSync(moviePath)) return html;
    return html.replace(
      /<div class="video__placeholder"[^>]*><\/div>/,
      '<video class="video__placeholder" src="./movie/mv.mp4" muted autoplay loop playsinline style="object-fit:cover;"></video>'
    );
  },
};

export default defineConfig({
  base: './',
  publicDir: 'public',
  plugins: [localVideoPreview],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
  },
});
