import { BookOpen, Bot } from "lucide-react"
import { Card } from "primereact/card"

export const Chatbox = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md mx-auto shadow-md border border-gray-200 bg-white">
                <div className="text-center pb-6">
                    <div className="mx-auto mb-4 w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bot className="w-10 h-10 text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-medium text-gray-900 mb-2">Hello!</h1>
                    <p className="text-gray-600 text-balance">Mi nombre es EduBot. <br />¿Cómo te llamas?</p>
                </div>

                <div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                        <div className="text-sm text-gray-700">
                            Practica oraciones en presente y pasado del verbo "TO BE"
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
