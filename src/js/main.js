/**
 * The main Javascript logic of the game.
 *
 * Sequences are represented using boolean strings, using false for heads and true for tails. There are specialized
 * functions for dealing with such arrays so that internal representation changes do not require massive refactorings.
 */

function clickedGo() {

}

function clickedStop() {

}

/**
 * Inverts the value of a coin.
 */
function invertCoin(coin) {
    return !coin;
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

// Add listeners.
document.getElementById("goButton").addEventListener("click", clickedGo);
document.getElementById("stopButton").addEventListener("click", clickedStop);
