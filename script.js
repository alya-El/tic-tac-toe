const X_CLASS = 'x';
const O_CLASS = 'o';

//audio for button click
const audio  = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/242518/click.mp3');

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.querySelector('#board');
const winnerMessg = document.querySelector('[data-winner-text]');
const winnerScreen = document.querySelector('#winner');
const startScreen = document.querySelector('#start-screen');

const restartBtn = document.querySelector('#restart');
const newGameBtn = document.querySelector('#new-game');

//const bot = document.querySelector('#ai-bot');
const friendBtn = document.querySelector('#friend');

let Xturn;
let boardArray;
let cellIndecies;

restartBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", StartingScreen);

//startGame();
StartingScreen();

function StartingScreen(){
    startScreen.classList.add('show');
    friendBtn.addEventListener("click", function(){
        audio.load();
        audio.play();
        startGame();
    });
}

function startGame(){
    Xturn = true;
    boardArray = [];
    cellIndecies = [].slice.call(cellElements, 0);
    winnerScreen.classList.remove('show');
    startScreen.classList.remove('show');

    setBoardHover();

    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
       
        cell.addEventListener("click", cellClicked, {once: true});
    });
}

function cellClicked(e){
    let cell = e.target; 
    let cellIndex = cellIndecies.indexOf(cell);
    let currClass = Xturn ? X_CLASS : O_CLASS;

    //place mark and switch turns
    placeMark(cell, currClass, cellIndex);

    //check for win
    if(checkWinner(currClass)){
        endGame(false);
    }
    //check for draw
    else if(!checkWinner(currClass) && !boardArray.includes(undefined) && boardArray.length === 9){
        endGame(true);
    }
    else{
        //set currClass to who's turn it is
        currClass = Xturn ? X_CLASS : O_CLASS;
        //set board hover
        setBoardHover();
    }
};

function endGame(draw){
    winnerScreen.classList.add('show');
    if(!draw){
        winnerMessg.innerHTML = (Xturn ? O_CLASS : X_CLASS).toUpperCase() + " Won!";
    }
    else{
        winnerMessg.innerHTML = "It's A Draw!";
    }
};

function placeMark(cell, currClass, cellIndex){
    cell.classList.add(currClass);

    //place mark on board array
    boardArray[cellIndex] = (currClass);

    //check if it's x's turn, if true switch to o's turn
    Xturn = Xturn ? false : true;
};

function setBoardHover(){
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);

    if(Xturn){
        board.classList.add(X_CLASS);
    }
    else{
        board.classList.add(O_CLASS);
    }
};

function checkWinner(currClass){
    if(boardArray[0] === currClass){
        if(boardArray[1] === currClass && boardArray[2] === currClass){
            return true;
        }
        if(boardArray[3] === currClass && boardArray[6] === currClass){
            return true;
        }
        if(boardArray[4] === currClass && boardArray[8] === currClass){
            return true;
        }
    }

    if(boardArray[2] === currClass){
        if(boardArray[5] === currClass && boardArray[8] === currClass){
            return true;
        }
        if(boardArray[4] === currClass && boardArray[6] === currClass){
            return true;
        }
    }

    if(boardArray[4] === currClass){
        if(boardArray[3] === currClass && boardArray[5] === currClass){
            return true;
        }
        if(boardArray[1] === currClass && boardArray[7] === currClass){
            return true;
        }
    }

    if(boardArray[6] === currClass && boardArray[7] === currClass && boardArray[8] === currClass){
        return true;
    }
    return false;
}; 
