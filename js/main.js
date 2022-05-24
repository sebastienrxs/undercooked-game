// const and query selectors
const gridContainer = document.querySelector('.grid')
const cellsArr = []
const modalPopUp = document.querySelector('#modal-popup')



 /* GAMEBOARD CLASS */
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
      newCell.textContent = newCell.dataset.index
      gridContainer.appendChild(newCell)
      cellsArr.push(newCell)
    }
  } 
}


// create new board
const board = new GameBoard(10, 10)



/* PLAYER CLASS */
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
    cellsArr[this.position].classList.remove(this.className, fish.chefClassName, rice.chefClassName)
  }
  
  resetClass() {
    this.hide()
    this.className = 'player'
    this.show()
  }

    // change player's class when ingredient is picked
  changeToFish() {
    cellsArr[this.position].classList.add('chef-fish')
    this.className = 'chef-fish'
  }

  changeToRice() {
    cellsArr[this.position].classList.add('chef-rice')
    this.className = 'chef-rice'
  }

  changeToPlate(){
    cellsArr[this.position].classList.add('chef-plate')
    this.className = 'chef-plate'

  }

  // make player move and check for boundaries
  moveUp() {
    // stop player from going in first row
    if (this.position < 20 || this.position === 63 || this.position === 64 || this.position === 65) {
      return
    }
    this.hide()
    this.position -= board.width
    this.show()
  }

  moveDown() {
    // stop player from going in last row and in table
    if (this.position > 79 || this.position === 43 || this.position === 44 || this.position === 45) {
      return
    }
    this.hide()
    this.position += board.width
    this.show()
  }
  
  moveLeft() {
    // stop player from leaving board and going in table
    if (this.position % (board.width) === 0 || this.position === 56) {
      return
    }
    this.hide()
    this.position -= 1
    this.show()
  }
  
  moveRight() {
    // stop player from leaving board and going in table
    if ((this.position + 1) % (board.width) === 0 || this.position === 52) {
      return
    }
    this.hide()
    this.position += 1
    this.show()
  }
}

// create and show player
const player = new Player
player.show()



/* PASS CLASS */
class Pass {
  constructor() {
    this.position = 99
    this.show = this.show() // show pass when created
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
const pass = new Pass



/* PLATE CLASS */
class Plate {
  constructor() {
    this.position = 53
    this.isPicked = false
    this.className = 'plate'
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
      this.className = ''
      cellsArr[this.position].classList.add('plate-fish')
    }

    changeToFishRice() {
      this.className = ''
      cellsArr[this.position].classList.add('plate-fish-rice')
    }

    changeToRice() {
      this.className = ''
      cellsArr[this.position].classList.add('plate-rice')
    }

    pick() {
      this.isPicked = !this.isPicked // change state of isPicked
      }

    drop() {
      this.isPicked = !this.isPicked
    }
}  

const plate = new Plate
plate.show()



/*  INGREDIENT CLASS  */
class Ingredient {
  constructor(position, className, chefClassName) {
    this.className = className
    this.position = position
    this.show = this.show() // show ingredient when created
    this.isPicked = false
    this.isInPlate = false
    this.chefClassName = chefClassName
  }

  show() {
    cellsArr[this.position].classList.add(this.className)
    }

  pick() {
    if (this.isInPlate) {return}
    cellsArr[this.position].classList.toggle(this.className) // toggle className when picked
    this.isPicked = !this.isPicked // change state of isPicked
    }

  drop() {
    this.isPicked = false
    this.isInPlate = true
  }
}

// create and show ingredients
const fish = new Ingredient(4, 'ingredient1', 'chef-fish')
const rice = new Ingredient(6, 'ingredient2')

const ingredientsArr = [fish, rice] // update manually if you create a new ingredient


/* DISPLAY MODAL */
function displayModal(text) {
  modalPopUp.textContent = text
  let toggleHidden = () => {modalPopUp.classList.toggle('hidden')}
  toggleHidden()
}

function displayModal2(text) {

  const sectionModal = document.querySelector('#section-modal')
  const newModal = document.createElement('div')
  newModal.classList.add('modal-text')
  newModal.textContent = text
  sectionModal.appendChild(newModal)

  let toggleHidden = () => {newModal.classList.toggle('hidden')}
  setTimeout(() => {
    toggleHidden()
    sectionModal.removeChild(newModal)
  }, 2000);
}


/* WIN POINT */
let scoreCounter = 0
let scoreNumber = document.querySelector('#score-span')
let scoreText = document.querySelector('.score')

function winPoint () {
  scoreCounter += 1
  scoreNumber.textContent = scoreCounter
  scoreText.classList.add('color-change')
  setTimeout(() => {
    scoreText.classList.remove('color-change')
  }, 3000);
}


/* PROGRESS BAR */
const progressBar = document.querySelector('.progress-bar-container')

function showProgressBar() {
  //create div inside the progress bar container
  progressBar.classList.toggle('hidden')
  const newDiv = document.createElement('div')
  newDiv.classList.add('progress')
  progressBar.appendChild(newDiv)

  // create div inside div inside container
  const newDiv2 = document.createElement('div') 
  newDiv2.classList.add('progress-value')
  newDiv.appendChild(newDiv2)

  // hide the container with setTimeout
  setTimeout(() => {
    progressBar.classList.toggle('hidden')
  }, 7500);  
}



/* EVENT LISTENERS */

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
      displayModal2('You picked the fish!') // chose text to display in modal
    }

    // PICK RICE - check if player is in front of rice
    if (player.position - board.width === rice.position) {
      if (isAnyPicked || rice.isInPlate) {
        return
        } 
      rice.pick()
      player.hide()
      player.changeToRice()
      displayModal2('You picked the rice!')
    }

    // DROP IN PLATE - check if player is in front of plate
    if (player.position + 10 === plate.position) {

      // if player has fish
      if (fish.isPicked === true) {
        player.resetClass()
        fish.drop()
        plate.changeToFish()
        displayModal2('You dropped the fish! Go get the rice!')
      }
      
      //if player has rice and fish is in plate
      if (fish.isInPlate === true && rice.isPicked === true) {
        player.resetClass()
        rice.drop()
        plate.changeToFishRice()
        displayModal2('All your ingredients are in the plate! Pick it up!')
        showProgressBar()
      }
      
      // if player has rice
      if (rice.isPicked === true) {
        rice.drop()
        player.resetClass()
        plate.changeToRice()
      }
      
      //if player has fish and rice is in plate
      if (rice.isInPlate === true && fish.isPicked === true) {
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
      }
    }
  }   
})




