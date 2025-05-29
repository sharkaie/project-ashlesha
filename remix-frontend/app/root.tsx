import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./tailwind.css";
import React, { useEffect } from "react";
import { Toaster } from "~/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "~/components/header";
import { Footer } from "~/components/footer";

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap",
    },
];

// export const loader: LoaderFunction = async ({ request }) => {
//     // Retrieve or create a session
//     const session = await getSession(request.headers.get("Cookie"));
//
//     // If no session ID exists, generate one
//     if (!session.has("__sid")) {
//         session.set("__sid", generateSessionId());
//     }
//
//     // Commit the session to generate a Set-Cookie header
//     const cookie = await commitSession(session);
//
//     return new Response(JSON.stringify({ message: "Session created!" }), {
//         headers: {
//             "Content-Type": "application/json",
//             "Set-Cookie": cookie, // Send the session cookie back to the client
//         },
//     });
// };

export function FacebookPixel() {
    useEffect(() => {
        // Dynamically add the Facebook Pixel script on the client
        const script = document.createElement("script");
        script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1266777627871517');
      fbq('track', 'PageView');
    `;
        document.head.appendChild(script);
    }, []);

    return null; // This component doesn't render anything visually
}

function GoogleTagManager() {
    useEffect(() => {
        // Dynamically inject the Google Analytics script
        const script1 = document.createElement("script");
        script1.async = true;
        script1.src =
            "https://www.googletagmanager.com/gtag/js?id=G-6Z9763N153";
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-6Z9763N153');
    `;
        document.head.appendChild(script2);
    }, []);
    return null;
}

// Create a client
const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <GoogleTagManager />

                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-11522513409"
                ></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'AW-11522513409');
                    `,
                    }}
                ></script>
                {/*  <script*/}
                {/*      dangerouslySetInnerHTML={{*/}
                {/*          __html: `!function(f,b,e,v,n,t,s)*/}
                {/*{if(f.fbq)return;n=f.fbq=function(){n.callMethod?*/}
                {/*n.callMethod.apply(n,arguments):n.queue.push(arguments)};*/}
                {/*if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';*/}
                {/*n.queue=[];t=b.createElement(e);t.async=!0;*/}
                {/*t.src=v;s=b.getElementsByTagName(e)[0];*/}
                {/*s.parentNode.insertBefore(t,s)}(window, document,'script',*/}
                {/*'https://connect.facebook.net/en_US/fbevents.js');*/}
                {/*fbq('init', '1266777627871517');*/}
                {/*fbq('track', 'PageView');`,*/}
                {/*      }}*/}
                {/*  />*/}

                <FacebookPixel />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src="https://www.facebook.com/tr?id=1266777627871517&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>

                <Scripts />
            </head>
            <body className="antialiased h-full w-full bg-background">
                <QueryClientProvider client={queryClient}>
                    <div className="flex flex-col w-full h-full">
                        <Header />
                        <main className="flex-1 items-center flex flex-col gap-4 md:gap-8 w-full">
                            {children}
                        </main>
                        <Footer />
                    </div>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
                <Toaster />

                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
