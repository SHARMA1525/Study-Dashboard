"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"

export function PomodoroView({ subjects }) {

  const [mode, setMode] = useState("focus")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) 
  const [focusTime, setFocusTime] = useState(25) 
  const [breakTime, setBreakTime] = useState(5) 
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)


  const alarmSound = useRef(null)


  useEffect(() => {
    if (typeof window !== "undefined") {
      alarmSound.current = new Audio("/notification.mp3") 
    }
  }, [])


  useEffect(() => {
    let interval = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {

      if (alarmSound.current) {
        alarmSound.current.play().catch((e) => console.error("Error playing sound:", e))
      }


      if (mode === "focus") {
        setMode("break")
        setTimeLeft(breakTime * 60)
        setSessionsCompleted((prev) => prev + 1)
        setIsActive(false) 
      } else {
        setMode("focus")
        setTimeLeft(focusTime * 60)
        setIsActive(false) 
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, mode, focusTime, breakTime])


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }


  const calculateProgress = () => {
    const totalTime = mode === "focus" ? focusTime * 60 : breakTime * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  }


  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === "focus" ? focusTime * 60 : breakTime * 60)
  }

  const switchMode = () => {
    setIsActive(false)
    if (mode === "focus") {
      setMode("break")
      setTimeLeft(breakTime * 60)
    } else {
      setMode("focus")
      setTimeLeft(focusTime * 60)
    }
  }


  const updateFocusTime = (value) => {
    const newFocusTime = value[0]
    setFocusTime(newFocusTime)
    if (mode === "focus" && !isActive) {
      setTimeLeft(newFocusTime * 60)
    }
  }

  const updateBreakTime = (value) => {
    const newBreakTime = value[0]
    setBreakTime(newBreakTime)
    if (mode === "break" && !isActive) {
      setTimeLeft(newBreakTime * 60)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>
            {mode === "focus" ? "Focus on your work. Stay concentrated!" : "Take a short break. Relax your mind."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-64 h-64 rounded-full border-8 border-primary/20 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/10 transition-all duration-1000"
                style={{
                  width: `${calculateProgress()}%`,
                }}
              />
            </div>
            <div className="text-5xl font-bold z-10">{formatTime(timeLeft)}</div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button size="lg" onClick={toggleTimer} className="w-24">
              {isActive ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start
                </>
              )}
            </Button>

            <Button variant="outline" size="lg" onClick={resetTimer} className="w-24">
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>

            <Button
              variant={mode === "focus" ? "secondary" : "default"}
              size="lg"
              onClick={switchMode}
              className="w-24"
            >
              {mode === "focus" ? (
                <>
                  <Coffee className="mr-2 h-5 w-5" />
                  Break
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Focus
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">
              Sessions completed today: <span className="font-bold">{sessionsCompleted}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="focus-time">Focus Time</Label>
                <span>{focusTime} min</span>
              </div>
              <Slider id="focus-time" min={5} max={60} step={5} value={[focusTime]} onValueChange={updateFocusTime} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="break-time">Break Time</Label>
                <span>{breakTime} min</span>
              </div>
              <Slider id="break-time" min={1} max={30} step={1} value={[breakTime]} onValueChange={updateBreakTime} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Subject</CardTitle>
            <CardDescription>Select what you're working on</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedSubject || ""} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: subject.color }} />
                      {subject.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Technique</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Choose a task to work on</li>
              <li>Set the timer for 25 minutes</li>
              <li>Work on the task until the timer rings</li>
              <li>Take a short break (5 minutes)</li>
              <li>After 4 pomodoros, take a longer break (15-30 minutes)</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

