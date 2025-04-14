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
    data.forEach(row => {
        const { id, day, hour, subject } = row; 
        const cell = document.getElementById(`${day.toLowerCase()}-${hour}`);
        if (cell) {
            cell.textContent = subject;
            cell.dataset.lessonId = id; 
            cell.addEventListener("click", () => {
                const dayInput = document.querySelector("#day");
                const hourInput = document.querySelector("#hour");
                const subjectInput = document.querySelector("#subject");
                const lessonIdInput = document.querySelector("#lessonId");

                if (dayInput && hourInput && subjectInput && lessonIdInput) {
                    dayInput.value = day;
                    hourInput.value = hour;
                    subjectInput.value = subject;
                    lessonIdInput.value = id; 
                } else {
                    console.error("One or more input fields are missing in the DOM.");
                }
            });
        } else {
            console.warn(`Cell with ID '${day.toLowerCase()}-${hour}' not found.`);
        }
    });
}

async function updateLesson() {
    const lessonIdInput = document.querySelector("#lessonId");
    const lessonId = lessonIdInput ? lessonIdInput.value : null;

    if (!lessonId) {
        alert("Lesson ID is missing. Please select a lesson to update.");
        return;
    }
    const day = document.querySelector("#day").value;
    const hour = document.querySelector("#hour").value;
    const subject = document.querySelector("#subject").value;
    if (!day || !hour || !subject) {
        alert("You missed something. Please check the datas again");
        return;
    }
    if(!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day))
    {
        alert("Invalid day entered");
        return;
    }
    if(0 > hour < 7){
        alert("Invalid hour entered");
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${lessonId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, hour, subject })
        });

        if (!response.ok) throw new Error("Failed to update lesson.");

        alert("Lesson updated successfully!");
        refreshTimetable();
        fetchTimetable();
    }
         catch (error) {
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
        refreshTimetable();
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
    if (!day || !hour || !subject) {
        alert("You missed something. Please check the datas again");
        return;
    }
    if(!["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(day))
    {
        alert("Invalid day entered");
        return;
    }
    if(0 > hour < 7){
        alert("Invalid hour entered");
        return;
    }
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ day, hour, subject })
        });

        if (!response.ok) throw new Error("Failed to add lesson.");

        alert("Lesson added successfully!");
        e.target.reset();
        refreshTimetable();
        fetchTimetable(); 
    } catch (error) {
        console.error("Error adding lesson:", error);
        alert("Could not add lesson.");
    }
});
function refreshTimetable() {
    for (let day of ["monday", "tuesday", "wednesday", "thursday", "friday"]) {
        for (let hour = 1; hour <= 6; hour++) {
            const cell = document.getElementById(`${day}-${hour}`);
            if (cell) {
                cell.textContent = "";
                const newCell = cell.cloneNode(true);
                cell.parentNode.replaceChild(newCell, cell);
            }
        }
    }
}
fetchTimetable();
