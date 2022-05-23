// CONST
const gridContainer = document.querySelector('.grid')
const cellsArr = []


// GAMEBOARD CLASS
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
      newCell.dataset.index = i // add index as text in the cell
      newCell.textContent = newCell.dataset.index
      gridContainer.appendChild(newCell)
      cellsArr.push(newCell)
    }
  } 
}


// CREATE NEW BOARD
const board = new GameBoard(10, 10)



//PLAYER CLASS
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

  moveUp() {
    // stop player from going in first row
    if (this.position < 20) {
      return
    }
    this.hide()
    this.position -= board.width
    this.show()
  }

  moveDown() {
    // stop player from going in last row
    if (this.position > 79) {
      return
    }
    this.hide()
    this.position += board.width
    this.show()
  }
  
  moveLeft() {
    // stop player from leaving board
    if (this.position % (board.width) === 0) {
      return
    }
    this.hide()
    this.position -= 1
    this.show()
  }
  
  moveRight() {
    // stop player from leaving board
    if ((this.position + 1) % (board.width) === 0) {
      return
    }
    this.hide()
    this.position += 1
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
}


// CREATE AND SHOW PLAYER
const player = new Player
player.show()


// PASS CLASS
class Pass {
  constructor() {
    this.position = 99
    this.show = this.show() // show pass when created
  }

  show() {
  cellsArr[this.position].classList.add('the-pass')
  }
}


// CREATE AND SHOW PASS
const pass = new Pass


// INGREDIENT CLASS
class Ingredient {
  constructor(position, className, chefClassName) {
    this.className = className
    this.position = position
    this.show = this.show() // show ingredient when created
    this.isPicked = false
    this.chefClassName = chefClassName
  }

  show() {
    cellsArr[this.position].classList.add(this.className)
    }

  pick() {
    cellsArr[this.position].classList.toggle(this.className) // toggle className when picked
    this.isPicked = !this.isPicked // change state of isPicked
    console.log(`You picked the ${this.className}!`);
    }

    drop() {
      this.isPicked = false

    }
  }




// CREATE AND SHOW INGREDIENTS
const fish = new Ingredient(4, 'ingredient1', 'chef-fish')
const rice = new Ingredient(6, 'ingredient2')

const ingredientsArr = [fish, rice]
console.log('ingredientsArr:', ingredientsArr)




// EVENT LISTENERS
// Arrows
document.addEventListener('keydown', function (event) {
  // console.log(event.key, event.code)

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

    // check if any ingredient is picked
    let isAnyPicked = null;
    for(var i=0; i<ingredientsArr.length; i++) {
      if(ingredientsArr[i].isPicked === true ) {
        isAnyPicked = true;
        break;
      }
    }
        
    // check if player is in front of fish
    if (player.position - board.width === fish.position) {
      if (isAnyPicked) {
        return
      }  
      fish.pick()
      player.hide()
      player.changeToFish()
    }
    // check if player is in front of rice
    if (player.position - board.width === rice.position) {
      if (isAnyPicked) {
        return
        } 
      rice.pick()
      player.hide()
      player.changeToRice()
    }

    // check if player is in front of plate
    if (player.position === 43) {
      if (fish.isPicked === true) {
        fish.drop()
        player.resetClass()
      }
      if (rice.isPicked === true) {
        // rice.drop()
        player.resetClass()
      }
    }
  }   
})




