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
