import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cloudinary Studio",
  description: "Media SaaS",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen flex flex-col bg-black text-white`}
        >
          {/* Main content takes full space */}
          <div className="flex-1 flex flex-col">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
