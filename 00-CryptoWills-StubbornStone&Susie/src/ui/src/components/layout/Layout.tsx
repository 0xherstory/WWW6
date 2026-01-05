import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children: ReactNode;
  showFooter?: boolean;
}

export function Layout({ children, showFooter = true }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
