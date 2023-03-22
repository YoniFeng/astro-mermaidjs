import { visit } from 'unist-util-visit';
import renderDiagram from './render-mermaid';

const style = `display: flex; justify-content: center; width: 100%;`;

function plugin() {
  return async function transformer(ast) {
    const instances: any[] = [];
    visit(ast, { type: 'code', lang: 'mermaid' }, (node, index, parent) => {
      instances.push([node, index, parent]);
    });

    await Promise.all(
      instances.map(async ([node, index, parent]) => {
        const html = await renderDiagram({
          config: {},
          code: node.value,
        }).then(diagram => diagram);

        parent.children.splice(index, 1, {
          type: 'html',
          value: `<div class="mermaid-diagram" style="${style}">${html}</div>`,
          position: node.position,
        });
      }),
    );

    return ast;
  };
}

export default plugin;