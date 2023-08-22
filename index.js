import { createApp } from "vue";

createApp({
  data() {
    return {
      max: 10,
      snake: ["0-0"],
      prey: "0-0",
      coordinatesList: ["0-0"],
      x: [0],
      y: [0],
      time: null,
      up: false,
      down: false,
      left: false,
      right: false,
      locked: "",
      speed: 1000,
      tmpSpeed: "1000",
      snakeSprint: false,
      gameOver: false,
    };
  },
  mounted() {
    this.init();
    window.addEventListener("keyup", this.onArrow);
    if (this.gameOver) {
      window.alert("Game Over!");
    }
    window.addEventListener("keydown", this.boostOn);
    window.addEventListener("keyup", this.boostOff);
  },
  methods: {
    init() {
      const tempX = [];
      const tempY = [];
      const tmpCoordinatesList = [];
      for (let i = 0; i <= this.max; i += 1) {
        tempX.push(i);
        tempY.push(i);
        for (let j = 0; j <= this.max; j += 1) {
          tmpCoordinatesList.push(i + "-" + j);
        }
      }
      this.coordinatesList = tmpCoordinatesList;
      this.x = tempX;
      this.y = tempY;
      const tmpSnake = [];
      const startPoint = Math.floor(tmpCoordinatesList.length / 3);
      for (let i = startPoint; i < startPoint + 5; i += 1) {
        tmpSnake.push(tmpCoordinatesList[i]);
      }
      this.snake = tmpSnake;
      this.locked = "ArrowRight";
      if (!this.prey) {
        this.generatePrey();
      }
      this.run();
    },
    async generatePrey() {
      const randomX = Math.floor(Math.random() * this.max + 0);
      const randomY = Math.floor(Math.random() * this.max + 0);
      const tmpPrey = randomX + "-" + randomY;
      if (this.snake.includes(tmpPrey)) {
        this.generatePrey();
      } else {
        this.prey = tmpPrey;
      }
    },
    isSnake(id) {
      if (id && this.snake) return this.snake.includes(id);
      return false;
    },
    isPrey(id) {
      return this.prey === id;
    },
    run() {
      this.time = () => {
        const head = this.snake[0];
        const n = head.split("-");
        const nX = Number(n[0]);
        const nY = Number(n[1]);
        const topEnd = nX === 0;
        const bottomEnd = nX === this.max;
        const leftEnd = nY === 0;
        const rightEnd = nY === this.max;
        let newHead = head;
        if (this.up) {
          let newnX;
          if (topEnd) {
            newnX = this.max;
          } else {
            newnX = nX - 1;
          }
          newHead = `${newnX}-${nY}`;
          this.locked = "ArrowDown";
        } else if (this.down) {
          let newnX;
          if (bottomEnd) {
            newnX = 0;
          } else {
            newnX = nX + 1;
          }
          newHead = `${newnX}-${nY}`;
          this.locked = "ArrowUp";
        } else if (this.left) {
          let newnY;
          if (leftEnd) {
            newnY = this.max;
          } else {
            newnY = nY - 1;
          }
          newHead = `${nX}-${newnY}`;
          this.locked = "ArrowRight";
        } else if (this.right) {
          let newnY;
          if (rightEnd) {
            newnY = 0;
          } else {
            newnY = nY + 1;
          }
          newHead = `${nX}-${newnY}`;
          this.locked = "ArrowLeft";
        } else {
          this.init();
          return;
        }
        if (this.snake.includes(newHead)) {
          this.gameOver = true;
        } else {
          this.gameOver = false;
        }
        const newSnake = [newHead, ...this.snake];
        this.move(newSnake);
      };
      setTimeout(this.time, this.speed);
    },
    async move(newSnake) {
      console.log("this.speed", this.speed);
      if (this.gameOver) {
        this.max = 10;
        this.snake = ["0-0"];
        this.prey = "0-0";
        this.coordinatesList = ["0-0"];
        this.x = [0];
        this.y = [0];
        this.time = null;
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.locked = "";
        this.speed = 1000;
        this.init();
        return;
      }
      if (newSnake.includes(this.prey)) {
        await this.generatePrey();
        this.snake = newSnake;
        this.speed =
          this.speed - 100 > 100
            ? (this.speed = this.speed - 100)
            : (this.speed = 100);
      } else {
        newSnake.pop();
        this.snake = newSnake;
      }
      this.run();
    },
    boostOn(event) {
      console.log("boostOn",event);
      if (event.code === "Space") {
        if (!this.snakeSprint) {
          this.tmpSpeed = this.speed.toString();
        }
        this.snakeSprint = true;
        this.speed = 100;
      }
    },
    boostOff(event) {
      console.log("boostOff",event);
      if (event.code === "Space") {
        this.snakeSprint = false;
        this.speed = Number(this.tmpSpeed);
      }
    },
    onArrow(event) {
      const { key } = event;
      if (key === "ArrowUp" && this.locked !== "ArrowUp") {
        this.up = true;
        this.down = false;
        this.left = false;
        this.right = false;
      } else if (key === "ArrowDown" && this.locked !== "ArrowDown") {
        this.up = false;
        this.down = true;
        this.left = false;
        this.right = false;
      } else if (key === "ArrowLeft" && this.locked !== "ArrowLeft") {
        this.up = false;
        this.down = false;
        this.left = true;
        this.right = false;
      } else if (key === "ArrowRight" && this.locked !== "ArrowRight") {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = true;
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onArrow);
    window.removeEventListener("keyup", this.boostOff);
    window.removeEventListener("keydown", this.boostOn);
  },
}).mount("#app");
