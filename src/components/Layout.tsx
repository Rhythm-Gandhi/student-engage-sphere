
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 md:py-0 md:px-8 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with 💖 by the Student Tech Team. © {new Date().getFullYear()} Campus Events Portal.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
