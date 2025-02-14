// ==UserScript==
// @name         NYT Wordle Helper
// @namespace    Shuang Luo
// @version      0.1
// @description  A helper for New York Times Wordle game
// @author       Shuang Luo
// @match        https://www.nytimes.com/games/wordle/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This will store structured guess information
    let guesses = [];
    let words = [];

    // Function to fetch the words from the external file
    function fetchWords() {
        return fetch('https://cheaderthecoder.github.io/5-Letter-words/words.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Status Code: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                words = data.split('\n').map(word => word.trim());
            })
            .catch(error => {
                console.error('Error loading words:', error);
            });
    }

    // Function to update possible words in the message div
    function updatePossibleWords(possibleWords) {
        const possibleWordsElement = document.getElementById('possibleWords');
        if (possibleWordsElement) {
            if (possibleWords.length === 0) {
                possibleWordsElement.innerText = 'No suggestions available.';
            } else {
                possibleWordsElement.innerText = possibleWords.join(', ');
            }
        }
    }

    // Function to check each of the five board divs and display their content with styling
    function checkBoardContent() {
        const boardContent = [];

        for (let i = 1; i <= 5; i++) {
            const boardDiv = document.querySelector(`#wordle-app-game > div.Board-module_boardContainer__TBHNL > div > div:nth-child(${i})`);
            if (boardDiv && boardDiv.innerText.trim() !== '') {
                const letters = Array.from(boardDiv.querySelectorAll('[data-state]'));
                let structuredGuess = {
                    guess: '',
                    status: []
                };

                // Process each letter and build the guess structure
                letters.forEach((letterDiv, index) => {
                    const letter = letterDiv.innerText;
                    const state = letterDiv.getAttribute('data-state');

                    guesses.push({ letter, state, position: index });

                    let status = '';
                    if (state === 'present') {
                        status = 'present';
                    } else if (state === 'correct') {
                        status = 'correct';
                    } else {
                        status = 'absent';
                    }

                    structuredGuess.guess += letter;
                    structuredGuess.status.push({ letter, status, position: index });
                });


                // Display the guess with letter colors (if applicable)
                let styledGuess = `Guess ${i}: `;
                structuredGuess.status.forEach(({ letter, status }) => {
                    let color = '';
                    if (status === 'present') {
                        color = 'orange';
                    } else if (status === 'correct') {
                        color = 'green';
                    } else {
                        color = 'gray';
                    }

                    styledGuess += `<span style="color:${color}; font-weight: bold; margin: 0 2px;">${letter}</span>`;
                });

                boardContent.push(styledGuess);
            }
        }

        const boardContentElement = document.getElementById('boardContent');
        if (boardContentElement) {
            if (boardContent.length === 0) {
                boardContentElement.innerText = 'No guesses made yet.';
            } else {
                // Join the board guesses with line breaks and display them
                boardContentElement.innerHTML = boardContent.join('<br>');
            }
        }
    }

    // Function to filter possible words based on the guesses
    function filterPossibleWords() {
        if (guesses.length === 0) {
            return;
        }
        let validWords = []

        // for every word in words, check if it contains a letter that has a state of "absent". if not, add it to the validWords array
        for (let word of words) {
            let isValid = true;
            for (let guess of guesses) {
                if (guess.state === 'absent' && word.includes(guess.letter.toLowerCase())) {
                    isValid = false;
                    break;
                }
            }
            if (isValid) {
                validWords.push(word);
            }
        }

        // if any of the letters in the guesses have a state of "present", check if each word in the validWords array contains the letter in any position. if not, remove it from the validWords array.
        for (let word of validWords) {
            let isValid = false;
            for (let guess of guesses) {
                if (guess.state === 'present' && word.includes(guess.letter.toLowerCase())) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                validWords = validWords.filter(w => w !== word);
            }
        }

        // for each word in validWords, check if it contains the correct letters in the correct positions
        for (let word of validWords) {
            let isValid = true;
            for (let guess of guesses) {
                if (guess.state === 'correct') {
                    if (word[guess.position] !== guess.letter.toLowerCase()) {
                        isValid = false;
                        break;
                    }
                }
            }

            // If the word is still valid after all checks, keep it in the validWords array
            if (!isValid) {
                validWords = validWords.filter(w => w !== word);
            }
        }

        // Update possible words display
        updatePossibleWords(validWords);
    }

    // Function to initialize the script
    function initialize() {
        // Check if the game board is available
        const wordleApp = document.querySelector('#wordle-app-game');
        if (!wordleApp) {
            console.log('Wordle game not found, script not running.');
            return;
        }

        // Create a div to display the helper message
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'absolute';
        messageDiv.style.top = '80px';
        messageDiv.style.right = '20px';
        messageDiv.style.padding = '10px';
        messageDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        messageDiv.style.color = 'white';
        messageDiv.style.fontSize = '16px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.maxWidth = '300px';
        messageDiv.style.wordWrap = 'break-word';
        messageDiv.innerHTML = `
            <h2 style="font-size: 24px; margin: 0;">NYT Wordle Helper</h2>
            <br>
            <h5 style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Possible words are:</h5>
            <span id="possibleWords">Loading...</span><br><br>
            <h5 style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Current guesses:</h5>
            <span id="boardContent">Make your first guess. If you have done so, click enter.</span>
        `;
        document.body.appendChild(messageDiv);

        // Initialize guesses array
        guesses = [];

        // Start fetching the words from the external file
        fetchWords();

        // Listen for clicks on the "Enter" button (aria-label="enter") to update the board content and filter words
        const enterButton = document.querySelector('[aria-label="enter"]');
        if (enterButton) {
            enterButton.addEventListener('click', () => {
                checkBoardContent();
                filterPossibleWords();
            });
        }

    }

    // Wait for Wordle game to load and then initialize the script
    const observer = new MutationObserver(() => {
        const wordleApp = document.querySelector('#wordle-app-game');
        if (wordleApp) {
            observer.disconnect();
            initialize();
        }
    });

    // Start observing the body for changes to detect when Wordle game is loaded
    observer.observe(document.body, { childList: true, subtree: true });
})();