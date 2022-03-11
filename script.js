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

const botBtn = document.querySelector('#ai-bot');
const friendBtn = document.querySelector('#friend');

let Xturn;
let boardArray;
let cellIndecies;
let botPlayer;

let delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

restartBtn.addEventListener("click", startGame);
newGameBtn.addEventListener("click", StartingScreen);

//startGame();
StartingScreen();

function StartingScreen(){
    startScreen.classList.add('show');
    botPlayer = false;

    friendBtn.addEventListener("click", function(){
        startGame();
    });
    botBtn.addEventListener("click", function(){
        startGame();
        botPlayer = true;
    });
}

function startGame(){
    Xturn = true;
    boardArray = new Array(9);
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
    audio.load();
    audio.play();
     
    let cell = Xturn || !botPlayer ? e.target : e;
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

        //if playing with ai, play ai move
        if(!Xturn && botPlayer){
            delay(function(){
                botMove();
            }, 600 );   
        }
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

function botMove(){
    let randomIndex = Math.floor(Math.random() * boardArray.length);

    while(boardArray[randomIndex] == 'x'|| boardArray[randomIndex] == 'o'){
        randomIndex = Math.floor(Math.random() * boardArray.length);
    }
    let cell = document.querySelector(`.cell:nth-child(${randomIndex+1})`);

    cellClicked(cell);
};

function setBoardHover(){
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);

    if(Xturn){
        board.classList.add(X_CLASS);
    }
    else if(!botPlayer && !Xturn){
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
