import type { Metadata } from "next";
import RvaStreetGames from "@/components/rva-street-games/RvaStreetGames";

export const metadata: Metadata = {
  title: "RVA Street Games",
  description: "Richmond street-view guessing and navigation game",
};

export default function RvaStreetGamesPage() {
  return <RvaStreetGames />;
}
