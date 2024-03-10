const input = document.querySelector<HTMLInputElement>("#noteInput");
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-note-form");

let Notes: Note[] = loadNotes(); // Initialize Notes with notes from localStorage

type Note = {
    body: string,
    createdAt: Date
};

form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!input?.value) return;

    const newNote: Note = {
        body: input.value,
        createdAt: new Date()
    };

    Notes.push(newNote);
    addNotes(newNote, Notes.length - 1); // Pass index as Notes.length - 1
    input.value = "";
    saveNotes(); // Save notes after adding a new note
});

function addNotes(note: Note, index: number) {
    const item = document.createElement("li");

    // Create container for note content
    const contentContainer = document.createElement("div");
    contentContainer.textContent = note.body;

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => toggleEdit(index, contentContainer));

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(index));

    // Append content container and buttons to item
    item.appendChild(contentContainer);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    // Append item to list
    list?.appendChild(item);
}

function toggleEdit(index: number, contentContainer: HTMLDivElement) {
    const note = Notes[index];

    // Create input field for editing
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = note.body;

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => saveEdit(index, inputField));

    // Replace content container with input field and save button
    contentContainer.replaceWith(inputField, saveButton);

    // Focus on the input field
    inputField.focus();
}

function saveEdit(index: number, inputField: HTMLInputElement) {
    const newBody = inputField.value.trim();
    if (newBody === "") return; // Do not save empty note

    Notes[index].body = newBody;
    saveNotes();
    renderNotes();
}



function saveNotes() {
    localStorage.setItem("NOTES", JSON.stringify(Notes));
}

function loadNotes(): Note[] {
    const noteJSON = localStorage.getItem("NOTES");
    if (!noteJSON) return [];
    return JSON.parse(noteJSON);
}

function editNote(index: number) {
    const newBody = prompt("Enter new note content:");
    if (newBody === null || newBody === "") return; // Cancelled or empty input

    Notes[index].body = newBody;
    saveNotes();
    renderNotes();
}

function deleteNote(index: number) {
    Notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function renderNotes() {
    if (!list) return; // Check if list is null

    list.innerHTML = ""; // Clear list
    Notes.forEach((note, index) => {
        addNotes(note, index);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    renderNotes();
});
