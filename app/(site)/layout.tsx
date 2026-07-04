import Header from "@/components/Header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex-1">{children}</main>

      <footer className="flex justify-center py-10">
        <img
          src="/Doubledag-Logo-Digital-Glitch2.webp"
          alt="Double Dag Logo"
          className="w-24 opacity-70 transition duration-500 hover:opacity-100 md:w-32"
        />
      </footer>
    </div>
  );
}
