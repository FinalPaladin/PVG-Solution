import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

import { Button } from "@/components/ui/button";
import { mediaImageUpload } from "@/api/requestCustomer";
import "./editor.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function NewsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),

      Link,

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Image.configure({
        inline: false,
      }),

      Placeholder.configure({
        placeholder: "Nhập nội dung tin tức...",
      }),
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      handlePaste(_, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
          if (item.type.startsWith("image")) {
            const file = item.getAsFile();
            if (file) uploadImage(file);
            return true;
          }
        }
        return false;
      },

      handleDrop(_, event) {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const file = files[0];
        if (file.type.startsWith("image")) {
          uploadImage(file);
          return true;
        }
        return false;
      },
    },
  });

  // Sync value -> editor
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const uploadImage = async (file: File) => {
    if (file.size > MAX_IMAGE_SIZE) {
      alert("Ảnh vượt quá 5MB");
      return;
    }

    const res = await mediaImageUpload(file);
    if (res.isSuccess && res.result) {
      editor?.chain().focus().setImage({ src: res.result.publicUrl }).run();
    }
  };

  // ✅ GIỮ SCROLL KHI CHẠY COMMAND
  const withPreserveScroll = (fn: () => void) => {
    const container = document.querySelector(
      ".editor-scroll"
    ) as HTMLElement | null;

    if (!container) {
      fn();
      return;
    }

    const scrollTop = container.scrollTop;
    fn();

    requestAnimationFrame(() => {
      container.scrollTop = scrollTop;
    });
  };

  if (!editor) return null;

  const runCommand = (command: () => void) => {
    withPreserveScroll(() => {
      command();
    });
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border rounded-md p-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBold().run())
          }
        >
          B
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleItalic().run())
          }
        >
          I
        </Button>

        {[1, 2, 3, 4, 5, 6].map((level) => (
          <Button
            key={level}
            size="sm"
            variant="outline"
            onClick={() =>
              runCommand(() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: level as 1 | 2 | 3 | 4 | 5 | 6,
                  })
                  .run()
              )
            }
          >
            H{level}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBulletList().run())
          }
        >
          • List
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleOrderedList().run())
          }
        >
          1. List
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().toggleBlockquote().run())
          }
        >
          Quote
        </Button>

        {/* Text Align */}
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().setTextAlign("left").run())
          }
        >
          Left
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().setTextAlign("center").run()
            )
          }
        >
          Center
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().setTextAlign("right").run())
          }
        >
          Right
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() =>
              editor.chain().focus().setTextAlign("justify").run()
            )
          }
        >
          Justify
        </Button>

        {/* Image */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => document.getElementById("editorUpload")?.click()}
        >
          Ảnh
        </Button>

        <input
          id="editorUpload"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
        />

        {/* Color */}
        <input
          type="color"
          className="h-8 w-8 cursor-pointer rounded border"
          onChange={(e) =>
            runCommand(() =>
              editor.chain().focus().setColor(e.target.value).run()
            )
          }
        />

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            runCommand(() => editor.chain().focus().unsetColor().run())
          }
        >
          Clear color
        </Button>
      </div>

      {/* Editor */}
      <div className="editor-scroll rounded-md border h-[400px] overflow-y-auto p-3">
        <div className="max-w-none">
          <EditorContent editor={editor} className="tiptap" />
        </div>
      </div>
    </div>
  );
}
