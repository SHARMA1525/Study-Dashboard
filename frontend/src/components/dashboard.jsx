"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState("login") // "login" | "signup"
  const [subjects, setSubjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [notes, setNotes] = useState([])
  const [activeView, setActiveView] = useState("dashboard")
  const [activeSubject, setActiveSubject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [subs, tks, nts] = await Promise.all([
        api.get("/subjects"),
        api.get("/tasks"),
        api.get("/notes"),
      ])
      setSubjects(subs)
      setTasks(tks)
      setNotes(nts)
    } catch (err) {
      console.error("Failed to fetch data", err)
      if (err.message.includes("401")) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    fetchData()
  }

  const handleSignupSuccess = () => {
    setAuthView("login")
  }

  const handleLogout = () => {
    api.logout()
    setIsAuthenticated(false)
    setSubjects([])
    setTasks([])
    setNotes([])
  }

  const overallProgress = subjects.length > 0
    ? subjects.reduce((sum, subject) => sum + (subject.progress || 0), 0) / subjects.length
    : 0

  const addSubject = async (subject) => {
    try {
      const newSub = await api.post("/subjects", subject)
      setSubjects([...subjects, newSub])
    } catch (err) {
      console.error("Failed to add subject", err)
    }
  }

  const deleteSubject = async (subjectId) => {
    try {
      await api.delete(`/subjects/${subjectId}`)
      setSubjects(subjects.filter(subject => subject.id !== subjectId))
      setTasks(tasks.filter(task => task.subjectId !== subjectId))
      setNotes(notes.filter(note => note.subjectId !== subjectId))
      if (activeSubject === subjectId) {
        setActiveView("dashboard")
        setActiveSubject(null)
      }
    } catch (err) {
      console.error("Failed to delete subject", err)
    }
  }

  const addTask = async (task) => {
    try {
      const newTask = await api.post("/tasks", task)
      setTasks([...tasks, newTask])
    } catch (err) {
      console.error("Failed to add task", err)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err) {
      console.error("Failed to delete task", err)
    }
  }

  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    try {
      const updatedTask = await api.put(`/tasks/${taskId}`, { completed: !task.completed })
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    } catch (err) {
      console.error("Failed to toggle task", err)
    }
  }

  const addNote = async (note) => {
    try {
      const newNote = await api.post("/notes", note)
      setNotes([...notes, newNote])
    } catch (err) {
      console.error("Failed to add note", err)
    }
  }

  const deleteNote = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`)
      setNotes(notes.filter(note => note.id !== noteId))
    } catch (err) {
      console.error("Failed to delete note", err)
    }
  }

  const updateSubjectProgress = async (subjectId, progress) => {
    try {
      const updatedSub = await api.put(`/subjects/${subjectId}`, { progress })
      setSubjects(subjects.map(s => s.id === subjectId ? updatedSub : s))
    } catch (err) {
      console.error("Failed to update progress", err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return authView === "login" ? (
      <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <SignupForm onSignupSuccess={handleSignupSuccess} onSwitchToLogin={() => setAuthView("login")} />
    )
  }

  return (
    <>
      <Sidebar
        subjects={subjects}
        activeView={activeView}
        setActiveView={setActiveView}
        activeSubject={activeSubject}
        setActiveSubject={setActiveSubject}
        addSubject={addSubject}
        deleteSubject={deleteSubject}
        onLogout={handleLogout}
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
    </>
  )
}

// build optimization pass

// build optimization pass

// build optimization pass

// build optimization pass
