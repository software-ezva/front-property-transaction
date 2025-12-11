import { useState } from "react";
import { X, Save } from "lucide-react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

interface InlineAddFormProps {
  placeholder: string;
  onAdd: (value: string) => Promise<void>;
  onCancel: () => void;
}

export default function InlineAddForm({
  placeholder,
  onAdd,
  onCancel,
}: InlineAddFormProps) {
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setIsSaving(true);
    try {
      await onAdd(value);
      setValue("");
      onCancel();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md bg-card p-2 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-9"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onCancel();
        }}
      />
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={!value.trim() || isSaving}
        className="h-9 w-9 p-0"
      >
        <Save className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="h-9 w-9 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
