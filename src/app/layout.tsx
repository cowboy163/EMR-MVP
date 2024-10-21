import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import TopNav from "@/components/navbar/TopNav";
import { ReduxProviders } from "@/lib/ReduxProviders";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Noqclinic-demo",
  description: "Doctor Booking Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id || null;
  const role = session?.user?.role || null;
  return (
    <ReduxProviders>
      <html lang="en">
        <body>
          <Providers userId={userId} role={role}>
            <TopNav />
            <main className="container mx-auto">
              {children}
            </main>
          </Providers>
        </body>
      </html>
    </ReduxProviders>
  );
}