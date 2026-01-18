import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import CustomCursor from "./components/CustomCursor";
import Index from "./pages/Index";
import MomoDex from "./pages/MomoDex";
import MintMomo from "./pages/MintMomo";
import Profile from "./pages/Profile";
import MoMoverse from "./pages/MoMoverse";
import Market from "./pages/Market";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CustomCursor />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/momo-dex" element={<MomoDex />} />
              <Route path="/mint" element={<MintMomo />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/momoverse" element={<MoMoverse />} />
              <Route path="/market" element={<Market />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
            © 2026 MoMo Club. All rights reserved.
          </footer>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
