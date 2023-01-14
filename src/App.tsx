import { useEffect, useState, useCallback } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json"; // This is a list of words

function getWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
  const [wordToGuess, setWordToGuess] = useState(getWord);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]); // This will be an array of strings (Length of one)

  // This is a filter function that will return an array of letters that are not in the word

  const incorrectLetters = guessedLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  // This is a function that will check if the word has been guessed. Loop through every character.
  // .every function works by --> If every single iteration of loop returns true, then 'every' will return true
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  // useCallback is used to memoize the function
  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      //
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    // This is a dependency array. guessedLetters is the only thing this function depends on. Every time this changes, the function is re run
    [guessedLetters, isWinner, isLoser]
  );

  // This is a function that will check if the word has been guessed
  // This is the event listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) return;

      e.preventDefault();
      addGuessedLetter(key);
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (key !== "Enter") return;

      e.preventDefault();
      setGuessedLetters([]);
      setWordToGuess(getWord());
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: "2rem", textAlign: "center" }}>
        {isWinner && "You won! - Refresh to play again"}
        {isLoser && "You lost! - Refresh to play again"}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord
        reveal={isLoser}
        guessedLetters={guessedLetters}
        wordToGuess={wordToGuess}
      />
      <div style={{ alignSelf: "stretch" }}>
        <Keyboard
          disabled={isWinner || isLoser}
          activeLetters={guessedLetters.filter((letter) =>
            wordToGuess.includes(letter)
          )}
          inactiveLetters={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  );
}

export default App;
