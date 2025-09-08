import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react'

export const RegexDocumentation = () => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(section)) {
            newExpanded.delete(section)
        } else {
            newExpanded.add(section)
        }
        setExpandedSections(newExpanded)
    }

    const regexPatterns = {
        subjects: {
            title: "Patrones para Sujetos",
            patterns: [
                {
                    name: "Pronombres Personales",
                    regex: "/\\b(I|You|He|She|It|We|They)\\b/i",
                    description: "Reconoce pronombres personales en inglés",
                    examples: ["I", "You", "He", "She", "It", "We", "They"]
                },
                {
                    name: "Nombres Propios",
                    regex: "/\\b[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\b/",
                    description: "Reconoce nombres propios capitalizados",
                    examples: ["Michael", "Ann", "Cartagena", "Charles", "Maria Garcia"]
                },
                {
                    name: "Sustantivos Comunes con 'The'",
                    regex: "/\\bThe\\s+[a-z]+(?:s)?\\b/i",
                    description: "Reconoce sustantivos comunes precedidos por 'The'",
                    examples: ["The car", "The tables", "The dog", "The cats"]
                },
                {
                    name: "Pronombres Demostrativos",
                    regex: "/\\b(This|That|These|Those)\\s+[a-z]+(?:s)?\\b/i",
                    description: "Reconoce pronombres demostrativos con sustantivos",
                    examples: ["This pencil", "These pencils", "That car", "Those cars"]
                }
            ]
        },
        verbs: {
            title: "Patrones para el Verbo TO BE",
            patterns: [
                {
                    name: "Presente Afirmativo",
                    regex: "/\\b(am|is|are)\\b/i",
                    description: "Formas afirmativas del verbo TO BE en presente",
                    examples: ["am", "is", "are"]
                },
                {
                    name: "Presente Negativo",
                    regex: "/\\b(am\\s+not|is\\s+not|are\\s+not|am\\s+n't|is\\s+n't|are\\s+n't)\\b/i",
                    description: "Formas negativas del verbo TO BE en presente",
                    examples: ["am not", "is not", "are not", "am n't", "is n't", "are n't"]
                },
                {
                    name: "Pasado Afirmativo",
                    regex: "/\\b(was|were)\\b/i",
                    description: "Formas afirmativas del verbo TO BE en pasado",
                    examples: ["was", "were"]
                },
                {
                    name: "Pasado Negativo",
                    regex: "/\\b(was\\s+not|were\\s+not|was\\s+n't|were\\s+n't)\\b/i",
                    description: "Formas negativas del verbo TO BE en pasado",
                    examples: ["was not", "were not", "was n't", "were n't"]
                }
            ]
        },
        questions: {
            title: "Patrones para Preguntas",
            patterns: [
                {
                    name: "Preguntas con Verbo al Inicio",
                    regex: "/^(Am|Is|Are|Was|Were)\\s+/i",
                    description: "Preguntas que comienzan con el verbo TO BE",
                    examples: ["Am I a teacher?", "Is the cat brown?", "Are you happy?"]
                },
                {
                    name: "Preguntas con Pronombres Interrogativos",
                    regex: "/^(What|Where|When|Why|How|Who)\\s+/i",
                    description: "Preguntas que comienzan con pronombres interrogativos",
                    examples: ["What is your name?", "Where are you?", "How are you?"]
                }
            ]
        },
        predicates: {
            title: "Patrones para Predicados",
            patterns: [
                {
                    name: "Adjetivos Simples",
                    regex: "/\\b(?:old|young|happy|sad|big|small|good|bad|nice|cool|furious|sick|brown|black|white|red|blue|green|yellow|orange|purple|pink|gray|grey)\\b/i",
                    description: "Adjetivos comunes que pueden funcionar como predicados",
                    examples: ["old", "happy", "big", "nice", "cool", "furious", "sick"]
                },
                {
                    name: "Complementos con Artículo",
                    regex: "/\\b(?:a|an|the)\\s+[a-z]+(?:s)?\\b/i",
                    description: "Complementos que incluyen artículos",
                    examples: ["a teacher", "an engineer", "the student", "a car"]
                },
                {
                    name: "Complementos de Lugar",
                    regex: "/\\b(?:in|from|at|to)\\s+[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*\\b/i",
                    description: "Complementos que indican lugar",
                    examples: ["in Barranquilla", "from Cartagena", "at school", "to the park"]
                },
                {
                    name: "Complementos Temporales",
                    regex: "/\\b(?:yesterday|today|tomorrow|last\\s+week|next\\s+week|last\\s+month|next\\s+month|last\\s+year|next\\s+year)\\b/i",
                    description: "Complementos que indican tiempo",
                    examples: ["yesterday", "today", "last week", "next month", "last year"]
                }
            ]
        },
        agreement: {
            title: "Reglas de Concordancia Sujeto-Verbo",
            patterns: [
                {
                    name: "Primera Persona Singular (I)",
                    regex: "Sujeto: /\\bI\\b/i | Verbo Presente: /\\bam\\b/i | Verbo Pasado: /\\bwas\\b/i",
                    description: "Concordancia para la primera persona singular",
                    examples: ["I am happy", "I was sick"]
                },
                {
                    name: "Segunda Persona (You)",
                    regex: "Sujeto: /\\bYou\\b/i | Verbo Presente: /\\b(am|are)\\b/i | Verbo Pasado: /\\bwere\\b/i",
                    description: "Concordancia para la segunda persona",
                    examples: ["You are tall", "You were here"]
                },
                {
                    name: "Tercera Persona Singular (He/She/It)",
                    regex: "Sujeto: /\\b(He|She|It|The\\s+[a-z]+|This\\s+[a-z]+|That\\s+[a-z]+|[A-Z][a-z]+)\\b/i | Verbo Presente: /\\b(is)\\b/i | Verbo Pasado: /\\bwas\\b/i",
                    description: "Concordancia para la tercera persona singular",
                    examples: ["He is tall", "The cat is brown", "Maria was sick"]
                },
                {
                    name: "Primera Persona Plural (We)",
                    regex: "Sujeto: /\\bWe\\b/i | Verbo Presente: /\\bare\\b/i | Verbo Pasado: /\\bwere\\b/i",
                    description: "Concordancia para la primera persona plural",
                    examples: ["We are friends", "We were happy"]
                },
                {
                    name: "Tercera Persona Plural (They)",
                    regex: "Sujeto: /\\b(They|The\\s+[a-z]+s|These\\s+[a-z]+s|Those\\s+[a-z]+s)\\b/i | Verbo Presente: /\\bare\\b/i | Verbo Pasado: /\\bwere\\b/i",
                    description: "Concordancia para la tercera persona plural",
                    examples: ["They are students", "The cats are brown", "These pencils are black"]
                }
            ]
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Documentación de Expresiones Regulares</h2>
            </div>

            <p className="text-gray-600 mb-6">
                Esta documentación muestra todas las expresiones regulares utilizadas en el proyecto EduBot
                para validar frases en inglés que contengan el verbo TO BE en presente y pasado.
            </p>

            {Object.entries(regexPatterns).map(([key, section]) => (
                <div key={key} className="mb-6">
                    <button
                        onClick={() => toggleSection(key)}
                        className="flex items-center gap-2 w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {expandedSections.has(key) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    </button>

                    {expandedSections.has(key) && (
                        <div className="mt-4 space-y-4">
                            {section.patterns.map((pattern, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">{pattern.name}</h4>
                                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm mb-2">
                                        {pattern.regex}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{pattern.description}</p>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Ejemplos:</span>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {pattern.examples.map((example, exIndex) => (
                                                <span
                                                    key={exIndex}
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                                >
                                                    "{example}"
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
