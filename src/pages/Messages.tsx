import { Bot, Send, Plus, MessageSquare } from 'lucide-react'
import { useState } from 'react'
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

export const Messages = () => {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'Verb "TO BE" Practice',
            messages: [
                {
                    id: '1',
                    text: 'Nice to meet you, Martin! Please type a sentence in English using the verb TO BE (present or past).',
                    isBot: true,
                    timestamp: new Date()
                }
            ]
        }
    ])

    const [currentConversationId, setCurrentConversationId] = useState('1')
    const [showConversations, setShowConversations] = useState(false)
    const [newMessage, setNewMessage] = useState('')

    const currentConversation = conversations.find(c => c.id === currentConversationId)

    const createNewConversation = () => {
        const newId = Date.now().toString()
        const newConversation: Conversation = {
            id: newId,
            title: 'New Conversation',
            messages: [
                {
                    id: '1',
                    text: 'Hello! I\'m EduBot. Please type a sentence in English using the verb TO BE (present or past).',
                    isBot: true,
                    timestamp: new Date()
                }
            ]
        }
        setConversations([newConversation, ...conversations])
        setCurrentConversationId(newId)
        setShowConversations(false)
    }

    const sendMessage = () => {
        if (!newMessage.trim() || !currentConversation) return

        const userMessage = {
            id: Date.now().toString(),
            text: newMessage,
            isBot: false,
            timestamp: new Date()
        }

        // Validar la frase usando expresiones regulares
        const validationResult: ValidationResult = validateSentence(newMessage)

        // Generar respuesta del bot basada en la validación
        let botResponseText = validationResult.feedback

        // Agregar sugerencia para continuar
        if (validationResult.isValid) {
            botResponseText += "\n\nDo you want to try another sentence? (yes/no)"
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
                    title: conv.title === 'New Conversation' ? newMessage.slice(0, 30) + '...' : conv.title
                }
                : conv
        ))

        setNewMessage('')
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
            <div className={`${showConversations ? 'block' : 'hidden'} md:block w-80 bg-white border-r border-gray-200 flex-shrink-0 z-50 md:relative md:z-auto`}>
                <div className="p-4 border-b border-gray-200">
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

                <div className="overflow-y-auto">
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => {
                                setCurrentConversationId(conversation.id)
                                setShowConversations(false)
                            }}
                            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${currentConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{conversation.title}</p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {conversation.messages[conversation.messages.length - 1]?.text || 'No messages'}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 flex flex-col md:max-w-md md:mx-auto md:my-4 md:rounded-2xl md:shadow-lg overflow-hidden bg-white">
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
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
                </div>

                {/* Input Section */}
                <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Write a sentence with 'TO BE'..."
                                className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
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
