const words = {
    numbers: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    food: ['pizza', 'hamburger', 'spaghetti', 'sushi', 'tacos', 'salad', 'sandwich'],
    drinks: ['water', 'soda', 'juice', 'coffee', 'tea', 'milkshake', 'smoothie'],
    sports: ['soccer', 'basketball', 'tennis', 'volleyball', 'swimming', 'baseball', 'football'],
    classroom: ['desk', 'chair', 'whiteboard', 'pencil', 'notebook', 'backpack', 'calculator'],
    videogames: ['minecraft', 'fortnite', 'roblox', 'amongus', 'zelda', 'pokemon', 'mariokart'],
    anime: ['naruto', 'onepiece', 'attackontitan', 'myheroacademia', 'demonslayer', 'dragonball', 'deathnote']
};

let currentWord, guessedLetters, remainingGuesses;
const maxGuesses = 6;

const wordDisplay = document.getElementById('word-display');
const guessInput = document.getElementById('guess-input');
const guessButton = document.getElementById('guess-button');
const message = document.getElementById('message');
const hangman = document.getElementById('hangman');
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');
const startGameButton = document.getElementById('start-game');

startGameButton.addEventListener('click', startGame);
guessButton.addEventListener('click', makeGuess);
guessInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') makeGuess();
});

function startGame() {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    const wordList = words[category];
    
    let filteredWords;
    if (category === 'seasons') {
        filteredWords = wordList; // Use all seasons regardless of difficulty
    } else {
        if (difficulty === 'easy') {
            filteredWords = wordList.filter(word => word.length <= 5);
        } else if (difficulty === 'medium') {
            filteredWords = wordList.filter(word => word.length > 5 && word.length <= 8);
        } else {
            filteredWords = wordList.filter(word => word.length > 8);
        }
    }

    if (filteredWords.length === 0) {
        filteredWords = wordList; // Fallback to all words if no words match the difficulty
    }

    currentWord = filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
    guessedLetters = new Set();
    remainingGuesses = maxGuesses;

    updateDisplay();
    message.textContent = '';
    guessInput.value = '';
    guessInput.focus();
    guessInput.disabled = false;
    guessButton.disabled = false;

    gameCount++;
}

function makeGuess() {
    const guess = guessInput.value.toUpperCase();
    if (guess.length !== 1 || !/[A-Z]/.test(guess)) {
        message.textContent = 'Please enter a single letter.';
        return;
    }

    if (guessedLetters.has(guess)) {
        message.textContent = 'You already guessed that letter.';
        return;
    }

    guessedLetters.add(guess);

    if (!currentWord.includes(guess)) {
        remainingGuesses--;
    }

    updateDisplay();

    if (remainingGuesses === 0) {
        message.textContent = `Game over! The word was ${currentWord}.`;
        guessInput.disabled = true;
        guessButton.disabled = true;
    } else if (!wordDisplay.textContent.includes('_')) {
        message.textContent = 'Congratulations! You guessed the word!';
        guessInput.disabled = true;
        guessButton.disabled = true;
    }

    guessInput.value = '';
    guessInput.focus();
}

function updateDisplay() {
    wordDisplay.textContent = currentWord
        .split('')
        .map(letter => guessedLetters.has(letter) ? letter : '_')
        .join(' ');

    hangman.textContent = drawHangman(maxGuesses - remainingGuesses);
}







let gameCount = 0;

function drawHangman(wrongGuesses) {
    if (gameCount % 2 === 0) {
        return drawAlternateHangman(wrongGuesses);
    } else {
        return drawOriginalHangman(wrongGuesses);
    }
}

function drawOriginalHangman(wrongGuesses) {
    const fullHangman = `
 ___________.._______
| .__________))______|
| | / /      ||
| |/ /       ||
| | /        ||.-''.
| |/         |/  _  \\
| |          ||  \`/,|
| |          (\\\_.'
| |         .-\`--'.
| |        /Y . . Y\\
| |       // |   | \\\\
| |      //  | . |  \\\\
| |     ')   |   |   (\`
| |          ||'||
| |          || ||
| |          || ||
| |          || ||
| |         / | | \\
""""""""""|_\`-' \`-' |"""|
|"|""""""""\\ \\       '"|"|
| |        \\ \\        | |
: :         \\ \\       : :  sk
. .          \`'       . .`;

    const hangmanParts = fullHangman.split('\n');
    
    const partsToShow = [
        [22, 21, 20, 19], // Base
        [18, 17, 16, 15, 14, 13, 12, 11, 10], // Gallows
        [9], // Head
        [8, 7], // Body
        [6], // Left arm
        [5], // Right arm
        [4, 3, 2, 1] // Legs
    ];

    let drawing = '';
    for (let i = 0; i < hangmanParts.length; i++) {
        let shouldShow = false;
        for (let j = 0; j <= wrongGuesses; j++) {
            if (partsToShow[j] && partsToShow[j].includes(hangmanParts.length - i - 1)) {
                shouldShow = true;
                break;
            }
        }
        drawing += shouldShow ? hangmanParts[i] + '\n' : '\n';
    }

    return drawing;
}

function drawAlternateHangman(wrongGuesses) {
    const fullHangman = `
  |_______________\`\`\\
    [/]           [  ]
    [\\]           | ||
    [/]           |  |
    [\\]           |  |
    [/]           || |
   [---]          |  |
   [---]          |@ |
   [---]          |  |
  oOOOOOo         |  |
 oOO___OOo        | @|
oO/|||||\Oo       |  |
OO/|||||\OOo      |  |
*O\\ x x /OO*      |  |
/*|  c  |O*\\      |  |
   \\_O_/    \\     |  |
    \\#/     |     |  |
 |       |  |     | ||
 |       |  |_____| ||__
_/_______\\__|  \\  ||||  \\
/         \\_|\\  _ | ||\\  \\
|    V    |\\  \\//\\  \\  \\  \\
|    |    | __//  \\  \\  \\  \\
|    |    |\\|//|\\  \\  \\  \\  \\
------------\\--- \\  \\  \\  \\  \\
\\  \\  \\  \\  \\  \\  \\  \\  \\  \\  \\
_\\__\\__\\__\\__\\__\\__\\__\\__\\__\\__\\
__|__|__|__|__|__|__|__|__|__|__|
|___| |___|
|###/ \\###|
\\##/   \\##/
 \`\`     \`\` `;

    const hangmanParts = fullHangman.split('\n');
    
    const partsToShow = [
        [34, 33, 32, 31, 30], // Base
        [29, 28, 27, 26, 25, 24, 23, 22, 21], // Structure
        [20, 19, 18], // Head
        [17, 16, 15, 14], // Body
        [13, 12], // Arms
        [11, 10, 9], // Legs
        [8, 7, 6, 5, 4, 3, 2, 1, 0] // Full figure
    ];

    let drawing = '';
    for (let i = 0; i < hangmanParts.length; i++) {
        let shouldShow = false;
        for (let j = 0; j <= wrongGuesses; j++) {
            if (partsToShow[j] && partsToShow[j].includes(hangmanParts.length - i - 1)) {
                shouldShow = true;
                break;
            }
        }
        drawing += shouldShow ? hangmanParts[i] + '\n' : '\n';
    }

    return drawing;
}

