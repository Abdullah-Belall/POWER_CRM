"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks/selector";
import { getTable } from "@/store/slices/tables-slice";
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface";

type TreeNode = ChartOfAccountsInterface & {
  children?: TreeNode[];
};

export default function TreeView() {
  const tableData = useAppSelector(getTable("chartOfAccountsTable"));
  const treeRoots = useMemo<TreeNode[]>(
    () => buildTree(tableData?.data ?? []),
    [tableData?.data]
  );

  if (!treeRoots.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-neutral-400">
        لا توجد حسابات لعرضها حاليا.
      </div>
    );
  }

  return (
    <div
      className="hs-accordion-treeview-root"
      role="tree"
      aria-orientation="vertical"
    >
      <TreeGroup nodes={treeRoots} level={0} />
    </div>
  );
}

type TreeGroupProps = {
  nodes: TreeNode[];
  level: number;
};

const TreeGroup = ({ nodes, level }: TreeGroupProps) => {
  const groupClass =
    level === 0
      ? "hs-accordion-group"
      : "hs-accordion-group ps-7 relative before:absolute before:top-0 before:start-3 before:w-0.5 before:-ms-px before:h-full before:bg-gray-100 dark:before:bg-neutral-700";

  return (
    <div className={groupClass} role="group" data-hs-accordion-always-open="">
      {nodes.map((node) => (
        <TreeBranch key={node.id} node={node} level={level} />
      ))}
    </div>
  );
};

type TreeBranchProps = {
  node: TreeNode;
  level: number;
};

const TreeBranch = ({ node, level }: TreeBranchProps) => {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const headingId = `coa-tree-heading-${node.id}`;
  const collapseId = `coa-tree-collapse-${node.id}`;
  const isExpanded = level === 0;
  const displayName = node.en_name || node.ar_name || node.code || "Account";

  if (!hasChildren) {
    return (
      <div
        className="hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-2 py-1 rounded-md cursor-pointer"
        role="treeitem"
      >
        <div className="flex items-center gap-x-3">
          <FileIcon />
          <div className="grow">
            <p className="text-sm text-gray-800 dark:text-neutral-200">
              {displayName}
            </p>
            {node.code && (
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                #{node.code}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const accordionClass = `hs-accordion ${isExpanded ? "active" : ""}`;
  const collapseClass = `hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
    isExpanded ? "" : "hidden"
  }`;

  return (
    <div
      className={accordionClass}
      role="treeitem"
      aria-expanded={isExpanded}
      id={headingId}
    >
      <div className="hs-accordion-heading py-0.5 flex items-center gap-x-0.5 w-full">
        <button
          className="hs-accordion-toggle size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          aria-expanded={isExpanded}
          aria-controls={collapseId}
        >
          <AccordionIcon />
        </button>
        <div className="grow hs-accordion-selectable hs-accordion-selected:bg-gray-100 dark:hs-accordion-selected:bg-neutral-700 px-1.5 rounded-md cursor-pointer">
          <div className="flex items-center gap-x-3">
            <FolderIcon />
            <div className="grow">
              <p className="text-sm text-gray-800 dark:text-neutral-200">
                {displayName}
              </p>
              {node.code && (
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  #{node.code}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        id={collapseId}
        className={collapseClass}
        role="group"
        aria-labelledby={headingId}
      >
        <TreeGroup nodes={children} level={level + 1} />
      </div>
    </div>
  );
};

const AccordionIcon = () => (
  <svg
    className="size-4 text-gray-800 dark:text-neutral-200"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path className="hs-accordion-active:hidden block" d="M12 5v14" />
  </svg>
);

const FolderIcon = () => (
  <svg
    className="shrink-0 size-4 text-gray-500 dark:text-neutral-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const FileIcon = () => (
  <svg
    className="shrink-0 size-4 text-gray-500 dark:text-neutral-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

// Builds a tree whether the API returns nested nodes or a flat list.
const buildTree = (accounts: ChartOfAccountsInterface[]): TreeNode[] => {
  if (!accounts?.length) {
    return [];
  }

  const hasPrefilledChildren = accounts.some((acc) => acc.children?.length);

  if (hasPrefilledChildren) {
    return accounts.map(cloneNode);
  }

  const nodesMap = new Map<string, TreeNode>();

  accounts.forEach((account) => {
    nodesMap.set(account.id, { ...account, children: [] });
  });

  const roots: TreeNode[] = [];

  nodesMap.forEach((node) => {
    const parentId = getParentId(node.parent);
    if (parentId && nodesMap.has(parentId)) {
      nodesMap.get(parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const cloneNode = (node: ChartOfAccountsInterface): TreeNode => ({
  ...node,
  children: node.children?.map(cloneNode) ?? [],
});

const getParentId = (
  parent: ChartOfAccountsInterface | string | null | undefined
) => {
  if (!parent) return undefined;
  if (typeof parent === "string") return parent;
  return parent.id;
};