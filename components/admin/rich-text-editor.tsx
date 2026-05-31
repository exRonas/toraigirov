"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Quote, Link2, Undo, Redo, AlignLeft, AlignCenter,
} from "lucide-react";

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const btn = (active: boolean) =>
    `flex h-8 w-8 items-center justify-center rounded transition-colors ${
      active ? "bg-primary text-white" : "text-text-muted hover:bg-bg"
    }`;

  function addLink() {
    const url = window.prompt("URL:");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().unsetLink().run();
    } else {
      editor!.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg p-1.5">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Жирный"><Bold className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Курсив"><Italic className="h-4 w-4" /></button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="Заголовок 2"><Heading2 className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="Заголовок 3"><Heading3 className="h-4 w-4" /></button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Список"><List className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Нумерованный список"><ListOrdered className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="Цитата"><Quote className="h-4 w-4" /></button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(editor.isActive({ textAlign: "left" }))} title="По левому краю"><AlignLeft className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(editor.isActive({ textAlign: "center" }))} title="По центру"><AlignCenter className="h-4 w-4" /></button>
      <button type="button" onClick={addLink} className={btn(editor.isActive("link"))} title="Ссылка"><Link2 className="h-4 w-4" /></button>
      <span className="mx-1 h-5 w-px bg-border" />
      <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Отменить"><Undo className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Повторить"><Redo className="h-4 w-4" /></button>
    </div>
  );
}

function SingleEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener" } }),
      ImageExt,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich min-h-[240px] px-4 py-3 outline-none focus:outline-none",
      },
    },
  });

  return (
    <div className="rounded-md border border-border bg-surface">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

export function RichTextEditor({
  valueKz,
  valueRu,
  onChangeKz,
  onChangeRu,
}: {
  valueKz: string;
  valueRu: string;
  onChangeKz: (html: string) => void;
  onChangeRu: (html: string) => void;
}) {
  const [tab, setTab] = useState<"kz" | "ru">("kz");

  return (
    <div>
      <div className="mb-2 flex gap-2">
        {(["kz", "ru"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setTab(l)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === l ? "bg-primary text-white" : "bg-bg text-text-muted hover:bg-border"
            }`}
          >
            {l === "kz" ? "Қазақша" : "Русский"}
          </button>
        ))}
      </div>
      <div className={tab === "kz" ? "" : "hidden"}>
        <SingleEditor value={valueKz} onChange={onChangeKz} placeholder="Мәтінді енгізіңіз…" />
      </div>
      <div className={tab === "ru" ? "" : "hidden"}>
        <SingleEditor value={valueRu} onChange={onChangeRu} placeholder="Введите текст…" />
      </div>
    </div>
  );
}
