"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function Dashboard() {
  // Load initial data from localStorage or use defaults
  const [subjects, setSubjects] = useLocalStorage("subjects", [
    { id: "1", name: "Mathematics", color: "#FF5733", progress: 25 },
    { id: "2", name: "Physics", color: "#33A1FF", progress: 40 },
    { id: "3", name: "Computer Science", color: "#33FF57", progress: 60 },
    { id: "4", name: "Chemistry", color: "#F033FF", progress: 15 },
  ])

  const [tasks, setTasks] = useLocalStorage("tasks", [
    { id: "1", title: "Complete Math Assignment", subjectId: "1", completed: false, dueDate: "2025-04-15", priority: "high" },
    { id: "2", title: "Study for Physics Quiz", subjectId: "2", completed: false, dueDate: "2025-04-10", priority: "medium" },
    { id: "3", title: "Finish Programming Project", subjectId: "3", completed: true, dueDate: "2025-04-05", priority: "high" },
    { id: "4", title: "Read Chemistry Chapter 5", subjectId: "4", completed: false, dueDate: "2025-04-12", priority: "low" },
  ])

  const [notes, setNotes] = useLocalStorage("notes", [
    { id: "1", title: "Calculus Formulas", content: "Remember the power rule: d/dx(x^n) = nx^(n-1)", subjectId: "1", createdAt: "2025-04-01" },
    { id: "2", title: "Newton's Laws", content: "First Law: An object at rest stays at rest...", subjectId: "2", createdAt: "2025-04-02" },
  ])

  const [activeView, setActiveView] = useState("dashboard")
  const [activeSubject, setActiveSubject] = useState(null)

  // Calculate overall progress
  const overallProgress = subjects.length > 0 
    ? subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length 
    : 0

  // Add a new subject
  const addSubject = (subject) => {
    const newSubject = {
      ...subject,
      id: Date.now().toString(),
    }
    setSubjects([...subjects, newSubject])
  }

  // Delete a subject
  const deleteSubject = (subjectId) => {
    // Delete the subject
    setSubjects(subjects.filter(subject => subject.id !== subjectId))
    
    // Delete associated tasks
    setTasks(tasks.filter(task => task.subjectId !== subjectId))
    
    // Delete associated notes
    setNotes(notes.filter(note => note.subjectId !== subjectId))
    
    // If the deleted subject was active, go back to dashboard
    if (activeSubject === subjectId) {
      setActiveView("dashboard")
      setActiveSubject(null)
    }
  }

  // Add a new task
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    }
    setTasks([...tasks, newTask])
  }

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  // Toggle task completion
  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    )
  }

  // Add a new note
  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setNotes([...notes, newNote])
  }

  // Delete a note
  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  // Update subject progress
  const updateSubjectProgress = (subjectId, progress) => {
    setSubjects(
      subjects.map(subject => 
        subject.id === subjectId ? { ...subject, progress } : subject
      )
    )
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        subjects={subjects}
        activeView={activeView}
        setActiveView={setActiveView}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        addSubject={addSubject}
        deleteSubject={deleteSubject}
      />
      <MainContent 
        activeView={activeView}
        subjects={subjects}
        tasks={tasks}
        notes={notes}
        activeSubject={activeSubject}
        overallProgress={overallProgress}
        addSubject={addSubject}
        deleteSubject={deleteSubject}
        addTask={addTask}
        deleteTask={deleteTask}
        addNote={addNote}
        deleteNote={deleteNote}
        toggleTaskCompletion={toggleTaskCompletion}
        updateSubjectProgress={updateSubjectProgress}
      />
    </div>
  )
}