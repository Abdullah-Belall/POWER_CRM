"use client";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { useAppSelector } from "@/store/hooks/selector";
import { openPopup } from "@/store/slices/popups-slice";
import { getTable } from "@/store/slices/tables-slice";
import { AccTypeEnum } from "@/types/enums/erp/acc-enums";
import { GET_PROJECTS_TREE_VIEW_CREQ } from "@/utils/erp-requests/clients-reqs/projects-reqs";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useMemo, useState, useCallback, useEffect } from "react";

export type TreeNode = {
  id: string | number;
  ar_name: string;
  en_name?: string;
  code?: number
  children?: TreeNode[];
  parent?: TreeNode;
  acc_type: AccTypeEnum;
};


const hasChildren = (node: TreeNode) => Boolean(node.children && node.children.length);

export default function ProjectTreeView() {
  const tableData = useAppSelector(getTable('projectsTable'))
  const [data, setData] = useState<TreeNode[]>([])
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_PROJECTS_TREE_VIEW_CREQ)
    setData(res.data?.roots)
  }
useEffect(() => {
  fetchData()
}, [tableData])
  const initiallyExpanded = useMemo(() => {
    const ids: Array<string | number> = [];
    const collect = (nodes: TreeNode[]) => {
      nodes?.forEach((node) => {
        if (hasChildren(node)) {
          ids.push(node.id);
          collect(node.children!);
        }
      });
    };
    collect(data);
    return ids;
  }, [data]);

  const [expanded, setExpanded] = useState<Set<string | number>>(
    () => new Set(initiallyExpanded)
  );

  useEffect(() => {
    setExpanded(new Set(initiallyExpanded));
  }, [initiallyExpanded]);

  const toggleNode = useCallback((id: string | number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  const dispatch = useAppDispatch()

  const renderNode = (node: TreeNode, depth = 0) => {
    const nodeHasChildren = hasChildren(node);
    const isExpanded = nodeHasChildren ? expanded.has(node.id) : false;

    return (
      <li key={node.id} className="space-y-1">
        <div
          className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700 dark:text-gray-200"
          style={{ paddingInlineStart: depth * 12 }}
          onClick={() => nodeHasChildren && toggleNode(node.id)}
        >
          {nodeHasChildren ? (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded border border-gray-300 text-xs font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
              {isExpanded ? "−" : "+"}
            </span>
          ) : (
            <span className="inline-flex h-5 w-5 items-center justify-center text-gray-400">•</span>
          )}
          <span onClick={() => {
            dispatch(openPopup({
              popup: 'projectFormPopup',
            }))
            dispatch(openPopup({
              popup: 'updateProjectFormPopup',
              data: node as any
            }))
          }} className="flex items-center gap-2">
            <span className="text-brand-500">{node.code}</span>
            <span>|</span>
            <span className="text-nowrap">{node.en_name || node.ar_name}</span>
          </span>
        </div>
        {nodeHasChildren && isExpanded && (
          <ul className="border-s border-gray-200 ps-5 dark:border-gray-800">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (!data?.length) {
    return (
      <div className="w-full rounded border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No projects are currently available.
      </div>
    );
  }

  return (
    <div className="w-full rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <ul className="space-y-1">{data.map((node) => renderNode(node))}</ul>
    </div>
  );
}

