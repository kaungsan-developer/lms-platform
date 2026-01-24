import NavBar from "./_components/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-5">{children}</main>
    </div>
  );
}
