let allBookings = []; // To store all bookings for searching

function loadBookings() {
    fetch("http://localhost:5000/api/bookings")
        .then((response) => response.json())
        .then((bookings) => {
            allBookings = bookings; // Store the fetched bookings
            displayBookings(bookings);
        })
        .catch((error) => console.error("Error loading bookings:", error));
}

function displayBookings(bookings) {
    const bookingsTable = document.getElementById("bookingsTable").getElementsByTagName("tbody")[0];
    bookingsTable.innerHTML = ""; // Clear any existing rows

    bookings.forEach((booking) => {
        const row = bookingsTable.insertRow(0); // Insert at the beginning

        row.insertCell(0).innerText = booking.uniqueId;
        row.insertCell(1).innerText = booking.teamName;
        row.insertCell(2).innerText = booking.whatsappNum;
        row.insertCell(3).innerText = booking.yourName;
        row.insertCell(4).innerText = new Date(booking.timestamp).toLocaleString(); // Display formatted timestamp

        const actionsCell = row.insertCell(5);
        const cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel Slot";
        cancelButton.classList.add("cancel-button");
        cancelButton.onclick = () => cancelBooking(booking.uniqueId);
        actionsCell.appendChild(cancelButton);
    });
}

function searchBooking() {
    const searchTerm = document.getElementById("searchInput").value.toUpperCase();
    const filteredBookings = allBookings.filter((booking) =>
        `${booking.teamName.replace(/\s+/g, "-").toUpperCase()}-${booking.uniqueId}`.includes(searchTerm)
    );
    displayBookings(filteredBookings);
}

function cancelBooking(uniqueId) {
    if (confirm(`Are you sure you want to cancel booking with ID: ${uniqueId}?`)) {
        fetch(`http://localhost:5000/api/bookings/${uniqueId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    loadBookings(); // Reload bookings after cancellation
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => console.error("Error canceling booking:", error));
    }
}

function deleteAllBookings() {
    if (confirm("Are you sure you want to cancel all slots? This action cannot be undone.")) {
        fetch("http://localhost:5000/api/bookings", {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    loadBookings(); // Reload bookings after deletion
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch((error) => console.error("Error deleting all bookings:", error));
    }
}

function downloadCSV() {
    const csvRows = [];
    const headers = ['Team Name'];
    csvRows.push(headers.join(',')); // Add the header row

    // Loop through allBookings to get the team names
    allBookings.forEach(booking => {
        csvRows.push(booking.teamName);
    });

    // Create the CSV file content
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Create a link and click it to trigger the download
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'team_names.csv');
    a.click();
}

// Listen for the Enter key in the search field
document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        searchBooking(); // Trigger the search
    }
});

// Load bookings when the page loads
window.onload = function () {
    loadBookings();
    setInterval(loadBookings, 5000); // Auto-refresh every 5 seconds
};