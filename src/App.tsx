import { useState, useEffect } from "react"
import { Chatbox } from "./pages/Chatbox"
import { Messages } from "./pages/Messages"

function App() {
  const [userName, setUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar el nombre del localStorage al inicializar
  useEffect(() => {
    const savedUserName = localStorage.getItem('chatbox-user-name')
    if (savedUserName) {
      setUserName(savedUserName)
    }
    setIsLoading(false)
  }, [])

  const handleNameSubmit = (name: string) => {
    setUserName(name)
    localStorage.setItem('chatbox-user-name', name)
  }

  const handleNameChange = () => {
    setUserName(null)
    localStorage.removeItem('chatbox-user-name')
  }

  // Mostrar loading mientras se verifica el localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userName) {
    return <Chatbox onNameSubmit={handleNameSubmit} />
  }

  return <Messages userName={userName} onNameChange={handleNameChange} />
}

export default App
