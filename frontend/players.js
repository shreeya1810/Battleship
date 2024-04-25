const grid_size = 10;
const num_ships = 5;
const ship_names = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
const num_spots = [5, 4, 3, 3, 2];
let angle = 0;
let count = 0;

let carriers = [];
let battleships = [];
let cruisers = [];
let submarines = [];
let destroyers = [];

function allShipsPlaced() {
  if(count==5){
    return true;
  }
}

function createButton(){
  const button = document.createElement("button");
  const buttonContent = document.createTextNode("Continue");
  button.appendChild(buttonContent);
  button.classList.add("button");
  button.setAttribute("type", "submit");
  $("form")[0].appendChild(button);
  button.addEventListener("click", () => {
    let click = new Audio('/sounds/click.mp3');
    click.play()
        .catch(error => alert("Error playing audio: ", error));
  });
}

function storePositions(){
  Array.from($(".grid-carrier")).forEach(carrier => carriers.push(carrier.classList[1]));
  Array.from($(".grid-battleship")).forEach(battleship => battleships.push(battleship.classList[1]));
  Array.from($(".grid-cruiser")).forEach(cruiser => cruisers.push(cruiser.classList[1]));
  Array.from($(".grid-submarine")).forEach(submarine => submarines.push(submarine.classList[1]));
  Array.from($(".grid-destroyer")).forEach(destroyer => destroyers.push(destroyer.classList[1]));

  ships_data = { "carrier": carriers,
    "battleship": battleships,
    "cruiser": cruisers,
    "submarine": submarines,
    "destroyer": destroyers
  }; //JSON object
  
  return ships_data;
}

function sendData(){  
  $.post('/getData', storePositions());
}

function whenAllShipsPlaced(){
  if (allShipsPlaced() === true){
    $(".ships-list").remove();
    $("h2").text(""); 
    createButton();  
    sendData();
  }
}

function makeGrid(grid, width){
  for (let i = 0; i < width*width; i++) {
    const block = document.createElement('div');
    block.classList.add('block');
    block.classList.add(i);
    grid.append(block);   
  }
}

function drag(ship){
  ship.addEventListener("dragstart", (event) => {
    ship.classList.add("dragging");
  });
  ship.addEventListener("dragend", (event) => {
    ship.classList.remove("dragging");
  });
}

function placeShip(ship, start){
  const shipType = ship.classList[1];
  const end = num_spots[ship_names.indexOf(shipType)] + Number(start) -1;

  for (let i = start; i <= end; i++) {
    if($(`.${i}`)[0].classList.length==3){
        return false;
      }
  }  
  // if ship already present in blocks, don't allow there

  if(Math.floor(start/10) === Math.floor(end/10)){
    for (let i = start; i <= end; i++) {
      $(`.${i}`)[0].classList.add(`grid-${shipType}`);
    }
    count+=1;
    whenAllShipsPlaced();
    return true;
  }
  // if ship overflows grid, don't allow

  return false;
}

function drop(block){
  block.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  block.addEventListener("drop", (event) => {
    const startIndex = event.target.classList[1];
    const shipPlace = $(".dragging")[0];
    if (placeShip(shipPlace, startIndex) === true) {
      shipPlace.remove();
      $(`#${shipPlace.classList[1]}`).remove();
      var audio = new Audio('/sounds/place.mp3');
      audio.play();
    }
  })
}

makeGrid($(".grid"), grid_size);

const blocks = Array.from($('.block'));
blocks.forEach(block => drop(block));

const ships = Array.from($('.ship'));
ships.forEach(ship => drag(ship));