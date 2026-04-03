"use client";

import { useState, useEffect } from "react";
import { Editor } from "@/src/components";
import { ArticleCard } from "@/src/components/ArticleCard";
import { ArticlePreview } from "@/src/components/ArticlePreview";
import {
  getArticles,
  saveArticle,
  deleteArticle,
  getArticle,
} from "@/src/lib/articles";
import { Article } from "@/src/components/types";
import { OutputData } from "@editorjs/editorjs";

type View = "list" | "editor" | "preview";

export default function Home() {
  const [view, setView] = useState<View>("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [previewArticle, setPreviewArticle] = useState<Article | undefined>();
  const [initialData, setInitialData] = useState<OutputData | undefined>();
  const [editorKey, setEditorKey] = useState(0)

  useEffect(() => {
    setArticles(getArticles());
  }, []);

  const handleNew = () => {
    setEditingId(undefined);
    setInitialData(undefined);
    setEditorKey((prev) => prev + 1);
    setView("editor");
  };

  const handleEdit = (id: string) => {
    const article = getArticle(id);
    if (article) {
      setEditingId(id);
      setInitialData(article.content);
      setEditorKey((prev) => prev + 1);
      setView("editor");
    }
  };

  const handlePreview = (id: string) => {
    const article = getArticle(id);
    if (article) {
      setPreviewArticle(article);
      setView("preview");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this article?")) {
      deleteArticle(id);
      setArticles(getArticles());
    }
  };

  const handleSave = (data: OutputData) => {
    saveArticle(data, editingId);
    setArticles(getArticles());
    setView("list");
  };

  const handleBack = () => {
    setView("list");
  };

  if (view === "preview" && previewArticle) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <ArticlePreview
          article={previewArticle}
          onBack={handleBack}
          onEdit={handleEdit}
        />
      </main>
    );
  }

  if (view === "editor") {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <button
          onClick={handleBack}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to articles
        </button>
        <h1 className="text-2xl font-bold mb-4">
          {editingId ? "Edit Article" : "New Article"}
        </h1>
        <Editor
          key={editorKey}
          initialData={initialData}
          onPublish={handleSave}
        />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Articles</h1>
        <button
          onClick={handleNew}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New Article
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No articles yet</p>
          <p className="mt-1 text-sm">
            Click &quot;+ New Article&quot; to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}
    </main>
  );
}
