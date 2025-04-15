import type { Attachment, UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Link2, Send } from "lucide-react";
import { Messages } from "./Messages";
import { useChat } from "~/hooks/useChat";
import { Button } from "~/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { checkAuthAndShowModal } from "~/utils/auth";

export function Chat({
  id,
  initialMessages,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<UIMessage>;
  isReadonly: boolean;
}) {
  const {
    reload,
    status,
    handleSubmit,
    messages,
    setMessages,
    append,
    setInput,
    stop,
    input,
  } = useChat({
    id,
    initialMessages,
  });

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [researchMode, setResearchMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { authenticated, user } = usePrivy();
  
  // Store authentication status for real-time checks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PRIVY_TEMP_AUTH_CHECK__ = { authenticated };
    }
  }, [authenticated]);

  const toggleResearchMode = () => {
    setResearchMode(!researchMode);
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Check authentication before submitting
    if (!checkAuthAndShowModal(() => handleInputSubmit(e))) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (e) {
        handleSubmit(e as React.FormEvent<HTMLFormElement>);
      } else {
        // Create a synthetic event or call without the event
        handleSubmit({} as React.FormEvent<HTMLFormElement>);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] relative">
      {/* Messages container without extra padding */}
      <div className="flex-1 overflow-y-auto">
        <Messages
          chatId={id}
          status={status}
          // @ts-expect-error
          messages={messages}
          setMessages={(v) => {
            if (typeof v === "function") {
              setMessages(v(messages));
              return;
            }
            setMessages(v);
          }}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={false}
        />
      </div>
      
      {/* Input Area - Normal positioning at bottom */}
      {!isReadonly && (
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10">
          <div className="w-full max-w-3xl mx-auto px-4 py-3">
            <div className="relative w-full shadow-md rounded-2xl border border-[#1E9BB9]/30 bg-white dark:bg-gray-900 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Show login modal if user is not authenticated and starts typing
                  if (!authenticated && e.target.value.trim() !== '') {
                    checkAuthAndShowModal();
                    // Keep the input content for after login
                  }
                }}
                placeholder="Ask anything..."
                className="w-full resize-none rounded-t-2xl border-0 bg-transparent px-4 py-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-0 min-h-[60px] transition-colors duration-200 font-['SF_Pro_Text',system-ui,sans-serif]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && input.trim() && status !== "streaming") {
                    e.preventDefault();
                    handleInputSubmit();
                  }
                }}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between p-2 border-t border-[#1E9BB9]/20 transition-colors duration-200">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Research Mode Button - visual only */}
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
                  {status === "streaming" ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 transition-colors duration-200"
                      onClick={() => stop()}
                    >
                      <div className="h-4 w-4 flex items-center justify-center">
                        <span className="block h-2 w-2 bg-white rounded-sm"></span>
                      </div>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-[#1E9BB9] p-2 text-white hover:bg-[#1E9BB9]/80 transition-colors duration-200"
                      onClick={handleInputSubmit}
                      disabled={isSubmitting || !input.trim() || status === "submitted"}
                    >
                      {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
