const API_URL = "http://localhost:3000/timetable";

async function fetchTimetable() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch timetable.");
        const data = await response.json();
        renderTimetable(data);
    } catch (error) {
        console.error("Error fetching timetable:", error);
        alert("Could not load timetable. Check console for details.");
    }
}

function renderTimetable(data) {
    const timetable = document.querySelector("#timetable");

    data.forEach(row => {
        const { day, hour, subject } = row;
        const cell = document.getElementById(`${day.toLowerCase()}-${hour}`);
        if (cell) {
            cell.textContent = subject;
        }
    });

    const saveButtons = document.querySelectorAll(".save-btn");
    saveButtons.forEach(btn => {
        btn.addEventListener("click", () => updateLesson(btn.dataset.id));
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => deleteLesson(btn.dataset.id));
    });
}

async function updateLesson(id) {
    const inputs = document.querySelectorAll(`input[data-id='${id}']`);
    const day = inputs[0].value;
    const hour = inputs[1].value;
    const subject = inputs[2].value;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, hour, subject })
        });

        if (!response.ok) throw new Error("Failed to update lesson.");

        alert("Lesson updated successfully!");
        fetchTimetable();
    } catch (error) {
        console.error("Error updating lesson:", error);
        alert("Could not update lesson.");
    }
}

async function deleteLesson(id) {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete lesson.");

        alert("Lesson deleted successfully!");
        fetchTimetable();
    } catch (error) {
        console.error("Error deleting lesson:", error);
        alert("Could not delete lesson.");
    }
}

document.querySelector("#addLessonForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const day = document.querySelector("#day").value;
    const hour = document.querySelector("#hour").value;
    const subject = document.querySelector("#subject").value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, hour, subject })
        });

        if (!response.ok) throw new Error("Failed to add lesson.");

        alert("Lesson added successfully!");
        e.target.reset();
        fetchTimetable();
    } catch (error) {
        console.error("Error adding lesson:", error);
        alert("Could not add lesson.");
    }
});

fetchTimetable();
