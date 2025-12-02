"use client"
import TableActions from "@/components/common/table-actions";
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs";
import { useAppDispatch } from "@/store/hooks/dispatch";
import { fillTable } from "@/store/slices/tables-slice";
import { useEffect } from "react";
import DeleteAlertFormPopup from "@/components/form/common/delete-alert";
import { useAppSelector } from "@/store/hooks/selector";
import { closePopup, selectPopup } from "@/store/slices/popups-slice";
import { openSnakeBar } from "@/store/slices/snake-bar-slice";
import { SnakeBarTypeEnum } from "@/types/enums/common-enums";
import { DELETE_PROJECT_CREQ, GET_PROJECTS_CREQ } from "@/utils/erp-requests/clients-reqs/projects-reqs";
import ProjectsTable from "@/components/tables/erp/projects/projects-table";
import ProjectTreeView from "@/components/projects/tree-view/project-tree-view";
import ProjectFormPopup from "@/components/form/erp/projects/project-form-popup";

export default function Projects() {
  const dispatch = useAppDispatch()
  const fetchData = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_PROJECTS_CREQ);
    if(res.done) {
      dispatch(fillTable({
        tableName: 'projectsTable',
        obj: {
          data: res.data.projects,
          total: res.data.total
        }
      }))
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  const deleteProjectPopup = useAppSelector(selectPopup('deleteProjectAlert'))
  return (
    <>
      <div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Projects
              </h3>
            </div>
            <TableActions popup={"projectFormPopup"} btn={"Create Project"} />
          </div>
          <div className="flex w-full h-full gap-2">
            <div className="w-full">
              <ProjectsTable />
            </div>
            <div>
              <ProjectTreeView />
            </div>
          </div>
        </div>
      </div>
      <ProjectFormPopup />
      {/* <UpdateAccountsFormPopup /> */}
      <DeleteAlertFormPopup popupName={'deleteProjectAlert'} onDone={async () => {
        const res = await CLIENT_COLLECTOR_REQ(DELETE_PROJECT_CREQ, {id : deleteProjectPopup.data?.id})
        if(res.done){
          fetchData()
          dispatch(closePopup({popup: 'deleteProjectAlert'}))
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.SUCCESS,
            message: 'Project deleted successfully'
          }))
        } else {
          dispatch(openSnakeBar({
            type: SnakeBarTypeEnum.ERROR,
            message: res.message
          }))
        }
      }} />
    </>
  );
}
