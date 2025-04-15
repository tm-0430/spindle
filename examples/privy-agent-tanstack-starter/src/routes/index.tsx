import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "~/components/Markdown";
import { readHomeMarkdownFile } from "~/functions/markdown";
import { ArrowUpIcon, Globe, Link2, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "@tanstack/react-router";
import { generateUUID } from "~/lib/utils";
import { checkAuthAndShowModal } from "~/utils/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    return {
      mdContent: await readHomeMarkdownFile(),
    };
  },
  loader: async ({ context, location }) => {
    const search = location.search as { errMsg?: string };

    if (typeof window !== "undefined") {
      const errMsg = search.errMsg;
      if (errMsg) {
        toast.error(errMsg);
      }
    }

    return context.mdContent;
  },
  component: Home,
});

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [researchMode, setResearchMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { authenticated, user } = usePrivy();
  const navigate = useNavigate();

  // Store authentication status for real-time checks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PRIVY_TEMP_AUTH_CHECK__ = { authenticated };
    }
  }, [authenticated]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Check authentication before submitting
      if (!checkAuthAndShowModal(() => handleSubmit())) {
        return;
      }
      
      try {
        setIsSubmitting(true);
        
        // Create a session ID with proper UUID format
        const sessionId = generateUUID();
        
        // Navigate to the chats page with only the initialPrompt parameter
        navigate({
          to: "/chats/$chatId",
          params: { chatId: sessionId },
          search: { 
            initialPrompt: inputValue
          }
        });
      } catch (error) {
        console.error("Error navigating to chat:", error);
        toast.error("An error occurred. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  // Keep the toggle for UI purposes only
  const toggleResearchMode = () => {
    setResearchMode(!researchMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Show login modal if user is not authenticated and starts typing
    if (!authenticated && e.target.value.trim() !== '') {
      checkAuthAndShowModal();
      // Keep the input for after login
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-4 overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full pt-40 pb-16">
        <h1 className="text-4xl font-bold mb-16 font-['SF_Pro_Display',system-ui,sans-serif] bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:via-[#1E9BB9] dark:to-gray-400 bg-clip-text text-transparent transition-colors duration-200">
          What do you want to know?
        </h1>

        {/* Main Input Container - Restored full width */}
        <div className="w-full max-w-3xl">
          <div className="relative w-full shadow-md rounded-2xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              className="w-full resize-none rounded-t-2xl border-0 bg-transparent px-4 py-4 pr-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-0 min-h-[60px] transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-2 border-t border-[#1E9BB9]/20 transition-colors duration-200">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Research Mode Button - with selected state */}
                <Button
                  variant={researchMode ? "default" : "ghost"}
                  className={`h-8 rounded-md px-3 py-1 text-xs font-medium ${
                    researchMode 
                      ? "bg-[#1E9BB9]/20 border border-[#1E9BB9]/50 text-[#1E9BB9]" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-[#1E9BB9]/10"
                  } transition-colors duration-200`}
                  onClick={toggleResearchMode}
                >
                  Research mode
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-md text-gray-500 dark:text-gray-400 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                >
                  <Link2 className="h-4 w-4" />
                </Button>
                
                {/* Solana Explorer Link Button */}
                {authenticated && user?.wallet ? (
                  <a 
                    href={`https://explorer.solana.com/address/${user.wallet.address}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M93.94 42.63H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64Z" fill="currentColor"/>
                      <path d="M93.94 74.31H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64Z" fill="currentColor"/>
                      <path d="M13.78 58.47h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64Z" fill="currentColor"/>
                    </svg>
                  </a>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                    disabled
                  >
                    <svg className="h-4 w-4" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M93.94 42.63H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64Z" fill="currentColor"/>
                      <path d="M93.94 74.31H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64Z" fill="currentColor"/>
                      <path d="M13.78 58.47h80.16c1.95 0 3.71-1.16 4.49-2.94 0.78-1.79 0.45-3.89-0.85-5.35l-19.2-21.76c-0.92-1.04-2.25-1.64-3.64-1.64H13.78c-1.95 0-3.71 1.16-4.49 2.94-0.78 1.79-0.45 3.89 0.85 5.35l19.2 21.76c0.92 1.04 2.25 1.64 3.64 1.64Z" fill="currentColor"/>
                    </svg>
                  </Button>
                )}
              </div>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-[#1E9BB9] p-2 text-white hover:bg-[#1E9BB9]/80 transition-colors duration-200"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !inputValue.trim()}
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Feed Section - Only this scrolls */}
      <div className="w-full max-w-3xl mt-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-320px)] pb-8">
        <h2 className="text-xl font-bold mb-4 sticky top-0 pt-2 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 font-['SF_Pro_Display',system-ui,sans-serif] bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:via-[#1E9BB9] dark:to-gray-400 bg-clip-text text-transparent transition-colors duration-200">
          Solana Ecosystem Updates
        </h2>

        {/* Token Prices - Enhanced with charts and horizontal scrolling */}
        <div className="mb-4 overflow-hidden rounded-xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 p-2 transition-all duration-200">
          {/* <h3 className="font-medium text-gray-800 dark:text-white mb-3 transition-colors duration-200 font-['SF_Pro_Display',system-ui,sans-serif]">
            Token Prices
          </h3> */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 min-w-max pb-1">
              {/* SOL Token */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center self-start mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 14L12 7L16 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11H15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      SOL
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      $135.72
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Solana
                    </p>
                    <p className="text-sm text-green-500">+4.2%</p>
                  </div>
                  <div className="h-10 mt-2 w-full">
                    <svg
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,10 L10,12 L20,8 L30,15 L40,10 L50,13 L60,7 L70,9 L80,5 L90,8 L100,2"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        className="transform scale-x-100 scale-y-100"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end mt-1 space-x-2">
                    <a href="https://dexscreener.com/solana/sol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com/solana" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.082 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.92 8.913 20.46 12.034 19.287C15.614 17.938 18.556 14.902 19.685 10.201C19.891 9.467 20 8.717 20 7.97C20 7.663 21.12 5.61 22 4.009V4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* SEND Token */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center self-start mt-1">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      SEND
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      $2.45
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Sendai
                    </p>
                    <p className="text-sm text-green-500">+12.8%</p>
                  </div>
                  <div className="h-10 mt-2 w-full">
                    <svg
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,15 L10,12 L20,10 L30,8 L40,13 L50,9 L60,5 L70,3 L80,2 L90,1 L100,0"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        className="transform scale-x-100 scale-y-100"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end mt-1 space-x-2">
                    <a href="https://dexscreener.com/solana/send" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com/sendai_crypto" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.082 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.92 8.913 20.46 12.034 19.287C15.614 17.938 18.556 14.902 19.685 10.201C19.891 9.467 20 8.717 20 7.97C20 7.663 21.12 5.61 22 4.009V4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* JUP Token */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center self-start mt-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 14L16 14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 11L17 13L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11L7 9L9 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      JUP
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      $0.82
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Jupiter
                    </p>
                    <p className="text-sm text-green-500">+6.3%</p>
                  </div>
                  <div className="h-10 mt-2 w-full">
                    <svg
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,10 L10,8 L20,12 L30,7 L40,9 L50,6 L60,5 L70,8 L80,3 L90,5 L100,2"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        className="transform scale-x-100 scale-y-100"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end mt-1 space-x-2">
                    <a href="https://dexscreener.com/solana/jup" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com/JupiterExchange" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.082 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.92 8.913 20.46 12.034 19.287C15.614 17.938 18.556 14.902 19.685 10.201C19.891 9.467 20 8.717 20 7.97C20 7.663 21.12 5.61 22 4.009V4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* BONK Token */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-300 flex items-center justify-center self-start mt-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M10.5 19.9V4.1C10.5 2.6 9.86 2 8.27 2H4.23C2.64 2 2 2.6 2 4.1V19.9C2 21.4 2.64 22 4.23 22H8.27C9.86 22 10.5 21.4 10.5 19.9Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 12.9V4.1C22 2.6 21.36 2 19.77 2H15.73C14.14 2 13.5 2.6 13.5 4.23V8.27C13.5 9.86 14.14 10.5 15.73 10.5H19.77C21.36 10.5 22 9.86 22 8.27Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      BONK
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      $0.00001
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Bonk
                    </p>
                    <p className="text-sm text-red-500">-2.4%</p>
                  </div>
                  <div className="h-10 mt-2 w-full">
                    <svg
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,5 L10,8 L20,4 L30,10 L40,7 L50,12 L60,15 L70,13 L80,17 L90,14 L100,18"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                        className="transform scale-x-100 scale-y-100"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end mt-1 space-x-2">
                    <a href="https://dexscreener.com/solana/bonk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com/bonk_inu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.082 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.92 8.913 20.46 12.034 19.287C15.614 17.938 18.556 14.902 19.685 10.201C19.891 9.467 20 8.717 20 7.97C20 7.663 21.12 5.61 22 4.009V4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* RAY Token */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 w-80">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center self-start mt-1">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                  >
                    <path
                      d="M6 12H18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 18V6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      RAY
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white transition-colors duration-200">
                      $1.35
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      Raydium
                    </p>
                    <p className="text-sm text-green-500">+8.7%</p>
                  </div>
                  <div className="h-10 mt-2 w-full">
                    <svg
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <path
                        d="M0,12 L10,10 L20,14 L30,8 L40,7 L50,5 L60,9 L70,4 L80,5 L90,2 L100,3"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        className="transform scale-x-100 scale-y-100"
                      />
                    </svg>
                  </div>
                  <div className="flex justify-end mt-1 space-x-2">
                    <a href="https://dexscreener.com/solana/ray" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    <a href="https://twitter.com/RaydiumProtocol" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1E9BB9] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.082 5.865 7.605 4 5.01C4 5.01 -0.182 12.94 8 16.01C6.128 17.247 4.261 18.088 2 18.01C5.308 19.92 8.913 20.46 12.034 19.287C15.614 17.938 18.556 14.902 19.685 10.201C19.891 9.467 20 8.717 20 7.97C20 7.663 21.12 5.61 22 4.009V4.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="space-y-4">
          {/* News Item 1 */}
          <div className="overflow-hidden rounded-xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 hover:bg-[#1E9BB9]/5 dark:hover:bg-[#1E9BB9]/10 cursor-pointer transition-all duration-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <img
                  src="https://solana.com/src/img/branding/solanaLogoMark.svg"
                  alt="Solana"
                  className="w-12 h-12 rounded-lg mt-1"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 dark:text-white transition-colors duration-200 font-['SF_Pro_Display',system-ui,sans-serif]">
                      Solana Ecosystem Growth Continues with Record DeFi TVL
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      2h ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                    Solana's DeFi ecosystem hits new all-time high with over
                    $20B in Total Value Locked, representing 150% growth since
                    January.
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="px-2 py-1 bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 text-[#1E9BB9] rounded-full text-xs">
                      DeFi
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs">
                      Growth
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Item 2 */}
          <div className="overflow-hidden rounded-xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 hover:bg-[#1E9BB9]/5 dark:hover:bg-[#1E9BB9]/10 cursor-pointer transition-all duration-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-600"
                  >
                    <path
                      d="M5 12.7C5 9.3 7.6 6.7 11 6.7C14.4 6.7 17 9.3 17 12.7C17 16.1 14.4 18.7 11 18.7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 2V6.7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 18.7V22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.9 19.8L11 13.7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.2 19.2C19.9673 19.2 21.4 17.7673 21.4 16C21.4 14.2327 19.9673 12.8 18.2 12.8C16.4327 12.8 15 14.2327 15 16C15 17.7673 16.4327 19.2 18.2 19.2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 dark:text-white transition-colors duration-200 font-['SF_Pro_Display',system-ui,sans-serif]">
                      Jupiter Exchange Launches New Token Launchpad
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      5h ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                    Jupiter, Solana's leading DEX aggregator, announces a new
                    launchpad for token projects with enhanced liquidity
                    features.
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs">
                      Jupiter
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      Launch
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* News Item 3 */}
          <div className="overflow-hidden rounded-xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 hover:bg-[#1E9BB9]/5 dark:hover:bg-[#1E9BB9]/10 cursor-pointer transition-all duration-200">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg bg-[#1E9BB9]/20 flex items-center justify-center mt-1">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#1E9BB9]"
                  >
                    <path
                      d="M22 8.27V4.23C22 2.64 21.36 2 19.77 2H15.73C14.14 2 13.5 2.64 13.5 4.23V8.27C13.5 9.86 14.14 10.5 15.73 10.5H19.77C21.36 10.5 22 9.86 22 8.27Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 17.5H20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17.5 20.5V14.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 dark:text-white transition-colors duration-200 font-['SF_Pro_Display',system-ui,sans-serif]">
                      Solana Agent Kit 2.0 Released with Advanced AI Features
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      1d ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                    The latest version of Solana Agent Kit introduces powerful
                    AI assistants and enhanced data handling for blockchain
                    developers.
                  </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <span className="px-2 py-1 bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 text-[#1E9BB9] rounded-full text-xs">
                      SDK
                    </span>
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs">
                      AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Load More Button */}
          <button className="w-full py-3 rounded-xl border border-[#1E9BB9]/30 text-[#1E9BB9] hover:bg-[#1E9BB9]/10 transition-colors duration-200 font-medium">
            Load more updates
          </button>
        </div>
      </div>
    </div>
  );
}
