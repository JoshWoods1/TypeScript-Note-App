const inputHeading = document.querySelector<HTMLInputElement>("#noteHeading");
const inputSubheading = document.querySelector<HTMLInputElement>("#noteSubheading");
const inputBody = document.querySelector<HTMLInputElement>("#noteBody");
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.querySelector<HTMLFormElement>("#new-note-form");

type Note = {
    heading: string;
    subheading: string;
    body: string;
    createdAt: Date;
};

let Notes: Note[] = loadNotes();

form?.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!inputHeading?.value || !inputSubheading?.value || !inputBody?.value) return;

    const newNote: Note = {
        heading: inputHeading.value.trim(),
        subheading: inputSubheading.value.trim(),
        body: inputBody.value.trim(),
        createdAt: new Date(),
    };

    Notes.push(newNote);
    addNotes(newNote, Notes.length - 1); // Pass index as Notes.length - 1
    inputHeading.value = "";
    inputSubheading.value = "";
    inputBody.value = "";
    saveNotes();
});

function addNotes(note: Note, index: number) {
    const item = document.createElement("li");

    // Create heading
    const headingElement = document.createElement("h2");
    headingElement.textContent = note.heading;

    // Create subheading
    const subheadingElement = document.createElement("h3");
    subheadingElement.textContent = note.subheading;

    // Create body
    const bodyElement = document.createElement("p");
    bodyElement.textContent = note.body;

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => toggleEdit(index, item));

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteNote(index));

    // Append elements to list item
    item.appendChild(headingElement);
    item.appendChild(subheadingElement);
    item.appendChild(bodyElement);
    item.appendChild(editButton);
    item.appendChild(deleteButton);

    // Append list item to the list
    list?.appendChild(item);
}

function toggleEdit(index: number, listItem: HTMLLIElement) {
    const note = Notes[index];

    // Replace content with input fields
    const inputHeading = document.createElement("input");
    inputHeading.type = "text";
    inputHeading.value = note.heading;

    const inputSubheading = document.createElement("input");
    inputSubheading.type = "text";
    inputSubheading.value = note.subheading;

    const inputBody = document.createElement("input");
    inputBody.type = "text";
    inputBody.value = note.body;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", () =>
        saveEdit(index, inputHeading, inputSubheading, inputBody)
    );

    // Clear list item and append input fields and save button
    listItem.innerHTML = "";
    listItem.appendChild(inputHeading);
    listItem.appendChild(inputSubheading);
    listItem.appendChild(inputBody);
    listItem.appendChild(saveButton);
}

function saveEdit(
    index: number,
    inputHeading: HTMLInputElement,
    inputSubheading: HTMLInputElement,
    inputBody: HTMLInputElement
) {
    const newHeading = inputHeading.value.trim();
    const newSubheading = inputSubheading.value.trim();
    const newBody = inputBody.value.trim();

    if (!newHeading || !newSubheading || !newBody) return; // Do not save if any field is empty

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

function loadNotes(): Note[] {
    const notesJSON = localStorage.getItem("NOTES");
    if (!notesJSON) return [];
    return JSON.parse(notesJSON).map((note: Note) => ({
        ...note,
        createdAt: new Date(note.createdAt),
    }));
}

function deleteNote(index: number) {
    Notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

function renderNotes() {
    if (!list) return;

    list.innerHTML = ""; // Clear list
    Notes.forEach((note, index) => {
        addNotes(note, index);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    renderNotes();
});
