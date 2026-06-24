const pixelSize = 80;
const boardSize = 8 * pixelSize;

function renderChessboard() {
    try{
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
                square.dataset.index = row * 8 + col; // store the index of the square in a data attribute to access later
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }
                chessboard.appendChild(square);
            }
        }
        renderPieces('assets/images/pieces-basic-svg/rook-b.svg', 1); 

        chessboard.addEventListener('dragstart', (event) => {
            const target = event.target; // target is the element being dragged--> the element that triggered the event
            if (event.target.classList.contains('chess-piece')) { // Check if the dragged element is a chess piece
                event.dataTransfer.setData('text/plain', event.target.src); // store the image source of the dragged piece in the dataTransfer object
                // we're able to access teh index we set earlier while creating the squares
                console.log(`Dragging piece from square: ${target.parentElement.dataset.index}`); 
                event.dataTransfer.setData('source-square', target.parentElement.dataset.index);
                event.dataTransfer.effectAllowed = 'move'; // this indicates that the drag operation is a move and not copy or link
            } else {
                event.target.style.cursor = 'not-allowed'; // change cursor to indicate that dragging is not allowed
                event.dataTransfer.effectAllowed = 'none'; // prevent any drag operation from being initiated
            }
        });

        chessboard.addEventListener('dragover', (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move'; 
        });

        chessboard.addEventListener('drop', (event) => {
            event.preventDefault();
            const pieceSrc = event.dataTransfer.getData('text/plain'); // get the img src
            const targetSquare = event.target.closest('.square'); // find the closest parent element with the class 'square' to
            if (targetSquare) {
                let pieceElement = targetSquare.querySelector('img'); // check if there is already an img element inside the target square
                if (pieceElement) {
                    targetSquare.removeChild(pieceElement); // if there is, remove it to allow the new piece to be placed
                } 
                // create a new img after removing existing one (if any)
                renderPieces(pieceSrc, targetSquare.dataset.index); // render the piece on the target square index
                console.log(`Dropped piece on square: ${targetSquare.dataset.index}`);

                // REMOVE SRC PIECE
                const sourceSquareIndex = event.dataTransfer.getData('source-square'); // we set this data in the dragstart event listener as 'source-square'
                const sourceSquare = chessboard.children[sourceSquareIndex]; // get the source square using the index
                if (sourceSquare) {
                    const sourcePieceElement = sourceSquare.querySelector('img'); // find the img element inside the source square
                    if (sourcePieceElement) {
                        sourceSquare.removeChild(sourcePieceElement); // remove the img element from the source square
                    }
                }
                console.log(`Dropped piece from square: ${sourceSquareIndex}`);
                console.log(`Moved piece from square ${convertIndexToPosition(sourceSquareIndex)} to square ${convertIndexToPosition(targetSquare.dataset.index)}`);
            }
        });
        }
    catch (error) {
        console.error("Error rendering chessboard:", error);
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    renderChessboard();
});

function renderPieces(piece, position) {
    try {
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
    catch (error) {
        console.error("Error rendering pieces:", error);
    }
   
}

function convertIndexToPosition(index) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const file = String.fromCharCode(97 + col); // Convert column to file (a-h)
    const rank = 8 - row; // Convert row to rank (1-8)
    return `${file}${rank}`;
}
