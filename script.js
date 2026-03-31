// --------------------------------------------------------------
  // 1. JSON DICTIONARY (English -> Brahvi) with Part-of-Speech tags
  //    Brahvi values are left clean (placeholder style) but realistic.
  //    For demo, we fill with transliterated Brahvi-like forms.
  //    Actual Brahvi script can be added later. Here we keep clean Latin/script neutral.
  // --------------------------------------------------------------
  const sanitizeWord = (raw) => raw.toLowerCase().replace(/[^\w']/g, '');

  const dictionary = [
    // Pronouns
    { word: "i", pos: "pronoun", brahvi: "مان" },
    { word: "you", pos: "pronoun", brahvi: "تے" },
    { word: "he", pos: "pronoun", brahvi: "آ" },
    { word: "she", pos: "pronoun", brahvi: "آ" },
    { word: "we", pos: "pronoun", brahvi: "مانی" },
    { word: "they", pos: "pronoun", brahvi: "آنی" },
    { word: "me", pos: "pronoun", brahvi: "منا" },
    { word: "my", pos: "pronoun", brahvi: "مَنِ" },
    { word: "your", pos: "pronoun", brahvi: "تِنِ" },
    // Common verbs
    { word: "eat", pos: "verb", brahvi: "خا" },
    { word: "drink", pos: "verb", brahvi: "پی" },
    { word: "go", pos: "verb", brahvi: "رو" },
    { word: "come", pos: "verb", brahvi: "آ" },
    { word: "see", pos: "verb", brahvi: "بینی" },
    { word: "run", pos: "verb", brahvi: "دَو" },
    { word: "speak", pos: "verb", brahvi: "گفت" },
    { word: "say", pos: "verb", brahvi: "چی" },
    { word: "is", pos: "verb", brahvi: "اے" },
    { word: "are", pos: "verb", brahvi: "اے" },
    { word: "am", pos: "verb", brahvi: "آس" },
    // Nouns
    { word: "bread", pos: "noun", brahvi: "نان" },
    { word: "water", pos: "noun", brahvi: "آب" },
    { word: "milk", pos: "noun", brahvi: "پا__LAM_SVG__" },
    { word: "friend", pos: "noun", brahvi: "دوست" },
    { word: "house", pos: "noun", brahvi: "گِد" },
    { word: "man", pos: "noun", brahvi: "مرد" },
    { word: "woman", pos: "noun", brahvi: "زنان" },
    { word: "food", pos: "noun", brahvi: "خوراک" },
    { word: "day", pos: "noun", brahvi: "روز" },
    { word: "time", pos: "noun", brahvi: "وقت" },
    // Adjectives
    { word: "fresh", pos: "adjective", brahvi: "تازہ" },
    { word: "good", pos: "adjective", brahvi: "جوان" },
    { word: "bad", pos: "adjective", brahvi: "خراب" },
    { word: "big", pos: "adjective", brahvi: "گڑ" },
    { word: "small", pos: "adjective", brahvi: "چُک" },
    { word: "fast", pos: "adjective", brahvi: "تیز" },
    { word: "beautiful", pos: "adjective", brahvi: "سندر" },
    { word: "happy", pos: "adjective", brahvi: "خوش" },
    // Adverbs / common
    { word: "very", pos: "adverb", brahvi: "بڑی" },
    { word: "quickly", pos: "adverb", brahvi: "تیزی سار" },
    // Interjections & phrases
    { word: "hello", pos: "interjection", brahvi: "سلام" },
    { word: "hi", pos: "interjection", brahvi: "سلام" },
    { word: "thank", pos: "verb", brahvi: "مہربانی" },
    { word: "thanks", pos: "interjection", brahvi: "شکریہ" },
    { word: "yes", pos: "interjection", brahvi: "ہاں" },
    { word: "no", pos: "interjection", brahvi: "نہ" },
    // Additional for phrases
    { word: "how", pos: "adverb", brahvi: "چون" },
    { word: "what", pos: "pronoun", brahvi: "چی" },
    { word: "where", pos: "adverb", brahvi: "کوتا" },
    { word: "why", pos: "adverb", brahvi: "چوندا" },
    { word: "and", pos: "conjunction", brahvi: "او" },
    { word: "but", pos: "conjunction", brahvi: "لکن" },
    { word: "or", pos: "conjunction", brahvi: "یا" }
  ];

  // Helper: build quick lookup maps per POS and global
  const globalLookup = new Map(); // word lower => brahvi (fallback)
  const posLookup = new Map();    // word_lower+pos => brahvi

  dictionary.forEach(entry => {
    const normalizedWord = sanitizeWord(entry.word);
    if (!normalizedWord) return;
    const posKey = `${normalizedWord}|${entry.pos}`;
    posLookup.set(posKey, entry.brahvi);
    // global fallback (keep first occurrence priority)
    if (!globalLookup.has(normalizedWord)) {
      globalLookup.set(normalizedWord, entry.brahvi);
    }
  });

  const phraseDictionary = [
    { phrase: "hello friend", brahvi: "Ø³Ù„Ø§Ù… Ø¯ÙˆØ³Øª" },
    { phrase: "thank you", brahvi: "Ù…ÛØ±Ø¨Ø§Ù†ÛŒ" },
    { phrase: "how are you", brahvi: "Ú†ÙˆÙ† Ø¢ÛŒ" },
    { phrase: "good morning", brahvi: "Ú†Ø§ Ø®ÙˆØ¨ Ø²Ù†" },
    { phrase: "see you later", brahvi: "Ø¨Ù‡ Ø¨Ø§Ø¯ Ø¨ÛŒÙ†ÙŠ" },
    { phrase: "i love you", brahvi: "Ù…ÛŒÙ† ØªÙˆ Ø±ÙˆÚ©Ø¨" },
    { phrase: "what is your name", brahvi: "Ø§Ø³Ø§Ù… ØªÙˆ Ø§ÛŒØ´ Ø§ÛŒ" }
  ];
  const phraseMap = new Map();
  let maxPhraseLength = 1;
  phraseDictionary.forEach(entry => {
    const normalizedWords = entry.phrase
      .split(/\s+/)
      .map(word => sanitizeWord(word))
      .filter(Boolean);
    if (normalizedWords.length < 2) return;
    const key = normalizedWords.join(" ");
    phraseMap.set(key, {
      translation: entry.brahvi,
      pos: entry.pos || "phrase",
      phrase: entry.phrase,
      length: normalizedWords.length
    });
    maxPhraseLength = Math.max(maxPhraseLength, normalizedWords.length);
  });

  const lamGlyphSVG = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 858 1344" preserveAspectRatio="xMidYMid meet">
    <g transform="translate(0,1344) scale(0.1,-0.1)" fill="currentColor" stroke="none">
      <path d="M5624 13412 c-88 -65 -354 -329 -480 -477 -124 -146 -164 -206 -164 -245 0 -36 7 -43 188 -201 103 -90 246 -221 318 -291 164 -160 162 -160 284 -57 151 127 318 289 401 387 140 169 175 253 145 354 -33 114 -143 225 -441 446 -169 126 -186 131 -251 84z"/>
      <path d="M6266 12241 c-62 -41 -320 -309 -475 -494 l-74 -88 -70 75 c-86 95 -177 170 -347 285 -125 85 -137 91 -184 91 l-51 0 -155 -157 c-162 -165 -334 -360 -464 -526 -64 -83 -76 -104 -76 -136 0 -36 5 -42 128 -143 143 -118 407 -355 492 -442 49 -50 59 -56 96 -56 37 0 55 10 160 89 229 172 412 354 490 487 l27 45 31 -28 c17 -16 72 -65 121 -109 50 -43 154 -139 231 -211 117 -110 147 -133 172 -133 22 0 55 19 123 71 348 266 523 470 559 655 25 126 -27 252 -157 380 -88 88 -253 216 -395 308 -97 62 -133 69 -182 37z"/>
      <path d="M8371 11938 c-76 -188 -214 -546 -256 -670 -163 -474 -239 -926 -280 -1668 -3 -58 -46 -1131 -95 -2385 -116 -2950 -114 -2913 -186 -3415 -39 -274 -81 -420 -196 -680 -135 -306 -314 -568 -568 -833 -392 -410 -907 -671 -1530 -776 -464 -79 -1027 -39 -1400 99 -227 84 -405 195 -566 355 -251 248 -393 555 -450 976 -24 174 -24 555 0 744 56 447 190 932 400 1449 20 49 35 91 33 92 -6 6 -209 84 -218 84 -21 0 -227 -472 -347 -796 -265 -713 -400 -1387 -433 -2156 -23 -554 43 -922 235 -1313 111 -225 245 -403 420 -558 307 -270 630 -411 1081 -468 127 -17 528 -17 660 0 434 53 799 177 1155 391 689 413 1270 1141 1709 2141 332 756 586 1729 686 2624 37 337 47 558 95 2100 95 3107 133 3849 231 4515 11 74 22 142 25 151 3 12 -15 23 -79 48 -46 17 -85 31 -88 31 -2 0 -19 -37 -38 -82z"/>
    </g>
  </svg>`;
  const glyphPlaceholders = {
    "__LAM_SVG__": `<span class="inline-lam-glyph" aria-hidden="true">${lamGlyphSVG}</span>`
  };

  function applyGlyphPlaceholders(text) {
    let updated = text;
    Object.keys(glyphPlaceholders).forEach(key => {
      const replacement = glyphPlaceholders[key];
      const regex = new RegExp(key, "g");
      updated = updated.replace(regex, replacement);
    });
    return updated;
  }

  // simple rule-based POS tagging (basic heuristic for English)
  // returns best guessed POS for a given token (lowercased, punctuation stripped)
  function guessPartOfSpeech(token) {
    if (!token || token.length === 0) return "noun";
    const word = token.toLowerCase();
    // check common pronouns
    const pronouns = ["i", "you", "he", "she", "we", "they", "me", "my", "your", "it", "its", "him", "her", "us"];
    if (pronouns.includes(word)) return "pronoun";
    // verbs - common endings
    if (word.endsWith("ing") || word.endsWith("ed") || word === "eat" || word === "run" || word === "go" || word === "is" || word === "are" || word === "am") return "verb";
    // adjectives heuristic (ends with y, ful, ous, etc)
    if (word.endsWith("y") || word.endsWith("ful") || word.endsWith("ous") || word.endsWith("ic") || word === "big" || word === "small" || word === "fresh" || word === "good") return "adjective";
    // adverbs (ly)
    if (word.endsWith("ly")) return "adverb";
    // interjections
    const interjections = ["hello", "hi", "hey", "wow", "thanks", "yes", "no", "oh"];
    if (interjections.includes(word)) return "interjection";
    // conjunction
    const conj = ["and", "but", "or", "nor", "yet", "so"];
    if (conj.includes(word)) return "conjunction";
    // default noun
    return "noun";
  }

  // retrieve translation using POS-aware strategy:
  // 1) if exact word+POS match exists => use it
  // 2) else if global word match exists => use that
  // 3) else return null (to be bracketed)
  function translateWord(word, posHint = null) {
    const cleanWord = sanitizeWord(word);
    if (!cleanWord) return null;
    const pos = posHint || guessPartOfSpeech(cleanWord);
    const exactKey = `${cleanWord}|${pos}`;
    if (posLookup.has(exactKey)) {
      return posLookup.get(exactKey);
    }
    if (globalLookup.has(cleanWord)) {
      return globalLookup.get(cleanWord);
    }
    if (cleanWord.endsWith("s") && cleanWord.length > 1) {
      const singular = cleanWord.slice(0, -1);
      if (globalLookup.has(singular)) {
        return globalLookup.get(singular);
      }
    }
    return null;
  }

  function findPhraseMatch(startIndex, tokenList) {
    const maxCheck = Math.min(maxPhraseLength, tokenList.length - startIndex);
    for (let len = maxCheck; len >= 2; len--) {
      const segment = tokenList.slice(startIndex, startIndex + len);
      const key = segment.map(entry => entry.normalized).join(" ");
      if (phraseMap.has(key)) {
        const match = phraseMap.get(key);
        return {
          length: len,
          phrase: match.phrase,
          translation: match.translation,
          pos: match.pos,
          raw: segment.map(entry => entry.original).join(" ")
        };
      }
    }
    return null;
  }

  // ----- sentence tokenization & phrase assembly (SOV order for Brahvi) -----
  // Brahvi follows Subject-Object-Verb (SOV) word order typically.
  // Our assembly: extract tokens with POS, group by subject/verb/object/adjective etc.
  // For long phrase: we reconstruct using basic rule: [Subject] + [Object] + [Verb] + [Adjuncts]
  // but for simplicity, we apply POS-aware ordering that respects SOV.
  // We'll break sentence into chunks (words), tag them, then reorder.
  function translatePhraseToBrahvi(englishText) {
    if (!englishText.trim()) return "";
    
    // split into sentences? keep simple: translate full text preserving punctuation.
    // But we preserve punctuation at end.
    const sentences = englishText.match(/[^.!?]+[.!?]*/g) || [englishText];
    let finalTranslatedSentences = [];
    
    for (let sentence of sentences) {
      if (sentence.trim().length === 0) continue;
      // capture trailing punctuation
      const trailingPunctMatch = sentence.match(/[.!?]+$/);
      const trailingPunct = trailingPunctMatch ? trailingPunctMatch[0] : "";
      const cleanSentence = sentence.replace(/[.!?]+$/, "").trim();
      if (cleanSentence.length === 0) {
        finalTranslatedSentences.push(trailingPunct);
        continue;
      }
      
      const rawTokens = cleanSentence.split(/\s+/).filter(token => token.trim() !== "");
      const wordTokens = rawTokens
        .map(token => {
          const normalized = sanitizeWord(token);
          return normalized ? { original: token, normalized } : null;
        })
        .filter(Boolean);
      const wordItems = [];
      let tokenIndex = 0;
      while (tokenIndex < wordTokens.length) {
        const phraseMatch = findPhraseMatch(tokenIndex, wordTokens);
        if (phraseMatch) {
          wordItems.push({
            raw: phraseMatch.raw,
            word: phraseMatch.phrase,
            translation: phraseMatch.translation,
            pos: phraseMatch.pos
          });
          tokenIndex += phraseMatch.length;
          continue;
        }
        const currentToken = wordTokens[tokenIndex];
        const pos = guessPartOfSpeech(currentToken.normalized);
        const translation = translateWord(currentToken.normalized, pos);
        wordItems.push({
          raw: currentToken.original,
          word: currentToken.normalized,
          translation,
          pos
        });
        tokenIndex++;
      }
      
      // separate items that are actual words (non-null translation candidate)
      const actualWords = wordItems.filter(item => item.word !== null);
      
      // If no words have translation, return original sentence with brackets indication
      if (actualWords.length === 0) {
        finalTranslatedSentences.push("[no translation]");
        continue;
      }
      
      // ---- assemble Brahvi respecting SOV order and POS grouping ----
      let subjects = [];
      let objects = [];
      let verbs = [];
      let adjectives = [];
      let adverbs = [];
      let others = []; // rest (conjunctions, interjections, etc)
      
      for (let item of actualWords) {
        if (!item.translation) {
          // untranslated word: wrap in brackets for visibility
          others.push(`[${item.word}]`);
          continue;
        }
        const pos = item.pos;
        const translatedVal = item.translation;
        if (pos === "pronoun" && (item.word === "i" || item.word === "we" || item.word === "you" || item.word === "he" || item.word === "she" || item.word === "they")) {
          subjects.push(translatedVal);
        } else if (pos === "noun") {
          // heuristic: if noun appears before verb likely object, but for SOV we treat nouns as objects unless subject pronoun.
          objects.push(translatedVal);
        } else if (pos === "verb") {
          verbs.push(translatedVal);
        } else if (pos === "adjective") {
          adjectives.push(translatedVal);
        } else if (pos === "adverb") {
          adverbs.push(translatedVal);
        } else if (pos === "interjection") {
          others.unshift(translatedVal); // interjection at beginning
        } else {
          others.push(translatedVal);
        }
      }
      
      // Special handling for "I eat fresh bread": fresh (adj) should modify bread (noun)
      // To make natural Brahvi: we combine adjectives with object: [object_adj+object] pattern.
      let objectPhrase = "";
      if (objects.length > 0) {
        let mainObj = objects[objects.length-1]; // last noun as head
        let objAdjs = adjectives.slice();
        if (objAdjs.length > 0) {
          // In Brahvi adjective-noun order? usually adjective precedes noun (similar to English)
          objectPhrase = [...objAdjs, mainObj].join(" ");
        } else {
          objectPhrase = mainObj;
        }
      } else if (adjectives.length > 0 && objects.length === 0) {
        objectPhrase = adjectives.join(" ");
      }
      
      let subjectPhrase = subjects.length > 0 ? subjects.join(" ") : "";
      let verbPhrase = verbs.length > 0 ? verbs.join(" ") : "";
      let adverbPhrase = adverbs.length > 0 ? adverbs.join(" ") : "";
      let otherPhrase = others.filter(v => v).join(" ");
      
      // Construct final SOV: Subject + Object + (adverb) + Verb + others
      let assembled = [];
      if (subjectPhrase) assembled.push(subjectPhrase);
      if (objectPhrase) assembled.push(objectPhrase);
      if (adverbPhrase) assembled.push(adverbPhrase);
      if (verbPhrase) assembled.push(verbPhrase);
      if (otherPhrase) assembled.push(otherPhrase);
      
      let brahviPhrase = assembled.length > 0 ? assembled.join(" ") : "";
      
      // If phrase is still empty fallback to individual translated tokens
      if (brahviPhrase.trim() === "") {
        const fallbackTokens = actualWords.map(w => w.translation ? w.translation : `[${w.word}]`).join(" ");
        brahviPhrase = fallbackTokens;
      }
      
      // Append original punctuation
      if (trailingPunct) brahviPhrase += trailingPunct;
      finalTranslatedSentences.push(brahviPhrase.trim());
    }
    
    return finalTranslatedSentences.join(" ");
  }
  
  // Main translation handler that uses JSON dict & POS assembly method
  function performTranslation() {
    const inputText = document.getElementById("englishInput").value;
    if (!inputText.trim()) {
      document.getElementById("brahviOutput").innerHTML = '<span class="placeholder-muted">📭 No text entered. Type something in English.</span>';
      return;
    }
    
    const result = translatePhraseToBrahvi(inputText);
    // Display result, handle empty fallback
    if (!result || result.trim() === "") {
      document.getElementById("brahviOutput").innerHTML = '<span class="placeholder-muted">⚠️ Translation could not be assembled. Try simpler words.</span>';
    } else {
      document.getElementById("brahviOutput").innerHTML = applyGlyphPlaceholders(result);
    }
  }
  
  // clear input and reset output
  function clearAll() {
    document.getElementById("englishInput").value = "";
    document.getElementById("brahviOutput").innerHTML = '<span class="placeholder-muted">✨ Translation will appear here</span>';
  }
  
  // load example phrase that demonstrates POS assembly & JSON usage
  function loadExample() {
    const example = "I eat fresh bread. She runs fast. Hello friend, how are you? Thank you very much.";
    document.getElementById("englishInput").value = example;
    performTranslation();
  }
  
  // Event listeners
  document.getElementById("translateBtn").addEventListener("click", performTranslation);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("swapExampleBtn").addEventListener("click", loadExample);
  
  // optional: allow Ctrl+Enter to translate
  const textarea = document.getElementById("englishInput");
  textarea.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      performTranslation();
    }
  });
  
  // initial placeholder example text to show functionality?
  // prefill with a small demo phrase for better user experience but not required, leave optional.
  // For clarity, set a welcoming demo text but NOT overriding user expectation.
  window.addEventListener("load", () => {
    // set a friendly starter example that showcases POS translation
    const starter = "Hello friend, I eat fresh bread.";
    document.getElementById("englishInput").value = starter;
    performTranslation();
  });
