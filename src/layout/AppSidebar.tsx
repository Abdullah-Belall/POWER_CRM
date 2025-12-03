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
import { TbContract } from "react-icons/tb";
import { LuNotebookText } from "react-icons/lu";

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
    icon: <TbContract className={"text-xl"} />,
    name: "Domains",
    roles: ['read-tenant'],
    subItems: [
      { name: "Domains", path: "/tenants", pro: false, roles: ['read-tenant'] },
    ],
  },
  {
    icon: <IoMdSettings className={"text-xl"} />,
    name: "General",
    roles: ['read-user', 'read-role'],
    subItems: [
      {
        name: "General Settings",
        roles: ['general-ledger'],
        subItems: [
          { name: "Company Branches", path: "/general/branches", pro: false, roles: ['general-ledger'] },
          { name: "Currency", path: "/general-ledger/acc/currency", pro: false, roles: ['general-ledger'] },
        ],
      },
      {
        name: "Users Management",
        roles: ['read-role', 'read-user'],
        subItems: [
          { name: "Roles", path: "/general/roles", pro: false, roles: ['read-role'] },
          { name: "Users", path: "/general/users", pro: false, roles: ['read-user'] },
        ],
      },
    ],
  },
  {
    name: "General Ledger",
    icon: <LuNotebookText className={"text-xl"} />,
    roles: ['general-ledger'],
    subItems: [
      {
        name: "Setting Accounts",
        roles: ['general-ledger'],
        subItems: [
          { name: "Account Setup", path: "/grandcshissssshhssss34ld1", roles: ['general-ledger'] },
          { name: "Account Classification", path: "/general-ledger/acc/flags", roles: ['general-ledger'] },
          { name: "Cash Group", path: "/general-ledger/setting/cash-group", roles: ['general-ledger'] },
          { name: "Customers Group", path: "/general-ledger/setting/customers-group", roles: ['general-ledger'] },
          { name: "Suppliers Group", path: "/general-ledger/setting/supliers-group", roles: ['general-ledger'] },
          { name: "Employee Group", path: "/general-ledger/setting/employee-group", roles: ['general-ledger'] },
          { name: "Expensess Group", path: "/general-ledger/setting/expensess-group", roles: ['general-ledger'] },
          { name: "Income Group", path: "/general-ledger/setting/income-group", roles: ['general-ledger'] },
          { name: "Assits Group", path: "/general-ledger/setting/assits-group", roles: ['general-ledger'] },
          { name: "Depet Group", path: "/general-ledger/setting/depets-group", roles: ['general-ledger'] },
          { name: "Credit Group", path: "/general-ledger/setting/credit-group", roles: ['general-ledger'] },
        ],
      },
      {
        name: "Inputs Accounts",
        roles: ['general-ledger'],
        subItems: [
          { name: "Chart of Accounts", path: "/general-ledger/acc/inputs/chart-of-accounts", roles: ['general-ledger'] },
          { name: "Cost Centers", path: "/general-ledger/acc/inputs/cost-center", roles: ['general-ledger'] },
          { name: "Projects", path: "/general-ledger/acc/inputs/projects", roles: ['general-ledger'] },
          { name: "Activity", path: "/general-ledger/acc/inputs/activities", roles: ['general-ledger'] },
          { name: "Cash at Bank", path: "/general-ledger/acc/inputs/cash-at-bank", roles: ['general-ledger'] },
          { name: "Cash in Hand", path: "/general-ledger/acc/inputs/cash-in-hand", roles: ['general-ledger'] },
          { name: "Expensess", path: "/general-ledger/acc/inputs/expensess", roles: ['general-ledger'] },
          { name: "Revenue", path: "/general-ledger/acc/inputs/revenue", roles: ['general-ledger'] },
          { name: "Assits", path: "/general-ledger/acc/inputs/assits", roles: ['general-ledger'] },
          { name: "Personal Covenant", path: "/general-ledger/acc/inputs/personal_covenant", roles: ['general-ledger'] },
          { name: "Depts Accounts", path: "/general-ledger/acc/inputs/depts-accounts", roles: ['general-ledger'] },
          { name: "Credit Accounts", path: "/general-ledger/acc/inputs/credit-accounts", roles: ['general-ledger'] },
        ],
      },
      {
        name: "Transactions",
        roles: ['general-ledger'],
        subItems: [
          { name: "General Journal", path: "/general-ledger/transactions/general-journal", roles: ['general-ledger'] },
          { name: "Cash Receit Vouchers", path: "/general-ledger/transactions/cash-receit-vouchers", roles: ['general-ledger'] },
          { name: "Bank Receit Vouchers", path: "/general-ledger/transactions/bank-receit-vouchers", roles: ['general-ledger'] },
          { name: "Cash Payment Vouchers", path: "/general-ledger/transactions/cash-payment-vouchers", roles: ['general-ledger'] },
          { name: "Bank Payment Vouchers", path: "/general-ledger/transactions/bank-payment-vouchers", roles: ['general-ledger'] },
        ],
      },
      {
        name: "Report Accounts",
        roles: ['general-ledger'],
        subItems: [
          { name: "Opening Balances", path: "/granggsssghild1", roles: ['general-ledger'] },
          { name: "Payment Bond", path: "/granggglllhi2ld1", roles: ['general-ledger'] },
          { name: "Receipt Bond", path: "/granggglllh3ild1", roles: ['general-ledger'] },
          { name: "Account Statement", path: "/grangg4glllhild1", roles: ['general-ledger'] },
          { name: "Balance Review", path: "/grangggl5llhild1", roles: ['general-ledger'] },
          { name: "Balance Sheet", path: "/grangggll6lhild1", roles: ['general-ledger'] },
          { name: "Profit and Loss", path: "/granggg7lllhild1", roles: ['general-ledger'] },
          { name: "Daily Bonds", path: "/granggglll8hild1", roles: ['general-ledger'] },
          { name: "General Daily", path: "/grangggll9lhild1", roles: ['general-ledger'] },
          { name: "Accounting Guide", path: "/granggg0lllhild1", roles: ['general-ledger'] },
          { name: "Cost Centers Report", path: "/grangdgglllhild1", roles: ['general-ledger'] },
        ],
      },
    ],
  },
  {
    icon: <FaHeadset className={"text-xl"} />,
    name: "Support",
    roles: ['read-complaint', 'create-complaint', 'complaint-assignable'],
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
        name: "Clients Complaints",
        path: "/complaints/supporters",
        pro: false,
        roles: ['complaint-assignable'],
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
    roles: ['potential-customers-assign', 'potential-customers-assignable', 'read-system', 'read-potential-customers'],
    subItems: [
      {
        name: "Inputs",
        roles: ['potential-customers-assign', 'potential-customers-assignable'],
        subItems: [
          { name: "Salers", path: "/grandcshissssssss34ld1", roles: ['not-now'] },
          { name: "Collectors'", path: "/gra45ndssschsilds2", roles: ['not-now'] },
          {
            name: "Potential Customers",
            path: "/sales/inputs/potential-customers",
            roles: ['potential-customers-assign'],
          },
          { name: "Systems", path: "/sales/inputs/systems", roles: ['read-system'] },
        ],
      },
      {
        name: "Operations",
        roles: ['not-now'],
        subItems: [
          { name: "Price Quote", path: "/gran23dcgggghild1", roles: ['not-now'] },
          { name: "Customer Discussion", path: "/gra2n33dchsild2", roles: ['not-now'] },
          { name: "Sales Contract", path: "/grsandc123shild2", roles: ['not-now'] },
          { name: "Tasks", path: "/activities/tasks", pro: false, roles: ['not-now'] },
        ],
      },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const currentUserRoles = useAppSelector(selectCurrentUserRoles());

  
const hasCommonRole = (userRoles: string[], itemRoles?: string[]) => {
  if (!itemRoles || itemRoles.length === 0) return true;
  return itemRoles.some(role => userRoles.includes(role));
};

const filterItemsByRoles = (items: (NavItem | SubItem)[], userRoles: string[]): any[] => {
  return items
    .map(item => {
      const userHasAccess = hasCommonRole(userRoles, item.roles);

      let filteredSubItems: any[] = [];
      if (item.subItems) {
        filteredSubItems = filterItemsByRoles(item.subItems, userRoles);
      }

      if (!userHasAccess && filteredSubItems.length === 0) {
        return null;
      }

      return {
        ...item,
        subItems: filteredSubItems.length > 0 ? filteredSubItems : item.subItems,
      };
    })
    .filter(Boolean);
};

const filteredNavItems = useMemo(() => {
  return filterItemsByRoles(navItems, currentUserRoles || []);
}, [currentUserRoles]);


  const renderSubItems = (
    subItems: SubItem[],
    parentKey: string,
    level: number = 0
  ) => {
    return (
      <ul className={`mt-2 space-y-1 ${level === 0 ? "ml-9" : "ml-6"}`}>
        {subItems.map((subItem, subIndex) => {
          const itemKey = `${parentKey}-${subIndex}`;
          const listItemKey =
            subItem.path || `${itemKey}-${subItem.name || "subitem"}`;
          const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0;
          const isSubmenuOpen = openSubmenu.has(itemKey);

          return (
            <li key={listItemKey}>
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
        const listItemKey = nav.path || `${itemKey}-${nav.name || "nav"}`;
        const isSubmenuOpen = openSubmenu.has(itemKey);

        return (
          <li key={listItemKey}>
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
  const [, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const findAndOpenSubmenus = useCallback(
    (
      items: NavItem[] | SubItem[],
      targetPath: string,
      parentKey: string = "",
      menuType?: "main"
    ): string[] => {
    const keysToOpen: string[] = [];

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
    const keysToOpen = new Set<string>();
    const foundKeys = findAndOpenSubmenus(filteredNavItems, pathname, "", "main");
    foundKeys.forEach((key) => keysToOpen.add(key));

    setOpenSubmenu(keysToOpen);
  }, [pathname, findAndOpenSubmenus, filteredNavItems]);

  useEffect(() => {
    const updateHeights = () => {
      setSubMenuHeight((prevHeights) => {
        const newHeights: Record<string, number> = {};
        
        openSubmenu.forEach((key) => {
          if (subMenuRefs.current[key]) {
            const height = subMenuRefs.current[key]?.scrollHeight || 0;
            if (height > 0) {
              newHeights[key] = height;
            } else if (prevHeights[key]) {
              newHeights[key] = prevHeights[key];
            }
          }
        });

        return newHeights;
      });
    };
    
    let rafId2: number;
    let rafId3: number;
    let timeoutId: NodeJS.Timeout;

    const rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        rafId3 = requestAnimationFrame(() => {
          updateHeights();
          timeoutId = setTimeout(() => {
            updateHeights();
          }, 50);
        });
      });
    });

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
            <h1 className="font-[600] text-2xl flex items-center gap-2 dark:text-white text-nowrap"><Image width={35} height={35} src={'/images/logo/LOGUP.png'} alt="t" /> POWER SOFT</h1>
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
                className={`mb-4 text-xs uppercase flex leading-[20px] !text-[16px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "ERP"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems)}
              {/* <h1 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 !text-[16px] mt-[14px]">CRM</h1>
              {renderMenuItems(filteredNavItems.slice(4))} */}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
