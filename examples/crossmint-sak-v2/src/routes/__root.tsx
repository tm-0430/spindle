import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type * as React from "react";
import { DefaultCatchBoundary } from "../components/DefaultCatchBoundary.js";
import { NotFound } from "../components/NotFound.js";
import appCss from "../styles/app.css?url";
import { seo } from "../utils/seo.js";
import UserLoginButton from "../components/UserLoginButton";
import { CrossmintProvider } from "../components/CrossmintProvider";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "Crossmint Wallet",
        description:
          "Crossmint Wallet is a web app that enables you to interact with the blockchain through simple language.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <CrossmintProvider>
          <div className="p-2 flex gap-2 text-lg">
            <Link
              to="/"
              activeProps={{
                className: "font-bold",
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{" "}
            <Link
              to="/chats"
              preload={false}
              activeProps={{
                className: "font-bold",
              }}
            >
              Chats
            </Link>
            <div className="ml-auto">
              <UserLoginButton />
            </div>
          </div>
          <hr />
          <Toaster position="top-center" />
          {children}
        </CrossmintProvider>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
