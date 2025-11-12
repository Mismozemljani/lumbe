"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, FileText } from "lucide-react"
import type { Project } from "@/lib/types"

interface ProjectCalendarProps {
  projects: Project[]
  onClose: () => void
  onViewPdf?: (project: Project) => void
}

export function ProjectCalendar({ projects, onClose, onViewPdf }: ProjectCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)

  const monthNames = [
    "Januar",
    "Februar",
    "Mart",
    "April",
    "Maj",
    "Jun",
    "Jul",
    "Avgust",
    "Septembar",
    "Oktobar",
    "Novembar",
    "Decembar",
  ]

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getProjectsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return projects.filter((project) => {
      return dateStr >= project.start_date && dateStr <= project.end_date
    })
  }

  const days = []
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border border-slate-200 dark:border-slate-800" />)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const projectsOnDay = getProjectsForDate(day)
    days.push(
      <div
        key={day}
        className="h-24 border border-slate-200 dark:border-slate-800 p-1 overflow-y-auto hover:bg-slate-50 dark:hover:bg-slate-900"
      >
        <div className="font-semibold text-sm mb-1">{day}</div>
        {projectsOnDay.map((project) => (
          <div
            key={project.id}
            className="text-xs px-1 py-0.5 mb-1 rounded truncate"
            style={{
              backgroundColor: project.color + "33",
              color: project.color,
              borderLeft: `3px solid ${project.color}`,
            }}
            title={`${project.name}\n${project.start_date} - ${project.end_date}`}
          >
            {project.name}
          </div>
        ))}
      </div>,
    )
  }

  return (
    <Card className={`p-4 ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Kalendar Projekata</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} title="Ceo ekran">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-2">
        {["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-sm py-2 border border-slate-200 dark:border-slate-800"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">{days}</div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-semibold mb-3 text-sm">Aktivni Projekti:</h4>
        <div className="flex flex-wrap gap-4">
          {projects.map((project) => (
            <div key={project.id} className="border-l-4 pl-3 py-2 flex-shrink-0" style={{ borderColor: project.color }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded border border-slate-300" style={{ backgroundColor: project.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap">{project.name}</span>
                    {project.pdf_url && project.pdf_document && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <button
                          onClick={() => onViewPdf?.(project)}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1 whitespace-nowrap"
                        >
                          <FileText className="h-3 w-3 text-red-600" />
                          {project.pdf_document}
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                    {new Date(project.start_date).toLocaleDateString("sr-RS")} -{" "}
                    {new Date(project.end_date).toLocaleDateString("sr-RS")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
