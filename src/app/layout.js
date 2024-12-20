import "./globals.css";
import LocationChecker from "@/components/goodPlaceChecker";

export const metadata = {
  title: "crandi youtube",
  description: "Generated by crandi youtube",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <main>
          {children}
          <LocationChecker />
        </main>
      </body>
    </html>
  );
}
