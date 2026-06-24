const chess = new Chess();

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
        const position = loadPositionFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
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

                //load the position
                const piece = position[row][col]; // null if empty square
                if (piece){ // true if there is a piece on the square
                    const pieceColor = piece.color === 'w' ? 'w' : 'b'; // determine the color of the piece
                    const pieceType = piece.type; // determine the type of the piece (p, r, n, b, q, k)
                    const pieceImage = `assets/images/pieces-basic-svg/${pieceType}-${pieceColor}.svg`; // construct the image path based on the piece type and color
                    const squareIndex = row * 8 + col; // pos to index conversion(0,0) -> 0, (0,1) -> 1, (1,0) -> 8, etc.
                    renderPiece(pieceImage, squareIndex);
                }
            }
        }
        //renderPiece('assets/images/pieces-basic-svg/rook-b.svg', 1); 

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
                // Only allow the drop if the move is valid according to chess rules
                if(validateMove(convertIndexToPosition(event.dataTransfer.getData('source-square')), convertIndexToPosition(targetSquare.dataset.index)))
                {
                    let pieceElement = targetSquare.querySelector('img'); // check if there is already an img element inside the target square
                    if (pieceElement) {
                        targetSquare.removeChild(pieceElement); // if there is, remove it to allow the new piece to be placed
                    } 
                    // create a new img after removing existing one (if any)
                    renderPiece(pieceSrc, targetSquare.dataset.index); // render the piece on the target square index
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
            }
        });

        chessboard.addEventListener('click', (event) => {
            const targetSquare = event.target.closest('.square');
            if (!targetSquare) {
                return;
            }
            console.log(`Clicked on square: ${targetSquare.dataset.index}`);// smth like 55
            showValidMoves(convertIndexToPosition(targetSquare.dataset.index)); // convert to a7 or smth before pasing
            setTimeout(() => {
                clearShading();
            }, 1000);
        });
        }
    catch (error) {
        console.error("Error rendering chessboard:", error);
    }
}

document.addEventListener('DOMContentLoaded', ()=> {
    renderChessboard();
});

function renderPiece(piece, position) {
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

function shadeValidSquare(position) {
    try {
        // passed a2,a3 ... here
        index = convertPositionToIndex(position);
        console.log(`Shading square at position: ${position} (index: ${index})`);
        const chessboard = document.getElementById('chessboard');
           if (!chessboard) {
               console.error(`Error: Chessboard not found!`);
               return;
           }
           const square = chessboard.children[index];
           if (!square) {
               console.error(`Error: Square at position ${index} not found!`);
               return;
           }
           square.style.backgroundColor = 'rgba(126, 134, 126, 0.5)'; 
    }
    catch (error) {
        console.error("Error rendering pieces:", error);
    }
   
}

function clearShading() {
    try {
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) {
            console.error(`Error: Chessboard not found!`);
            return;
        }
        const square = chessboard.children;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 0) {
                    square[row * 8 + col].style.backgroundColor =  '#f0d9b5';
                } else {
                    square[row * 8 + col].style.backgroundColor =  '#b58863';
                }
            }
        }
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

function convertPositionToIndex(position) {
    const file = position[0];
    const rank = parseInt(position[1], 10);
    const col = file.charCodeAt(0) - 97;
    const row = 8 - rank;
    return row * 8 + col;
}

function loadPositionFromFEN(fen) {
    chess.load(fen);
    return chess.board();
}

function showValidMoves(position, turn) {
    const validMoves = chess.moves({ square: position, verbose: true });
    console.log(`Valid moves for ${position}:`, validMoves);
    validMoves.forEach(move => {
        //console.log(`Valid move: ${move.from} to ${move.to}`);// move.to is smth like a7, b8, etc
        shadeValidSquare(move.to);
    });
}

function validateMove(from, to) {
    const isValid = chess.move({ from, to, promotion: 'q' }); // promotion is required for pawn moves
    if (isValid) {
        console.log(`Move from ${from} to ${to} is valid.`);
        return true;
    } else {
        console.log(`Move from ${from} to ${to} is invalid.`);
        return false;
    }
}