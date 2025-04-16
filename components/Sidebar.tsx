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
          src={"/b7_logo.png"}
          alt="Bintang Toedjoe Logo"
          width={400}
          height={300}
        />
      </header>
      {/* Menu */}
      <div className="">
        <ul className="menu rounded-box w-80 space-y-2 bg-base-100 p-4">
          {/* ITEM 1: Lifetime Dropdown */}
          <li>
            <details open={pathname.includes("/lifetime")}>
              <summary className="font-semibold">Lifetime Sparepart</summary>
              <ul className="uppercase space-y-1">
                <li>
                  <NavLink href="/dashboard/lifetime/ilapak">Ilapak</NavLink>
                </li>
                <li>
                  <NavLink href="/dashboard/lifetime/sig">SIG</NavLink>
                </li>
                <li>
                  <NavLink href="/dashboard/lifetime/chimei">Chimei</NavLink>
                </li>
                <li>
                  <NavLink href="/dashboard/lifetime/unifill">Unifill</NavLink>
                </li>
                <li>
                  <NavLink href="/dashboard/lifetime/jinsung">Jinsung</NavLink>
                </li>
              </ul>
            </details>
          </li>
          {/* ITEM 2 */}
          <li>
            <NavLink href="/kanban">Kanban Sparepart</NavLink>
          </li>
          {/* ITEM 3 */}
          <li>
            <NavLink href="/monitoring-expanse">
              Monitoring Sparepart Expense
            </NavLink>
          </li>
          {/* ITEM 4 */}
          <li>
            <NavLink href="/cmms">CMMS</NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}
