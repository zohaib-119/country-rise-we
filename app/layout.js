import "./globals.css";
import { AuthProvider } from "./AuthProvider";
import { LanguageProvider } from "@/context/LanguageProvider";

export const metadata = {
  title: "CountryRise",
  description: "Rising Rural Entrepreneurial Women",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
