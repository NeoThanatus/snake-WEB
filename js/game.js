(function () {
  let FPS = 10
  const SIZE = 40

  let board;
  let snake;
  let apple;
  let score;
  setInterval(run, 1000 / FPS)
  function init() {
    score = new Score();
    board = new Board(SIZE);
    snake = new Snake([[4, 4], [4, 5], [4, 6]])
    apple = new Apple(snake.body)
    
  }

  function restart() {
    board.element.remove();
    score.element.remove();
    snake = null;
    apple = null;
    board = null;
    FPS = 10;
    
    init()
  }

  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if(snake.direction === 2) return;
        snake.changeDirection(0)
        break;
      case "ArrowRight":
        if(snake.direction === 3) return;
        snake.changeDirection(1)
        break;
      case "ArrowDown":
        if(snake.direction === 0) return;
        snake.changeDirection(2)
        break;
      case "ArrowLeft":
        if(snake.direction === 1) return;
        snake.changeDirection(3)
        break;
      case "s":
        restart();
       
        break;
      default:
        break;
    }
  })
  class Score{
    constructor(){
      this.scoreValue = 0;
      this.element = document.createElement("div");
      this.element.setAttribute("id", "score");
      document.body.appendChild(this.element);
      this.element.innerHTML = `Score: 0`
    }
    updateScore(){
      console.log(this.scoreValue.toString().padStart(4, "0")); 
      this.element.innerHTML = `Score: ${this.scoreValue.toString().padStart(4, "0")}`
    }
    addPoints(points){
      this.scoreValue += points;
      this.updateScore();
  }}


  class Board {
    constructor(size) {
      this.element = document.createElement("table")
      this.element.setAttribute("id", "board")
      this.color = "#ccc";
      document.body.appendChild(this.element)
      for (let i = 0; i < size; i++) {
        const row = document.createElement("tr")
        this.element.appendChild(row);
        for (let j = 0; j < size; j++) {
          const field = document.createElement("td");
          row.appendChild(field)
        }
      }
    }
  }

  class Apple{
    constructor(snakeBody){
      this.color = "black"
      this.position = [Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)]
      this.snakeBody = snakeBody;
      this.updatePosition()
      
    }
    chooseNewPosition(snakeBody){
      let newPosition;
      let isPositionOccupied;
      do{
        newPosition = [Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE)];
        isPositionOccupied = snakeBody.some(field => field[0] === newPosition[0] && field[1] === newPosition[1]);
      } while(isPositionOccupied);
      
      if(this.color === "red"){
        score.addPoints(20);
        updateScore(score.scoreValue);
      } else {
        score.addPoints(10);
        updateScore(score.scoreValue);
      }
      this.color = Math.random() < 1/2 ? "black" : "red";
      return newPosition;
    }
    updatePosition(){
      document.querySelector(`#board tr:nth-child(${this.position[0]}) td:nth-child(${this.position[1]})`).style.backgroundColor = this.color
    };
  }


  class Snake {
    constructor(body) {
      this.body = body;
      this.color = "#222";
      this.direction = 1; // 0 para cima, 1 para direita, 2 para baixo, 3 para esquerda
      this.body.forEach(field => document.querySelector(`#board tr:nth-child(${field[0]}) td:nth-child(${field[1]})`).style.backgroundColor = this.color)
    }
    walk() {
      const head = this.body[this.body.length - 1];
      let newHead;
      switch (this.direction) {
        case 0:
          newHead = [head[0] - 1, head[1]]
          break;
        case 1:
          newHead = [head[0], head[1] + 1]
          break;
        case 2:
          newHead = [head[0] + 1, head[1]]
          break;
        case 3:
          newHead = [head[0], head[1] - 1]
          break;
        default:
          break;
      }
      
      this.body.push(newHead)
      const oldTail = this.body.shift()
      document.querySelector(`#board tr:nth-child(${newHead[0]}) td:nth-child(${newHead[1]})`).style.backgroundColor = this.color
      document.querySelector(`#board tr:nth-child(${oldTail[0]}) td:nth-child(${oldTail[1]})`).style.backgroundColor = board.color
    }
    changeDirection(direction) {
      this.direction = direction
    }
    detectCollision() {
      const head = this.body[this.body.length - 1];
      const isAppleEaten = head[0] === apple.position[0] && head[1] === apple.position[1];
      const isSnakeEatingItself = this.body.some((field, index) => index < this.body.length - 1 && field[0] === head[0] && field[1] === head[1]);
      
      if (isAppleEaten) {
        apple.position = apple.chooseNewPosition(this.body);
        apple.updatePosition();
        const tail = this.body[0];
        const secondLast = this.body[1];
        let newTail = [tail[0] * 2 - secondLast[0], tail[1] * 2 - secondLast[1]];
        FPS += 1;
        this.body.unshift(newTail);
      }
      if (isSnakeEatingItself ) {
        gameOver();
    }}
  }
  function updateScore(score) {
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = `Score: ${score}`;
  }
  function run() {
    snake.walk()
    snake.detectCollision()
    //setInterval(this.run, 1000 / FPS)
  }
  function gameOver(){
    alert("Game Over!\nPressione S para reiniciar")
  }
  init()
  

})()