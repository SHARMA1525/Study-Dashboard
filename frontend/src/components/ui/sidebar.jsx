"use client"

import { useState } from "react"
import { LayoutDashboard, CheckSquare, Clock, BarChart, StickyNote, Settings, PlusCircle, Trash2 } from 'lucide-react'
import { 
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function Sidebar({ 
  subjects, 
  activeView, 
  setActiveView, 
  activeSubject, 
  setActiveSubject,
  addSubject,
  deleteSubject
}) {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [newSubject, setNewSubject] = useState({ name: "", color: "#3B82F6" })
  const [subjectToDelete, setSubjectToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleAddSubject = () => {
    if (addSubject && newSubject.name) {
      addSubject({
        name: newSubject.name,
        color: newSubject.color,
        progress: 0
      });
      setIsAddSubjectOpen(false);
      setNewSubject({ name: "", color: "#3B82F6" });
    }
  }

  const handleDeleteSubject = () => {
    if (subjectToDelete) {
      deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }

  return (
    <>
      <ShadcnSidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Study Dashboard</h1>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "dashboard"}
                    onClick={() => {
                      setActiveView("dashboard")
                      setActiveSubject(null)
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "tasks"}
                    onClick={() => {
                      setActiveView("tasks")
                      setActiveSubject(null)
                    }}
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>Tasks</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "pomodoro"}
                    onClick={() => {
                      setActiveView("pomodoro")
                      setActiveSubject(null)
                    }}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Pomodoro Timer</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "progress"}
                    onClick={() => {
                      setActiveView("progress")
                      setActiveSubject(null)
                    }}
                  >
                    <BarChart className="h-4 w-4" />
                    <span>Progress</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "notes"}
                    onClick={() => {
                      setActiveView("notes")
                      setActiveSubject(null)
                    }}
                  >
                    <StickyNote className="h-4 w-4" />
                    <span>Notes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Subjects</SidebarGroupLabel>
              <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 mr-2">
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">Add Subject</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Subject</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input 
                        id="subject-name" 
                        value={newSubject.name} 
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="subject-color">Color</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="subject-color" 
                          type="color" 
                          value={newSubject.color} 
                          onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                          className="w-12 h-8 p-1"
                        />
                        <span className="text-sm text-muted-foreground">{newSubject.color}</span>
                      </div>
                    </div>
                    <Button onClick={handleAddSubject}>Add Subject</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {subjects.map((subject) => (
                  <SidebarMenuItem key={subject.id}>
                    <SidebarMenuButton 
                      isActive={activeSubject === subject.id}
                      onClick={() => {
                        setActiveSubject(subject.id)
                        setActiveView("subject")
                      }}
                    >
                      <div 
                        className="h-3 w-3 rounded-full mr-1" 
                        style={{ backgroundColor: subject.color }}
                      />
                      <span>{subject.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction 
                      onClick={() => {
                        setSubjectToDelete(subject.id);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeView === "settings"}
                    onClick={() => {
                      setActiveView("settings")
                      setActiveSubject(null)
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </ShadcnSidebar>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject and all associated tasks and notes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubject} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}