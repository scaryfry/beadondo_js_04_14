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
    const tbody = document.querySelector("#timetable tbody");
    tbody.innerHTML = ""; 

    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${row.id}</td>
            <td><input type="text" value="${row.day}" class="editable" data-id="${row.id}" data-field="day"></td>
            <td><input type="text" value="${row.hour}" class="editable" data-id="${row.id}" data-field="hour"></td>
            <td><input type="text" value="${row.subject}" class="editable" data-id="${row.id}" data-field="subject"></td>
            <td>
                <button class="save-btn" data-id="${row.id}">Save</button>
                <button class="delete-btn" data-id="${row.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.querySelectorAll(".save-btn").forEach(btn => {
        btn.addEventListener("click", () => updateLesson(btn.dataset.id));
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
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
