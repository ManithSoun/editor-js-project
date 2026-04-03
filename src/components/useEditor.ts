import { useEffect, useCallback, useRef } from "react";
import type EditorJS from "@editorjs/editorjs";
import type { ToolConstructable } from "@editorjs/editorjs";
import { OutputData } from "@editorjs/editorjs";
import { EditorInstance } from "./types";
import { config } from "process";
import { url } from "inspector";
import { resolve } from "path";
import { rejects } from "assert";

interface UseEditorProps {
  holderId: string;
  initialData?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  storageKey?: string;
}

async function loadTools() {
  const [
    Header,
    List,
    Checklist,
    Quote,
    Code,
    Embed,
    Table,
    LinkTool,
    Marker,
    InlineCode,
    Delimiter,
    SimpleImage,
    Underline,
    ImageTool,
  ] = await Promise.all([
    import("@editorjs/header").then((m) => m.default),
    import("@editorjs/list").then((m) => m.default),
    import("@editorjs/checklist").then((m) => m.default),
    import("@editorjs/quote").then((m) => m.default),
    import("@editorjs/code").then((m) => m.default),
    import("@editorjs/embed").then((m) => m.default),
    import("@editorjs/table").then((m) => m.default),
    import("@editorjs/link").then((m) => m.default),
    import("@editorjs/marker").then((m) => m.default),
    import("@editorjs/inline-code").then((m) => m.default),
    import("@editorjs/delimiter").then((m) => m.default),
    import("@editorjs/simple-image").then((m) => m.default),
    import("@editorjs/underline").then((m) => m.default),
    import("@editorjs/image").then((m) => m.default),
  ]);

  return {
    header: {
      class: Header as unknown as ToolConstructable,
      config: { levels: [1, 2, 3, 4], defaultLevel: 2 },
      inlineToolbar: true,
    },
    list: { class: List as unknown as ToolConstructable, inlineToolbar: true },
    checklist: {
      class: Checklist as unknown as ToolConstructable,
      inlineToolbar: true,
    },
    quote: {
      class: Quote as unknown as ToolConstructable,
      inlineToolbar: true,
    },
    code: Code as unknown as ToolConstructable,
    embed: {
      class: Embed as unknown as ToolConstructable,
      config: { services: { youtube: true, vimeo: true, codepen: true } },
    },
    table: {
      class: Table as unknown as ToolConstructable,
      inlineToolbar: true,
    },
    linkTool: LinkTool as unknown as ToolConstructable,
    marker: Marker as unknown as ToolConstructable,
    inlineCode: InlineCode as unknown as ToolConstructable,
    delimiter: Delimiter as unknown as ToolConstructable,
    image: {
      class: ImageTool as unknown as ToolConstructable,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            const url = URL.createObjectURL(file);
            return {
              success: 1,
              file: { url },
            };
          },
          async uploadByUrl(url: string) {
            return {
              success: 1,
              file: { url },
            };
          },
        },
      },
    },
    underline: Underline as unknown as ToolConstructable,
  };
}

function getSavedData(key: string): OutputData | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useEditor({
  holderId,
  initialData,
  onChange,
  placeholder = "Start writing...",
  storageKey = "editorjs-data",
}: UseEditorProps) {
  const editorRef = useRef<EditorInstance>(null);
  const isReady = useRef(false);

  const handleSave = useCallback(async () => {
    if (!editorRef.current) return null;
    const data = await editorRef.current.save();
    localStorage.setItem(storageKey, JSON.stringify(data));
    onChange?.(data);
    return data;
  }, [onChange, storageKey]);

  useEffect(() => {
    if (isReady.current) return;

    let destroyed = false;

    const initEditor = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    
      const holder = document.getElementById(holderId);
      if (!holder || destroyed) return;
    
      holder.innerHTML = "";
    
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const tools = await loadTools();
    
      // Only use initialData (passed from parent), never load from localStorage for new articles
      if (destroyed) return;
    
      const editor = new EditorJS({
        holder: holderId,
        tools,
        data: initialData,
        placeholder,
        onChange: () => {
          handleSave();
        },
      });
    
      await editor.isReady;
    
      if (destroyed) {
        try { editor.destroy(); } catch {}
        return;
      }
    
      editorRef.current = editor;
      isReady.current = true;
    };
    initEditor();

    return () => {
      destroyed = true;
      const editor = editorRef.current;
      if (editor) {
        try {
          editor.destroy();
        } catch {}
      }
      editorRef.current = null;
      isReady.current = false;
    };
  }, [holderId, initialData, placeholder, handleSave, storageKey]);

  return { editorRef, save: handleSave };
}
