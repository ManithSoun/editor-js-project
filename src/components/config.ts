import type { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CheckList from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import SimpleImage from "@editorjs/simple-image";
import Underline from "@editorjs/underline";

export const EDITOR_TOOLS: Record<string, ToolConstructable | ToolSettings> = {
  header: {
    class: Header as unknown as ToolConstructable,
    config: {
      levels: [1, 2, 3, 4],
      defaultLevel: 2,
    },
    inlineToolbar: true,
  },
  list: {
    class: List as unknown as ToolConstructable,
    inlineToolbar: true,
  },
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
    config: {
      services: {
        youtube: true,
        vimeo: true,
        codepen: true,
      },
    },
  },
  table: {
    class: Table as unknown as ToolConstructable,
    inlineToolbar: true,
  },
  linkTool: LinkTool as unknown as ToolConstructable,
  marker: Marker as unknown as ToolConstructable,
  inlineCode: InlineCode as unknown as ToolConstructable,
  delimiter: Delimiter as unknown as ToolConstructable,
  image: SimpleImage as unknown as ToolConstructable,
  underline: Underline as unknown as ToolConstructable,
};