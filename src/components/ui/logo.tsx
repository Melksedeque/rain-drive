import { CloudRain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, onClick }: { className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("flex items-center gap-2 font-bold text-xl cursor-pointer", className)}>
      <div className="p-1.5 bg-accent rounded-lg text-accent-fg">
        <CloudRain className="w-5 h-5" />
      </div>
      <span className="tracking-tight">RainDrive</span>
    </Link>
  );
}
