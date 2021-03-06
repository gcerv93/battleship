import Ship from "./Ship";
import { isArrayInArray } from "../helpers";

const Gameboard = () => {
  const board = [
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
  ];

  const missed = [];
  const hits = [];

  function createShips() {
    const carrier = Ship("carrier", 5);
    const battleship = Ship("battleship", 4);
    const destroyer = Ship("destroyer", 3);
    const submarine = Ship("submarine", 3);
    const patrolBoat = Ship("patrol boat", 2);

    return [carrier, battleship, destroyer, submarine, patrolBoat];
  }

  const ships = createShips();

  function getShips() {
    return ships;
  }

  function getBoard() {
    return board;
  }

  function getOccupied() {
    const occupied = [];

    board.forEach((row, i) => {
      row.forEach((element, idx) => {
        if (element !== false) {
          occupied.push([i, idx]);
        }
      });
    });

    return occupied;
  }

  function allSunk(gameShips = ships) {
    if (gameShips.length > 0) {
      return false;
    }

    return true;
  }

  function sinkShip(sunkShip) {
    const index = ships.findIndex((ship) => sunkShip.name === ship.name);

    if (index !== -1) {
      ships.splice(index, 1);
    }
  }

  function generateUnavailable(arr) {
    const unavailable = [];
    unavailable.push(arr);
    unavailable.push([arr[0], arr[1] + 1]);
    unavailable.push([arr[0], arr[1] - 1]);
    unavailable.push([arr[0] + 1, arr[1]]);
    unavailable.push([arr[0] + 1, arr[1] + 1]);
    unavailable.push([arr[0] + 1, arr[1] - 1]);
    unavailable.push([arr[0] - 1, arr[1]]);
    unavailable.push([arr[0] - 1, arr[1] + 1]);
    unavailable.push([arr[0] - 1, arr[1] - 1]);

    return unavailable;
  }

  function validatePlacement(coords, orientation, ship) {
    const occupied = getOccupied();
    const unavailable = [];
    occupied.forEach((arr) => {
      generateUnavailable(arr).forEach((ele) => unavailable.push(ele));
    });

    let x = coords[0];
    let y = coords[1];
    if (isArrayInArray(unavailable, [x, y])) return false;
    for (let i = 1; i < ship.length; i += 1) {
      let checkCoords;

      if (orientation === "vertical") {
        x += 1;
        if (x > 9) return false;
        checkCoords = [x, y];
      } else {
        y += 1;
        if (y > 9) return false;
        checkCoords = [x, y];
      }

      if (isArrayInArray(unavailable, checkCoords)) {
        return false;
      }
    }

    return true;
  }

  function placeVertically(coords, ship) {
    for (let i = 0; i < ship.length; i += 1) {
      board[coords[0] + i][coords[1]] = {
        ship,
        name: ship.name,
        length: ship.length,
        index: i,
        hit: false,
      };
    }
  }

  function placeHorizontally(coords, ship) {
    for (let i = 0; i < ship.length; i += 1) {
      board[coords[0]][coords[1] + i] = {
        ship,
        name: ship.name,
        length: ship.length,
        index: i,
        hit: false,
      };
    }
  }

  function placeShip(coords, orientation, ship) {
    if (orientation === "vertical") {
      placeVertically(coords, ship);
    } else {
      placeHorizontally(coords, ship);
    }
  }

  function receiveAttack(coords) {
    if (board[coords[0]][coords[1]] === false) {
      if (!isArrayInArray(missed, coords)) {
        missed.push(coords);
      }
    } else {
      const obj = board[coords[0]][coords[1]];
      obj.hit = true;
      obj.ship.hit(obj.index);

      if (!isArrayInArray(hits, coords)) {
        hits.push(coords);
      }

      if (obj.ship.isSunk()) {
        sinkShip(obj.ship);
      }
    }
  }

  return {
    getBoard,
    getShips,
    allSunk,
    placeShip,
    missed,
    hits,
    receiveAttack,
    getOccupied,
    validatePlacement,
  };
};

export default Gameboard;
