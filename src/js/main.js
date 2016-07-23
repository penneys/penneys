/**
 * The main Javascript logic of the game.
 *
 * Sequences are represented using boolean strings, using false for heads and true for tails. There are specialized
 * functions for dealing with such arrays so that internal representation changes do not require massive refactorings.
 */

const SLOW_SIMULATION_SPEED = 1;
const FAST_SIMULATION_SPEED = 2;

const SLOW_SIMULATION_UPDATE_INTERVAL = 500; // 500 ms between tosses.
const FAST_SIMULATION_UPDATE_INTERVAL = 100; // 200 ms between iterations.

const SLOW_SIMULATION_TOSS_COUNT = 1;
const FAST_SIMULATION_TOSS_COUNT = 100;

const headsButtons = ["firstHeads", "secondHeads", "thirdHeads"];
const tailsButtons = ["firstTails", "secondTails", "thirdTails"];
const radioButtons = headsButtons.concat(tailsButtons);

var game = {};

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

function stringFromCoinSequence(sequence) {
    return sequence.map(function (coin) {
        return coin ? "T" : "H";
    }).join("");
}

function coinSequenceEquals(sequence, lastThreeTosses) {
    if (sequence === null && lastThreeTosses === null) {
        return true;
    }
    if (sequence === null || lastThreeTosses === null || sequence.length !== lastThreeTosses.length) {
        return false;
    }
    for (var i = 0; i < sequence.length; i++) {
        if (sequence[i] !== lastThreeTosses[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Returns the simulation speed as a small positive integer.
 */
function getSimulationSpeed() {
    if (document.getElementById("radioSlow").checked) {
        return SLOW_SIMULATION_SPEED;
    } else {
        return FAST_SIMULATION_SPEED;
    }
}

function updateScoreboard(player, computer) {
    document.getElementById("playerSequence").innerHTML = stringFromCoinSequence(player.sequence);
    document.getElementById("playerScore").innerHTML = player.score.toString();
    document.getElementById("computerSequence").innerHTML = stringFromCoinSequence(computer.sequence);
    document.getElementById("computerScore").innerHTML = computer.score.toString();
}

function updateSequenceWindow(history, simulationSpeed) {
    var element = document.getElementById("sequenceWindow");
    if (simulationSpeed === SLOW_SIMULATION_SPEED) {
        element.innerHTML = stringFromCoinSequence(history);
        element.scrollLeft = element.scrollWidth;
    } else {
        element.innerHTML = "History not available."; // This may be unnecessarily expensive.
    }
}

function updateGame(currentTime) {
    function eraseGameHistory() {
        while (game.history.length > 0) {
            game.history.pop();
        }
    }

    function getSimulationUpdateInterval(simulationSpeed) {
        if (simulationSpeed === SLOW_SIMULATION_SPEED) {
            return SLOW_SIMULATION_UPDATE_INTERVAL;
        } else {
            return FAST_SIMULATION_UPDATE_INTERVAL;
        }
    }

    /**
     * Returns how many tosses should be simulated per step for the given simulation speed.
     */
    function getTossCount(simulationSpeed) {
        if (simulationSpeed === SLOW_SIMULATION_SPEED) {
            return SLOW_SIMULATION_TOSS_COUNT;
        } else {
            return FAST_SIMULATION_TOSS_COUNT;
        }
    }

    function simulateTosses(game, simulationSpeed) {
        for (var i = 0; i < getTossCount(simulationSpeed); i++) {
            game.history.push(tossCoin());
            updateSequenceWindow(game.history, simulationSpeed);
            if (game.history.length >= 3) {
                const lastThreeTosses = game.history.slice(-3);
                if (coinSequenceEquals(game.player.sequence, lastThreeTosses)) {
                    game.player.score++;
                    eraseGameHistory();
                } else if (coinSequenceEquals(game.computer.sequence, lastThreeTosses)) {
                    game.computer.score++;
                    eraseGameHistory();
                }
            }
            updateScoreboard(game.player, game.computer);
        }
    }

    if (game.running) {
        var simulationSpeed = getSimulationSpeed();
        var updateInterval = getSimulationUpdateInterval(simulationSpeed);
        if (game.lastUpdate + updateInterval <= currentTime) {
            game.lastUpdate = currentTime;
            simulateTosses(game, simulationSpeed);
        }
        requestAnimationFrame(updateGame);
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

function showReporting() {
    document.getElementById("reporting").hidden = false;
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
    game.lastUpdate = window.performance.now();
    game.running = true;
    showReporting();
    updateScoreboard(game.player, game.computer);
    enableStopButton();
    requestAnimationFrame(updateGame);
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

// Add listeners.
getGoButton().addEventListener("click", clickedGo);
getStopButton().addEventListener("click", clickedStop);
