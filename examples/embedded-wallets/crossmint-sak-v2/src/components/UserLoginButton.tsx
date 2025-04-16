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

export default function UserLoginButton() {
  const { login, logout, jwt } = useAuth();
  const { wallet, status } = useWallet();
  const nav = useNavigate();
  const [_, copyToClipboard] = useCopyToClipboard();

  const walletAddress = wallet ? (wallet as any).address || (wallet as any).publicKey?.toString() : null;

  if (status === "loading-error") {
    return <div className="text-rose-500">Error loading wallet</div>;
  }

  if (status === "in-progress") {
    return <div className="text-amber-500">Loading...</div>;
  }

  return (
    <>
      {jwt ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleUser />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              {walletAddress}
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
              onClick={() =>
                sonnerToast.promise(
                  async () => {
                    await logout();
                    nav({ href: "/", replace: true });
                  },
                  {
                    description: "Disconnecting wallet...",
                  },
                )
              }
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={login}>Connect Wallet</Button>
      )}
    </>
  );
}
