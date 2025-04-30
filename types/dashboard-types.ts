export interface Subject {
  id: string
  name: string
  color: string
  progress: number
}

export interface Task {
  id: string
  title: string
  subjectId: string
  completed: boolean
  dueDate: string
  priority: "high" | "medium" | "low"
}

export interface Note {
  id: string
  title: string
  content: string
  subjectId: string
  createdAt: string
}

