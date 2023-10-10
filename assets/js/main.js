let cards = document.querySelectorAll('.card');
let flippedCards = []; //Lista de cartas volteadas
let lockBoard = false; //No dejar voltear mas de dos cartas a la vez
let matchedCardsCount = 0; //Contador para ganar


document.addEventListener('DOMContentLoaded', function() {
    shuffleCards();
});

function shuffleCards() {
    const board = document.querySelector('.board');
    const cardsArray = Array.from(board.children);
    const shuffledOrder = shuffleArray([...Array(cardsArray.length).keys()]);

    cardsArray.forEach((card, index) => {
        card.style.order = shuffledOrder[index];
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', function() {
    location.reload();
});

//Añadir el evento de click a cada una de las cartas
cards.forEach(card => {
    card.addEventListener('click', flipCard);
});

//Funcion para voltear cartas
function flipCard() {
    if (lockBoard) return; //No detectar click si hay dos cards volteandose
    if (this === flippedCards[0]) return; //No detectar el click si la card ya esta volteada
    this.querySelector('img').style.display = 'block'; // Mostrar la imagen
    this.classList.add('flipped'); //darle clase flipped para poder detectarla
    this.classList.remove('unflipped');
    flippedCards.push(this); //meter card a la lista de tarjetas volteadas

    if (flippedCards.length === 2) { //Si se estan volteando dos cards, checar si hacen match
        match();
    }
}

function match() {
    let img1 = flippedCards[0].querySelector('img').getAttribute('src');
    let img2 = flippedCards[1].querySelector('img').getAttribute('src');
    //checar si el src de cada una de las dos imgs es el mismo
    let isMatch = img1 === img2;

    isMatch ? disableCards() : unflipCards(); //si hacen match, ya tienes un par, si no, volver a voltear
}

function disableCards() { //Funcion cuando SI hacen match
    //Les quitamos el listener de click
    flippedCards[0].removeEventListener('click', flipCard);
    flippedCards[1].removeEventListener('click', flipCard);
    flippedCards[0].style.cursor = 'default'; //Devuelve el cursor normal
    flippedCards[1].style.cursor = 'default';
    flippedCards[0].style.transform = 'none'; //Ya no hace el efecto al pasar el cursor por encima
    flippedCards[1].style.transform = 'none';
    flippedCards[0].style.transform = 'rotateY(180deg)'; //Para dejar bien orientada la imagen
    flippedCards[1].style.transform = 'rotateY(180deg)';
    //Incrementa el contador de tarjetas emparejadas
    matchedCardsCount += 2;  
    // Verifica si todas las tarjetas han sido emparejadas
    if (matchedCardsCount === cards.length) {
        setTimeout(() => {
            Swal.fire({
                title: '¡Felicidades!',
                text: 'Ganaste',
                icon: 'success',
                confirmButtonText: 'Jugar de nuevo'
            }).then((result) => {
                if (result.isConfirmed) {
                    location.reload();  // Recarga la pagina
                }
            });
        }, 500);
    }
    //volvemos a habilitar el tablero y reiniciamos la lista de cards voltendose
    resetBoard();
}

function unflipCards() { //Funcion cuando NO hacen match
    lockBoard = true; //bloqueamos el tablero

    setTimeout(() => { //aplicamos lo siguiente despues de esperar el timeout
        flippedCards[0].querySelector('img').style.display = 'none'; //Ocultamos la img de la card 1 volteada
        flippedCards[1].querySelector('img').style.display = 'none'; //Ocultamos la img de la card 2 volteada

        flippedCards[0].classList.remove('flipped'); //Le quitamos la clase que le dimos para saber si estaba volteada
        flippedCards[1].classList.remove('flipped'); 
        flippedCards[0].classList.add('unflipped'); //Le ponemos la clase que le dimos para saber si estaba boca abajo
        flippedCards[1].classList.add('unflipped');

        resetBoard();//habilitamos el tablero
    }, 1000);
}

function resetBoard() { //Limpiamos la lista de cards volteadas y habilitamos el tablero
    [flippedCards, lockBoard] = [[], false];
}
