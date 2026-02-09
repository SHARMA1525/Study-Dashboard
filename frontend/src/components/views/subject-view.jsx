"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Calendar, Trash2 } from 'lucide-react'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SubjectView({ 
  subject, 
  tasks, 
  notes, 
  updateProgress, 
  addTask, 
  deleteTask,
  addNote, 
  deleteNote,
  toggleTaskCompletion 
}) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    subjectId: subject.id,
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    priority: "medium",
  })
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    subjectId: subject.id,
  })
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false)
  const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = useState(false)

  const handleAddTask = () => {
    if (newTask.title) {
      addTask(newTask)
      setIsAddTaskOpen(false)
      setNewTask({
        title: "",
        subjectId: subject.id,
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        priority: "medium",
      })
    }
  }

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      addNote(newNote)
      setIsAddNoteOpen(false)
      setNewNote({
        title: "",
        content: "",
        subjectId: subject.id,
      })
    }
  }

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete)
      setTaskToDelete(null)
      setIsDeleteTaskDialogOpen(false)
    }
  }

  const handleDeleteNote = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete)
      setNoteToDelete(null)
      setIsDeleteNoteDialogOpen(false)
    }
  }

  const handleProgressChange = (value) => {
    updateProgress(subject.id, value[0])
  }


  const completedTasksPercentage =
    tasks.length > 0 ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0


  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Track and update your progress in {subject.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Progress:</span>
                <span className="font-bold">{subject.progress}%</span>
              </div>
              <Slider
                value={[subject.progress]}
                onValueChange={handleProgressChange}
                max={100}
                step={5}
                className="py-4"
              />
              <Progress value={subject.progress} className="h-2" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>

                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{completedTasksPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Tasks Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tasks for {subject.name}</h3>
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task for {subject.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-due-date">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                      >
                        <SelectTrigger id="task-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddTask}>Add Task</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {pendingTasks.length > 0 ? (
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Pending Tasks</h4>
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-3 rounded-md bg-muted/50">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span>{task.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span className="mr-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setTaskToDelete(task.id)
                        setIsDeleteTaskDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete task</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4 mb-4">No pending tasks for this subject!</p>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Completed Tasks</h4>
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center p-3 rounded-md bg-muted/50">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="line-through text-muted-foreground">{task.title}</span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => {
                        setTaskToDelete(task.id)
                        setIsDeleteTaskDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete task</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notes for {subject.name}</h3>
              <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Add New Note for {subject.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="note-title">Title</Label>
                      <Input
                        id="note-title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Note title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="note-content">Content</Label>
                      <Textarea
                        id="note-content"
                        rows={8}
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Write your note here..."
                      />
                    </div>
                    <Button onClick={handleAddNote}>Save Note</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <Card key={note.id} className="flex flex-col">
                    <CardHeader className="pb-2 flex flex-row justify-between items-start">
                      <CardTitle>{note.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => {
                          setNoteToDelete(note.id)
                          setIsDeleteNoteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete note</span>
                      </Button>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </CardContent>
                    <CardFooter className="pt-2 text-xs text-muted-foreground">
                      Created: {new Date(note.createdAt).toLocaleDateString()}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No notes for this subject yet</p>
                <Button variant="outline" onClick={() => setIsAddNoteOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create your first note
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={isDeleteTaskDialogOpen} onOpenChange={setIsDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteNoteDialogOpen} onOpenChange={setIsDeleteNoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
