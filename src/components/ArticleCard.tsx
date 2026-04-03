"use client";

import { Article } from "./types";

interface ArticleCardProps {
  article: Article;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export function ArticleCard({ article, onEdit, onDelete, onPreview }: ArticleCardProps) {
  const date = new Date(article.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={() => onPreview(article.id)}
      className="rounded-lg border border-gray-200 p-5 hover:border-gray-300 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {article.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{article.excerpt}</p>
          <p className="mt-2 text-xs text-gray-400">Updated {date}</p>
        </div>
        <div className="ml-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(article.id)}
            className="rounded px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="rounded px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}