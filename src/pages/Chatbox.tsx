import { BookOpen, Bot, User, Sparkles, Zap } from "lucide-react"
import { useState } from "react"

interface ChatboxProps {
    onNameSubmit: (name: string) => void
}

export const Chatbox = ({ onNameSubmit }: ChatboxProps) => {
    const [userName, setUserName] = useState('')
    const [isAnimating, setIsAnimating] = useState(false)

    const handleSubmit = () => {
        if (userName.trim()) {
            setIsAnimating(true)
            setTimeout(() => {
                onNameSubmit(userName.trim())
            }, 500)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative">
            {/* Floating Particles */}
            <div className="floating-particles">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>

            <div className={`w-full max-w-md mx-auto glass-dark rounded-2xl p-8 hover-lift transition-all duration-500 ${isAnimating ? 'scale-105 opacity-90' : ''}`}>
                <div className="text-center pb-6">
                    <div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center pulse-glow relative">
                        <Bot className="w-12 h-12 text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-yellow-800" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Welcome, Champion!
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        I'm <span className="text-cyan-400 font-semibold">EduBot</span>, your English learning companion.<br />
                        What's your name, warrior?
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 glass rounded-xl border border-cyan-400/20 hover-glow">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-gray-200">
                            <span className="text-cyan-400 font-semibold">Mission:</span> Master the verb "TO BE" in present and past tense
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-200" htmlFor="username">
                            Enter your name, hero:
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="w-5 h-5 text-cyan-400" />
                            </div>
                            <input
                                id="username"
                                type="text"
                                placeholder="Type your name here..."
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!userName.trim() || isAnimating}
                        className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${userName.trim() && !isAnimating
                                ? 'btn-primary hover:scale-105 active:scale-95'
                                : 'bg-gray-600 cursor-not-allowed opacity-50'
                            }`}
                    >
                        {isAnimating ? (
                            <>
                                <div className="spinner"></div>
                                <span>Launching...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                <span>Start Learning</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">
                        Ready to become an English master? Let's do this! 🚀
                    </p>
                </div>
            </div>
        </div>
    )
}
