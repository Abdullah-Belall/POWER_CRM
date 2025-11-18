"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import { GrOverview } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { FaHeadset, FaMoneyBillTrendUp } from "react-icons/fa6";
import { useAppSelector } from "@/store/hooks/selector";
import { selectCurrentUserRoles } from "@/store/slices/user-slice";

type SubItem = {
  name: string;
  path?: string;
  pro?: boolean;
  new?: boolean;
  subItems?: SubItem[];
  roles?: string[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
  roles?: string[];
};

const navItems: NavItem[] = [
  {
    name: "Overview",
    icon: <GrOverview className={"text-xl"} />,
    path: "/",
    roles: [],
  },
  {
    icon: <IoMdSettings className={"text-xl"} />,
    name: "General",
    roles: ['read-user', 'read-role'],
    subItems: [
      { name: "Roles", path: "/general/roles", pro: false, roles: ['read-role'] },
      { name: "Users", path: "/general/users", pro: false, roles: ['read-user'] },
    ],
  },
  {
    icon: <FaHeadset className={"text-xl"} />,
    name: "Complaints",
    roles: ['read-complaint', 'create-complaint'],
    subItems: [
      {
        name: "Complaints",
        path: "/complaints/clients",
        pro: false,
        roles: ['create-complaint'],
      },
      {
        name: "Clients Complaints",
        path: "/complaints/managers",
        pro: false,
        roles: ['read-complaint'],
      },
      {
        name: "Employees Complaints",
        path: "/complaints/employees",
        pro: false,
        roles: ['not-now'],
      },
    ],
  },
  {
    name: "Sales System",
    icon: <FaMoneyBillTrendUp className={"text-xl"} />,
    roles: ['potential-customers-assign', 'potential-customers-assignable'],
    subItems: [
      {
        name: "Inputs",
        roles: ['potential-customers-assign', 'potential-customers-assignable'],
        subItems: [
          { name: "Salers Data", path: "/grandcshi34ld1", roles: [] },
          { name: "Collectors' Data", path: "/gra45ndchsild2", roles: [] },
          {
            name: "Potential Customer Data",
            path: "/sales/inputs/potential-customers",
            roles: [],
          },
          { name: "Services Data", path: "/gransdchild2", roles: [] },
          { name: "Service Pricing", path: "/graandchaild2", roles: [] },
        ],
      },
      {
        name: "Operations",
        roles: [],
        subItems: [
          { name: "Price Quote", path: "/gran23dchild1", roles: [] },
          { name: "Customer Discussion", path: "/gran33dchild2", roles: [] },
          { name: "Sales Contract", path: "/grandc123hild2", roles: [] },
        ],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const currentUserRoles = useAppSelector(selectCurrentUserRoles());
  const currentUserRoleSet = useMemo(
    () => new Set(currentUserRoles ?? []),
    [currentUserRoles]
  );

  const filteredNavItems = useMemo(() => {
    const hasRoleAccess = (itemRoles?: string[]) => {
      if (!itemRoles || itemRoles.length === 0) return true;
      if (currentUserRoleSet.size === 0) return false;
      return itemRoles.some((role) => currentUserRoleSet.has(role));
    };

    const filterSubItems = (items: SubItem[]): SubItem[] => {
      return items.reduce<SubItem[]>((acc, item) => {
        const filteredChildren = item.subItems
          ? filterSubItems(item.subItems)
          : undefined;
        const itemHasAccess = hasRoleAccess(item.roles);

        if (!itemHasAccess && (!filteredChildren || filteredChildren.length === 0)) {
          return acc;
        }

        acc.push({
          ...item,
          subItems: filteredChildren,
        });

        return acc;
      }, []);
    };

    const filterItems = (items: NavItem[]): NavItem[] =>
      items.reduce<NavItem[]>((acc, item) => {
        const filteredChildren = item.subItems
          ? filterSubItems(item.subItems)
          : undefined;
        const itemHasAccess = hasRoleAccess(item.roles);

        if (!itemHasAccess && (!filteredChildren || filteredChildren.length === 0)) {
          return acc;
        }

        acc.push({
          ...item,
          subItems: filteredChildren,
        });

        return acc;
      }, []);

    return filterItems(navItems);
  }, [currentUserRoleSet]);

  const renderSubItems = (
    subItems: SubItem[],
    parentKey: string,
    level: number = 0
  ) => {
    return (
      <ul className={`mt-2 space-y-1 ${level === 0 ? "ml-9" : "ml-6"}`}>
        {subItems.map((subItem, subIndex) => {
          const itemKey = `${parentKey}-${subIndex}`;
          const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0;
          const isSubmenuOpen = openSubmenu.has(itemKey);

          return (
            <li key={subItem.name}>
              {hasNestedSubItems ? (
                <>
                  <button
                    onClick={() => handleSubmenuToggle(itemKey)}
                    className={`menu-dropdown-item w-full text-left ${
                      isSubmenuOpen
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="flex items-center gap-1 ml-auto">
                      {subItem.new && (
                        <span
                          className={`${
                            isSubmenuOpen
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span
                          className={`${
                            isSubmenuOpen
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          pro
                        </span>
                      )}
                      <ChevronDownIcon
                        className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                          isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                        }`}
                      />
                    </span>
                  </button>
                  <div
                    ref={(el) => {
                      subMenuRefs.current[itemKey] = el;
                    }}
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isSubmenuOpen ? "1fr" : "0fr",
                      opacity: isSubmenuOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      {renderSubItems(subItem.subItems!, itemKey, level + 1)}
                    </div>
                  </div>
                </>
              ) : (
                subItem.path && (
                  <Link
                    href={subItem.path}
                    className={`menu-dropdown-item ${
                      isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="flex items-center gap-1 ml-auto">
                      {subItem.new && (
                        <span
                          className={`${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          new
                        </span>
                      )}
                      {subItem.pro && (
                        <span
                          className={`${
                            isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          pro
                        </span>
                      )}
                    </span>
                  </Link>
                )
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" = "main"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const itemKey = `${menuType}-${index}`;
        const isSubmenuOpen = openSubmenu.has(itemKey);

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
                <button
                  onClick={() => handleSubmenuToggle(itemKey)}
                  className={`menu-item group ${
                    isSubmenuOpen
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } cursor-pointer ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`${
                      isSubmenuOpen
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                    />
                  )}
                </button>
                {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[itemKey] = el;
                    }}
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isSubmenuOpen ? "1fr" : "0fr",
                      opacity: isSubmenuOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      {renderSubItems(nav.subItems, itemKey)}
                    </div>
                  </div>
                )}
              </>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  className={`menu-item group ${
                    isActive(nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
          </li>
        );
      })}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<Set<string>>(new Set());
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
   const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Recursive function to find and open all parent submenus for a given path
  const findAndOpenSubmenus = useCallback(
    (
      items: NavItem[] | SubItem[],
      targetPath: string,
      parentKey: string = "",
      menuType?: "main"
    ): string[] => {
    const keysToOpen: string[] = [];

    // Recursive helper to check nested items
    const checkNested = (subItems: SubItem[], key: string): boolean => {
      let found = false;
      for (let i = 0; i < subItems.length; i++) {
        const subKey = `${key}-${i}`;
        if (subItems[i].path === targetPath) {
          keysToOpen.push(key);
          return true;
        }
        if (subItems[i].subItems) {
          if (checkNested(subItems[i].subItems!, subKey)) {
            keysToOpen.push(key);
            found = true;
          }
        }
      }
      return found;
    };

    items.forEach((item, index) => {
      const currentKey = menuType
        ? `${menuType}-${index}`
        : `${parentKey}-${index}`;

      if (item.subItems) {
        if (checkNested(item.subItems, currentKey)) {
          if (menuType) {
            keysToOpen.push(currentKey);
          }
        }
      }
    });

      return keysToOpen;
    },
    []
  );

  useEffect(() => {
    // Check if the current path matches any submenu item (recursively)
    const keysToOpen = new Set<string>();
    const foundKeys = findAndOpenSubmenus(filteredNavItems, pathname, "", "main");
    foundKeys.forEach((key) => keysToOpen.add(key));

    setOpenSubmenu(keysToOpen);
  }, [pathname, findAndOpenSubmenus, filteredNavItems]);

  useEffect(() => {
    // Set the height of all open submenu items
    // Use multiple delays to ensure nested menus are fully rendered
    const updateHeights = () => {
      setSubMenuHeight((prevHeights) => {
        const newHeights: Record<string, number> = {};
        
        // Calculate heights for all open menus only
        openSubmenu.forEach((key) => {
          if (subMenuRefs.current[key]) {
            const height = subMenuRefs.current[key]?.scrollHeight || 0;
            if (height > 0) {
              newHeights[key] = height;
            } else if (prevHeights[key]) {
              // Keep previous height if current is 0 (menu might still be rendering)
              newHeights[key] = prevHeights[key];
            }
          }
        });

        // Heights for closed menus are automatically excluded (not in newHeights)
        return newHeights;
      });
    };

    // Use multiple requestAnimationFrame calls and setTimeout to ensure nested menus are fully rendered
    // This is necessary because deeply nested menus need time to render
    let rafId1: number;
    let rafId2: number;
    let rafId3: number;
    let timeoutId: NodeJS.Timeout;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        rafId3 = requestAnimationFrame(() => {
          updateHeights();
          // Also update after a small delay to catch any late-rendering nested menus
          timeoutId = setTimeout(() => {
            updateHeights();
          }, 50);
        });
      });
    });

    // Use ResizeObserver to watch for size changes in nested menus
    const observers: ResizeObserver[] = [];
    
    openSubmenu.forEach((key) => {
      const element = subMenuRefs.current[key];
      if (element) {
        const observer = new ResizeObserver(() => {
          if (openSubmenu.has(key) && element) {
            const height = element.scrollHeight || 0;
            if (height > 0) {
              setSubMenuHeight((prevHeights) => ({
                ...prevHeights,
                [key]: height,
              }));
            }
          }
        });
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (rafId3) cancelAnimationFrame(rafId3);
      if (timeoutId) clearTimeout(timeoutId);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [openSubmenu]);

  const handleSubmenuToggle = (itemKey: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      const newSet = new Set(prevOpenSubmenu);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
        // Also close all nested submenus
        Object.keys(subMenuRefs.current).forEach((key) => {
          if (key.startsWith(itemKey + "-")) {
            newSet.delete(key);
          }
        });
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <h1 className="font-[600] text-2xl flex items-center gap-2 dark:text-white"><Image width={35} height={35} src={'/images/logo/LOGUP.png'} alt="t" /> POWER SOFT</h1>
            // <>
            //   <Image
            //     className="dark:hidden"
            //     src="/images/logo/logo.svg"
            //     alt="Logo"
            //     width={150}
            //     height={40}
            //   />
            //   <Image
            //     className="hidden dark:block"
            //     src="/images/logo/logo-dark.svg"
            //     alt="Logo"
            //     width={150}
            //     height={40}
            //   />
            // </>
          ) : (
            // <Image
            //   src="/images/logo/logo-icon.svg"
            //   alt="Logo"
            //   width={32}
            //   height={32}
            // />
            <Image width={35} height={35} src={'/images/logo/LOGUP.png'} alt="t" />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
