function loadDeletedBookings() {
  fetch("http://localhost:5000/api/deleted-bookings")
    .then((response) => response.json())
    .then((deletedBookings) => {
      const tableBody = document
        .getElementById("deletedBookingsTable")
        .getElementsByTagName("tbody")[0];
      tableBody.innerHTML = ""; // Clear any existing rows

      deletedBookings.forEach((booking) => {
        const row = tableBody.insertRow();

        row.insertCell(0).innerText = booking.uniqueId;
        row.insertCell(1).innerText = booking.teamName;
        row.insertCell(2).innerText = booking.whatsappNum;
        row.insertCell(3).innerText = booking.yourName;
        row.insertCell(4).innerText = new Date(
          booking.timestamp
        ).toLocaleString();
        row.insertCell(5).innerText = new Date(
          booking.deletedAt
        ).toLocaleString(); // Show when the booking was deleted
      });
    })
    .catch((error) => console.error("Error loading deleted bookings:", error));
}

// Load bookings when the page loads
window.onload = function () {
  loadBookings();
  setInterval(loadBookings, 5000); // Auto-refresh every 5 seconds
};
