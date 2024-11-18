"use strict";
const inputHeading = document.querySelector("#noteHeading");
const inputSubheading = document.querySelector("#noteSubheading");
const inputBody = document.querySelector("#noteInput");
const list = document.querySelector("#list");
const form = document.querySelector("#new-note-form");
let Notes = loadNotes(); // Initialize Notes with notes from localStorage

form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputHeading?.value || !inputSubheading?.value || !inputBody?.value) return;

    const newNote = {
        heading: inputHeading.value,
        subheading: inputSubheading.value,
        body: inputBody.value,
        createdAt: new Date(),
    };

    Notes.push(newNote);
    addNotes(newNote, Notes.length - 1); // Pass index as Notes.length - 1
    inputHeading.value = "";
    inputSubheading.value = "";
    inputBody.value = "";
    saveNotes(); // Save notes after adding a new note
});

function addNotes(note, index) {
    const item = document.createElement("li");

    // Create heading container
    const headingContainer = document.createElement("h2");
    headingContainer.textContent = note.heading;

    // Create subheading container
    const subheadingContainer = document.createElement("h3");
    subheadingContainer.textContent = note.subheading;

    // Create body container
    const bodyContainer = document.createElement("p");
    bodyContainer.textContent = note.body;

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => toggleEdit(index, item));

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(index));

    // Append all elements to the list item
    item.appendChild(headingContainer);
    item.appendChild(subheadingContainer);
    item.appendChild(bodyContainer);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    // Append item to the list
    list?.appendChild(item);
}

function toggleEdit(index, item) {
    const note = Notes[index];
    item.innerHTML = ""; // Clear the current content

    // Create input fields for editing
    const inputHeading = document.createElement("input");
    inputHeading.type = "text";
    inputHeading.value = note.heading;

    const inputSubheading = document.createElement("input");
    inputSubheading.type = "text";
    inputSubheading.value = note.subheading;

    const inputBody = document.createElement("textarea");
    inputBody.value = note.body;

    // Create save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () => {
        saveEdit(index, inputHeading.value, inputSubheading.value, inputBody.value);
    });

    // Append input fields and save button to the list item
    item.appendChild(inputHeading);
    item.appendChild(inputSubheading);
    item.appendChild(inputBody);
    item.appendChild(saveButton);

    // Focus on the heading input field
    inputHeading.focus();
}

function saveEdit(index, newHeading, newSubheading, newBody) {
    if (!newHeading.trim() || !newSubheading.trim() || !newBody.trim()) return;

    Notes[index] = {
        ...Notes[index],
        heading: newHeading,
        subheading: newSubheading,
        body: newBody,
    };
    saveNotes();
    renderNotes();
}

function saveNotes() {
    localStorage.setItem("NOTES", JSON.stringify(Notes));
}

function loadNotes() {
    const noteJSON = localStorage.getItem("NOTES");
    if (!noteJSON) return [];
    return JSON.parse(noteJSON);
}

function deleteNote(index) {
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
