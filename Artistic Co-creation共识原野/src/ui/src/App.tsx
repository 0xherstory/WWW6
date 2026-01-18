import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Publish from "./pages/Publish";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 text-primary cursor-pointer hover:opacity-80 transition-opacity">
            <Hexagon className="w-8 h-8 fill-primary/20 stroke-primary stroke-[1.5]" />
            <span className="font-bold text-xl tracking-tight text-foreground uppercase">
              Artistic <span className="font-light opacity-50">Co-creation</span>
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
           <Link href="/login">
             <Button variant="ghost" className="font-mono text-xs uppercase tracking-widest">登录</Button>
           </Link>
           <Link href="/register">
             <Button className="font-mono text-xs uppercase tracking-widest bg-primary text-primary-foreground">注册</Button>
           </Link>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/publish" component={Publish} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
          <Navbar />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
