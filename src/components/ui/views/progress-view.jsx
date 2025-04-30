"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProgressView({ subjects, tasks, overallProgress }) {
  // Calculate task completion rate by subject
  const taskCompletionBySubject = subjects.map((subject) => {
    const subjectTasks = tasks.filter((task) => task.subjectId === subject.id)
    const completedTasks = subjectTasks.filter((task) => task.completed)
    const completionRate = subjectTasks.length > 0 ? (completedTasks.length / subjectTasks.length) * 100 : 0

    return {
      ...subject,
      taskCount: subjectTasks.length,
      completedTaskCount: completedTasks.length,
      completionRate,
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>Your combined progress across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full border-8 border-primary/20 flex items-center justify-center mb-6 relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeOpacity="0.2" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${overallProgress * 2.51} 251`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="text-4xl font-bold">{Math.round(overallProgress)}%</div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{subjects.length}</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{tasks.length}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{tasks.filter((t) => t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>

              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{tasks.filter((t) => !t.completed).length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="subjects">Subject Progress</TabsTrigger>
          <TabsTrigger value="tasks">Task Completion</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
              <CardDescription>Track your progress in each subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjects.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <span className="font-bold">{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion</CardTitle>
              <CardDescription>Track your task completion by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {taskCompletionBySubject.map((subject) => (
                  <div key={subject.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.completedTaskCount}/{subject.taskCount} tasks
                      </span>
                    </div>
                    <Progress value={subject.completionRate} className="h-2" />
                    <div className="text-right text-sm font-medium">{Math.round(subject.completionRate)}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

