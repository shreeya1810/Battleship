const grid_size = 10;
const ship_names = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
const num_spots = [5, 4, 3, 3, 2];
let players = [];
let classes = ["playerOne", "playerTwo"];
let turn = 1;
let playerOneHits = [];
let playerTwoHits = [];
let playerOneSunk = [];
let playerTwoSunk = [];


fetch('/sendShips')
  .then(response => response.json())
  .then(jsonData => placeShips(jsonData));

fetch('/sendPlayers')
  .then(response => response.json())
  .then(players => pushNames(players));


function makeGrid(grid, width) {
  for (let i = 0; i < width*width; i++) {
    const block= document.createElement('div');
    block.classList.add('block');
    block.classList.add(i);
    grid.append(block);   
  }
}

function pushNames(playerNames) {
  players.push(playerNames[0]);
  players.push(playerNames[1]);
}

function placeShips(playerShips) {  
  for (ship in playerShips[0]) {
    playerShips[0][ship].forEach(block => $(".playerOne .grid .block")[block].classList.add(`grid-${ship}`));
    playerShips[1][ship].forEach(block => $(".playerTwo .grid .block")[block].classList.add(`grid-${ship}`));
  }
}

function startGame() {
  const blocks = Array.from($( `.${classes[turn]} .grid .block`));
  blocks.forEach(block => block.addEventListener('click', handleClick));
}

function switchTurn(){
  if(turn == 0){
    turn = 1;
  }
  else{
    turn = 0;
  }
}

function hide() {
  const blocks = Array.from($(".block"));
  blocks.forEach(block => block.classList.add("hide")); 
}

function handleClick(event) {

  if(!checkSunk()){

    if (event.target.classList.length === 4) {
      event.target.classList.add("hit");

      switchTurn();

      let shipName = event.target.classList[3].split('-')[1]

      if (turn == 0){
        playerTwoHits.push(shipName);
      }

      else {
        playerOneHits.push(shipName);
      }

      checkScore(shipName, num_spots[ship_names.indexOf(shipName)]);
      setTimeout(() =>{
        $('h2').text(`${players[turn]} go again`);
        switchTurn();
        startGame();
        checkSunk();
        restartGame();
        }, 1200); 
    }

    else if (event.target.classList.length === 5){
      $("h2").text("You've already fired here");
      switchTurn();
      setTimeout(() =>{
        $('h2').text(`${players[turn]} try again`);
        switchTurn();
        startGame();
        }, 1200); 
    }

    else{
      $("h2").text("It's a miss!");
      event.target.classList.add("miss");
      event.target.classList.add("taken");
      setTimeout(() =>{
        $('h2').text(`${players[turn]} goes next`);
        switchTurn();
        startGame();
        }, 1200); 
    }

    const blocks = Array.from($(".block"));
    blocks.forEach(block => block.replaceWith(block.cloneNode(true))); 
  }

}

function checkScore(hitName, shipLength) {

  if (turn == 0) {
    if(playerTwoHits.filter(storedShip => storedShip==hitName).length == shipLength){
      $("h2").text(`You sunk ${players[1]}'s ${hitName}!`);
      playerTwoSunk.push(hitName);
    }

    else{
      $("h2").text("It's a hit!");
    }
  }

  else {
    if(playerOneHits.filter(storedShip => storedShip==hitName).length == shipLength){
      $("h2").text(`You sunk ${players[0]}'s ${hitName}!`);
      playerOneSunk.push(hitName);
    }

    else{
      $("h2").text("It's a hit!");
    }
  }
}

function checkSunk() {

  if (playerTwoSunk.length == 5){
    $("h2").text(`${players[0]} won!!`);
    return true;
  }
  else if(playerOneSunk.length == 5){
    $("h2").text(`${players[1]} won!!`);
    return true;
  }
  return false;
}

function restartGame() {
  if (checkSunk()){
    const button = document.createElement("button");
    const buttonContent = document.createTextNode("Play Again");
    button.appendChild(buttonContent);
    button.classList.add("button");
    button.setAttribute("type", "submit");
    $("form")[0].appendChild(button);
  }
}

const grids = Array.from($('.grid'));
grids.forEach(grid => makeGrid(grid, grid_size));

hide();
startGame();