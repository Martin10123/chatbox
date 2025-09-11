# API Documentation - EduBot

## Tabla de Contenidos

- [Interfaces](#interfaces)
- [Funciones de Validación](#funciones-de-validación)
- [Patrones de Expresiones Regulares](#patrones-de-expresiones-regulares)
- [Ejemplos de Uso](#ejemplos-de-uso)

## Interfaces

### ValidationResult

```typescript
interface ValidationResult {
  isValid: boolean;
  type?: "affirmative" | "negative" | "interrogative";
  tense?: "present" | "past";
  error?: string;
}
```

**Descripción**: Representa el resultado de la validación de una frase.

**Propiedades**:
- `isValid`: Indica si la frase es gramaticalmente correcta
- `type`: Tipo de frase (afirmativa, negativa, interrogativa)
- `tense`: Tiempo verbal (presente, pasado)
- `error`: Mensaje de error si la validación falla

## Funciones de Validación

### validateToBeSentence(sentence: string): ValidationResult

**Descripción**: Función principal que valida una frase en inglés que contiene el verbo TO BE.

**Parámetros**:
- `sentence` (string): La frase a validar

**Retorna**: `ValidationResult` con el resultado de la validación

**Ejemplo**:
```typescript
const result = validateToBeSentence("I am a teacher.");
console.log(result);
// Output: { isValid: true, type: "affirmative", tense: "present" }
```

### getFeedbackMessage(result: ValidationResult): string

**Descripción**: Genera un mensaje de retroalimentación basado en el resultado de la validación.

**Parámetros**:
- `result` (ValidationResult): Resultado de la validación

**Retorna**: `string` con el mensaje de retroalimentación

**Ejemplo**:
```typescript
const result = validateToBeSentence("I is a student.");
const message = getFeedbackMessage(result);
console.log(message);
// Output: "❌ Subject-verb disagreement"
```

### validateContractions(sentence: string): boolean

**Descripción**: Valida si una frase contiene contracciones válidas del verbo TO BE.

**Parámetros**:
- `sentence` (string): La frase a validar

**Retorna**: `boolean` indicando si contiene contracciones válidas

**Ejemplo**:
```typescript
const hasContractions = validateContractions("I'm happy.");
console.log(hasContractions);
// Output: true
```

## Patrones de Expresiones Regulares

### Patrones de Sujetos

#### Pronombres Personales
```typescript
const personalPronouns = /\b(I|You|He|She|It|We|They)\b/i;
```

#### Nombres Propios
```typescript
const properNouns = /\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/;
```

#### Sustantivos Comunes con "The"
```typescript
const commonNounsWithThe = /\bThe [a-z]+(?:s)?\b/i;
```

#### Pronombres Demostrativos
```typescript
const demonstrativePronouns = /\b(This|That|These|Those) [a-z]+(?:s)?\b/i;
```

### Patrones de Verbos

#### Presente Afirmativo
```typescript
const presentAffirmative = /\b(am|is|are)\b/i;
```

#### Presente Negativo
```typescript
const presentNegative = /\b(am\s+not|is\s+not|are\s+not|am\s+n't|is\s+n't|are\s+n't)\b/i;
```

#### Pasado Afirmativo
```typescript
const pastAffirmative = /\b(was|were)\b/i;
```

#### Pasado Negativo
```typescript
const pastNegative = /\b(was\s+not|were\s+not|was\s+n't|were\s+n't)\b/i;
```

### Patrones de Preguntas

#### Preguntas con Verbo al Inicio
```typescript
const interrogativeStart = /^(Am|Is|Are|Was|Were)\s+/i;
```

#### Preguntas con Pronombres Interrogativos
```typescript
const interrogativePronouns = /^(What|Where|When|Why|How|Who)\s+/i;
```

## Ejemplos de Uso

### Validación Básica

```typescript
import { validateToBeSentence, getFeedbackMessage } from './helpers/regexValidator';

// Frase válida
const validSentence = "The cat is brown.";
const result1 = validateToBeSentence(validSentence);
console.log(result1);
// Output: { isValid: true, type: "affirmative", tense: "present" }

// Frase inválida
const invalidSentence = "I is a student.";
const result2 = validateToBeSentence(invalidSentence);
console.log(result2);
// Output: { isValid: false, error: "Subject-verb disagreement" }

// Generar mensaje de retroalimentación
const message = getFeedbackMessage(result2);
console.log(message);
// Output: "❌ Subject-verb disagreement"
```

### Validación de Preguntas

```typescript
// Pregunta válida
const question = "Are you ready?";
const result = validateToBeSentence(question);
console.log(result);
// Output: { isValid: true, type: "interrogative", tense: "present" }
```

### Validación de Contracciones

```typescript
import { validateContractions } from './helpers/regexValidator';

const sentences = [
  "I'm happy.",
  "You're tall.",
  "He's a teacher.",
  "She's not here.",
  "We're students.",
  "They're friends."
];

sentences.forEach(sentence => {
  const hasContractions = validateContractions(sentence);
  console.log(`${sentence}: ${hasContractions ? 'Contiene contracciones' : 'No contiene contracciones'}`);
});
```

### Manejo de Errores

```typescript
const testSentences = [
  "I am a teacher.",           // Válida
  "I is a student.",           // Error de concordancia
  "am happy.",                 // Sin sujeto
  "The cat brown.",            // Sin verbo
  "is a teacher.",             // Sin sujeto
  "Are you ready?",            // Pregunta válida
  "You am tall.",              // Error de concordancia
];

testSentences.forEach(sentence => {
  const result = validateToBeSentence(sentence);
  const message = getFeedbackMessage(result);
  console.log(`"${sentence}" -> ${message}`);
});
```

## Reglas de Concordancia

### Primera Persona Singular (I)
- **Presente**: `am`
- **Pasado**: `was`
- **Ejemplos**: "I am happy.", "I was sick."

### Segunda Persona (You)
- **Presente**: `are`
- **Pasado**: `were`
- **Ejemplos**: "You are tall.", "You were here."

### Tercera Persona Singular (He/She/It)
- **Presente**: `is`
- **Pasado**: `was`
- **Ejemplos**: "He is tall.", "The cat is brown.", "Maria was sick."

### Primera Persona Plural (We)
- **Presente**: `are`
- **Pasado**: `were`
- **Ejemplos**: "We are friends.", "We were happy."

### Tercera Persona Plural (They)
- **Presente**: `are`
- **Pasado**: `were`
- **Ejemplos**: "They are students.", "The cats are brown."

## Consideraciones de Rendimiento

- **Tiempo de validación**: < 50ms por frase
- **Memoria**: Uso mínimo de memoria para patrones regex
- **Escalabilidad**: Los patrones están optimizados para frases cortas y medianas

## Limitaciones

1. **Vocabulario limitado**: Solo reconoce un conjunto predefinido de palabras
2. **Solo verbo TO BE**: No maneja otros verbos auxiliares
3. **Inglés básico**: No incluye estructuras gramaticales complejas
4. **Sin análisis semántico**: Solo valida sintaxis, no significado
