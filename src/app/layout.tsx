import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { MessageProvider } from "@/contexts/MessageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HwyDaw Assistant",
  description: "Your AI assistant for music production",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <UserProvider>
            <MessageProvider>{children}</MessageProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
