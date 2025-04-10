"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
// Remove this import
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { FlipHorizontalIcon } from "lucide-react";

type NavItem = {
  name: string;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    name: "Item Sales and Rate",
    path: "/unitrate"
  },

  {
    name: "Item Cost",
    subItems: [
      {
        name: "Item",
        path: "/itemcost"
      },
      {
        name: "Unit", 
        path: "/measureunit"
      }
    ]
  },
  {
    name: "SPK",
    path: "/spk"
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight({
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
      });
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={70}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={70}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}>
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <FlipHorizontalIcon />}
              </h2>
              <ul className="flex flex-col gap-4">
                {navItems.map((nav, index) => (
                  <li key={nav.name}>
                    {nav.subItems ? (
                      <div>
                        <button
                          onClick={() => handleSubmenuToggle(index)}
                          className={`menu-item group ${
                            !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                          }`}
                        >
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <>
                              <span className="menu-item-text dark:text-white">{nav.name}</span>
                              <ChevronUpDownIcon
                                className={`h-4 w-4 transition-transform dark:text-white ${
                                  openSubmenu === index ? "rotate-180" : ""
                                }`}
                              />
                            </>
                          )}
                        </button>
                        <div
                          ref={(el: HTMLDivElement | null) => {
                            subMenuRefs.current[index] = el;
                          }}
                          className={`overflow-hidden transition-all duration-300 ${
                            openSubmenu === index
                              ? "max-h-[1000px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                          style={{
                            height:
                              openSubmenu === index
                                ? `${subMenuHeight[index] || 0}px`
                                : "0px",
                          }}
                        >
                          <ul className="pl-4 pt-2">
                            {nav.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.path}
                                  className={`menu-item group ${
                                    isActive(subItem.path) ? "menu-item-active" : "menu-item-inactive"
                                  } ${
                                    !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                                  }`}
                                >
                                  {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className="menu-item-text">{subItem.name}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={nav.path || '/'}
                        className={`menu-item group ${
                          isActive(nav.path || '/') ? "menu-item-active" : "menu-item-inactive"
                        } ${
                          !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                        }`}
                      >
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{nav.name}</span>
                        )}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        {/* Remove the SidebarWidget component */}
      </div>
    </aside>
  );
};

export default AppSidebar;
