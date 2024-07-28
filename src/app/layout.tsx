import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import navStyles from "./nav.module.css";
import NavLink from './NavLink';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayoba Business",
  description: "Ayoba Business Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className={navStyles.nav}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/profile">Profile</NavLink>
          <NavLink href="/settings">Settings</NavLink>
        </nav>
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}