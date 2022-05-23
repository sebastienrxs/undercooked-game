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
      if (i<10 || i>89) {newCell.classList.add('top-row')} // add a class to first and last row
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
    this.initialPosition = 55
    this.currentPosition = this.initialPosition
    
  }

  show() {
    cellsArr[this.currentPosition].classList.add('player')
  }

  hide() {
    cellsArr[this.currentPosition].classList.remove('player')
  }

  moveUp() {
    // stop player from going in first row
    if (this.currentPosition < 20) {
      return
    }
    this.hide()
    this.currentPosition -= board.width
    this.show()
  }

  moveDown() {
    // stop player from going in last row
    if (this.currentPosition > 79) {
      return
    }
    this.hide()
    this.currentPosition += board.width
    this.show()
  }
  
  moveLeft() {
    // stop player from leaving board
    if (this.currentPosition % (board.width) === 0) {
      return
    }
    this.hide()
    this.currentPosition -= 1
    this.show()
  }
  
  moveRight() {
    // stop player from leaving board
    if ((this.currentPosition + 1) % (board.width) === 0) {
      return
    }
    this.hide()
    this.currentPosition += 1
    this.show()
  }
}


// CREATE AND SHOW PLAYER
const player = new Player
player.show()


// PASS CLASS
class Pass {
  constructor() {
    this.position = 99

  }

  show() {
  cellsArr[this.position].classList.add('the-pass')
  }
}


// CREATE AND SHOW PASS
const pass = new Pass
pass.show()






// // CHOSE INGREDIENT LOCATION
// // Can be done 2 ways, which is best ?
// const ingredient1 = document.querySelector("[data-index = '3']")
// ingredient1.classList.add("ingredient1")

// const ingredient2 = cellsArr[5]
// ingredient2.classList.add("ingredient2")


// // CHOSE PASS LOCATION
// const thePass = cellsArr[99]
// thePass.classList.add("the-pass")


// // SHOW PLAYER
// function showPlayer() {
//   // Show the player in the currentPosition
//   cellsArr[currentPosition].classList.add('player')
  
// }
// showPlayer()

// // let player = document.querySelector('.player')
// // console.log('player:', player)
// // console.log("index", player.dataset.index);


// // REMOVE PLAYER
// function removePlayer() {
//   // stop showing the player in the currentPosition
//   cellsArr[currentPosition].classList.remove('player')
// }


// //MOVE PLAYER
// function movePlayer(newPosition) {
//   // stop player from going in first row
//   if (newPosition < 10) {
//     return
//   }
//     // stop player from going in last row
//   if (newPosition > gridWidth * gridHeight - 11) {
//     return
//   }
//   removePlayer()
//   currentPosition = newPosition

//   showPlayer()
// }



// // PICK INGREDIENT
// function pickIngredient() {
//   ingredient1.classList.toggle("ingredient1")
//   player.classList.toggle("chef-fish")

// }



// EVENT LISTENERS
// Arrows
document.addEventListener('keydown', function (event) {
  console.log(event.key, event.keyCode, event.code)

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


// // Space bar
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    // pickIngredient()
    console.log('Space pressed'); 
  }
})




