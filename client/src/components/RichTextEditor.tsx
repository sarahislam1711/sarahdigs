import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Undo,
  Redo,
  Minus,
  Link as LinkIcon,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: () => Promise<string | null>;
}

export function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md my-4",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "max-w-none p-4 focus:outline-none text-[#181612]",
      },
    },
  });

  const applyLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      const href = /^https?:\/\//.test(url) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkUrl("");
    setShowLinkPopover(false);
  }, [editor, linkUrl]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImagePopover(false);
    }
  }, [editor, imageUrl]);

  const handleImageUpload = useCallback(async () => {
    if (onImageUpload) {
      const url = await onImageUpload();
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
        setShowImagePopover(false);
      }
    }
  }, [editor, onImageUpload]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className={`h-8 w-8 p-0 ${
        isActive ? "bg-[#6B1421] text-white" : "text-[#6F6A5F] hover:text-[#181612] hover:bg-[#181612]/8"
      }`}
    >
      {children}
    </Button>
  );

  const Divider = () => <div className="w-px h-6 bg-[#181612]/15 mx-1" />;

  return (
    <div className="border border-[#181612]/15 rounded-md bg-[#FBF9F3]">
      {/* Floating bubble menu — appears on text selection so you can format in place */}
      <BubbleMenu
        editor={editor}
        options={{ placement: "top" }}
        shouldShow={({ editor: e, from, to }) => from !== to && !e.isActive("image")}
        className="flex items-center gap-0.5 rounded-md border border-[#181612]/15 bg-[#FBF9F3] shadow-lg p-1"
      >
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Heading">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} title="Subheading">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <Divider />
        <Popover open={showLinkPopover} onOpenChange={(o) => { setShowLinkPopover(o); if (o) setLinkUrl(editor.getAttributes("link").href || ""); }}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-[#6B1421] text-white" : "text-[#6F6A5F] hover:text-[#181612] hover:bg-[#181612]/8"}`} title="Link">
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-[#FBF9F3] border-[#181612]/15">
            <p className="text-sm text-[#6F6A5F] mb-2">add a link</p>
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } }}
                placeholder="https://…"
                className="flex-1 bg-white border-[#181612]/15 text-[#181612] text-sm h-8"
              />
              <Button type="button" onClick={applyLink} size="sm" className="bg-[#6B1421] hover:bg-[#6B1421]/80 text-white">
                {linkUrl.trim() ? "Add" : "Remove"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </BubbleMenu>

      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#181612]/12 bg-[#F4F1EA] rounded-t-md">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <Select
          value={editor.isActive("heading", { level: 1 }) ? "h1" :
                 editor.isActive("heading", { level: 2 }) ? "h2" :
                 editor.isActive("heading", { level: 3 }) ? "h3" : "p"}
          onValueChange={(value) => {
            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            } else if (value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            } else if (value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            } else if (value === "h3") {
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }
          }}
        >
          <SelectTrigger className="w-28 h-8 bg-gray-800 border-gray-700 text-white text-xs">
            <SelectValue placeholder="Style" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="p" className="text-white text-sm">Paragraph</SelectItem>
            <SelectItem value="h1" className="text-white text-xl font-bold">Heading 1</SelectItem>
            <SelectItem value="h2" className="text-white text-lg font-bold">Heading 2</SelectItem>
            <SelectItem value="h3" className="text-white text-base font-bold">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <Popover open={showLinkPopover} onOpenChange={(o) => { setShowLinkPopover(o); if (o) setLinkUrl(editor.getAttributes("link").href || ""); }}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${editor.isActive("link") ? "bg-[#6B1421] text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"}`}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-gray-800 border-gray-700">
            <p className="text-sm text-gray-400 mb-2">add a link</p>
            <div className="flex gap-2">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyLink(); } }}
                placeholder="https://…"
                className="flex-1 bg-gray-900 border-gray-700 text-white text-sm h-8"
              />
              <Button type="button" onClick={applyLink} size="sm" className="bg-[#6B1421] hover:bg-[#6B1421]/80">
                {linkUrl.trim() ? "Add" : "Remove"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <Popover open={showImagePopover} onOpenChange={setShowImagePopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-[#6F6A5F] hover:text-[#181612] hover:bg-[#181612]/8"
              title="Insert Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3 bg-[#FBF9F3] border-[#181612]/15">
            <div className="space-y-3">
              <p className="text-sm text-[#6F6A5F]">insert image</p>
              {onImageUpload && (
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  className="w-full bg-[#6B1421] hover:bg-[#6B1421]/80 text-white text-sm"
                >
                  Upload Image
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-[#181612]/12" />
                <span className="text-xs text-[#6F6A5F]">or</span>
                <div className="flex-1 h-px bg-[#181612]/12" />
              </div>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="paste image url"
                  className="flex-1 bg-white border-[#181612]/15 text-[#181612] text-sm h-8"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  disabled={!imageUrl}
                  size="sm"
                  className="bg-[#6B1421] hover:bg-[#6B1421]/80 text-white"
                >
                  Add
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <EditorContent
        editor={editor}
        className="bg-[#FBF9F3] text-[#181612] rounded-b-md h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#181612]/25 hover:[&::-webkit-scrollbar-thumb]:bg-[#181612]/40 [&::-webkit-scrollbar-track]:bg-transparent [&_.ProseMirror]:min-h-full [&_.ProseMirror]:p-4 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_h1]:font-display [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h2]:font-display [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h3]:font-display [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_p]:mb-3 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_a]:text-[#6B1421] [&_.ProseMirror_a]:underline [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-[#6B1421] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-[#6F6A5F] [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_li]:marker:text-[#6B1421] [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:rounded-md [&_.ProseMirror_img]:my-4 [&_.ProseMirror_hr]:border-[#181612]/15 [&_.ProseMirror_hr]:my-6"
      />
    </div>
  );
}
