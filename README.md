# Editor.js - Practice Project

### Create the Next.js Project

```bash
mkdir editor-js-project && cd editor-js-project
npx create-next-app@latest . --typescript --tailwind --app --eslint
```

### Install Editor.js Core + Plugins

```bash
npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/paragraph
```

### Install Additional Plugins

```bash
npm install @editorjs/checklist @editorjs/quote @editorjs/code @editorjs/embed \
  @editorjs/table @editorjs/link @editorjs/marker @editorjs/inline-code \
  @editorjs/delimiter @editorjs/simple-image @editorjs/underline @editorjs/image
```

### Run the Dev Server

```bash
npm run dev
```

Visit `http://localhost:3001`

## Build Order (Step by Step)

Follow this order — each step builds on the previous one.

### Phase 1: Editor Setup

1. **`src/types/editorjs.d.ts`** — Declare types for plugins that don't ship their own
2. **`src/components/types.ts`** — Define `EditorProps`, `EditorInstance`, `Article` types
3. **`src/components/useEditor.ts`** — Custom hook with:
   - Dynamic imports (Editor.js needs the browser DOM, can't run on server)
   - `loadTools()` function that imports all plugins via `Promise.all`
   - `useRef` to hold the editor instance
   - `useEffect` for initialization and cleanup
   - `handleSave` with `useCallback`
4. **`src/components/Editor.tsx`** — UI component that uses the hook
5. **`src/components/index.ts`** — Barrel export
6. **`src/app/page.tsx`** — Simple page that renders `<Editor />`

**Test:** Run `npm run dev`, visit localhost, make sure the editor loads with all block types.

### Phase 2: Article Management

7. **`src/components/types.ts`** — Add `Article` interface (id, title, excerpt, content, dates)
8. **`src/lib/articles.ts`** — CRUD helpers:
   - `getArticles()` — read all from localStorage
   - `getArticle(id)` — read one
   - `saveArticle(content, id?)` — create or update
   - `deleteArticle(id)` — remove
   - `extractTitle()` / `extractExcerpt()` — pull text from blocks
9. **`src/components/ArticleCard.tsx`** — Card component with edit/delete/preview buttons
10. **`src/app/page.tsx`** — Update to show article list with "New Article" button

**Test:** Create an article, see it in the list, edit it, delete it.

### Phase 3: Article Preview

11. **`src/lib/renderer.ts`** — Convert Editor.js JSON blocks to HTML strings
    - Handle each block type: header, paragraph, list, checklist, quote, code, delimiter, image, table, embed
12. **`src/components/ArticlePreview.tsx`** — Render article as formatted HTML
13. **`src/app/page.tsx`** — Add preview view (click article card → preview)
14. **`src/app/globals.css`** — Add `.article-preview` styles for headings, quotes, code, tables, etc.

**Test:** Create an article with different block types, click it, see the formatted preview.

---

## Key Concepts Learned

### Why `"use client"`?

Editor.js needs browser APIs (DOM). Next.js renders on the server by default. `"use client"` tells Next.js to run the component in the browser only.

### Why `useRef` instead of `useState`?

We store the Editor.js instance in a ref because we don't want React to re-render when the editor is created. We just need to hold onto it for cleanup.

### Why dynamic imports?

Editor.js and its plugins access browser globals like `Element` and `document`. If imported at the top level, they run on the server and crash. `await import()` inside `useEffect` ensures they only load in the browser.

### Why `as unknown as ToolConstructable`?

Editor.js plugin packages have mismatched TypeScript definitions. The plugins work fine at runtime, but TypeScript's type checker complains. This cast tells TypeScript to trust us.

### Why `Promise.all` for loading tools?

Loading 13 plugins one by one would be slow. `Promise.all` loads them all in parallel, so the editor initializes faster.

### Why barrel exports (`index.ts`)?

Instead of `import { Editor } from "@/components/Editor"`, you write `import { Editor } from "@/components"`. If you rename or restructure files later, only `index.ts` changes — every other import stays the same.

### Why separate `renderer.ts`?

The editor saves data as JSON blocks. To display articles to readers, you need to convert that JSON to HTML. Keeping this logic in its own file means you can reuse it anywhere (server-side rendering, API responses, etc.).

---

## Common Issues & Fixes

| Problem                          | Cause                                    | Fix                                              |
| -------------------------------- | ---------------------------------------- | ------------------------------------------------ |
| `Element is not defined`         | Editor.js running on server              | Use dynamic `import()` inside `useEffect`        |
| `'React' refers to a UMD global` | Missing React import                     | Add `import React from "react"`                  |
| Duplicate editor rendering       | React Strict Mode double-mount           | Clear `holder.innerHTML` + use `destroyed` flag  |
| `localStorage` quota exceeded    | Base64 images are too large              | Use `URL.createObjectURL` instead                |
| TypeScript errors on plugins     | Missing type declarations                | Add `declare module "@editorjs/..."`             |
| Heading sizes all the same       | Tailwind CSS reset strips heading styles | Add `!important` heading styles in `globals.css` |
