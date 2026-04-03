import { OutputData } from "@editorjs/editorjs";

export function renderBlocks(data: OutputData): string {
  return data.blocks
    .map((block) => {
      switch (block.type) {
        case "header":
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;

        case "paragraph":
          return `<p>${block.data.text}</p>`;

        case "list":
          const tag = block.data.style === "ordered" ? "ol" : "ul";
          const items = block.data.items
            .map((item: string) => `<li>${item}</li>`)
            .join("");
          return `<${tag}>${items}</${tag}>`;

        case "checklist":
          const checks = block.data.items
            .map(
              (item: { text: string; checked: boolean }) =>
                `<div class="checklist-item">
                  <span class="check">${item.checked ? "☑" : "☐"}</span>
                  <span${item.checked ? ' class="checked"' : ""}>${item.text}</span>
                </div>`
            )
            .join("");
          return `<div class="checklist">${checks}</div>`;

        case "quote":
          return `<blockquote>
            <p>${block.data.text}</p>
            ${block.data.caption ? `<cite>${block.data.caption}</cite>` : ""}
          </blockquote>`;

        case "code":
          return `<pre><code>${block.data.code}</code></pre>`;

        case "delimiter":
          return `<hr />`;

        case "image":
          return `<figure>
            <img src="${block.data.file?.url || block.data.url}" alt="${block.data.caption || ""}" />
            ${block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : ""}
          </figure>`;

        case "table":
          const rows = block.data.content
            .map((row: string[], i: number) => {
              const cellTag = block.data.withHeadings && i === 0 ? "th" : "td";
              const cells = row.map((cell: string) => `<${cellTag}>${cell}</${cellTag}>`).join("");
              return `<tr>${cells}</tr>`;
            })
            .join("");
          return `<table>${rows}</table>`;

        case "embed":
          return `<div class="embed">
            <iframe src="${block.data.embed}" width="${block.data.width || 600}" height="${block.data.height || 400}" frameborder="0" allowfullscreen></iframe>
            ${block.data.caption ? `<p class="embed-caption">${block.data.caption}</p>` : ""}
          </div>`;

        default:
          return `<p>${JSON.stringify(block.data)}</p>`;
      }
    })
    .join("\n");
}