let generatedGrid;
        let boardElement = document.getElementById("sudoku-board");
        const restartButton = document.getElementById("restart-button");
        const submitButton = document.getElementById("submit-button");
        const popup = document.getElementById("popup");
        const popupText = document.getElementById("popup-text");
        const popupOkButton = document.getElementById("popup-button");

        function createSudokuBoard() {
            boardElement.innerHTML = '';
            generatedGrid = generateSudoku();
            for (let i = 0; i < 9; i++) {
                let row = boardElement.insertRow();
                for (let j = 0; j < 9; j++) {
                    let cell = row.insertCell();
                    let input = document.createElement("input");
                    input.type = "text";
                    input.maxLength = "1";
                    input.pattern = "[1-9]";

                    if (generatedGrid[i][j] !== 0) {
                        input.value = generatedGrid[i][j];
                        input.disabled = true;
                    }

                    input.addEventListener("input", function () {
                        let num = parseInt(this.value);
                        if (this.value === "" || isNaN(num) || num < 1 || num > 9) {
                            this.value = "";
                        }
                    });
                    cell.appendChild(input);
                }
            }
        }

        function generateSudoku() {
            const grid = Array.from({
                length: 9
            }, () => Array(9).fill(0));
            for (let i = 0; i < 9; i += 3) {
                fillSubgrid(grid, i, i);
            }
            solveSudoku(grid);
            const difficultyLevel = 50;
            removeNumbers(grid, difficultyLevel);
            return grid;
        }

        function fillSubgrid(grid, rowStart, colStart) {
            const numbers = shuffle(Array.from({
                length: 9
            }, (_, i) => i + 1));
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    grid[rowStart + row][colStart + col] = numbers.pop();
                }
            }
        }

        function shuffle(array) {
            let currentIndex = array.length,
                randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]
                ];
            }
            return array;
        }

        function solveSudoku(grid) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        for (let number = 1; number <= 9; number++) {
                            if (isValid(grid, row, col, number)) {
                                grid[row][col] = number;
                                if (solveSudoku(grid)) {
                                    return true;
                                } else {
                                    grid[row][col] = 0;
                                }
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        function isValid(grid, row, col, number) {
            for (let i = 0; i < 9; i++) {
                if (grid[row][i] === number || grid[i][col] === number)
                    return false;
            }
            const subgridRowStart = Math.floor(row / 3) * 3;
            const subgridColStart = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[subgridRowStart + i][subgridColStart + j] === number)
                        return false;
                }
            }
            return true;
        }

        function removeNumbers(grid, count) {
            let attempts = count;
            while (attempts > 0) {
                let row = Math.floor(Math.random() * 9);
                let col = Math.floor(Math.random() * 9);
                if (grid[row][col] !== 0) {
                    grid[row][col] = 0;
                    attempts--;
                }
            }
        }

        function isBoardComplete() {
            const inputs = boardElement.getElementsByTagName("input");
            for (let input of inputs) {
                if (input.value === "") {
                    return false;
                }
            }
            return true;
        }

        function checkBoard() {
            if (!isBoardComplete()) {
                popupText.textContent = "Incomplete Board!";
                popup.style.display = "block";
                return;
            }

            const grid = [];
            const inputs = boardElement.getElementsByTagName("input");
            let index = 0;
            for (let i = 0; i < 9; i++) {
                grid[i] = [];
                for (let j = 0; j < 9; j++) {
                    grid[i][j] = parseInt(inputs[index].value);
                    index++;
                }
            }

            if (isValidSudoku(grid)) {
                popupText.textContent = "Congratulations! You solved it!";
                popup.style.display = "block";
            } else {
                popupText.textContent = "Incorrect Solution. Try again!";
                popup.style.display = "block";
            }
        }

        function isValidSudoku(grid) {
            for (let row = 0; row < 9; row++) {
                const seen = new Set();
                for (let col = 0; col < 9; col++) {
                    const cellValue = grid[row][col];
                    if (cellValue === 0 || seen.has(cellValue)) {
                        return false;
                    }
                    seen.add(cellValue);
                }
            }
            for (let col = 0; col < 9; col++) {
                const seen = new Set();
                for (let row = 0; row < 9; row++) {
                    const cellValue = grid[row][col];
                    if (cellValue === 0 || seen.has(cellValue)) {
                        return false;
                    }
                    seen.add(cellValue);
                }
            }
            for (let boxRow = 0; boxRow < 3; boxRow++) {
                for (let boxCol = 0; boxCol < 3; boxCol++) {
                    const seen = new Set();
                    for (let row = 0; row < 3; row++) {
                        for (let col = 0; col < 3; col++) {
                            const cellValue = grid[3 * boxRow + row][3 * boxCol + col];
                            if (cellValue === 0 || seen.has(cellValue)) {
                                return false;
                            }
                            seen.add(cellValue);
                        }
                    }
                }
            }
            return true;
        }

        popupOkButton.addEventListener("click", () => {
            popup.style.display = "none";
        });

        restartButton.addEventListener("click", createSudokuBoard);
        submitButton.addEventListener("click", checkBoard); 
        window.onload = createSudokuBoard;