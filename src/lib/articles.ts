import { OutputData } from "@editorjs/editorjs";
import { Article } from "../components/types";

const STORAGE_KEY = "editorjs-articles";

export function getArticles(): Article[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getArticle(id: string): Article | undefined {
  return getArticles().find((a) => a.id === id);
}

export function saveArticle(content: OutputData, id?: string): Article {
  const articles = getArticles();
  const title = extractTitle(content);
  const excerpt = extractExcerpt(content);
  const now = new Date().toISOString();

  if (id) {
    const index = articles.findIndex((a) => a.id === id);
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        title,
        excerpt,
        content,
        updatedAt: now,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
      return articles[index]
    }
  }

  const article: Article = {
    id: crypto.randomUUID(),
    title,
    excerpt,
    content,
    createAt: now,
    updatedAt: now
  }

  articles.unshift(article);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  return article
}

export function deleteArticle(id: string): void {
  const articles = getArticles().filter((a) => a.id != id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
}

function extractTitle(data: OutputData): string {
  const header = data.blocks.find((b) => b.type === "header");
  if (header) return stripHtml(header.data.text);
  const paragraph = data.blocks.find((b) => b.type === "paragraph");
  if (paragraph) return stripHtml(paragraph.data.text).slice(0, 60) + "...";
  return "Untitled";
}

function extractExcerpt(data: OutputData): string {
  const paragraph = data.blocks.find((b) => b.type === "paragraph");
  if (paragraph) return stripHtml(paragraph.data.text).slice(0, 150) + "...";
  return "No content";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}