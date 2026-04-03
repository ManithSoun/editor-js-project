"use client";

import React, { useState } from "react";
import { EditorProps } from "./types";
import { useEditor } from "./useEditor";
import { OutputData } from "@editorjs/editorjs";

const EDITOR_HOLDER_ID = "editorjs";

interface FullEditorProps extends EditorProps {
  onPublish?: (data: OutputData) => void;
}

export function Editor({ initialData, onChange, placeholder, onPublish }: FullEditorProps) {
  const [savedData, setSavedData] = useState<OutputData | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const { save } = useEditor({
    holderId: EDITOR_HOLDER_ID,
    initialData,
    onChange,
    placeholder,
  });

  const handleSave = async () => {
    const data = await save();
    if (data) {
      setSavedData(data);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    }
  };

  const handlePublish = async () => {
    const data = await save();
    if (data && onPublish) {
      onPublish(data);
    }
  };

  return (
    <div>
      <div className="rounded-lg border border-gray-200 p-4">
        <div id={EDITOR_HOLDER_ID} />
        <div className="mt-4 flex items-center justify-end gap-3">
          {showSaved && (
            <span className="text-sm text-green-600">Saved!</span>
          )}
          <button
            onClick={handleSave}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Save Draft
          </button>
          {onPublish && (
            <button
              onClick={handlePublish}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {savedData && (
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-semibold text-gray-500">
            Output JSON:
          </h3>
          <pre className="max-h-96 overflow-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
            {JSON.stringify(savedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}