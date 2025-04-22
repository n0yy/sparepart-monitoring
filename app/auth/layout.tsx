import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - Dashboard Lifetime",
  description: "Authentication pages for Dashboard Lifetime",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="">{children}</div>;
}
