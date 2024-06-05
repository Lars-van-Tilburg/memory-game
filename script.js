document.addEventListener("DOMContentLoaded", () => {
    const game = document.getElementById("game");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    const cardsArray = [
        '🍎', '🍎', '🍌', '🍌',
        '🍇', '🍇', '🍉', '🍉',
        '🍓', '🍓', '🍒', '🍒',
        '🍍', '🍍', '🥭', '🥭'
    ];

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchesFound = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        cards = [];
        matchesFound = 0;
        const shuffledCards = shuffle(cardsArray);
        game.innerHTML = '';
        shuffledCards.forEach(symbol => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="front">${symbol}</div>
                <div class="back">?</div>
            `;
            card.addEventListener("click", flipCard);
            game.appendChild(card);
            cards.push(card);
        });
        message.textContent = '';
        restartButton.style.display = 'none';
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add("flipped");

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.querySelector(".front").innerText === secondCard.querySelector(".front").innerText;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        matchesFound++;
        if (matchesFound === cardsArray.length / 2) {
            gameWon();
        }
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function gameWon() {
        message.textContent = "Congratulations! You won!";
        restartButton.style.display = 'block';
    }

    function restartGame() {
        createBoard();
    }

    restartButton.addEventListener("click", restartGame);

    createBoard();
});
