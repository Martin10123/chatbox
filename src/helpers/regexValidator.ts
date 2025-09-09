// Validaciones para el verbo "To Be" en presente y pasado
// Incluye formas afirmativas, negativas, interrogativas y contracciones

export interface ValidationResult {
  isValid: boolean;
  type?: "affirmative" | "negative" | "interrogative";
  tense?: "present" | "past";
  error?: string;
}

// Patrones para sujetos
const SUBJECT_PATTERNS = {
  // Pronombres personales
  personalPronouns: /\b(I|You|He|She|It|We|They)\b/i,

  // Sustantivos propios (nombres de personas, lugares, etc.)
  properNouns: /\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/,

  // Sustantivos comunes con artículo "The"
  commonNounsWithThe: /\bThe [a-z]+(?:s)?\b/i,

  // Pronombres demostrativos + sustantivo común
  demonstrativePronouns: /\b(This|That|These|Those) [a-z]+(?:s)?\b/i,

  // Combinación de todos los tipos de sujetos (ordenado para evitar conflictos)
  allSubjects:
    /\b(I|You|He|She|It|We|They|The [a-z]+(?:s)?|This [a-z]+(?:s)?|That [a-z]+(?:s)?|These [a-z]+(?:s)?|Those [a-z]+(?:s)?|[A-Z][a-z]+(?: [A-Z][a-z]+)*)\b/i,
};

// Patrones para formas interrogativas
const INTERROGATIVE_PATTERNS = {
  // Presente interrogativo
  presentInterrogative: /\b(Am|Are|Is)\b/i,

  // Pasado interrogativo
  pastInterrogative: /\b(Was|Were)\b/i,
};

// Función para validar concordancia sujeto-verbo
function validateSubjectVerbAgreement(subject: string, verb: string): boolean {
  const subjectLower = subject.toLowerCase();
  const verbLower = verb.toLowerCase();

  // Extraer el verbo base de contracciones y formas negativas
  let baseVerb = verbLower;
  if (verbLower.includes("'")) {
    // Mapear contracciones a sus formas base
    if (verbLower === "i'm") baseVerb = "am";
    else if (["you're", "we're", "they're"].includes(verbLower))
      baseVerb = "are";
    else if (["he's", "she's", "it's"].includes(verbLower)) baseVerb = "is";
    else if (["isn't", "aren't"].includes(verbLower))
      baseVerb = verbLower.replace("n't", "");
    else if (["wasn't", "weren't"].includes(verbLower))
      baseVerb = verbLower.replace("n't", "");
    else if (verbLower.includes("'re not") || verbLower.includes("'s not")) {
      baseVerb = verbLower
        .replace(" not", "")
        .replace("'re", "")
        .replace("'s", "");
      if (verbLower.includes("'re")) baseVerb = "are";
      else if (verbLower.includes("'s")) baseVerb = "is";
    }
  } else if (verbLower.includes(" not")) {
    // Mapear formas negativas completas a sus formas base
    if (verbLower === "am not") baseVerb = "am";
    else if (verbLower === "are not") baseVerb = "are";
    else if (verbLower === "is not") baseVerb = "is";
    else if (verbLower === "was not") baseVerb = "was";
    else if (verbLower === "were not") baseVerb = "were";
  }

  // Reglas de concordancia para presente
  if (["am", "are", "is"].includes(baseVerb)) {
    if (subjectLower === "i") return baseVerb === "am";
    if (["you", "we", "they"].includes(subjectLower)) return baseVerb === "are";
    if (["he", "she", "it"].includes(subjectLower)) return baseVerb === "is";
    if (
      subjectLower.startsWith("the ") ||
      subjectLower.startsWith("this ") ||
      subjectLower.startsWith("that ") ||
      subjectLower.startsWith("these ") ||
      subjectLower.startsWith("those ")
    ) {
      // Para sustantivos, verificar si es singular o plural
      if (subjectLower.endsWith("s") && !subjectLower.endsWith("ss")) {
        return baseVerb === "are"; // Plural
      }
      return baseVerb === "is"; // Singular
    }
    // Para nombres propios, generalmente singular
    return baseVerb === "is";
  }

  // Reglas de concordancia para pasado
  if (["was", "were"].includes(baseVerb)) {
    if (["i", "he", "she", "it"].includes(subjectLower))
      return baseVerb === "was";
    if (["you", "we", "they"].includes(subjectLower))
      return baseVerb === "were";
    if (
      subjectLower.startsWith("the ") ||
      subjectLower.startsWith("this ") ||
      subjectLower.startsWith("that ") ||
      subjectLower.startsWith("these ") ||
      subjectLower.startsWith("those ")
    ) {
      if (subjectLower.endsWith("s") && !subjectLower.endsWith("ss")) {
        return baseVerb === "were"; // Plural
      }
      return baseVerb === "was"; // Singular
    }
    // Para nombres propios, generalmente singular
    return baseVerb === "was";
  }

  return false;
}

// Función para extraer el sujeto de la frase
function extractSubject(
  sentence: string,
  isQuestion: boolean = false
): string | null {
  if (isQuestion) {
    // Para preguntas, buscar el sujeto después del verbo auxiliar
    const questionWords = ["Am", "Are", "Is", "Was", "Were"];
    for (const word of questionWords) {
      const regex = new RegExp(`\\b${word}\\s+([A-Za-z]+)`, "i");
      const match = sentence.match(regex);
      if (match) {
        const potentialSubject = match[1];
        // Verificar que el sujeto extraído sea válido usando los patrones de sujetos
        if (SUBJECT_PATTERNS.allSubjects.test(potentialSubject)) {
          return potentialSubject;
        }
      }
    }
    return null; // No se encontró un sujeto válido
  }

  // Para frases normales, usar el patrón original
  const match = sentence.match(SUBJECT_PATTERNS.allSubjects);
  return match ? match[0] : null;
}

// Función para extraer el verbo de la frase
function extractVerb(sentence: string): string | null {
  // Buscar contracciones primero
  const contractionMatch = sentence.match(
    /\b(I'm|you're|he's|she's|it's|we're|they're|isn't|aren't|wasn't|weren't|I'm not|you're not|he's not|she's not|it's not|we're not|they're not)\b/i
  );
  if (contractionMatch) {
    return contractionMatch[0];
  }

  // Buscar formas completas (incluyendo negativas)
  const verbMatch = sentence.match(
    /\b(am not|are not|is not|was not|were not|am|are|is|was|were)\b/i
  );
  return verbMatch ? verbMatch[0] : null;
}

// Función principal de validación
export function validateToBeSentence(sentence: string): ValidationResult {
  // Limpiar la frase
  const cleanSentence = sentence.trim();

  if (!cleanSentence) {
    return { isValid: false, error: "Empty sentence" };
  }

  // Verificar si es una pregunta
  const isQuestion = cleanSentence.endsWith("?");
  const isAffirmativeOrNegative = cleanSentence.endsWith(".");
  const questionSentence = isQuestion
    ? cleanSentence.slice(0, -1).trim()
    : cleanSentence;

  // Extraer sujeto y verbo
  const subject = extractSubject(questionSentence, isQuestion);
  const verb = extractVerb(questionSentence);

  if (!subject) {
    return { isValid: false, error: "No valid subject found" };
  }

  if (!verb) {
    return {
      isValid: false,
      error:
        "Missing verb TO BE. Please use am, is, are, was, or were. Try again with a sentence using the verb TO BE in present or past tense.",
    };
  }

  // Validar puntuación para frases afirmativas y negativas
  if (!isQuestion && !isAffirmativeOrNegative) {
    return {
      isValid: false,
      error:
        "Missing punctuation. Affirmative and negative sentences must end with a period (.). Try again with a sentence using the verb TO BE in present or past tense.",
    };
  }

  // Determinar el tipo de frase y tiempo
  let type: "affirmative" | "negative" | "interrogative" = "affirmative";
  let tense: "present" | "past" = "present";

  // Verificar si es interrogativa
  if (isQuestion) {
    type = "interrogative";

    // Verificar que la pregunta comience con un verbo auxiliar (estructura correcta)
    const interrogativeMatch =
      questionSentence.match(INTERROGATIVE_PATTERNS.presentInterrogative) ||
      questionSentence.match(INTERROGATIVE_PATTERNS.pastInterrogative);

    if (!interrogativeMatch) {
      return {
        isValid: false,
        error:
          "Invalid question structure. Questions must start with Am, Are, Is, Was, or Were. Try again with a sentence using the verb TO BE in present or past tense.",
      };
    }

    // Verificar que el verbo auxiliar esté al inicio de la frase (case insensitive)
    const questionStart = questionSentence.trim().split(" ")[0];
    const questionStartLower = questionStart.toLowerCase();
    if (!["am", "are", "is", "was", "were"].includes(questionStartLower)) {
      return {
        isValid: false,
        error:
          "Invalid question structure. Questions must start with Am, Are, Is, Was, or Were. Try again with a sentence using the verb TO BE in present or past tense.",
      };
    }

    // Verificar concordancia en preguntas
    const questionVerb = interrogativeMatch[0].toLowerCase();
    if (!validateSubjectVerbAgreement(subject, questionVerb)) {
      return {
        isValid: false,
        error:
          "Subject-verb disagreement in question Try again with a sentence using the verb TO BE in present or past tense.",
      };
    }

    tense = ["am", "are", "is"].includes(questionVerb) ? "present" : "past";
  } else {
    // Verificar si es negativa
    if (
      verb.toLowerCase().includes("not") ||
      verb.toLowerCase().includes("n't")
    ) {
      type = "negative";
    }

    // Determinar tiempo y validar concordancia
    if (
      [
        "am",
        "are",
        "is",
        "i'm",
        "you're",
        "he's",
        "she's",
        "it's",
        "we're",
        "they're",
        "am not",
        "are not",
        "is not",
        "i'm not",
        "you're not",
        "he's not",
        "she's not",
        "it's not",
        "we're not",
        "they're not",
        "isn't",
        "aren't",
      ].some((v) => verb.toLowerCase().includes(v))
    ) {
      tense = "present";
    } else if (
      ["was", "were", "wasn't", "weren't", "was not", "were not"].some((v) =>
        verb.toLowerCase().includes(v)
      )
    ) {
      tense = "past";
    }

    // Validar concordancia sujeto-verbo
    if (!validateSubjectVerbAgreement(subject, verb)) {
      return { isValid: false, error: "Subject-verb disagreement" };
    }
  }

  return {
    isValid: true,
    type,
    tense,
  };
}

// Función para obtener mensaje de retroalimentación
export function getFeedbackMessage(result: ValidationResult): string {
  if (!result.isValid) {
    return `❌ ${result.error}`;
  }

  const typeMessages = {
    affirmative: "Correct sentence in",
    negative: "Correct sentence in",
    interrogative: "Correct sentence in",
  };

  const tenseMessages = {
    present: "present",
    past: "past",
  };

  return `✅ ${typeMessages[result.type!]} ${tenseMessages[result.tense!]} ${
    result.type
  }! Great job! Great! Try another sentence with the verb TO BE.`;
}

// Función para validar contracciones específicas
export function validateContractions(sentence: string): boolean {
  const contractionPatterns = [
    // Contracciones afirmativas presente
    /\bI'm\b/i,
    /\byou're\b/i,
    /\bhe's\b/i,
    /\bshe's\b/i,
    /\bit's\b/i,
    /\bwe're\b/i,
    /\bthey're\b/i,

    // Contracciones negativas presente
    /\bisn't\b/i,
    /\baren't\b/i,
    /\bI'm not\b/i,
    /\byou're not\b/i,
    /\bhe's not\b/i,
    /\bshe's not\b/i,
    /\bit's not\b/i,
    /\bwe're not\b/i,
    /\bthey're not\b/i,

    // Contracciones negativas pasado
    /\bwasn't\b/i,
    /\bweren't\b/i,
  ];

  return contractionPatterns.some((pattern) => pattern.test(sentence));
}
