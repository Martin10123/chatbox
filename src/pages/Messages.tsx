import { Bot, Send, Plus, MessageSquare, Trash2, LogOut, User, Sparkles, Star, Crown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { validateToBeSentence, getFeedbackMessage } from '../helpers/regexValidator'
import type { ValidationResult } from '../helpers/regexValidator'

interface Conversation {
    id: string
    title: string
    messages: Array<{
        id: string
        text: string
        isBot: boolean
        timestamp: Date
    }>
}

interface MessagesProps {
    userName: string
    onNameChange: () => void
}

export const Messages = ({ userName, onNameChange }: MessagesProps) => {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'English Mastery Quest',
            messages: [
                {
                    id: '1',
                    text: `Welcome to the arena, ${userName}! 🏆 Ready to conquer the verb TO BE? Type a sentence using TO BE in present or past tense, champion!`,
                    isBot: true,
                    timestamp: new Date()
                }
            ]
        }
    ])

    const [currentConversationId, setCurrentConversationId] = useState('1')
    const [showConversations, setShowConversations] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const currentConversation = conversations.find(c => c.id === currentConversationId)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentConversation?.messages, isLoading])

    useEffect(() => {
        scrollToBottom()
    }, [currentConversationId])

    const createNewConversation = () => {
        const newId = Date.now().toString()
        const newConversation: Conversation = {
            id: newId,
            title: 'New Battle Arena',
            messages: [
                {
                    id: '1',
                    text: `New quest begins, ${userName}! ⚔️ I'm EduBot, your English training partner. Let's master the verb TO BE together!`,
                    isBot: true,
                    timestamp: new Date()
                }
            ]
        }
        setConversations([newConversation, ...conversations])
        setCurrentConversationId(newId)
        setShowConversations(false)
    }

    const deleteConversation = (conversationId: string) => {
        const updatedConversations = conversations.filter(conv => conv.id !== conversationId)
        setConversations(updatedConversations)

        if (conversationId === currentConversationId) {
            if (updatedConversations.length > 0) {
                setCurrentConversationId(updatedConversations[0].id)
            } else {
                createNewConversation()
            }
        }
    }

    const handleLogout = () => {
        setConversations([])
        setCurrentConversationId('')

        onNameChange()
    }

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentConversation || isLoading) return

        const userMessage = {
            id: Date.now().toString(),
            text: newMessage,
            isBot: false,
            timestamp: new Date()
        }

        setConversations(conversations.map(conv =>
            conv.id === currentConversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, userMessage],
                    title: conv.title === 'New Conversation' ? newMessage.slice(0, 30) + '...' : conv.title
                }
                : conv
        ))

        const messageToSend = newMessage
        setNewMessage('')
        setIsLoading(true)

        const messageLength = messageToSend.length
        const loadingTime = messageLength > 50 ? Math.random() * 2000 + 4000 : Math.random() * 1000 + 2000

        await new Promise(resolve => setTimeout(resolve, loadingTime))

        const validationResult: ValidationResult = validateToBeSentence(messageToSend)

        let botResponseText = getFeedbackMessage(validationResult)

        if (validationResult.isValid) {
            botResponseText += "\n\n🎉 Excellent work, warrior! You're getting stronger! Try another sentence with the verb TO BE to level up!"
        } else {
            botResponseText += "\n\n💪 Don't give up, champion! Every master was once a beginner. Try again with a sentence using the verb TO BE in present or past tense."
        }

        const botResponse = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            isBot: true,
            timestamp: new Date()
        }

        setConversations(conversations.map(conv =>
            conv.id === currentConversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, userMessage, botResponse],
                    title: conv.title === 'New Conversation' ? messageToSend.slice(0, 30) + '...' : conv.title
                }
                : conv
        ))

        setIsLoading(false)

        setTimeout(() => {
            scrollToBottom()
            inputRef.current?.focus()
        }, 100)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="min-h-screen animated-bg flex relative">
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
            {showConversations && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowConversations(false)}
                />
            )}

            <div className={`${showConversations ? 'block' : 'hidden'} md:flex md:flex-col w-80 glass-dark border-r border-cyan-400/20 flex-shrink-0 z-50 md:sticky md:top-0 md:h-screen`}>
                <div className="p-4 border-b border-cyan-400/20 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Crown className="w-5 h-5 text-yellow-400" />
                            Battle Logs
                        </h2>
                        <button
                            onClick={createNewConversation}
                            className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 cursor-pointer text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`w-full text-left p-4 border-b border-cyan-400/10 hover:bg-white/5 transition-all duration-300 hover:scale-105 ${currentConversationId === conversation.id ? 'bg-cyan-400/20 border-l-4 border-l-cyan-400 pulse-glow' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setCurrentConversationId(conversation.id)
                                        setShowConversations(false)
                                    }}
                                    className="flex items-center gap-3 flex-1 min-w-0"
                                >
                                    <MessageSquare className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-white truncate">{conversation.title}</p>
                                        <p className="text-xs text-gray-300 truncate">
                                            {conversation.messages[conversation.messages.length - 1]?.text || 'No messages'}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteConversation(conversation.id)
                                    }}
                                    className="w-6 h-6 text-gray-400 hover:text-red-400 cursor-pointer transition-all duration-300 hover:scale-110 flex-shrink-0"
                                    title="Delete conversation"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col md:max-w-md md:mx-auto md:my-4 md:rounded-2xl overflow-hidden glass-dark h-screen md:h-auto md:max-h-[calc(100vh-2rem)]">
                <div className="glass px-4 py-4 border-b border-cyan-400/20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowConversations(!showConversations)}
                            className="md:hidden w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                        >
                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                        </button>

                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center pulse-glow relative">
                            <Bot className="w-6 h-6 text-white" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="w-2 h-2 text-yellow-800" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">EduBot</span>
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                            </h2>
                            <p className="text-sm text-gray-300">{currentConversation?.title || 'English Mastery Quest'}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-8 h-8 bg-red-500/30 hover:bg-red-500/50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 mr-2 border border-red-400/30"
                            title="Logout and clear all conversations"
                        >
                            <LogOut className="w-4 h-4 text-red-300" />
                        </button>

                        <button
                            onClick={createNewConversation}
                            className="md:hidden w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0" ref={messagesContainerRef}>
                    {currentConversation?.messages.map((message, index) => (
                        <div key={message.id} className={`flex items-start gap-3 message-enter ${message.isBot ? '' : 'flex-row-reverse'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                            {message.isBot && (
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 pulse-glow">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            <div className={`rounded-2xl px-4 py-3 max-w-[80%] transition-all duration-300 hover:scale-105 ${message.isBot
                                ? 'glass rounded-tl-sm border border-cyan-400/20'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-tr-sm shadow-lg'
                                }`}>
                                <p className={`text-sm leading-relaxed ${message.isBot ? 'text-white' : 'text-white'
                                    }`}>
                                    {message.text}
                                </p>
                            </div>
                            {!message.isBot && (
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all duration-300">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-start gap-3 message-bounce">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 pulse-glow">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="rounded-2xl px-4 py-3 glass rounded-tl-sm border border-cyan-400/20">
                                <div className="flex items-center space-x-2">
                                    <span className="text-white text-sm font-medium">EduBot is analyzing...</span>
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
                {isLoading}

                <div className="glass border-t border-cyan-400/20 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your TO BE sentence here, champion..."
                                disabled={isLoading}
                                className="w-full px-4 py-3 pr-12 bg-white/15 border border-cyan-400/50 rounded-full text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-white/20"
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || isLoading}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${newMessage.trim() && !isLoading
                                ? 'btn-primary hover:scale-110 active:scale-95'
                                : 'bg-gray-600 cursor-not-allowed opacity-50'
                                }`}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <Send className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
