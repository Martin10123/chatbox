// Ejemplos de uso de las expresiones regulares para el proyecto EduBot
// Basado en la especificación del proyecto de autómatas

import { validateSentence } from "./regexValidator";

export const testExamples = [
  // ✅ Ejemplos VÁLIDOS - Presente Afirmativo (incluyendo contracciones)
  "I am a teacher",
  "i'm martin", // Contracción válida
  "The cat is brown",
  "The boys are happy",
  "She is a nice girl",
  "she is my boyfriend", // Complemento libre
  "You are a student",
  "It is cool",
  "Cartagena is a big city",
  "This pencil is black",
  "We are students",
  "They are friends",

  // ✅ Ejemplos VÁLIDOS - Presente Negativo
  "I am not a teacher",
  "The cat is not brown",
  "The boys are not happy",
  "She is not a nice girl",
  "You are not a student",
  "It is not cool",
  "Cartagena is not a big city",
  "This pencil is not black",
  "We are not students",
  "They are not friends",

  // ✅ Ejemplos VÁLIDOS - Pasado Afirmativo
  "You were a good student",
  "They were in Barranquilla yesterday",
  "The dog was furious",
  "Maria was sick last week",
  "I was happy",
  "The car was red",
  "We were friends",
  "It was cold",

  // ✅ Ejemplos VÁLIDOS - Pasado Negativo
  "You were not a good student",
  "They were not in Barranquilla yesterday",
  "The dog was not furious",
  "Maria was not sick last week",
  "I was not happy",
  "The car was not red",
  "We were not friends",
  "It was not cold",

  // ✅ Ejemplos VÁLIDOS - Preguntas
  "Am I a teacher?",
  "Is the cat brown?",
  "Are the boys happy?",
  "Is she a nice girl?",
  "Are you a student?",
  "Is it cool?",
  "Is Cartagena a big city?",
  "Is this pencil black?",
  "Were you a good student?",
  "Were they in Barranquilla yesterday?",
  "Was the dog furious?",
  "Was Maria sick last week?",

  // ❌ Ejemplos INVÁLIDOS - Errores de concordancia
  "I is a student", // Error: I + is
  "You am happy", // Error: You + am
  "He are tall", // Error: He + are
  "She were sick", // Error: She + were (pasado)
  "We is friends", // Error: We + is
  "They was here", // Error: They + was

  // ❌ Ejemplos INVÁLIDOS - Estructura incorrecta
  "am happy", // Sin sujeto
  "I student", // Sin verbo
  "The cat brown", // Sin verbo
  "is a teacher", // Sin sujeto
  "are friends", // Sin sujeto

  // ❌ Ejemplos INVÁLIDOS - No contiene TO BE
  "I have a car", // Usa 'have' en lugar de TO BE
  "She likes music", // Usa 'likes' en lugar de TO BE
  "They play football", // Usa 'play' en lugar de TO BE
  "We eat pizza", // Usa 'eat' en lugar de TO BE
];

export const runValidationTests = () => {
  console.log(
    "🧪 Ejecutando pruebas de validación con expresiones regulares...\n"
  );

  testExamples.forEach((example, index) => {
    const result = validateSentence(example);
    const status = result.isValid ? "✅" : "❌";
    const type = result.sentenceType;
    const tense = result.tense;

    console.log(`${index + 1}. ${status} "${example}"`);
    console.log(`   Tipo: ${type} | Tiempo: ${tense}`);
    console.log(`   Feedback: ${result.feedback}`);
    if (result.errorMessage) {
      console.log(`   Error: ${result.errorMessage}`);
    }
    console.log("");
  });
};

// Función para probar casos específicos
export const testSpecificCases = (sentences: string[]) => {
  console.log("🔍 Probando casos específicos...\n");

  sentences.forEach((sentence, index) => {
    const result = validateSentence(sentence);
    const status = result.isValid ? "✅" : "❌";

    console.log(`${index + 1}. ${status} "${sentence}"`);
    console.log(`   Resultado: ${result.feedback}`);
    console.log("");
  });
};

// Exportar para uso en desarrollo
export default {
  testExamples,
  runValidationTests,
  testSpecificCases,
};
