import { OutputData } from "@editorjs/editorjs";
import EditorJS from "@editorjs/editorjs";

export interface EditorProps {
  initialData?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
}

export type EditorInstance = EditorJS | null;

export interface Article {
  id: string;
  title: string
  excerpt: string
  content: OutputData
  createAt: string
  updatedAt: string
}