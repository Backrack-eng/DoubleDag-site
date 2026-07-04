import { Bebas_Neue, Inter } from "next/font/google";
import "@/components/rva-street-games/rva-street-games.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${bebasNeue.variable} ${inter.variable} rva-game-shell h-[100dvh] w-full overflow-hidden`}
    >
      {children}
    </div>
  );
}
