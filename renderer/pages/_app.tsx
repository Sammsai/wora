import "@/styles/globals.css";
import Actions from "@/components/ui/actions";
import Navbar from "@/components/main/navbar";
import Player from "@/components/main/player";
import { PlayerProvider } from "@/context/playerContext";
import { useRouter } from "next/router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/themeProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";
// import PageTransition from "@/components/PageTransition";  // Optional: Re-enable for transitions

const SPECIAL_LAYOUTS = ["/setup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const isSpecialLayout = SPECIAL_LAYOUTS.includes(router.pathname);

  useEffect(() => {
    window.ipc.invoke("getActionsData").then((response) => {
      if (response?.isMaximized !== undefined) {
        setIsMaximized(response.isMaximized);
      }
    });

    const unsubscribe = window.ipc.on(
      "window-maximized-change",
      (maximized: boolean) => {
        setIsMaximized(maximized);
      },
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSpecialLayout) {
      Promise.all([
        window.ipc
          .invoke("getSettings")
          .catch((err) => console.error("Error loading settings:", err)),
        window.ipc
          .invoke("getRandomLibraryItems")
          .catch((err) => console.error("Error loading library items:", err)),
      ]).catch((err) => console.error("Error in data preloading:", err));
    }
  }, [isSpecialLayout, router.pathname]);

  const mainContainerClasses = cn(
    "relative h-dvh w-dvw overflow-hidden bg-white text-xs text-black antialiased select-none dark:bg-black dark:text-white transition-[border-radius]",
    isMaximized
      ? "rounded-none border-none"
      : "rounded-2xl border border-black/10 dark:border-white/10",
  );

  if (isSpecialLayout) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className={mainContainerClasses}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <PlayerProvider>
        <main className={mainContainerClasses}>
          <div className="h-full w-full">
            <Actions />
            <Toaster position="top-right" />

            <div className="flex gap-8">
              <div className="sticky top-0 z-50 h-dvh p-8 pt-12 pr-0">
                <Navbar />
              </div>

              <div className="h-dvh grow p-8 pt-12 pl-0">
                <div className="wora-transition relative flex h-full w-full flex-col">
                  <ScrollArea
                    ref={scrollAreaRef}
                    className="h-full w-full mask-b-from-40%"
                  >
                    <ErrorBoundary>
                      <Component {...pageProps} />
                      <div className="h-[20vh] w-full" />
                    </ErrorBoundary>
                  </ScrollArea>

                  <Player />
                </div>
              </div>
            </div>
          </div>
        </main>
      </PlayerProvider>
    </ThemeProvider>
  );
}
