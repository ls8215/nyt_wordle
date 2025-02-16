# NYT Wordle Helper

This is a user script designed to assist players of the **New York Times Wordle** game. It helps users track their guesses and suggests possible words based on their previous guesses. The script fetches a list of valid words from an external file and filters the possible words based on the game board's state.

## Features

- **Track Guesses**: Automatically records your guesses, including the letter, its state (correct, present, absent), and its position on the board.
- **Filter Possible Words**: After each guess, the script filters possible valid words based on your inputs (correct, present, absent).
- **Word Suggestions**: Displays a list of possible words that fit the current guess pattern.
- **Guess Display**: Shows your guesses with color coding based on the letter's state:
  - Green for correct letters in the correct position.
  - Orange for present letters (present in the word but not in the correct position).
  - Gray for absent letters (not in the word).
- **Interactive**: Clicking a button allows you to filter the possible words based on the current guesses.
- **External Word List**: Fetches a list of valid words from an external source, ensuring it's up-to-date.

## How to Use

### Step 1: Install a Userscript Manager

To use this script, you need to install a userscript manager in your browser, such as:
- [Tampermonkey](https://www.tampermonkey.net/)
- [Greasemonkey](https://www.greasespot.net/)

### Step 2: Install the Script

1. After installing a userscript manager, click on the **"Add a new script"** option.
2. Copy the script from the [raw GitHub link](https://raw.githubusercontent.com/ls8215/nyt_wordle/main/wordle.js).
3. Paste it into the userscript manager editor.
4. Save the script.

### Step 3: Play Wordle

1. Navigate to the [New York Times Wordle game](https://www.nytimes.com/games/wordle/index.html).
2. The script will automatically start running when the page is loaded.
3. As you make guesses, the script will display possible word suggestions based on your guesses.
4. You can click the **"Filter Words"** button to manually filter the possible words.
5. The script will also show your current guesses with color-coded letters (green, orange, or gray).

### Step 4: Interact with the Helper

- **Possible Words**: This section shows a list of words that match the current guesses based on the game's logic.
- **Current Guesses**: This section shows a list of your guesses with their corresponding color codes (gray for absent, orange for present, and green for correct).
- **Filter Words Button**: Clicking this will update the possible words list based on the current board's state.

## Notes

- **External Words File**: The list of words is hosted externally on GitHub. If the word list is outdated or incorrect, feel free to submit an issue or pull request to the repository.
- **User Feedback**: The script is continuously being updated. If you encounter any bugs or have feature requests, please submit an issue on the [GitHub repository](https://github.com/ls8215/nyt_wordle).