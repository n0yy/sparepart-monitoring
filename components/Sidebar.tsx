"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const NavLink = ({ href, children }: NavLinkProps) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        className={`hover:bg-base-200 ${
          active ? "bg-base-300 font-bold text-primary" : ""
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <aside className="shadow-xl w-[20%] min-h-screen p-4">
      <header className="">
        <Image
          src={"/vercel.svg"}
          alt="Vercel Logo"
          width={60}
          height={24}
          className="dark:invert mb-2"
        />
        <h1 className="text-xl font-bold uppercase">Dashboard Lifetime</h1>
      </header>
      {/* Menu */}
      <div className="mt-10">
        <ul className="menu rounded-box w-56 space-y-2 bg-base-100 p-4">
          {/* ITEM 1: Lifetime Dropdown */}
          <li>
            <details open={pathname.includes("/lifetime")}>
              <summary className="font-semibold">Lifetime</summary>
              <ul className="uppercase space-y-1">
                <li>
                  <NavLink href="/lifetime/ilapak">Ilapak</NavLink>
                </li>
                <li>
                  <NavLink href="/lifetime/sig">SIG</NavLink>
                </li>
                <li>
                  <NavLink href="/lifetime/chimei">Chimei</NavLink>
                </li>
                <li>
                  <NavLink href="/lifetime/unifill">Unifill</NavLink>
                </li>
                <li>
                  <NavLink href="/lifetime/jinsung">Jinsung</NavLink>
                </li>
              </ul>
            </details>
          </li>
          {/* ITEM 2 */}
          <li>
            <NavLink href="/kanban">Kanban</NavLink>
          </li>
          {/* ITEM 3 */}
          <li>
            <NavLink href="/monitoring-expanse">Monitoring Expanse</NavLink>
          </li>
          {/* ITEM 4 */}
          <li>
            <NavLink href="/kolaborasi-ckg-pg">Kolaborasi CKG & PG</NavLink>
          </li>
          {/* ITEM 5 */}
          <li>
            <NavLink href="/cmms">CMMS</NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}
