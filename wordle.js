// ==UserScript==
// @name         NYT Wordle Helper
// @namespace    Shuang Luo
// @version      0.2
// @description  A helper for New York Times Wordle game
// @author       Shuang Luo
// @match        https://www.nytimes.com/games/wordle/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ls8215/nyt_wordle/main/wordle.js
// ==/UserScript==

(function() {
    'use strict';

    // This will store structured guess information
    let guesses = [];
    let words = [];

    // Function to fetch the words from the external file
    function fetchWords() {
        return fetch('https://raw.githubusercontent.com/ls8215/nyt_wordle/refs/heads/main/words.txt')
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

    // Function to check if a letter aleady exists in the guesses array. if so, return true
    function checkIfLetterExists(letter) {
        return guesses.some(guess => guess.letter === letter);
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

                    if (
                        (state === 'absent' && !checkIfLetterExists(letter)) || 
                        state === 'present' || 
                        state === 'correct'
                    ) {
                        guesses.push({ letter, state, position: index });
                    }

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
    
        let validWords = words.filter(word => {
            return guesses.every(guess => {
                const letter = guess.letter.toLowerCase();
                const position = guess.position;
    

                if (guess.state === 'correct' && word[position] !== letter) {
                    return false;
                }

                if (guess.state === 'present') {
                    if (!word.includes(letter)) {
                        return false; 
                    }
                    if (word[position] === letter) {
                        return false; 
                    }
                }

                if (guess.state === 'absent' && word.includes(letter)) {
                    return false; 
                }
    
                return true; 
            });
        });

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

        const title = document.createElement('h2');
        title.style.fontSize = '24px';
        title.style.margin = '20';
        title.innerText = "NYT Wordle Helper";

        const possibleWordsTitle = document.createElement('h5');
        possibleWordsTitle.style.fontSize = '18px';
        possibleWordsTitle.style.fontWeight = 'bold';
        possibleWordsTitle.style.marginBottom = '5px';
        possibleWordsTitle.style.marginTop = '15px';
        possibleWordsTitle.innerText = "Possible words are:";

        const possibleWords = document.createElement('span');
        possibleWords.id = 'possibleWords';
        possibleWords.innerText = "Loading...";

        const boardContentTitle = document.createElement('h5');
        boardContentTitle.style.fontSize = '18px';
        boardContentTitle.style.fontWeight = 'bold';
        boardContentTitle.style.marginBottom = '5px';
        boardContentTitle.style.marginTop = '15px';
        boardContentTitle.innerText = "Current guesses:";

        const boardContent = document.createElement('span');
        boardContent.id = 'boardContent';
        boardContent.innerText = "Make your first guess. If you have done so, click enter.";

        // Create Filter button
        const filterButton = document.createElement('button');
        filterButton.id = 'filterButton';
        filterButton.innerText = "Filter Words";
        filterButton.style.backgroundColor = '#4CAF50';
        filterButton.style.color = 'white';
        filterButton.style.padding = '10px';
        filterButton.style.border = 'none';
        filterButton.style.cursor = 'pointer';
        filterButton.style.fontSize = '14px';
        filterButton.style.marginTop = '10px'; // Add some space between text and button

        // Append all elements to the messageDiv
        messageDiv.appendChild(title);
        messageDiv.appendChild(possibleWordsTitle);
        messageDiv.appendChild(possibleWords);
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(boardContentTitle);
        messageDiv.appendChild(boardContent);
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(filterButton);

        // Append messageDiv to the body
        document.body.appendChild(messageDiv);

        // Initialize guesses array
        guesses = [];

        // Start fetching the words from the external file
        fetchWords();

        // Function to check the board content and update the guesses array
        checkBoardContent();
        

        // Listen for keydown events on the document to update the board content and filter words
        document.addEventListener('keydown', (event) => {
            checkBoardContent();
            if (event.key === 'Enter') {
                checkBoardContent();
            }
        })

        // Listen for Filter button
        filterButton.addEventListener('click', () => {
            checkBoardContent();
            filterPossibleWords();
        });

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