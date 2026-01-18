import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { WalletButton } from "@/components/WalletButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <span className="text-lg font-semibold">
          Legacy<span className="text-primary">.eth</span>
        </span>
      </Link>
      <WalletButton />
    </header>
  );
}
