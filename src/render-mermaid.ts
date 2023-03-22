import path from 'node:path';
import fs from 'node:fs/promises';
import playwright from 'playwright';
import type mermaidAPI from 'mermaid';

declare global {
  interface Window {
    mermaid: mermaidAPI
  }
}

export default async function renderMermaid({ config, code }: any) {
  const browser = await playwright.chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const content = await fs.readFile(
    path.join(process.cwd(), 'node_modules/mermaid/dist/mermaid.min.js'),
    'utf8',
  );

  await page.addScriptTag({ content });

  const result: {
    status: string;
    error?: Error;
    message?: string;
    svgCode?: string;
  } = await page.evaluate(
    ([diagramCode]) => {
      window.mermaid.initialize({});

      try {
        /* Render the mermaid diagram */
        const svgCode = window.mermaid.mermaidAPI.render('diagram', diagramCode);
        return { status: 'success', svgCode };
      } catch (error) {
        return { status: 'error', error, message: error.message };
      }
    },
    [code]
  );

  await browser.close();
  
  if (result.status === 'success' && typeof result.svgCode === 'string') {
    return result.svgCode;
  }

  return false;
}