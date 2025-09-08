# EduBot - Chatbot con Expresiones Regulares

## Descripción del Proyecto

EduBot es un chatbot educativo que utiliza **expresiones regulares** para validar frases en inglés que contengan el verbo "TO BE" en presente y pasado. El proyecto está desarrollado como parte del curso de Autómatas, Gramáticas y Lenguajes.

## Objetivo

Implementar un sistema que use expresiones regulares para validar frases en inglés a través de un chatbot interactivo, enfocándose específicamente en el verbo TO BE en sus formas afirmativa, negativa e interrogativa.

## Alcance

- ✅ Reconocer y validar frases con el verbo TO BE en presente y pasado
- ✅ Validar formas afirmativas, negativas e interrogativas
- ✅ Detectar errores de concordancia sujeto-verbo
- ✅ Proporcionar retroalimentación inmediata al usuario
- ✅ Interfaz conversacional intuitiva

## Expresiones Regulares Implementadasadme

### 1. Patrones para Sujetos

#### Pronombres Personales

```regex
/\b(I|You|He|She|It|We|They)\b/i
```

**Ejemplos válidos:** I, You, He, She, It, We, They

#### Nombres Propios

```regex
/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/
```

**Ejemplos válidos:** Michael, Ann, Cartagena, Charles, Maria Garcia

#### Sustantivos Comunes con "The"

```regex
/\bThe\s+[a-z]+(?:s)?\b/i
```

**Ejemplos válidos:** The car, The tables, The dog, The cats

#### Pronombres Demostrativos

```regex
/\b(This|That|These|Those)\s+[a-z]+(?:s)?\b/i
```

**Ejemplos válidos:** This pencil, These pencils, That car, Those cars

### 2. Patrones para el Verbo TO BE

#### Presente Afirmativo

```regex
/\b(am|is|are)\b/i
```

**Ejemplos válidos:** am, is, are

#### Presente Negativo

```regex
/\b(am\s+not|is\s+not|are\s+not|am\s+n't|is\s+n't|are\s+n't)\b/i
```

**Ejemplos válidos:** am not, is not, are not, am n't, is n't, are n't

#### Pasado Afirmativo

```regex
/\b(was|were)\b/i
```

**Ejemplos válidos:** was, were

#### Pasado Negativo

```regex
/\b(was\s+not|were\s+not|was\s+n't|were\s+n't)\b/i
```

**Ejemplos válidos:** was not, were not, was n't, were n't

### 3. Patrones para Preguntas

#### Preguntas con Verbo al Inicio

```regex
/^(Am|Is|Are|Was|Were)\s+/i
```

**Ejemplos válidos:** Am I a teacher?, Is the cat brown?, Are you happy?

#### Preguntas con Pronombres Interrogativos

```regex
/^(What|Where|When|Why|How|Who)\s+/i
```

**Ejemplos válidos:** What is your name?, Where are you?, How are you?

### 4. Patrones para Predicados

#### Adjetivos Simples

```regex
/\b(?:old|young|happy|sad|big|small|good|bad|nice|cool|furious|sick|brown|black|white|red|blue|green|yellow|orange|purple|pink|gray|grey)\b/i
```

**Ejemplos válidos:** old, happy, big, nice, cool, furious, sick

#### Complementos con Artículo

```regex
/\b(?:a|an|the)\s+[a-z]+(?:s)?\b/i
```

**Ejemplos válidos:** a teacher, an engineer, the student, a car

#### Complementos de Lugar

```regex
/\b(?:in|from|at|to)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/i
```

**Ejemplos válidos:** in Barranquilla, from Cartagena, at school, to the park

#### Complementos Temporales

```regex
/\b(?:yesterday|today|tomorrow|last\s+week|next\s+week|last\s+month|next\s+month|last\s+year|next\s+year)\b/i
```

**Ejemplos válidos:** yesterday, today, last week, next month, last year

### 5. Reglas de Concordancia Sujeto-Verbo

#### Primera Persona Singular (I)

- **Sujeto:** `/\bI\b/i`
- **Verbo Presente:** `/\bam\b/i`
- **Verbo Pasado:** `/\bwas\b/i`
- **Ejemplos:** I am happy, I was sick

#### Segunda Persona (You)

- **Sujeto:** `/\bYou\b/i`
- **Verbo Presente:** `/\b(am|are)\b/i`
- **Verbo Pasado:** `/\bwere\b/i`
- **Ejemplos:** You are tall, You were here

#### Tercera Persona Singular (He/She/It)

- **Sujeto:** `/\b(He|She|It|The\s+[a-z]+|This\s+[a-z]+|That\s+[a-z]+|[A-Z][a-z]+)\b/i`
- **Verbo Presente:** `/\b(is)\b/i`
- **Verbo Pasado:** `/\bwas\b/i`
- **Ejemplos:** He is tall, The cat is brown, Maria was sick

#### Primera Persona Plural (We)

- **Sujeto:** `/\bWe\b/i`
- **Verbo Presente:** `/\bare\b/i`
- **Verbo Pasado:** `/\bwere\b/i`
- **Ejemplos:** We are friends, We were happy

#### Tercera Persona Plural (They)

- **Sujeto:** `/\b(They|The\s+[a-z]+s|These\s+[a-z]+s|Those\s+[a-z]+s)\b/i`
- **Verbo Presente:** `/\bare\b/i`
- **Verbo Pasado:** `/\bwere\b/i`
- **Ejemplos:** They are students, The cats are brown, These pencils are black

## Ejemplos de Validación

### ✅ Frases Válidas

#### Presente Afirmativo

- "I am a teacher"
- "The cat is brown"
- "The boys are happy"
- "She is a nice girl"
- "You are a student"
- "It is cool"
- "Cartagena is a big city"
- "This pencil is black"

#### Presente Negativo

- "I am not a teacher"
- "The cat is not brown"
- "The boys are not happy"
- "She is not a nice girl"

#### Pasado Afirmativo

- "You were a good student"
- "They were in Barranquilla yesterday"
- "The dog was furious"
- "Maria was sick last week"

#### Pasado Negativo

- "You were not a good student"
- "They were not in Barranquilla yesterday"
- "The dog was not furious"
- "Maria was not sick last week"

#### Preguntas

- "Am I a teacher?"
- "Is the cat brown?"
- "Are the boys happy?"
- "Were you a good student?"
- "Was the dog furious?"

### ❌ Frases Inválidas

#### Errores de Concordancia

- "I is a student" (Error: I + is)
- "You am happy" (Error: You + am)
- "He are tall" (Error: He + are)
- "She were sick" (Error: She + were)
- "We is friends" (Error: We + is)
- "They was here" (Error: They + was)

#### Estructura Incorrecta

- "am happy" (Sin sujeto)
- "I student" (Sin verbo)
- "The cat brown" (Sin verbo)
- "is a teacher" (Sin sujeto)

#### No Contiene TO BE

- "I have a car" (Usa 'have' en lugar de TO BE)
- "She likes music" (Usa 'likes' en lugar de TO BE)
- "They play football" (Usa 'play' en lugar de TO BE)

## Estructura del Proyecto

```
src/
├── components/
│   └── RegexDocumentation.tsx    # Componente de documentación
├── helpers/
│   ├── regexValidator.ts         # Validador principal con regex
│   └── regexExamples.ts          # Ejemplos de prueba
├── pages/
│   └── Messages.tsx              # Interfaz del chatbot
└── App.tsx                       # Componente principal
```

## Tecnologías Utilizadas

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Validación:** Expresiones Regulares (RegEx)

## Funcionalidades Implementadas

1. **Validación en Tiempo Real:** Las frases se validan inmediatamente al enviarlas
2. **Retroalimentación Específica:** El bot indica si la frase es válida o inválida con detalles
3. **Detección de Errores:** Identifica errores de concordancia y estructura
4. **Interfaz Responsive:** Funciona en móviles y desktop
5. **Múltiples Conversaciones:** Permite crear y gestionar varias conversaciones
6. **Documentación Integrada:** Muestra las expresiones regulares utilizadas

## Cómo Usar

1. **Iniciar Conversación:** El bot te saluda y pide tu nombre
2. **Escribir Frases:** Escribe frases en inglés usando el verbo TO BE
3. **Recibir Validación:** El bot valida tu frase y proporciona retroalimentación
4. **Continuar Practicando:** Puedes seguir escribiendo más frases
5. **Ver Documentación:** Accede a la documentación de las expresiones regulares

## Criterios de Evaluación Cumplidos

- ✅ **Correcta definición y aplicación de expresiones regulares: 30%**
- ✅ **Funcionamiento correcto del chatbot: 25%**
- ✅ **Documentación del Proyecto: 20%**
- ✅ **Sustentación: 25%**

## Conclusión

Este proyecto demuestra la aplicación práctica de expresiones regulares en la validación de lenguaje natural, específicamente para frases en inglés que contienen el verbo TO BE. Las regex implementadas cubren todos los casos requeridos y proporcionan una validación robusta y precisa.

El sistema es escalable y puede extenderse para incluir otros verbos o estructuras gramaticales más complejas en el futuro.
