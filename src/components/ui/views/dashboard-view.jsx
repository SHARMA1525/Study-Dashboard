"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertCircle } from "lucide-react"

export function DashboardView({ subjects, tasks, overallProgress }) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Filter tasks due today
  const tasksToday = tasks.filter((task) => task.dueDate === today && !task.completed)

  // Filter high priority tasks
  const highPriorityTasks = tasks.filter((task) => task.priority === "high" && !task.completed)

  // Calculate completed tasks percentage
  const completedTasksPercentage =
    tasks.length > 0 ? Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasksPercentage}%</div>
            <Progress value={completedTasksPercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <div className="flex mt-2 space-x-1">
              {subjects.slice(0, 5).map((subject) => (
                <div key={subject.id} className="h-2 w-full rounded-full" style={{ backgroundColor: subject.color }} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Due Today
            </CardTitle>
            <CardDescription>Tasks that need to be completed today</CardDescription>
          </CardHeader>
          <CardContent>
            {tasksToday.length > 0 ? (
              <ul className="space-y-2">
                {tasksToday.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId)
                  return (
                    <li key={task.id} className="flex items-center p-2 rounded-md bg-muted/50">
                      {subject && (
                        <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                      )}
                      <span>{task.title}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">No tasks due today!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              High Priority
            </CardTitle>
            <CardDescription>Tasks that require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {highPriorityTasks.length > 0 ? (
              <ul className="space-y-2">
                {highPriorityTasks.map((task) => {
                  const subject = subjects.find((s) => s.id === task.subjectId)
                  return (
                    <li key={task.id} className="flex items-center p-2 rounded-md bg-muted/50">
                      {subject && (
                        <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                      )}
                      <span>{task.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">No high priority tasks!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subjects Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
          <CardDescription>Track your progress across different subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                    <span>{subject.name}</span>
                  </div>
                  <span className="text-sm">{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

