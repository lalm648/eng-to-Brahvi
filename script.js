// --------------------------------------------------------------
  // 1. JSON DICTIONARY (English -> Brahvi) with Part-of-Speech tags
  //    Brahvi values are left clean (placeholder style) but realistic.
  //    For demo, we fill with transliterated Brahvi-like forms.
  //    Actual Brahvi script can be added later. Here we keep clean Latin/script neutral.
  // --------------------------------------------------------------
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
    { word: "milk", pos: "noun", brahvi: "شیر" },
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
    const wordKey = entry.word.toLowerCase();
    const posKey = `${wordKey}|${entry.pos}`;
    posLookup.set(posKey, entry.brahvi);
    // global fallback (keep first occurrence priority)
    if (!globalLookup.has(wordKey)) {
      globalLookup.set(wordKey, entry.brahvi);
    }
  });

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
    if (!word || word.trim() === "") return null;
    const cleanWord = word.toLowerCase().replace(/[^\w']/g, ''); // remove punctuation but keep apostrophe
    if (cleanWord === "") return null;
    const pos = posHint || guessPartOfSpeech(cleanWord);
    const exactKey = `${cleanWord}|${pos}`;
    if (posLookup.has(exactKey)) {
      return posLookup.get(exactKey);
    }
    // fallback to any POS match
    if (globalLookup.has(cleanWord)) {
      return globalLookup.get(cleanWord);
    }
    // also try to remove trailing 's' for plural heuristic? optional but simple
    if (cleanWord.endsWith("s") && cleanWord.length > 1) {
      const singular = cleanWord.slice(0, -1);
      if (globalLookup.has(singular)) {
        return globalLookup.get(singular);
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
      
      // tokenization: split by spaces and keep punctuation attached to words? we clean each token
      const tokens = cleanSentence.split(/\s+/);
      const wordItems = [];
      for (let token of tokens) {
        // separate punctuation like commas, quotes etc but keep basic
        const wordMatch = token.match(/^[a-zA-Z'’]+/);
        let word = wordMatch ? wordMatch[0] : token;
        let prefixPunct = "";
        let suffixPunct = "";
        if (!wordMatch) {
          // pure punctuation
          wordItems.push({ raw: token, word: null, punct: token, pos: null });
          continue;
        }
        // extract leading/trailing punctuation
        const leadingMatch = token.match(/^[^\w']*/);
        const trailingMatch = token.match(/[^\w']*$/);
        prefixPunct = leadingMatch ? leadingMatch[0] : "";
        suffixPunct = trailingMatch ? trailingMatch[0] : "";
        word = token.substring(prefixPunct.length, token.length - suffixPunct.length);
        if (word === "") continue;
        const pos = guessPartOfSpeech(word);
        const translation = translateWord(word, pos);
        wordItems.push({
          raw: token,
          word: word.toLowerCase(),
          translation: translation,
          pos: pos,
          prefixPunct: prefixPunct,
          suffixPunct: suffixPunct
        });
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
      document.getElementById("brahviOutput").innerHTML = result;
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
