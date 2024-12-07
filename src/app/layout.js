import "./globals.css";
import LunchRecommender from "@/components/food_choice";

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
          <LunchRecommender />
        </main>
      </body>
    </html>
  );
}
