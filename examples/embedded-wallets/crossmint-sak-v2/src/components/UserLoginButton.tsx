import { CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "./Toast";
import { toast as sonnerToast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useAuth, useWallet } from "@crossmint/client-sdk-react-ui";
import { useState, useEffect } from "react";
import { fetchSession, signupFn } from "~/functions/session";

interface UserLoginButtonProps {
  context?: "sidebar" | "modal";
}

export default function UserLoginButton({
  context = "sidebar",
}: UserLoginButtonProps) {
  const { login, logout, jwt, status: crossMintAuthStatus, user } = useAuth();
  const { wallet, status } = useWallet();
  const nav = useNavigate();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [isOpen, setIsOpen] = useState(false);

  const walletAddress = wallet
    ? (wallet as any).address || (wallet as any).publicKey?.toString()
    : null;

  // Clean up dropdown when component unmounts
  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  useEffect(() => {
    if (crossMintAuthStatus === "logged-in") {
      fetchSession().then((v) => {
        if (v?.email || v?.walletAddress) {
          return;
        }

        signupFn({
          data: {
            walletAddress: wallet?.address as string,
            email: user?.email,
            redirectUrl: "/chats",
          },
        }).then((v) => {
          if (v.error) {
            return sonnerToast.error(v.message);
          }

          nav({ href: "/chats" });
        });
      });
    }
  }, [crossMintAuthStatus, user, wallet]);

  if (status === "loading-error") {
    return <div className="text-rose-500">Error loading wallet</div>;
  }

  if (status === "in-progress") {
    return <div className="text-amber-500">Loading...</div>;
  }

  const isSidebar = context === "sidebar";

  return (
    <>
      {jwt ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={isSidebar ? "sm" : "default"}
              className={`${isSidebar ? "p-0 w-full flex justify-start" : "p-2"}`}
            >
              <CircleUser className={isSidebar ? "h-5 w-5 mr-2" : "h-6 w-6"} />
              {isSidebar && <span>Account</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              {walletAddress && walletAddress.length > 12
                ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                : walletAddress || "No wallet address"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (walletAddress) {
                  copyToClipboard(walletAddress);
                  toast({
                    type: "success",
                    description: `Copied ${walletAddress} to clipboard`,
                  });
                } else
                  toast({
                    type: "error",
                    description: "No wallet address found",
                  });
              }}
            >
              Copy Address
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                sonnerToast.promise(
                  async () => {
                    logout();
                    nav({ href: "/", replace: true });
                  },
                  {
                    description: "Disconnecting wallet...",
                  },
                );
              }}
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={login}
          variant="default"
          className={`${isSidebar ? "w-full" : ""} flex items-center gap-2`}
        >
          <CircleUser className="h-5 w-5" />
          <span>{isSidebar ? "Connect" : "Connect Wallet"}</span>
        </Button>
      )}
    </>
  );
}
