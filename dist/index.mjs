import {visit as $hgUW1$visit} from "unist-util-visit";
import {cwd as $hgUW1$cwd} from "process";
import $hgUW1$nodepath from "node:path";
import $hgUW1$nodefspromises from "node:fs/promises";
import $hgUW1$playwright from "playwright";






async function $3b3adf5e97fa5fd8$export$2e2bcd8739ae039({ config: config , code: code  }) {
    const browser = await (0, $hgUW1$playwright).chromium.launch({
        args: [
            "--no-sandbox",
            "--no-first-run"
        ]
    });
    const page = await browser.newPage();
    const content = await (0, $hgUW1$nodefspromises).readFile((0, $hgUW1$nodepath).join($hgUW1$cwd(), "node_modules/mermaid/dist/mermaid.js"), "utf8");
    await page.addScriptTag({
        content: content
    });
    const result = await page.evaluate(({ config: config , code: string  })=>{
        window.mermaid.initialize(config);
        try {
            /* Render the mermaid diagram */ const svgCode = window.mermaid.mermaidAPI.render("diagram", code);
            return {
                status: "success",
                svgCode: svgCode
            };
        } catch (error) {
            return {
                status: "error",
                error: error,
                message: error.message
            };
        }
    }, {
        config: config,
        code: code
    });
    await browser.close();
    if (result.status === "success" && typeof result.svgCode === "string") return result.svgCode;
    return false;
}


const $149c1bd638913645$var$style = `display: flex; justify-content: center; width: 100%;`;
function $149c1bd638913645$var$plugin() {
    return async function transformer(ast) {
        const instances = [];
        (0, $hgUW1$visit)(ast, {
            type: "code",
            lang: "mermaid"
        }, (node, index, parent)=>{
            instances.push([
                node,
                index,
                parent
            ]);
        });
        await Promise.all(instances.map(async ([node, index, parent])=>{
            const html = await (0, $3b3adf5e97fa5fd8$export$2e2bcd8739ae039)({
                config: {},
                code: node.value
            }).then((diagram)=>diagram);
            parent.children.splice(index, 1, {
                type: "html",
                value: `<div class="mermaid-diagram" style="${$149c1bd638913645$var$style}">${html}</div>`,
                position: node.position
            });
        }));
        return ast;
    };
}
var $149c1bd638913645$export$2e2bcd8739ae039 = $149c1bd638913645$var$plugin;


export {$149c1bd638913645$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=index.mjs.map
