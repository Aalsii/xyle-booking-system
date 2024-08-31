// Mousemove effect for dot following the mouse
document.addEventListener("mousemove", function (e) {
  const dot = document.getElementById("dot");
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
});

function openForm() {
  document.getElementById("popupForm").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

document.getElementById("overlay").onclick = closeForm;

function submitForm(event) {
  event.preventDefault(); // Prevents the default form submission

  // Get the form data
  const teamName = document.getElementById("teamName").value;
  const whatsappNum = document.getElementById("whatsappNum").value;
  const yourName = document.getElementById("yourName").value;

  // Submit the data to your server (which saves it to MongoDB)
  fetch("http://localhost:5000/api/book-slot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamName, whatsappNum, yourName }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert(`Your booking is confirmed. Your unique ID is: ${data.uniqueId}`);
        document.getElementById("bookingForm").reset(); // Reset the form fields
        closeForm(); // Close the form after submission
      } else {
        alert("Failed to book slot: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to book slot.");
    });
}
