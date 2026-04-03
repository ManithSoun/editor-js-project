"use client";

import { Article } from "./types";
import { renderBlocks } from "../lib/renderer";

interface ArticlePreviewProps {
  article: Article;
  onBack: () => void;
  onEdit: (id: string) => void;
}

export function ArticlePreview({ article, onBack, onEdit }: ArticlePreviewProps) {
  const html = renderBlocks(article.content);
  const date = new Date(article.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to articles
        </button>
        <button
          onClick={() => onEdit(article.id)}
          className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Edit
        </button>
      </div>

      <article className="article-preview">
        <p className="text-sm text-gray-400 mb-8">{date}</p>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}