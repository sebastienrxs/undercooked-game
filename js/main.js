 /* ------ QUERY SELECTORS ------ */
 let scoreNumber = document.querySelector('#score-span')
 let scoreText = document.querySelector('.score')
 const gridContainer = document.querySelector('.grid')
 let progressBar = null
 const timerElement = document.getElementById("timer")
 const templateProgressBar = document.querySelector('#template-progress-bar')

 // modals
const popUpModal = document.querySelector('#modal-popup')
const instructionsModal = document.querySelector('#instructions-modal')
const popUpModalLose = document.querySelector('#modal-popup-lose')
const instructionsCloseButton = document.getElementById('instructions-close-btn')

// buttons
const startButton = document.getElementById('start-btn')
const resetButton = document.getElementById('reset-btn')
const instructionsButton = document.getElementById('instructions-btn')

// audio
const walkAudio = document.querySelector("audio#walk")
const pickUpAudio = document.querySelector("audio#pickup")
const smallWinAudio = document.querySelector("audio#small-win")
const dropAudio = document.querySelector("audio#drop")



/* ------ VARIABLES ------ */
let cellsArr = []
let plate = null
let ingredientsArr = null
let scoreCounter = 0
let isGameStarted = false
let board=null, player=null, pass=null, intervalId



 /* ------ GAMEBOARD CLASS ------ */
class GameBoard {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.cells = this._createCells() // call the method to create cells
  }
  _createCells() {
    const size = this.width * this.height
    for (let i = 0; i < size; i++) {
      const newCell = document.createElement('div')
      newCell.classList.add('cell')
      if (i < 10 || i > 89) {newCell.classList.add('top-row')} // add a class to first and last row
      if (i > 52 && i < 56) {newCell.classList.add('top-row')} // add a class cells for the table
      // add new class every two line and two cell to make tiles
      if (i > 9 && i < 20 || i > 29 && i < 40 || i > 49 && i < 60 || i > 69 && i < 80) {
        if (i % 2 === 1){
          newCell.classList.add('cell2')
        }
      }

      if (i > 19 && i < 30 || i > 39 && i < 50 || i > 59 && i < 70 || i > 79 && i < 90) {
        if (i % 2 === 0){
          newCell.classList.add('cell2')
        }
      }

      newCell.dataset.index = i // add index as text in the cell
      // newCell.textContent = newCell.dataset.index
      gridContainer.appendChild(newCell)
      cellsArr.push(newCell)
    }
  } 
}



/* ------ PLAYER CLASS ------ */
class Player {
  constructor() {
    this.initialPosition = 21
    this.position = this.initialPosition
    this.className = 'player'
    
  }

  show() {
    cellsArr[this.position].classList.add(this.className)
  }
  
  hide() {
    // remove 'player' class and classes added by pick()
    cellsArr[this.position].classList.remove('player', 'chef-fish', 'chef-rice', 'chef-plate')
  }
  
  resetClass() {
    this.hide()
    this.className = 'player'
    this.show()
  }

    // change player's class when ingredient is picked
  changeToFish() {
    this.hide()
    cellsArr[this.position].classList.add('chef-fish')
    this.className = 'chef-fish'
  }

  changeToRice() {
    this.hide()
    cellsArr[this.position].classList.add('chef-rice')
    this.className = 'chef-rice'
  }

  changeToPlate(){
    this.hide()
    cellsArr[this.position].classList.add('chef-plate')
    this.className = 'chef-plate'

  }

  // make player move and check for boundaries
  moveUp() {
    // stop player from going in first row
    if (this.position < 20 || this.position === 63 || this.position === 64 || this.position === 65 || this.position === 66) {
      return
    }
    this.hide()
    this.position -= board.width
    this.show()
    walkAudio.play()
  }

  moveDown() {
    // stop player from going in last row and in table
    if (this.position > 79 || this.position === 43 || this.position === 44 || this.position === 45 || this.position === 46) {
      return
    }
    this.hide()
    this.position += board.width
    this.show()
    walkAudio.play()
  }
  
  moveLeft() {
    // stop player from leaving board and going in table
    if (this.position % (board.width) === 0 || this.position === 56 || this.position === 57) {
      return
    }
    this.hide()
    this.position -= 1
    this.show()
    walkAudio.play()
  }
  
  moveRight() {
    // stop player from leaving board and going in table
    if ((this.position + 1) % (board.width) === 0 || this.position === 52) {
      return
    }
    this.hide()
    this.position += 1
    this.show()
    walkAudio.play()
  }
}

// create and show player




/* ------ PASS CLASS ------ */
class Pass {
  constructor() {
    this.position = 99
  }

  show() {
  cellsArr[this.position].classList.add('the-pass')
  }

  showPlate() {
    cellsArr[this.position].classList.remove('the-pass')
    cellsArr[this.position].classList.add('pass-plate')
  }
}

// create and show pass




/* ------ PLATE CLASS ------ */
class Plate {
  constructor() {
    this.position = 53
    this.isPicked = false
    // this.className = 'plate'
    this.isInPass = false
    // this.show = this.show() // show plate when created
    }

    show() {
      cellsArr[this.position].classList.add('plate')
      }

    hide() {
      // remove classes added by pick()
      cellsArr[this.position].classList.remove('plate', 'plate-fish', 'plate-fish-rice', 'plate-rice')
    }

    changeToFish() {
      // this.className = ''
      this.hide()
      cellsArr[this.position].classList.add('plate-fish')
    }

    changeToFishRice() {
      // this.className = ''
      this.hide()
      cellsArr[this.position].classList.add('plate-fish-rice')
    }

    changeToRice() {
      // this.className = ''
      this.hide()
      cellsArr[this.position].classList.add('plate-rice')
    }

    pick() {
      this.isPicked = !this.isPicked // change state of isPicked
      pickUpAudio.play()
      }

    drop() {
      this.isPicked = !this.isPicked
      this.isInPass = !this.isInPass
    }
}  

// const plate = new Plate
// plate.show()



/* ------ INGREDIENTS CLASS ------ */
class Ingredient {
  constructor(min, max, className) {
    this.className = className
    this.position = Math.floor(Math.random() * (max - min) + min)
    // this.show = this.show() // show ingredient when created
    this.isPicked = false
    this.isInPlate = false
  }

  show() {
    cellsArr[this.position].classList.add(this.className)
    }

  pick() {
    if (this.isInPlate) {return}
    cellsArr[this.position].classList.toggle(this.className) // toggle className when picked
    this.isPicked = !this.isPicked // change state of isPicked
    pickUpAudio.play()
    }

  drop() {
    this.isPicked = false
    this.isInPlate = true
    dropAudio.play()
  }

  reset() {
    this.show()
    this.isPicked = false
    this.isInPlate = false
  }
}


// // create and show ingredients
// const fish = new Ingredient(0, 5, 'ingredient1')
// const rice = new Ingredient(5, 10,'ingredient2')

// const ingredientsArr = [fish, rice] // update manually if you create a new ingredient

// setTimeout(() => {
//   fish.reset()
  
// }, 3000);



/* ------ MODALS ------ */
function displayModal(text) {
  popUpModal.textContent = text
  let toggleHidden = () => {popUpModal.classList.toggle('hidden')}
  toggleHidden()
}

function displayModalLose(text) {
  popUpModalLose.textContent = text
  popUpModalLose.classList.remove
  let toggleHidden = () => {popUpModalLose.classList.toggle('hidden')}
  toggleHidden()
}

function displayModal2(text) {

  const sectionModal = document.querySelector('#section-modal') // select section
  const newModal = document.createElement('div') // create div
  newModal.classList.add('modal-text') // add class
  newModal.textContent = text //parse text input
  sectionModal.appendChild(newModal) // append div to section

  // hide after x seconds
  let toggleHidden = () => {newModal.classList.toggle('hidden')}
  setTimeout(() => {
    toggleHidden()
    sectionModal.removeChild(newModal)
  }, 2000);
}



/* ------ GAME OVER ------ */

function gameOver() {
displayModalLose('You lost...')
}



/* ------ WIN POINT ------ */

function winPoint () {
  scoreCounter += 1
  scoreNumber.textContent = scoreCounter
  scoreText.classList.add('color-change')
  
  setTimeout(() => {
    scoreText.classList.remove('color-change')
  }, 3000);
}



/* ------ PROGRESS BAR ------ */

function showProgressBar() {
  let clone = templateProgressBar.content.cloneNode(true);
  cellsArr[53].appendChild(clone)
  progressBar = document.querySelector('.progress-bar-container')

    // hide the container with setTimeout
  setTimeout(() => {
    progressBar.classList.toggle('hidden')
  }, 7500);    
}



/* ------ TIMER ------ */

function timer() {
  let time = 29

  intervalId = setInterval(() => {
    let minutes = parseInt(time / 60, 10)
    let secondes = parseInt(time % 60, 10)

    minutes = minutes < 10 ? "0" + minutes : minutes
    secondes = secondes < 10 ? "0" + secondes : secondes

    timerElement.innerText = `${minutes}:${secondes}`
    // time = time <= 0 ? 0 : time - 1

    // Game over and clear interval
    if (time === 0) {
      gameOver()
      clearInterval(intervalId)
    }
    time -= 1
}, 1000)
}



/* ------ START GAME ------ */
// called when start button pressed

function startGame () {
  if (!isGameStarted) {
    startButton.blur() // change focus to prevent clicking the button with space bar
    displayModal2('Pick the fish!')
    timer()

    board = new GameBoard(10, 10)
    player = new Player
    player.show()

    pass = new Pass
    pass.show()
    
    plate = new Plate
    plate.show()
    
    // create and show ingredients
    fish = new Ingredient(0, 5, 'ingredient1')
    fish.show()
    
    rice = new Ingredient(5, 10,'ingredient2')
    rice.show()
    ingredientsArr = [fish, rice] // update manually if you create a new ingredient
    
    isGameStarted = true
  }
}




/* ------ RESET GAME ------ */

function resetGame() {
  resetButton.blur()

  // reset timer
  clearInterval(intervalId)
  timerElement.textContent = '00:00'
  gridContainer.innerHTML=''

  // reset variables
  player = null
  plate = null
  pass = null
  fish = null
  rice = null
  ingredientsArr = null
  isGameStarted = false
  cellsArr = []

  //remove modals
  popUpModal.classList.add('hidden')
  popUpModalLose.classList.add('hidden')

  // remove progress bar
  progressBar.innerHTML=''

  // reset score
  scoreCounter = 0
  scoreNumber.textContent = scoreCounter
}



/* ------ RELOAD GAME ------ */




/* ------ EVENT LISTENERS ------ */

// Start game
startButton.addEventListener('click', startGame)

// Reset game
resetButton.addEventListener('click', resetGame)

// Instructions
function showInstructions() {
  instructionsModal.classList.toggle('hidden')
}
instructionsButton.addEventListener('click', showInstructions)

function closeInstructions() {
  instructionsModal.classList.toggle('hidden')
}

instructionsCloseButton.addEventListener('click', closeInstructions)

// Arrows
document.addEventListener('keydown', function (event) {

  switch (event.key) {
    case 'ArrowUp':
      player.moveUp()
      break

    case 'ArrowDown':
      player.moveDown()
      break

    case 'ArrowLeft':
      player.moveLeft()
      break

    case 'ArrowRight':
      player.moveRight()
  }
})


// Space bar
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {

    // PICKED - check if any ingredient is picked
    let isAnyPicked = null;
    for(var i=0; i<ingredientsArr.length; i++) {
      if(ingredientsArr[i].isPicked === true) {
        isAnyPicked = true;
        break;
      }      
    }
    
    // IN PLATE - check if any ingredient is in plate - NOT WORKING
    let isAnyInPlate = null;
    for(var i=0; i<ingredientsArr.length; i++) {
      if(ingredientsArr[i].isInPlate === true) {
        isAnyInPlate = true;
      }      
    }
        
    // PICK FISH - check if player is in front of fish
    if (player.position - board.width === fish.position) {
      // if one ingredient is already picked, cant pick another one
      if (isAnyPicked || fish.isInPlate) {
        return
      }  
      fish.pick()
      player.hide()
      player.changeToFish()
      displayModal2('Put the fish in the plate!') // chose text to display in modal
    }

    // PICK RICE - check if player is in front of rice
    if (player.position - board.width === rice.position) {
      if (isAnyPicked || rice.isInPlate) {
        return
        } 
      rice.pick()
      player.hide()
      player.changeToRice()
      displayModal2('Put the rice in the plate!')
    }

    // DROP IN PLATE - check if player is in front of plate
    if (player.position + 10 === plate.position) {

      // if player has fish
      if (fish.isPicked && !rice.isInPlate) {
        player.resetClass()
        fish.drop()
        plate.changeToFish()
        displayModal2('You dropped the fish! Go get the rice!')
      }
      
      //if player has rice and fish is in plate
      if (fish.isInPlate&& rice.isPicked) {
        player.resetClass()
        rice.drop()
        plate.changeToFishRice()
        showProgressBar()
        displayModal2('Pick the plate up from the other side of the table!')
      }
      
      // if player has rice
      if (rice.isPicked && !fish.isInPlate) {
        rice.drop()
        player.resetClass()
        plate.changeToRice()
      }
      
      //if player has fish and rice is in plate
      if (rice.isInPlate && fish.isPicked) {
        player.resetClass()
        fish.drop()
        plate.changeToFishRice()
        showProgressBar()
        displayModal2('All your ingredients are in the plate!')
      }
    }

    // PICK PLATE - check if player is in front of plate (other side of the table)
    if (player.position - 10 === plate.position) {
      // if plate is ready
      if (fish.isInPlate === true && rice.isInPlate === true) {
        player.hide()
        plate.hide()
        player.changeToPlate()
        plate.pick()
        displayModal2('Bring the plate to the pass!')
      }
    }

    // DROP IN PASS - check if player is in front of pass
    if (player.position + 10 === pass.position) {
      // if plate is ready
      if (plate.isPicked === true) {
        player.hide()
        player.resetClass()
        player.show()
        plate.drop()
        pass.showPlate()
        winPoint()
        displayModal('Congrats! The customer is happy!')
        smallWinAudio.play()
      }
    }
  }   
})
