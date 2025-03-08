document.addEventListener("DOMContentLoaded", () => {
    // Cache DOM elements for performance
    const board = document.getElementById("board");
    const numbers = document.querySelectorAll(".palette-number");
    const undoButton = document.getElementById("undo");
    const completionMessage = document.getElementById("completion-message");
    const gameTimeDisplay = document.getElementById("game-time");

    let selectedNumber = null;  // Store the selected number
    let moveHistory = [];  // Track moves for undo functionality
    let gameStartTime = Date.now();  // Record game start time

    // Puzzle grid with -1 representing empty cells
    const puzzle = [
        [-1, 1, -1, -1, -1, -1, -1, 9, -1],
        [-1, -1, 4, -1, -1, -1, 2, -1, -1],
        [-1, -1, 8, -1, -1, 5, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, 3, -1],
        [2, -1, -1, -1, 4, -1, 1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, 1, 8, -1, -1, 6, -1, -1],
        [-1, 3, -1, -1, -1, -1, -1, 8, -1],
        [-1, -1, 6, -1, -1, -1, -1, -1, -1]
    ];

    // Function to create the game board
    function createBoard() {
        for (let row = 0; row < 9; row++) {
            let tr = document.createElement("tr");
            for (let col = 0; col < 9; col++) {
                let td = document.createElement("td");
                td.id = `cell${row}${col}`;
                td.dataset.row = row;
                td.dataset.col = col;

                if (puzzle[row][col] !== -1) {
                    td.textContent = puzzle[row][col];
                    td.classList.add("fixed"); // Mark fixed cells that can't be edited
                } else {
                    td.addEventListener("click", handleCellClick); // Add event listener for user interaction
                }

                tr.appendChild(td);
            }
            board.appendChild(tr);
        }
    }

    // Handle clicks on cells, allowing user to fill them with the selected number
    function handleCellClick(event) {
        if (!selectedNumber) return;  // If no number is selected, do nothing

        let cell = event.target;
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);

        // Prevent modification of fixed cells
        if (cell.classList.contains("fixed")) return;

        let prevValue = cell.textContent;
        cell.textContent = selectedNumber;
        cell.classList.add("user-input");
        moveHistory.push({ cell, prevValue });  // Track the move for undo functionality

        checkConflicts(row, col, selectedNumber); // Check for conflicts after the move
        checkCompletion(); // Check if the game is complete
    }

    // Highlight all instances of the selected number on the board
    function highlightUsedNumbers(selectedNumber) {
        // Remove previous highlights
        document.querySelectorAll(".cell").forEach(cell => {
            cell.classList.remove("highlight");
        });

        // Highlight cells containing the selected number
        if (selectedNumber !== null) {
            document.querySelectorAll(".cell").forEach(cell => {
                if (cell.textContent.trim() === selectedNumber.toString()) {
                    cell.classList.add("highlight");
                }
            });
        }
    }

    // Attach event listener to number palette
    document.querySelectorAll(".palette-number").forEach(button => {
        button.addEventListener("click", function () {
            let selectedNumber = parseInt(this.textContent);
            highlightUsedNumbers(selectedNumber);
        });
    });

    // Attach event listener to number selection buttons
    document.querySelectorAll(".number-button").forEach(button => {
        button.addEventListener("click", function () {
            let selectedNumber = parseInt(this.textContent);
            highlightUsedNumbers(selectedNumber);
        });
    });

    // Function to check for conflicts (same number in the same row, column, or 3x3 grid)
    function checkConflicts(row, col, num) {
        clearConflicts();  // Clear previous conflict highlights

        // Check for conflicts in the same column
        for (let r = 0; r < 9; r++) {
            let cell = document.getElementById(`cell${r}${col}`);
            if (cell.textContent == num && r !== row) {
                markConflict(cell, row, col); // Mark conflict if same number found in column
            }
        }

        // Check for conflicts in the same row
        for (let c = 0; c < 9; c++) {
            let cell = document.getElementById(`cell${row}${c}`);
            if (cell.textContent == num && c !== col) {
                markConflict(cell, row, col); // Mark conflict if same number found in row
            }
        }

        // Check for conflicts in the 3x3 subgrid
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                let cell = document.getElementById(`cell${r}${c}`);
                if (cell.textContent == num && (r !== row || c !== col)) {
                    markConflict(cell, row, col); // Mark conflict in subgrid
                }
            }
        }
    }

    // Mark a cell as a conflict (invalid number placement)
    function markConflict(cell, row, col) {
        cell.classList.add("error");
        document.getElementById(`cell${row}${col}`).classList.add("error"); // Mark current cell as error too
    }

    // Clear all conflict highlights
    function clearConflicts() {
        document.querySelectorAll(".error").forEach(cell => cell.classList.remove("error"));
    }

    // Check if the puzzle is complete and no conflicts remain
    function checkCompletion() {
        let allCellsFilled = true;
        let anyErrors = document.querySelector(".error");

        // Check if all cells are filled and no errors exist
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                let cell = document.getElementById(`cell${row}${col}`);
                if (cell.textContent === "" || cell.classList.contains("error")) {
                    allCellsFilled = false;
                    break;
                }
            }
        }

        if (allCellsFilled && !anyErrors) {
            let gameDuration = Math.floor((Date.now() - gameStartTime) / 1000);  // Calculate game duration
            gameTimeDisplay.textContent = gameDuration;
            completionMessage.classList.remove("hidden");  // Show completion message
            saveHighScore(gameDuration);  // Save the high score
        }
    }

    // Function to save the game duration (high score) to local storage
    function saveHighScore(duration) {
        let scores = JSON.parse(localStorage.getItem("highScores")) || [];
        let date = new Date().toLocaleDateString();
        scores.push({ date, duration });
        scores.sort((a, b) => a.duration - b.duration);  // Sort scores by fastest time
        localStorage.setItem("highScores", JSON.stringify(scores));  // Store high scores
    }

    // Event listener for number selection
    numbers.forEach(number => {
        number.addEventListener("click", () => {
            selectedNumber = number.textContent;
        });
    });

    // Undo functionality: Revert the last move
    undoButton.addEventListener("click", () => {
        if (moveHistory.length === 0) return;

        let lastMove = moveHistory.pop();
        lastMove.cell.textContent = lastMove.prevValue;
        lastMove.cell.classList.remove("user-input");
        clearConflicts();
    });

    createBoard();  // Initialize the board when the page is loaded
});
