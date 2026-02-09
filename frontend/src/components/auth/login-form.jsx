"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { Loader2, GraduationCap } from "lucide-react"

export function LoginForm({ onLogin, onSwitchToSignup }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            await api.login(email, password)
            onLogin()
        } catch (err) {
            setError(err.message || "Invalid email or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-[#0a0b10] text-slate-200">
            {/* LEFT SIDE: Minimal Quote Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24 bg-[#0d0e14] border-r border-white/5 relative">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 blur-[120px] rounded-full" />

                <div className="relative z-10 space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.2]">
                            Consistency is the silent engine of <span className="text-indigo-400">mastery.</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">
                            Small steps every day lead to exponential results.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-12 h-1 px-1 rounded-full bg-indigo-500/30" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Growth Mindset</span>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: Auth Panel */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-indigo-400 mb-2">
                            <GraduationCap size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-sm text-slate-500 font-medium italic">"The secret of getting ahead is getting started."</p>
                    </div>

                    <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-xl ring-1 ring-white/10 overflow-hidden">
                        <CardHeader className="pb-4 pt-8">
                            <CardTitle className="text-lg font-bold text-white text-center">Login to Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all rounded-lg text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" title="Password" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 bg-white/5 border-white/10 text-white focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all rounded-lg text-sm"
                                    />
                                </div>
                                {error && (
                                    <div className="text-[11px] font-bold text-red-400/90 bg-red-400/5 border border-red-400/10 p-2.5 rounded-lg text-center">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow-lg transition-all duration-300 active:scale-[0.98] mt-2"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter className="pb-8 pt-0 flex justify-center border-t border-white/5 bg-white/[0.01]">
                            <p className="text-xs text-slate-500 pt-6">
                                Don't have an account?{" "}
                                <button
                                    onClick={onSwitchToSignup}
                                    className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Sign Up
                                </button>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
