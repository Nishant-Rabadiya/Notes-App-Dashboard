"use strict";
const addedCategoryList = document.getElementById('addedCategoryList');
const addCardCategorySection = document.getElementById('addCardCategorySection');
const createdNotes = document.getElementById('createdNotes');
const listError = document.getElementById('listError');
const addListInput = document.getElementById('addListInput');
const addedNotes = document.getElementById('addedNotes');
let date = new Date();
let findIndexNoteData;
const convertDateTime = (dateTime) => {
    date = new Date(dateTime);
    const today = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${hours}:${minutes}`;
    }
    else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${hours}:${minutes}`;
    }
    else {
        const dd = String(date.getDate());
        const mm = String(date.getMonth() + 1);
        return `${dd}/${mm}`;
    }
};
const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
const hexToRgbA = (hex) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.3)';
    }
};
let categoryData;
const getCategoryData = () => {
    let data = localStorage.getItem('categoryData');
    return categoryData = data ? JSON.parse(data) : [];
};
let cardData;
const getCategoryCardData = () => {
    let data = localStorage.getItem('notesData');
    return cardData = data ? JSON.parse(data) : [];
};
const addList = (e) => {
    if (addListInput) {
        if (addListInput.value.trim()) {
            if (addedCategoryList) {
                addedCategoryList.innerHTML = `
                  <div class="added-list" id="categoryListDemo">
                      <p class="added-list-name" id="listName">${addListInput.value}<button class="added-list-remove-btn" onclick='addListRemove(this)'><i class="fa-solid fa-xmark"></i></button></p>
                  </div> `;
            }
        }
    }
};
const addListRemove = (e) => {
    var _a;
    (_a = e.parentElement.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
};
const confirmList = () => {
    const listName = document.getElementById('listName');
    const categoryListDemo = document.getElementById('categoryListDemo');
    if (addListInput)
        if (!addListInput.value.trim() && !(listName === null || listName === void 0 ? void 0 : listName.innerText)) {
            if (listError) {
                listError.innerHTML = 'Please Enter the category list';
            }
        }
        else {
            if (listName === null || listName === void 0 ? void 0 : listName.innerText) {
                const list = {
                    categoryName: listName === null || listName === void 0 ? void 0 : listName.innerText,
                    id: date.getTime()
                };
                let categoryData = getCategoryData();
                const findData = categoryData.find((item) => item.categoryName === listName.innerText);
                if (findData) {
                    if (listError)
                        listError.innerHTML = 'Category name already exist!';
                }
                else {
                    categoryData.push(list);
                    localStorage.setItem('categoryData', JSON.stringify(categoryData));
                    addListInput.value = "";
                    if (categoryListDemo)
                        categoryListDemo.innerHTML = "";
                    if (listError)
                        listError.innerHTML = '';
                }
                if (listError) {
                    listError.innerHTML = '';
                }
            }
        }
    addCategoryList();
    addCategoryOption();
};
const addNotes = () => {
    const createdNotes = document.getElementById('createdNotes');
    const date = new Date();
    if (createdNotes) {
        createdNotes.innerHTML = `
        <div class="notes-headers-section" id="${date.getTime()}">
            <div class="notes-category-section">
                <label for="categoryList" class="notes-category-label">#</label>
                <select name="categoryList" id="categoryList" class="notes-category-name" onchange="createNoteCard(this, ${date.getTime()})">
                    <option hidden></option>
                </select>
                <div class="notes-time-section">
                    <p class="note-time">hello welcome</p>
                    <p class="note-time add-time" id="notesCreateTime"></p>
                </div>
            </div>
        </div>
        <div class="notes-details-section">
            <input type="text" class="notes-heading-input-section" oninput="firstCreateNoteHeading(this)" placeholder="Add your notes heading here.">
            <div class="notes-details">
                <div id="editor" class="editors"></div>
            </div>
        </div>`;
        const quill = new Quill('#editor', {
            placeholder: 'Write your note hear!!',
            theme: 'snow'
        });
        quill.on('text-change', function () {
            firstCreateNote();
        });
        addCategoryOption();
    }
};
const addCategoryList = () => {
    let categoryData = getCategoryData();
    if (addCardCategorySection) {
        addCardCategorySection.innerHTML = "";
        categoryData.map((value) => {
            addCardCategorySection.innerHTML += `
            <div class="add-card-category">
                <p class="add-card-category-name"><span class="category-span">#</span> ${value.categoryName}</p>
                <p class="add-card-category-count"></p>
            </div> `;
        });
    }
};
addCategoryList();
const addCategoryOption = () => {
    const categoryList = document.getElementById('categoryList');
    let categoryData = getCategoryData();
    if (categoryList) {
        categoryData.map((value) => {
            categoryList.innerHTML += `<option>${value.categoryName}</option>`;
        });
    }
};
addCategoryOption();
const createNoteCard = (e) => {
    const date = new Date();
    const notesCreateTime = document.getElementById('notesCreateTime');
    const list = {
        categoryName: e.value,
        id: date.getTime(),
        color: getRandomColor(),
        date: date.getTime(),
        isActive: false,
        editedTime: date.getTime()
    };
    let categoryCardData = getCategoryCardData();
    categoryCardData.push(list);
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    e.setAttribute("disabled", "disabled");
    (notesCreateTime) ? notesCreateTime.innerText = convertDateTime(date.getTime()) : "";
    shawNote();
};
const firstCreateNoteHeading = (e) => {
    const categoryList = document.getElementById("categoryList");
    let categoryCardData = getCategoryCardData();
    if (categoryList === null || categoryList === void 0 ? void 0 : categoryList.value) {
        findIndexNoteData = categoryCardData.length - 1;
        categoryCardData[findIndexNoteData].heading = e.value;
        localStorage.setItem('notesData', JSON.stringify(categoryCardData));
        shawNote();
    }
};
const firstCreateNote = () => {
    const editor = document.querySelector('#editor .ql-editor');
    if (editor) {
        const categoryList = document.getElementById("categoryList");
        let categoryCardData = getCategoryCardData();
        if (categoryList === null || categoryList === void 0 ? void 0 : categoryList.value) {
            const findIndexNoteData = categoryCardData.length - 1;
            categoryCardData[findIndexNoteData].notes = editor.innerHTML;
            localStorage.setItem('notesData', JSON.stringify(categoryCardData));
            shawNote();
        }
    }
};
const getFirstParagraph = (htmlString) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const firstParagraph = tempDiv.querySelector('p');
    return firstParagraph ? firstParagraph.textContent || "" : "";
};
const shawNote = () => {
    let categoryCardData = getCategoryCardData();
    const addedNotes = document.getElementById('addedNotes');
    if (addedNotes)
        addedNotes.innerHTML = "";
    categoryCardData.map((item) => {
        if (addedNotes) {
            const firstParagraph = getFirstParagraph(item.notes ? item.notes : "");
            addedNotes.innerHTML += `
                <div class="add-notes-card ${item.isActive ? 'active-date-btn' : ""}" id="${item.id}" onclick="createdCard(this)" draggable="true">
                    <h5 class="add-notes-card-heading">${item.heading ? item.heading : ""}</h5>
                    <p class="add-notes-card-details">${firstParagraph}</p>
                    <div class="add-notes-card-bottom">
                        <p class="add-notes-card-category" style="background-color: ${hexToRgbA(item.color)};  color:${item.color}" ><span class="category-icon"><i class="fa-solid fa-arrow-trend-up"></i></span> ${item.categoryName}</p>
                        <p class="add-notes-card-time">${convertDateTime(item.date)}</p>
                    </div>
                </div>`;
        }
    });
};
shawNote();
const cardNote = (category, date, heading, notes) => {
    const createdNotes = document.getElementById('createdNotes');
    if (createdNotes) {
        createdNotes.innerHTML = `
        <div class="notes-headers-section">
            <div class="notes-category-section">
                <label for="categoryList" class="notes-category-label">#</label>
                <select name="categoryList" id="categoryList" class="notes-category-name" disabled>
                    <option hidden>${category}</option>
                </select>
                <div class="notes-time-section">
                    <p class="note-time">hello welcome</p>
                    <p class="note-time add-time" id="notesCreateTime">${convertDateTime(date)}</p>
                </div>
                </div>
            <button class="notes-delet-button" onclick="removeNote(this, '${date}')"><i class="fa-regular fa-trash-can"></i></button>
        </div>

        <div class="notes-details-section">
            <input type="text" oninput="cardNoteHeading(this)" class="notes-heading-input-section"
                placeholder="Add your notes heading here." value="${heading ? heading : ""}">
            <div class="notes-details">
                <div id="editorNote" class="editors"></div>
            </div>
        </div>`;
        const quill = new Quill('#editorNote', {
            placeholder: 'Write your note hear!!',
            theme: 'snow'
        });
        quill.root.innerHTML = notes ? notes : "";
        quill.on('text-change', function () {
            cardNoteDetails(quill);
        });
    }
};
let cardId;
const createdCard = (e) => {
    let categoryCardData = getCategoryCardData();
    categoryCardData.forEach((item) => item.isActive = false);
    let findIndexNoteData = categoryCardData.findIndex((x) => x.id === parseInt(e.id));
    categoryCardData[findIndexNoteData].isActive = true;
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    let findNoteData = categoryCardData.find((x) => x.id === parseInt(e.id));
    cardId = findNoteData.id;
    cardNote(findNoteData.categoryName, findNoteData.date, findNoteData.heading, findNoteData.notes);
    shawNote();
};
const removeNote = (e, id) => {
    const confirmed = confirm("Are you sure you want to delete this note?");
    if (confirmed) {
        if (createdNotes)
            createdNotes.innerHTML = "";
        let categoryCardData = getCategoryCardData();
        findIndexNoteData = categoryCardData.findIndex((x) => x.id === parseInt(id));
        categoryCardData.splice(findIndexNoteData, 1);
        localStorage.setItem('notesData', JSON.stringify(categoryCardData));
        shawNote();
    }
};
const cardNoteHeading = (e) => {
    const date = new Date();
    let categoryCardData = getCategoryCardData();
    // categoryCardData.sort((a, b) => b.editedTime - a.editedTime );
    findIndexNoteData = categoryCardData.findIndex((x) => x.id === cardId);
    categoryCardData[findIndexNoteData].heading = e.value;
    categoryCardData[findIndexNoteData].editedTime = date.getTime();
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    shawNote();
};
const cardNoteDetails = (quill) => {
    const date = new Date();
    let categoryCardData = getCategoryCardData();
    // categoryCardData.sort((a, b) => b.editedTime - a.editedTime );
    findIndexNoteData = categoryCardData.findIndex((x) => x.id === cardId);
    categoryCardData[findIndexNoteData].notes = quill.root.innerHTML;
    categoryCardData[findIndexNoteData].editedTime = date.getTime();
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    shawNote();
};
function handleDragStart(event) {
    var _a;
    if (event.target instanceof HTMLElement) {
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }
}
function handleDragOver(event) {
    event.preventDefault();
}
function handleDrop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const targetElement = event.target.closest('.add-notes-card');
    const addedNotes = document.getElementById('addedNotes');
    if (targetElement && draggingElement && addedNotes && targetElement !== draggingElement) {
        const bounding = targetElement.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (event.clientY - offset > 0) {
            addedNotes.insertBefore(draggingElement, targetElement.nextSibling);
        }
        else {
            addedNotes.insertBefore(draggingElement, targetElement);
        }
    }
    if (draggingElement) {
        draggingElement.classList.remove('dragging');
    }
}
if (addedNotes) {
    addedNotes.addEventListener('dragstart', handleDragStart);
    addedNotes.addEventListener('dragover', handleDragOver);
    addedNotes.addEventListener('drop', handleDrop);
}
const searchCard = () => {
    const input = document.getElementById('searchInput');
    const searchValue = (input === null || input === void 0 ? void 0 : input.value.toLowerCase()) || '';
    const cardHeadings = document.getElementsByClassName('add-notes-card-heading');
    for (let i = 0; i < cardHeadings.length; i++) {
        const cardHeading = cardHeadings[i];
        const card = cardHeading.closest('.add-notes-card');
        if (card) {
            if (!cardHeading.innerHTML.toLowerCase().includes(searchValue)) {
                card.style.display = "none";
            }
            else {
                card.style.display = "block";
            }
        }
    }
};
