const pixelSize = 80;
const boardSize = 8 * pixelSize;

function renderChessboard() {
    const chessboard = document.getElementById('chessboard');
    // const gameScore = document.getElementById('game-score');
    chessboard.style.width = `${boardSize}px`;
    chessboard.style.height = `${boardSize}px`;
    // gameScore.style.height = `${boardSize*1.2}px`;
    // gameScore.style.width = `${boardSize/3}px`;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            chessboard.appendChild(square);
        }
    }
    renderPieces('assets/images/pieces-basic-svg/rook-b.svg', 1); 
}

document.addEventListener('DOMContentLoaded', renderChessboard);

function renderPieces(piece, position) {
    const chessboard = document.getElementById('chessboard');
    if (!chessboard) {
        console.error(`Error: Chessboard not found!`);
        return;
    }
    //console.log("Chessboard children count:", chessboard.children.length);
    const square = chessboard.children[position ];
    if (!square) {
        console.error(`Error: Square at position ${position} not found!`);
        return;
    }
    let pieceElement = square.querySelector('img');

    if (!pieceElement) {
        pieceElement = document.createElement('img');
        pieceElement.className = 'chess-piece';
        pieceElement.style.width = `${pixelSize}px`;
        pieceElement.style.height = `${pixelSize}px`;
        square.appendChild(pieceElement);
    }

    pieceElement.src = piece;
    pieceElement.alt = "Chess Piece";
}


