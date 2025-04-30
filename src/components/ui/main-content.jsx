"use client"

import { DashboardView } from "@/components/views/dashboard-view"
import { TasksView } from "@/components/views/tasks-view"
import { PomodoroView } from "@/components/views/pomodoro-view"
import { ProgressView } from "@/components/views/progress-view"
import { NotesView } from "@/components/views/notes-view"
import { SubjectView } from "@/components/views/subject-view"
import { SettingsView } from "@/components/views/settings-view"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainContent({
  activeView,
  subjects,
  tasks,
  notes,
  activeSubject,
  overallProgress,
  addSubject,
  deleteSubject,
  addTask,
  deleteTask,
  addNote,
  deleteNote,
  toggleTaskCompletion,
  updateSubjectProgress
}) {
  // Render the appropriate view based on activeView
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView 
            subjects={subjects}
            tasks={tasks}
            overallProgress={overallProgress}
          />
        )
      case "tasks":
        return (
          <TasksView 
            tasks={tasks}
            subjects={subjects}
            toggleTaskCompletion={toggleTaskCompletion}
            addTask={addTask}
            deleteTask={deleteTask}
          />
        )
      case "pomodoro":
        return <PomodoroView subjects={subjects} />
      case "progress":
        return (
          <ProgressView 
            subjects={subjects}
            tasks={tasks}
            overallProgress={overallProgress}
          />
        )
      case "notes":
        return (
          <NotesView 
            notes={notes}
            subjects={subjects}
            addNote={addNote}
            deleteNote={deleteNote}
          />
        )
      case "subject":
        const currentSubject = subjects.find(s => s.id === activeSubject)
        const subjectTasks = tasks.filter(t => t.subjectId === activeSubject)
        const subjectNotes = notes.filter(n => n.subjectId === activeSubject)
        
        return currentSubject ? (
          <SubjectView 
            subject={currentSubject}
            tasks={subjectTasks}
            notes={subjectNotes}
            updateProgress={updateSubjectProgress}
            addTask={addTask}
            deleteTask={deleteTask}
            addNote={addNote}
            deleteNote={deleteNote}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        ) : null
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView subjects={subjects} tasks={tasks} overallProgress={overallProgress} />
    }
  }

  return (
    <main className="flex-1 overflow-auto p-3 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          {activeView === "subject" 
            ? subjects.find(s => s.id === activeSubject)?.name 
            : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
        </h1>
        <ThemeToggle />
      </div>
      {renderView()}
    </main>
  )
}