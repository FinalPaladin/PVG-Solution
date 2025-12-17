// src/components/common/SelectBox.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  id: string | number;
  name: string;
};

interface SelectBoxProps {
  label: string;
  value?: string;
  placeholder?: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SelectBox({
  label,
  value,
  placeholder = "Chọn...",
  options,
  onChange,
  disabled,
}: SelectBoxProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.id} value={String(o.id)}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
