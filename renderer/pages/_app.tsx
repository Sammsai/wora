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
  const [windowOpacity, setWindowOpacity] = useState(100);

  const isSpecialLayout = SPECIAL_LAYOUTS.includes(router.pathname);

  useEffect(() => {
    window.ipc.invoke("getActionsData").then((response) => {
      if (response?.isMaximized !== undefined) {
        setIsMaximized(response.isMaximized);
      }
      if (
        response?.windowOpacity !== undefined &&
        response?.windowOpacity !== null
      ) {
        setWindowOpacity(response.windowOpacity);
      }
    });

    const unsubscribeMaximized = window.ipc.on(
      "window-maximized-change",
      (maximized: boolean) => {
        setIsMaximized(maximized);
      },
    );

    const unsubscribeOpacity = window.ipc.on(
      "window-opacity-change",
      (opacity: number) => {
        setWindowOpacity(opacity);
      },
    );

    const unsubscribeSettings = window.ipc.on(
      "confirmSettingsUpdate",
      (settings: any) => {
        if (
          settings?.windowOpacity !== undefined &&
          settings?.windowOpacity !== null
        ) {
          setWindowOpacity(settings.windowOpacity);
        }
      },
    );

    const handleLocalOpacity = (e: CustomEvent<number>) => {
      if (typeof e.detail === "number") {
        setWindowOpacity(e.detail);
      }
    };
    window.addEventListener(
      "wora-opacity-change",
      handleLocalOpacity as EventListener,
    );

    return () => {
      if (unsubscribeMaximized) unsubscribeMaximized();
      if (unsubscribeOpacity) unsubscribeOpacity();
      if (unsubscribeSettings) unsubscribeSettings();
      window.removeEventListener(
        "wora-opacity-change",
        handleLocalOpacity as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (!isSpecialLayout) {
      Promise.all([
        window.ipc
          .invoke("getSettings")
          .then((settings) => {
            if (
              settings?.windowOpacity !== undefined &&
              settings?.windowOpacity !== null
            ) {
              setWindowOpacity(settings.windowOpacity);
            }
          })
          .catch((err) => console.error("Error loading settings:", err)),
        window.ipc
          .invoke("getRandomLibraryItems")
          .catch((err) => console.error("Error loading library items:", err)),
      ]).catch((err) => console.error("Error in data preloading:", err));
    }
  }, [isSpecialLayout, router.pathname]);

  const mainContainerClasses = cn(
    "relative h-dvh w-dvw overflow-hidden bg-white text-xs text-black antialiased select-none dark:bg-black dark:text-white",
    isMaximized ? "rounded-none" : "rounded-lg",
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

            <div className="flex h-full gap-8">
              <div className="sticky top-0 z-50 h-full p-8 pt-12 pr-0">
                <Navbar />
              </div>

              <div className="h-full grow p-8 pt-12 pl-0">
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
