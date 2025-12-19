import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { Button } from "@/components/ui/button";
import { mediaImageUpload } from "@/api/requestCustomer";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function NewsEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Nhập nội dung tin tức...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handlePaste(view, event) {
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

      handleDrop(view, event) {
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

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border rounded-md p-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Button>

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
      </div>

      {/* Editor */}
      <div className="rounded-md border p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
