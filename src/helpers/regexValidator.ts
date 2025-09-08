// Módulo de validación con expresiones regulares para el verbo TO BE
// Basado en la especificación del proyecto de autómatas
// Programación funcional - Sin clases

export interface ValidationResult {
  isValid: boolean;
  sentenceType: "affirmative" | "negative" | "question" | "invalid";
  tense: "present" | "past" | "unknown";
  errorMessage?: string;
  feedback: string;
}

// Nota: Los patrones de sujetos se manejan directamente en las reglas de concordancia

// Patrones para formas del verbo TO BE - incluyendo contracciones
const VERB_PATTERNS = {
  // Presente afirmativo (incluyendo contracciones)
  presentAffirmative: /\b(am|is|are|'m|'s|'re)\b/i,

  // Presente negativo (incluyendo contracciones)
  presentNegative:
    /\b(am\s+not|is\s+not|are\s+not|am\s+n't|is\s+n't|are\s+n't|'m\s+not|'s\s+not|'re\s+not)\b/i,

  // Pasado afirmativo
  pastAffirmative: /\b(was|were)\b/i,

  // Pasado negativo (incluyendo contracciones)
  pastNegative: /\b(was\s+not|were\s+not|was\s+n't|were\s+n't)\b/i,
};

// Patrones para preguntas
const QUESTION_PATTERNS = {
  // Preguntas con verbo al inicio
  questionStart: /^(am|is|are|was|were)\s+/i,

  // Preguntas con pronombre interrogativo
  whQuestions: /^(what|where|when|why|how|who)\s+/i,
};

// Nota: Las reglas de concordancia se manejan directamente en validateSubjectVerbAgreement

/**
 * Detecta el tipo de oración (afirmativa, negativa, pregunta)
 */
const detectSentenceType = (
  sentence: string
): "affirmative" | "negative" | "question" | "invalid" => {
  // Verificar si es pregunta
  if (
    QUESTION_PATTERNS.questionStart.test(sentence) ||
    QUESTION_PATTERNS.whQuestions.test(sentence) ||
    sentence.endsWith("?")
  ) {
    return "question";
  }

  // Verificar si es negativa
  if (
    VERB_PATTERNS.presentNegative.test(sentence) ||
    VERB_PATTERNS.pastNegative.test(sentence)
  ) {
    return "negative";
  }

  // Verificar si es afirmativa
  if (
    VERB_PATTERNS.presentAffirmative.test(sentence) ||
    VERB_PATTERNS.pastAffirmative.test(sentence)
  ) {
    return "affirmative";
  }

  return "invalid";
};

/**
 * Detecta el tiempo verbal (presente, pasado)
 */
const detectTense = (sentence: string): "present" | "past" | "unknown" => {
  if (
    VERB_PATTERNS.presentAffirmative.test(sentence) ||
    VERB_PATTERNS.presentNegative.test(sentence)
  ) {
    return "present";
  }

  if (
    VERB_PATTERNS.pastAffirmative.test(sentence) ||
    VERB_PATTERNS.pastNegative.test(sentence)
  ) {
    return "past";
  }

  return "unknown";
};

/**
 * Valida la estructura básica de la oración - verbo TO BE + sujeto
 */
const validateStructure = (
  sentence: string
): { isValid: boolean; error?: string } => {
  // Verificar que contenga un verbo TO BE
  const hasVerb = Object.values(VERB_PATTERNS).some((pattern) =>
    pattern.test(sentence)
  );

  if (!hasVerb) {
    return { isValid: false, error: "Missing verb TO BE" };
  }

  // Verificar que tenga un sujeto (pronombres o sustantivos)
  // Patrón más estricto para detectar sujetos válidos
  const hasSubject =
    // Patrón 1: Pronombre + verbo (I am, you are, etc.)
    /\b(I|you|he|she|it|we|they)\s+(am|is|are|was|were|'m|'s|'re)\b/i.test(
      sentence
    ) ||
    // Patrón 2: Verbo + pronombre (am I, are you, etc.) - para preguntas
    /\b(am|is|are|was|were|'m|'s|'re)\s+(I|you|he|she|it|we|they)\b/i.test(
      sentence
    ) ||
    // Patrón 3: Nombre propio + verbo (John is, Mary was, etc.)
    /\b[A-Z][a-z]+\s+(am|is|are|was|were|'m|'s|'re)\b/i.test(sentence) ||
    // Patrón 4: Verbo + nombre propio (is John, was Mary, etc.) - para preguntas
    /\b(am|is|are|was|were|'m|'s|'re)\s+[A-Z][a-z]+\b/i.test(sentence) ||
    // Patrón 5: Sustantivo plural + verbo (doctors are, students were, etc.)
    /\b[a-z]+s\s+(am|is|are|was|were|'m|'s|'re)\b/i.test(sentence) ||
    // Patrón 6: Verbo + sustantivo plural (are doctors, were students, etc.) - para preguntas
    /\b(am|is|are|was|were|'m|'s|'re)\s+[a-z]+s\b/i.test(sentence);

  if (!hasSubject) {
    return {
      isValid: false,
      error:
        "Missing subject. Please include a pronoun (I, you, he, she, it, we, they) or noun.",
    };
  }

  return { isValid: true };
};

/**
 * Valida la concordancia entre sujeto y verbo - versión mejorada
 */
const validateSubjectVerbAgreement = (
  sentence: string
): { isValid: boolean; error?: string } => {
  // Errores de concordancia más específicos y detallados
  const agreementErrors = [
    // Errores con "I"
    {
      pattern: /\bi\s+is\b/i,
      error: "I + is is incorrect. Use 'I am' instead.",
    },
    {
      pattern: /\bi\s+are\b/i,
      error: "I + are is incorrect. Use 'I am' instead.",
    },

    // Errores con "you" (singular y plural)
    {
      pattern: /\byou\s+is\b/i,
      error: "You + is is incorrect. Use 'you are' instead.",
    },
    {
      pattern: /\byou\s+am\b/i,
      error: "You + am is incorrect. Use 'you are' instead.",
    },

    // Errores con "he"
    {
      pattern: /\bhe\s+am\b/i,
      error: "He + am is incorrect. Use 'he is' instead.",
    },
    {
      pattern: /\bhe\s+are\b/i,
      error: "He + are is incorrect. Use 'he is' instead.",
    },

    // Errores con "she"
    {
      pattern: /\bshe\s+am\b/i,
      error: "She + am is incorrect. Use 'she is' instead.",
    },
    {
      pattern: /\bshe\s+are\b/i,
      error: "She + are is incorrect. Use 'she is' instead.",
    },

    // Errores con "it"
    {
      pattern: /\bit\s+am\b/i,
      error: "It + am is incorrect. Use 'it is' instead.",
    },
    {
      pattern: /\bit\s+are\b/i,
      error: "It + are is incorrect. Use 'it is' instead.",
    },

    // Errores con "we" (plural)
    {
      pattern: /\bwe\s+is\b/i,
      error: "We + is is incorrect. Use 'we are' instead.",
    },
    {
      pattern: /\bwe\s+am\b/i,
      error: "We + am is incorrect. Use 'we are' instead.",
    },

    // Errores con "they" (plural)
    {
      pattern: /\bthey\s+is\b/i,
      error: "They + is is incorrect. Use 'they are' instead.",
    },
    {
      pattern: /\bthey\s+am\b/i,
      error: "They + am is incorrect. Use 'they are' instead.",
    },

    // Errores con nombres propios y sustantivos singulares
    {
      pattern: /\b[A-Z][a-z]+\s+are\b/,
      error: "Singular noun + are is incorrect. Use 'is' instead.",
    },

    // Errores con sustantivos plurales
    {
      pattern: /\b\w+s\s+is\b/i,
      error: "Plural noun + is is incorrect. Use 'are' instead.",
    },
  ];

  // Verificar errores de concordancia
  for (const error of agreementErrors) {
    if (error.pattern.test(sentence)) {
      return {
        isValid: false,
        error: error.error,
      };
    }
  }

  // Verificar patrones donde falta el sujeto después del verbo
  const missingSubjectPatterns = [
    // Patrones como "is a doctor?", "are doctors?", etc.
    {
      pattern: /\b(am|is|are|was|were|'m|'s|'re)\s+(a|an|the)\s+/i,
      error:
        "Missing subject. Please include a pronoun (I, you, he, she, it, we, they) or noun before the verb.",
    },
    // Solo detectar cuando el verbo está al inicio de la oración (sin sujeto antes)
    {
      pattern: /^(am|is|are|was|were|'m|'s|'re)\s+[a-z]+\s*$/i,
      error:
        "Missing subject. Please include a pronoun (I, you, he, she, it, we, they) or noun before the verb.",
    },
  ];

  // Verificar puntuación requerida
  const punctuationPatterns = [
    // Oraciones afirmativas y negativas deben terminar con punto
    {
      pattern: /^(?!.*\?$).*[^.!?]$/i,
      error:
        "Missing punctuation. Affirmative and negative sentences must end with a period (.).",
    },
  ];

  // Verificar preguntas mal formadas
  const malformedQuestionPatterns = [
    // Preguntas que empiezan con pronombre en lugar de verbo
    {
      pattern:
        /^(I|you|he|she|it|we|they)\s+(am|is|are|was|were|'m|'s|'re)\s+.*\?$/i,
      error:
        "Incorrect question structure. Questions should start with the verb (Am I, Are you, Is he, etc.).",
    },
    // Preguntas que empiezan con nombre propio en lugar de verbo
    {
      pattern: /^[A-Z][a-z]+\s+(am|is|are|was|were|'m|'s|'re)\s+.*\?$/i,
      error:
        "Incorrect question structure. Questions should start with the verb (Is John, Are Mary, etc.).",
    },
  ];

  // Verificar patrones específicos problemáticos
  const problematicPatterns = [
    // Patrones como "is we", "are I", etc.
    {
      pattern: /\bis\s+we\b/i,
      error: "is + we is incorrect. Use 'are we' instead.",
    },
    {
      pattern: /\bis\s+you\b/i,
      error: "is + you is incorrect. Use 'are you' instead.",
    },
    {
      pattern: /\bis\s+they\b/i,
      error: "is + they is incorrect. Use 'are they' instead.",
    },
    {
      pattern: /\bare\s+i\b/i,
      error: "are + I is incorrect. Use 'am I' instead.",
    },
    {
      pattern: /\bare\s+he\b/i,
      error: "are + he is incorrect. Use 'is he' instead.",
    },
    {
      pattern: /\bare\s+she\b/i,
      error: "are + she is incorrect. Use 'is she' instead.",
    },
    {
      pattern: /\bare\s+it\b/i,
      error: "are + it is incorrect. Use 'is it' instead.",
    },
    // Patrones problemáticos adicionales
    {
      pattern: /\bare\s+is\b/i,
      error: "are + is is incorrect. Use 'is' or 'are' consistently.",
    },
    {
      pattern: /\bis\s+are\b/i,
      error: "is + are is incorrect. Use 'is' or 'are' consistently.",
    },
    {
      pattern: /\bam\s+is\b/i,
      error: "am + is is incorrect. Use 'am' or 'is' consistently.",
    },
    {
      pattern: /\bam\s+are\b/i,
      error: "am + are is incorrect. Use 'am' or 'are' consistently.",
    },
    {
      pattern: /\bwas\s+are\b/i,
      error: "was + are is incorrect. Use 'was' or 'were' consistently.",
    },
    {
      pattern: /\bwere\s+is\b/i,
      error: "were + is is incorrect. Use 'was' or 'were' consistently.",
    },
  ];

  // Verificar patrones donde falta el sujeto
  for (const pattern of missingSubjectPatterns) {
    if (pattern.pattern.test(sentence)) {
      return {
        isValid: false,
        error: pattern.error,
      };
    }
  }

  // Verificar puntuación requerida
  for (const pattern of punctuationPatterns) {
    if (pattern.pattern.test(sentence)) {
      return {
        isValid: false,
        error: pattern.error,
      };
    }
  }

  // Verificar preguntas mal formadas
  for (const pattern of malformedQuestionPatterns) {
    if (pattern.pattern.test(sentence)) {
      return {
        isValid: false,
        error: pattern.error,
      };
    }
  }

  for (const pattern of problematicPatterns) {
    if (pattern.pattern.test(sentence)) {
      return {
        isValid: false,
        error: pattern.error,
      };
    }
  }

  return { isValid: true };
};

/**
 * Genera feedback específico para el usuario
 */
const generateFeedback = (
  sentenceType: string,
  tense: string,
  isValid: boolean,
  structureValidation: { isValid: boolean; error?: string },
  agreementValidation: { isValid: boolean; error?: string }
): string => {
  if (!isValid) {
    if (structureValidation.error === "Missing verb TO BE") {
      return "❌ Invalid sentence. Missing verb TO BE. Please use am, is, are, was, or were.";
    }
    if (
      structureValidation.error ===
      "Missing subject. Please include a pronoun (I, you, he, she, it, we, they) or noun."
    ) {
      return "❌ Invalid sentence. Missing subject. Please include a pronoun (I, you, he, she, it, we, they) or noun.";
    }
    if (agreementValidation.error) {
      return `❌ ${agreementValidation.error}`;
    }
    return "❌ Invalid sentence. Please check your grammar.";
  }

  // Generar feedback positivo
  const tenseText = tense === "present" ? "present" : "past";
  const typeText =
    sentenceType === "affirmative"
      ? "affirmative"
      : sentenceType === "negative"
      ? "negative"
      : "question";

  return `✅ Correct sentence in ${tenseText} ${typeText}! Great job!`;
};

/**
 * Valida una frase en inglés que contenga el verbo TO BE
 */
export const validateSentence = (sentence: string): ValidationResult => {
  // Limpiar la frase
  const cleanSentence = sentence.trim();

  if (!cleanSentence) {
    return {
      isValid: false,
      sentenceType: "invalid",
      tense: "unknown",
      errorMessage: "Empty sentence",
      feedback: "❌ Please enter a sentence.",
    };
  }

  // Detectar tipo de oración
  const sentenceType = detectSentenceType(cleanSentence);

  // Detectar tiempo verbal
  const tense = detectTense(cleanSentence);

  // Validar estructura básica (solo verbo TO BE)
  const structureValidation = validateStructure(cleanSentence);

  // Validar concordancia sujeto-verbo
  const agreementValidation = validateSubjectVerbAgreement(cleanSentence);

  // Determinar si es válida
  const isValid = structureValidation.isValid && agreementValidation.isValid;

  // Generar feedback
  const feedback = generateFeedback(
    sentenceType,
    tense,
    isValid,
    structureValidation,
    agreementValidation
  );

  return {
    isValid,
    sentenceType,
    tense,
    errorMessage: !isValid
      ? structureValidation.error || agreementValidation.error
      : undefined,
    feedback,
  };
};
