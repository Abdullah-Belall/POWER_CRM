"use client"
import { useEffect, useState } from "react"
import { MdOutlineClose } from "react-icons/md"
import { useAppSelector } from "@/store/hooks/selector"
import { useAppDispatch } from "@/store/hooks/dispatch"
import { closePopup, selectPopup } from "@/store/slices/popups-slice"
import { handleData } from "@/utils/base"
import { CLIENT_COLLECTOR_REQ } from "@/utils/requests/client-reqs/common-reqs"
import { SnakeBarTypeEnum } from "@/types/enums/common-enums"
import { openSnakeBar } from "@/store/slices/snake-bar-slice"
import { fillTable, getTable } from "@/store/slices/tables-slice"
import { ChartOfAccountsInterface } from "@/types/interfaces/erp/chart-of-accounts-interface"
import { AccTypeEnum } from "@/types/enums/erp/acc-enums"
import { ADD_PROJECT_CREQ, EDIT_PROJECT_CREQ, GET_PROJECTS_CREQ, GET_MAIN_PROJECTS_SELECT_LIST_CREQ } from "@/utils/erp-requests/clients-reqs/projects-reqs"
import ProjectTreeView from "@/components/projects/tree-view/project-tree-view"
import BlackLayer from "../../black-layer"
import Input from "../../input/InputField"
import Select from "../../Select"

const createInitialFormState = () => ({
  ar_name: "",
  en_name: "",
  parent_id: "",
  acc_type: '',
})

type ProjectFormState = ReturnType<typeof createInitialFormState>

export default function ProjectFormPopup() {
  const popup = useAppSelector(selectPopup("projectFormPopup"))
  const updatePopup = useAppSelector(selectPopup("updateProjectFormPopup"))
  const dispatch = useAppDispatch()
  const [data, setData] = useState<ProjectFormState>(createInitialFormState())
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<ChartOfAccountsInterface[]>([])
  const [selectedParent, setSelectedParent] = useState<ChartOfAccountsInterface | null>(null)
  const tableData = useAppSelector(getTable('projectsTable'))
  const handleClose = () =>{
    dispatch(
      closePopup({
        popup: "projectFormPopup",
      })
    )
    dispatch(
      closePopup({
        popup: "updateProjectFormPopup",
      })
    )
  }
  const fetchProjects = async () => {
    const res = await CLIENT_COLLECTOR_REQ(GET_MAIN_PROJECTS_SELECT_LIST_CREQ)
    console.log(res);
    if(res.done) {
      setProjects(res.data.projects)
    }
  }
  useEffect(() => {
    if(popup.isOpen) {
      fetchProjects()
    }
  }, [popup.isOpen, tableData])
  //* Set Selected Parent
  useEffect(() => {
    setSelectedParent(projects.find((e) => e.id === data.parent_id) ?? null)
  }, [projects, data.parent_id])
  //* Render Selected Parent
  useEffect(() => {
    if(selectedParent && updatePopup.data?.parent?.id !== selectedParent?.id) {
      setData({...data,
        acc_type: selectedParent.acc_type,
      })
    }
  }, [selectedParent])

  //* Render Selected From The Tree
  useEffect(() => {
    if (!updatePopup.isOpen) {
      setData(createInitialFormState())
      return
    }
    if (updatePopup.data) {
      setData({
        ar_name: updatePopup.data?.ar_name || "",
        en_name: updatePopup.data?.en_name || "",
        parent_id: (updatePopup.data?.parent?.id as string) || "",
        acc_type: updatePopup.data?.acc_type || "",
      })
    }
  }, [updatePopup.isOpen, updatePopup.data])
  const handleOpenSnakeBar = (type: SnakeBarTypeEnum, message: string) => {
    dispatch(
      openSnakeBar({
        type,
        message,
      })
    )
  }
  const isValid = () => {
    const { ar_name, acc_type } = data
    if (ar_name.trim()?.length === 0) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Arabic name is required")
      return false
    }
    if (!acc_type) {
      handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, "Account Type is required")
      return false
    }
    return true
  }
  const refetchData = async () => {
    const refreshed = await CLIENT_COLLECTOR_REQ(GET_PROJECTS_CREQ)
      if (refreshed?.done) {
        dispatch(
          fillTable({
            tableName: "projectsTable",
            obj: {
              data: refreshed.data.projects,
              total: refreshed.data.total,
            },
          })
        )
      }
  }
  const handleSubmit = async () => {
    if (loading) return
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim()?.length > 0 ? data.en_name : undefined,
      parent_id: data.parent_id.trim()?.length > 0 ? data.parent_id : undefined,
      acc_type: data.acc_type,
    }

    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(ADD_PROJECT_CREQ, { data: payload })
    setLoading(false)

    if (res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Project created successfully")
      setData(createInitialFormState())
      await refetchData()
      return
    }

    handleOpenSnakeBar(SnakeBarTypeEnum.ERROR, res.message || "Failed to create project")
  }
  const handleUpdate = async () => {
    if(loading) return;
    if (!isValid()) return

    const payload: any = {
      ar_name: data.ar_name.trim(),
      en_name: data.en_name.trim() || undefined,
    }
    
    setLoading(true)
    const res = await CLIENT_COLLECTOR_REQ(EDIT_PROJECT_CREQ, { data: payload, id: updatePopup.data?.id })
    setLoading(false)
    if(res.done) {
      handleOpenSnakeBar(SnakeBarTypeEnum.SUCCESS, "Project updated successfully")
      setData(createInitialFormState())
      dispatch(closePopup({
        popup: 'updateProjectFormPopup'
      }))
      await refetchData()
      return
    }
  }
  useEffect(() => {
    window.HSStaticMethods?.autoInit?.();
  }, []);
  if (!popup.isOpen) {
    return null
  }

  return (
    <BlackLayer onClick={handleClose}>
      <div
        className="min-w-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Create Project</h3>
            <button
              onClick={handleClose}
              className="text-xl !bg-brand-500 hover:bg-brand-600! rounded-full text-white w-[30px] h-[30px] flex justify-center items-center"
            >
              <MdOutlineClose />
            </button>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-4 sm:p-6 max-h-[calc(100dvh-120px)] overflow-y-scroll custom-scrollbar gap-[50px]">
          <div>
            <div className="space-y-6">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Basic Info</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <Input
                          placeholder="Arabic Name"
                          value={data.ar_name}
                          onChange={(e) => handleData(setData, "ar_name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="English Name"
                          value={data.en_name}
                          onChange={(e) => handleData(setData, "en_name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-full">
                        <Select 
                        disabled={updatePopup.isOpen}
                        options={projects ? ([{
                          label: '',
                          value: ''
                        }, ...projects?.map((e) => ({label: e.en_name || e.ar_name, value: e.id}))]) : []} placeholder="Main Project" value={data.parent_id} onChange={(e) => handleData(setData, 'parent_id', e.target.value)} />
                      </div>
                    </div>
                    <div className="ml-auto w-fit">
                      <Input
                        placeholder="Level"
                        value={(selectedParent?.level ? +selectedParent?.level + 1 : 1).toString()}
                        disabled={true}
                        slug={`Level`}
                        className={'!w-[45px]'}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-[40px]">Flags</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="col-span-full">
                        <Select options={[{
                          label: AccTypeEnum.MAIN,
                          value: AccTypeEnum.MAIN,
                        },
                        {
                          label: AccTypeEnum.SUB,
                          value: AccTypeEnum.SUB,
                        }]} 
                        disabled={updatePopup.isOpen}
                        placeholder="Account Type" value={data.acc_type} onChange={(e) => handleData(setData, 'acc_type', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full flex justify-center mb-3">
                    <button
                      onClick={updatePopup.isOpen ? handleUpdate : handleSubmit}
                      className="w-fit inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : updatePopup.isOpen ? 'Edit' :"Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className=" min-w-[400px]">
          <ProjectTreeView
          />
          </div>
        </div>
      </div>
    </BlackLayer>
  )
}

