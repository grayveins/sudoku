document.addEventListener("DOMContentLoaded", () => {
    // Define an array of high scores, each with a date and time
    const highScores = [
        { date: "2021/01/17", time: "3:41" },
        { date: "2021/01/21", time: "4:01" },
        { date: "2021/02/01", time: "2:52" },
        { date: "2021/02/17", time: "3:08" },
        { date: "2021/03/02", time: "2:51" }
    ];

    // Select the tbody element of the high scores table
    const tableBody = document.querySelector("#high-scores tbody");

    // Iterate over each score in the highScores array
    highScores.forEach(score => {
        // Create a new row (<tr>) for each score
        const row = document.createElement("tr");

        // Create a cell for the date and set its text content
        const dateCell = document.createElement("td");
        dateCell.textContent = score.date;
        dateCell.classList.add("date-cell");  // Add a class for styling

        // Create a cell for the time and set its text content
        const timeCell = document.createElement("td");
        timeCell.textContent = score.time;
        timeCell.classList.add("duration-cell");  // Add a class for styling

        // Append both the date and time cells to the row
        row.appendChild(dateCell);
        row.appendChild(timeCell);

        // Append the new row to the table body
        tableBody.appendChild(row);
    });
});
