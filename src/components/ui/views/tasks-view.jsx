"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function TasksView({ tasks, subjects, toggleTaskCompletion, addTask, deleteTask }) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    subjectId: "",
    completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    priority: "medium"
  })
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAddTask = () => {
    if (newTask.title && newTask.subjectId) {
      addTask(newTask)
      setIsAddTaskOpen(false)
      setNewTask({
        title: "",
        subjectId: "",
        completed: false,
        dueDate: new Date().toISOString().split('T')[0],
        priority: "medium"
      })
    }
  }

  const handleDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete)
      setTaskToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }


  const pendingTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)


  const highPriorityTasks = tasks.filter(task => task.priority === "high" && !task.completed)
  const mediumPriorityTasks = tasks.filter(task => task.priority === "medium" && !task.completed)
  const lowPriorityTasks = tasks.filter(task => task.priority === "low" && !task.completed)


  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(task => task.dueDate === today && !task.completed)
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = tomorrow.toISOString().split('T')[0]
  const tomorrowTasks = tasks.filter(task => task.dueDate === tomorrowDate && !task.completed)
  
  const upcomingTasks = tasks.filter(task => 
    task.dueDate > tomorrowDate && !task.completed
  )

  const overdueTasks = tasks.filter(task => 
    task.dueDate < today && !task.completed
  )


  const renderTaskItem = (task) => {
    const subject = subjects.find(s => s.id === task.subjectId)
    return (
      <div key={task.id} className="flex items-center p-3 rounded-md bg-muted/50 mb-2">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={() => toggleTaskCompletion(task.id)}
          className="mr-2"
        />
        <div className="flex-1">
          <div className="flex items-center">
            {subject && (
              <div 
                className="h-3 w-3 rounded-full mr-2" 
                style={{ backgroundColor: subject.color }}
              />
            )}
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
          </div>
          <div className="flex flex-wrap items-center mt-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="mr-2">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            {subject && <span className="mr-2">{subject.name}</span>}
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
            setIsDeleteDialogOpen(true)
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete task</span>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold">Tasks</h2>
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input 
                    id="task-title" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-subject">Subject</Label>
                  <Select 
                    value={newTask.subjectId} 
                    onValueChange={(value) => setNewTask({...newTask, subjectId: value})}
                  >
                    <SelectTrigger id="task-subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input 
                    id="task-due-date" 
                    type="date" 
                    value={newTask.dueDate} 
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask({...newTask, priority: value})}
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="due-date">Due Date</TabsTrigger>
            <TabsTrigger value="priority" className="hidden md:inline-flex">Priority</TabsTrigger>
            <TabsTrigger value="completed" className="hidden md:inline-flex">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {pendingTasks.length > 0 ? (
              <div>
                {pendingTasks.map(renderTaskItem)}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending tasks!</p>
            )}
          </TabsContent>
          
          <TabsContent value="due-date" className="space-y-4">
            {overdueTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-500">Overdue</CardTitle>
                </CardHeader>
                <CardContent>
                  {overdueTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {todayTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Today</CardTitle>
                </CardHeader>
                <CardContent>
                  {todayTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {tomorrowTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Tomorrow</CardTitle>
                </CardHeader>
                <CardContent>
                  {tomorrowTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {upcomingTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {overdueTasks.length === 0 && todayTasks.length === 0 && 
             tomorrowTasks.length === 0 && upcomingTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending tasks!</p>
            )}
          </TabsContent>
          
          <TabsContent value="priority" className="space-y-4">
            {highPriorityTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-500">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  {highPriorityTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {mediumPriorityTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-500">Medium Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  {mediumPriorityTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {lowPriorityTasks.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-500">Low Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  {lowPriorityTasks.map(renderTaskItem)}
                </CardContent>
              </Card>
            )}
            
            {highPriorityTasks.length === 0 && mediumPriorityTasks.length === 0 && 
             lowPriorityTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No pending tasks!</p>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length > 0 ? (
              <div>
                {completedTasks.map(renderTaskItem)}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No completed tasks yet!</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
    </>
  )
}
