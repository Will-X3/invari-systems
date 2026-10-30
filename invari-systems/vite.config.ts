import { defineConfig, type Plugin } from 'vite';
import { renderBody, renderHead } from './src/page';

/** Injects the build-time rendered page into index.html (dev and build). */
function staticPage(): Plugin {
  return {
    name: 'invari-static-page',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('<!--head-->', renderHead()).replace('<!--app-->', renderBody());
      },
    },
  };
}

export default defineConfig({
  plugins: [staticPage()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 0,
  },
});
