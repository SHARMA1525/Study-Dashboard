"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"

export function SettingsView() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoStartBreak, setAutoStartBreak] = useState(false)
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(false)
  const [defaultPomodoroTime, setDefaultPomodoroTime] = useState("25")
  const [defaultBreakTime, setDefaultBreakTime] = useState("5")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your general preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for upcoming tasks and events</p>
                </div>
                <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sounds">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Play sounds for notifications and timer completion</p>
                </div>
                <Switch id="sounds" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>

              <div className="pt-4">
                <Button variant="destructive">Reset All Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pomodoro">
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Settings</CardTitle>
              <CardDescription>Customize your pomodoro timer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="pomodoro-time">Default Pomodoro Time (minutes)</Label>
                <Select value={defaultPomodoroTime} onValueChange={setDefaultPomodoroTime}>
                  <SelectTrigger id="pomodoro-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="break-time">Default Break Time (minutes)</Label>
                <Select value={defaultBreakTime} onValueChange={setDefaultBreakTime}>
                  <SelectTrigger id="break-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 minutes</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-break">Auto-start Breaks</Label>
                  <p className="text-sm text-muted-foreground">Automatically start break timer after pomodoro ends</p>
                </div>
                <Switch id="auto-start-break" checked={autoStartBreak} onCheckedChange={setAutoStartBreak} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-start-pomodoro">Auto-start Pomodoro</Label>
                  <p className="text-sm text-muted-foreground">Automatically start pomodoro timer after break ends</p>
                </div>
                <Switch id="auto-start-pomodoro" checked={autoStartPomodoro} onCheckedChange={setAutoStartPomodoro} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

