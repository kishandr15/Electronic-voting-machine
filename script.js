// Initialize votes from local storage or set to 0
let votes = JSON.parse(localStorage.getItem("votes")) || {
    bjp: 0,
    congress: 0,
    jds: 0,
    nota: 0,
};

// Initialize voters from local storage or set as an empty Set
let voters = new Set(JSON.parse(localStorage.getItem("voters")) || []);

const message = document.getElementById("message");
const showResultsButton = document.getElementById("showResults");
const resetVotesButton = document.getElementById("resetVotes");
const resultsSection = document.getElementById("resultsSection");
const votingSection = document.getElementById("votingSection");

document.getElementById("submitVoterId").addEventListener("click", () => {
    const voterId = document.getElementById("voterIdInput").value.trim();

    if (voterId === "") {
        message.textContent = "Please enter a valid Voter ID!";
        return;
    }

    if (voters.has(voterId)) {
        message.textContent = "You have already voted!";
        return;
    }

    voters.add(voterId); // Add voter ID to the set
    localStorage.setItem("voters", JSON.stringify([...voters])); // Update local storage

    // Show the voting section and hide the results section
    votingSection.style.display = "grid";
    resultsSection.style.display = "none";
    showResultsButton.style.display = "block"; // Ensure results button remains visible on the main screen
    message.textContent = ""; // Clear any messages

    // Disable the Voter ID input field to prevent further entries
    document.getElementById("voterIdInput").disabled = true;
});


document.getElementById("bjpVote").addEventListener("click", () => castVote("bjp"));
document.getElementById("congressVote").addEventListener("click", () => castVote("congress"));
document.getElementById("jdsVote").addEventListener("click", () => castVote("jds"));
document.getElementById("notaVote").addEventListener("click", () => castVote("nota"));

function castVote(party) {
    votes[party]++;
    localStorage.setItem("votes", JSON.stringify(votes)); // Update local storage
    message.textContent = `You voted for ${party.toUpperCase()}.`;
    votingSection.style.display = "none"; // Hide voting section

    // Clear the Voter ID input field and re-enable it for the next voter
    document.getElementById("voterIdInput").value = "";
    document.getElementById("voterIdInput").disabled = false;
}


showResultsButton.addEventListener("click", () => {
    const isResultsVisible = resultsSection.style.display === "block";

    if (isResultsVisible) {
        resultsSection.style.display = "none";
        showResultsButton.textContent = "Show Results";
        resetVotesButton.style.display = "none"; // Hide the reset button
    } else {
        displayResults();
        resultsSection.style.display = "block";
        showResultsButton.textContent = "Hide Results";
        resetVotesButton.style.display = "block"; // Show the reset button
    }
});

resetVotesButton.addEventListener("click", () => {
    // Reset the votes and clear the local storage
    votes = { bjp: 0, congress: 0, jds: 0, nota: 0 };
    localStorage.setItem("votes", JSON.stringify(votes)); // Update local storage

    // Reset the voters
    voters = new Set();
    localStorage.setItem("voters", JSON.stringify([])); // Clear voters from local storage

    // Update the UI to reflect the reset
    displayResults();
    message.textContent = "Votes have been reset.";
});

function displayResults() {
    const resultsTable = document.getElementById("resultsTable");
    resultsTable.innerHTML = `
        <tr>
            <th>Party</th>
            <th>Votes</th>
        </tr>
    `;

    const sortedResults = Object.entries(votes).sort((a, b) => b[1] - a[1]);

    sortedResults.forEach(([party, count]) => {
        resultsTable.innerHTML += `
            <tr>
                <td>${party.toUpperCase()}</td>
                <td>${count}</td>
            </tr>
        `;
    });
}
