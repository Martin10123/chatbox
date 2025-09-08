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
 * Valida la estructura básica de la oración - solo verbo TO BE
 */
const validateStructure = (
  sentence: string
): { isValid: boolean; error?: string } => {
  // Solo verificar que contenga un verbo TO BE
  const hasVerb = Object.values(VERB_PATTERNS).some((pattern) =>
    pattern.test(sentence)
  );

  if (!hasVerb) {
    return { isValid: false, error: "Missing verb TO BE" };
  }

  return { isValid: true };
};

/**
 * Valida la concordancia entre sujeto y verbo - versión simplificada
 */
const validateSubjectVerbAgreement = (
  sentence: string
): { isValid: boolean; error?: string } => {
  // Solo verificar errores obvios de concordancia
  const obviousErrors = [
    { pattern: /\bi\s+is\b/i, error: "I + is is incorrect" },
    { pattern: /\bi\s+are\b/i, error: "I + are is incorrect" },
    { pattern: /\byou\s+is\b/i, error: "You + is is incorrect" },
    { pattern: /\byou\s+am\b/i, error: "You + am is incorrect" },
    { pattern: /\bhe\s+am\b/i, error: "He + am is incorrect" },
    { pattern: /\bhe\s+are\b/i, error: "He + are is incorrect" },
    { pattern: /\bshe\s+am\b/i, error: "She + am is incorrect" },
    { pattern: /\bshe\s+are\b/i, error: "She + are is incorrect" },
    { pattern: /\bit\s+am\b/i, error: "It + am is incorrect" },
    { pattern: /\bit\s+are\b/i, error: "It + are is incorrect" },
    { pattern: /\bwe\s+is\b/i, error: "We + is is incorrect" },
    { pattern: /\bwe\s+am\b/i, error: "We + am is incorrect" },
    { pattern: /\bthey\s+is\b/i, error: "They + is is incorrect" },
    { pattern: /\bthey\s+am\b/i, error: "They + am is incorrect" },
  ];

  for (const error of obviousErrors) {
    if (error.pattern.test(sentence)) {
      return {
        isValid: false,
        error: error.error,
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
      return "❌ Invalid sentence. Missing verb TO BE.";
    }
    if (agreementValidation.error) {
      return "❌ Invalid sentence. Subject-verb agreement error.";
    }
    return "❌ Invalid sentence.";
  }

  // Generar feedback positivo
  const tenseText = tense === "present" ? "present" : "past";
  const typeText =
    sentenceType === "affirmative"
      ? "affirmative"
      : sentenceType === "negative"
      ? "negative"
      : "question";

  return `✅ Correct sentence in ${tenseText} ${typeText}.`;
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
