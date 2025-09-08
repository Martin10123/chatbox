import { Bot, Send, Plus, MessageSquare, Trash2, Settings } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { validateSentence } from '../helpers/regexValidator'
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
            title: 'Verb "TO BE" Practice',
            messages: [
                {
                    id: '1',
                    text: `Nice to meet you, ${userName}! Please type a sentence in English using the verb TO BE (present or past).`,
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

    // Función para hacer scroll al final de los mensajes
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }

    // Hacer scroll cuando cambien los mensajes o el estado de loading
    useEffect(() => {
        scrollToBottom()
    }, [currentConversation?.messages, isLoading])

    // Hacer scroll cuando cambie la conversación actual
    useEffect(() => {
        scrollToBottom()
    }, [currentConversationId])

    const createNewConversation = () => {
        const newId = Date.now().toString()
        const newConversation: Conversation = {
            id: newId,
            title: 'New Conversation',
            messages: [
                {
                    id: '1',
                    text: `Hello ${userName}! I'm EduBot. Please type a sentence in English using the verb TO BE (present or past).`,
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

        // Si eliminamos la conversación actual, cambiar a la primera disponible
        if (conversationId === currentConversationId) {
            if (updatedConversations.length > 0) {
                setCurrentConversationId(updatedConversations[0].id)
            } else {
                // Si no hay conversaciones, crear una nueva
                createNewConversation()
            }
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentConversation || isLoading) return

        const userMessage = {
            id: Date.now().toString(),
            text: newMessage,
            isBot: false,
            timestamp: new Date()
        }

        // Agregar mensaje del usuario inmediatamente
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

        // Calcular tiempo de loading basado en la longitud del mensaje
        const messageLength = messageToSend.length
        const loadingTime = messageLength > 50 ? Math.random() * 2000 + 4000 : Math.random() * 1000 + 2000

        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, loadingTime))

        // Validar la frase usando expresiones regulares
        const validationResult: ValidationResult = validateSentence(messageToSend)

        // Generar respuesta del bot basada en la validación
        let botResponseText = validationResult.feedback

        // Agregar sugerencia para continuar
        if (validationResult.isValid) {
            botResponseText += "\n\nGreat! Try another sentence with the verb TO BE."
        } else {
            botResponseText += "\n\nTry again with a sentence using the verb TO BE in present or past tense."
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

        // Hacer scroll al final y focus al input después de enviar
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
        <div className="min-h-screen bg-gray-100 flex relative">
            {/* Mobile overlay */}
            {showConversations && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setShowConversations(false)}
                />
            )}

            {/* Conversations Sidebar - Hidden on mobile, visible on desktop */}
            <div className={`${showConversations ? 'block' : 'hidden'} md:flex md:flex-col w-80 bg-white border-r border-gray-200 flex-shrink-0 z-50 md:sticky md:top-0 md:h-screen`}>
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                        <button
                            onClick={createNewConversation}
                            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${currentConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
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
                                    <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{conversation.title}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {conversation.messages[conversation.messages.length - 1]?.text || 'No messages'}
                                        </p>
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        deleteConversation(conversation.id)
                                    }}
                                    className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                    title="Delete conversation"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col md:max-w-md md:mx-auto md:my-4 md:rounded-2xl md:shadow-lg overflow-hidden bg-white h-screen md:h-auto md:max-h-[calc(100vh-2rem)]">
                {/* Header */}
                <div className="bg-white px-4 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setShowConversations(!showConversations)}
                            className="md:hidden w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                        </button>

                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900">EduBot</h2>
                            <p className="text-sm text-gray-500">{currentConversation?.title || 'Verb "TO BE" Practice'}</p>
                        </div>

                        {/* Settings button */}
                        <button
                            onClick={onNameChange}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors mr-2"
                            title="Change name"
                        >
                            <Settings className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* New chat button for mobile */}
                        <button
                            onClick={createNewConversation}
                            className="md:hidden w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0" ref={messagesContainerRef}>
                    {currentConversation?.messages.map((message) => (
                        <div key={message.id} className={`flex items-start gap-3 ${message.isBot ? '' : 'flex-row-reverse'}`}>
                            {message.isBot && (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                            )}
                            <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${message.isBot
                                ? 'bg-gray-100 rounded-tl-sm'
                                : 'bg-blue-500 text-white rounded-tr-sm'
                                }`}>
                                <p className={`text-sm leading-relaxed ${message.isBot ? 'text-gray-800' : 'text-white'
                                    }`}>
                                    {message.text}
                                </p>
                            </div>
                            {!message.isBot && (
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-xs font-medium">U</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="rounded-2xl px-4 py-3 bg-gray-100 rounded-tl-sm">
                                <div className="flex items-center space-x-1">
                                    <span className="text-gray-600 text-sm">EduBot is thinking</span>
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Elemento invisible para hacer scroll */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Write a sentence with 'TO BE'..."
                                disabled={isLoading}
                                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim() || isLoading}
                            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4 text-gray-600 cursor-pointer" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
