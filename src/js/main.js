/**
 * The main Javascript logic of the game.
 *
 * Sequences are represented using boolean strings, using false for heads and true for tails. There are specialized
 * functions for dealing with such arrays so that internal representation changes do not require massive refactorings.
 */

const UPDATE_INTERVAL = 200; // 200 ms between tosses.

const headsButtons = ["firstHeads", "secondHeads", "thirdHeads"];
const tailsButtons = ["firstTails", "secondTails", "thirdTails"];
const radioButtons = headsButtons.concat(tailsButtons);

var game = {};

function disableRadioButtons() {
    for (var i = 0; i < radioButtons.length; i++) {
        document.getElementById(radioButtons[i]).disabled = true;
    }
}

function enableRadioButtons() {
    for (var i = 0; i < radioButtons.length; i++) {
        document.getElementById(radioButtons[i]).disabled = false;
    }
}

/**
 * If the game is not running, creates a Game object according to the user-defined settings and enters the game loop.
 */
function clickedGo() {
    disableRadioButtons();
    disableButtons();
    game.player = {
        sequence: getPlayerSequence(),
        score: 0
    };
    game.computer = {
        sequence: deriveBestSequence(game.player.sequence),
        score: 0
    };
    game.history = [];
    game.running = true;
    enableStopButton();
}

function disableButtons() {
    getGoButton().disabled = true;
    getStopButton().disabled = true;
}

function enableGoButton() {
    getGoButton().disabled = false;
}

function enableStopButton() {
    getStopButton().disabled = false;
}

/**
 * If the game is running, stops it.
 */
function clickedStop() {
    disableButtons();
    if (game.running) {
        game.running = false;
        enableRadioButtons();
        enableGoButton();
    }
}

/**
 * Returns a pseudo-random coin toss.
 */
function tossCoin() {
    return Math.random() < 0.5;
}

/**
 * Inverts the value of a coin.
 */
function invertCoin(coin) {
    return !coin;
}

function updateGame(game) {
    game.history.push(tossCoin());
}

function updateScores(game) {
    if (game.history.length >= 3) {
        const lastThreeTosses = game.history.slice(-3);
        if (game.player.sequence == lastThreeTosses) {
            game.player.score++;
        } else if (game.computer.sequence == lastThreeTosses) {
            game.computer.score++;
        }
    }
}

function getPlayerSequence() {
    var tailButtons = ["firstTails", "secondTails", "thirdTails"];
    return tailButtons.map(function (id) {
        return document.getElementById(id).checked;
    });
}

/**
 * Derives the best possible sequence for the computer based on the player sequence.
 */
function deriveBestSequence(playerSequence) {
    return [invertCoin(playerSequence[1]), playerSequence[0], playerSequence[1]];
}

function getGoButton() {
    return document.getElementById("goButton");
}

function getStopButton() {
    return document.getElementById("stopButton");
}

// Add listeners.
getGoButton().addEventListener("click", clickedGo);
getStopButton().addEventListener("click", clickedStop);
