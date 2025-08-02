import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-30 h-30 animate-spin" />
    </div>
  );
};
