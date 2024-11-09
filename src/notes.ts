const addedCategoryList = document.getElementById('addedCategoryList') as HTMLElement | null
const addCardCategorySection = document.getElementById('addCardCategorySection') as HTMLElement | null
const createdNotes = document.getElementById('createdNotes') as HTMLElement | null
const listError = document.getElementById('listError') as HTMLElement | null
const addListInput = document.getElementById('addListInput') as HTMLInputElement | null
const addedNotes = document.getElementById('addedNotes') as HTMLInputElement | null

interface CategoryListData {
    categoryName: string,
    id: number,
}

interface CreateCategoryCard {
    categoryName: string,
    id: number,
    color: string,
    date: number,
    heading?: string,
    notes?: string,
    isActive?: boolean,
    editedTime: number
}

let date: Date = new Date();
let findIndexNoteData: any;

const convertDateTime = (dateTime: any): string => {
    date = new Date(dateTime);
    const today = new Date();
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
 
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return `Today, ${hours}:${minutes}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${hours}:${minutes}`;
    } else {
        const dd: string = String(date.getDate());
        const mm: string = String(date.getMonth() + 1);
        return `${dd}/${mm}`;
    }
}

const getRandomColor = (): string =>  {
    const letters: string = "0123456789ABCDEF";
    let color: string = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const hexToRgbA = (hex: string) => {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.3)';
    }
}

let categoryData: CategoryListData[];
const getCategoryData = (): CategoryListData[] => {
    let data = localStorage.getItem('categoryData');
    return categoryData = data ? JSON.parse(data) : [];
};

let cardData: CreateCategoryCard[];
const getCategoryCardData = (): CreateCategoryCard[] => {
    let data = localStorage.getItem('notesData');
    return cardData = data ? JSON.parse(data) : [];
}

const addList = (e: HTMLElement): void => {
    if (addListInput) {
        if (addListInput.value.trim()) {
            if (addedCategoryList) {
                addedCategoryList.innerHTML = `
                  <div class="added-list" id="categoryListDemo">
                      <p class="added-list-name" id="listName">${addListInput.value}<button class="added-list-remove-btn" onclick='addListRemove(this)'><i class="fa-solid fa-xmark"></i></button></p>
                  </div> `
            }
        }
    }
}

const addListRemove = (e: HTMLElement): void => {
    (e.parentElement as HTMLElement).parentElement?.remove();
}

const confirmList = (): void => {
    const listName = document.getElementById('listName') as HTMLElement | null;
    const categoryListDemo = document.getElementById('categoryListDemo') as HTMLElement | null;
    if (addListInput)
        if (!addListInput.value.trim() && !listName?.innerText) {
            if (listError) {
                listError.innerHTML = 'Please Enter the category list';
            }
        } else {
            if (listName?.innerText) {
                const list: CategoryListData = {
                    categoryName: listName?.innerText,
                    id: date.getTime()
                }
                let categoryData: CategoryListData[] = getCategoryData();
                const findData = categoryData.find((item: CategoryListData) => item.categoryName === listName.innerText);
                if (findData) {
                    if (listError)
                        listError.innerHTML = 'Category name already exist!';
                } else {
                    categoryData.push(list)
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
}

const addNotes = (): void => {
    const createdNotes = document.getElementById('createdNotes') as HTMLElement | null;
    const date: Date = new Date();
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
}

const addCategoryList = (): void => {
    let categoryData: CategoryListData[] = getCategoryData();
    if (addCardCategorySection) {
        addCardCategorySection.innerHTML = "";
        categoryData.map((value: CategoryListData) => {
            addCardCategorySection.innerHTML += `
            <div class="add-card-category">
                <p class="add-card-category-name"><span class="category-span">#</span> ${value.categoryName}</p>
                <p class="add-card-category-count"></p>
            </div> `
        })
    }
}
addCategoryList();

const addCategoryOption = (): void => {
    const categoryList = document.getElementById('categoryList') as HTMLElement | null;
    let categoryData: CategoryListData[] = getCategoryData();
    if (categoryList) {
        categoryData.map((value: CategoryListData) => {
            categoryList.innerHTML += `<option>${value.categoryName}</option>`
        })
    }
}
addCategoryOption();

const createNoteCard = (e: HTMLElement): void => {
    const date: Date = new Date();
    const notesCreateTime = document.getElementById('notesCreateTime') as HTMLElement | null;
    const list: CreateCategoryCard = {
        categoryName: (e as HTMLInputElement).value,
        id: date.getTime(),
        color: getRandomColor(),
        date: date.getTime(),
        isActive: false,
        editedTime: date.getTime()
    }
    let categoryCardData = getCategoryCardData();
    categoryCardData.push(list)
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));

    (e as HTMLElement).setAttribute("disabled", "disabled");
    (notesCreateTime) ? notesCreateTime.innerText = convertDateTime(date.getTime()) : "";
    shawNote();
}

const firstCreateNoteHeading = (e: HTMLInputElement): void => {
    const categoryList = document.getElementById("categoryList") as HTMLSelectElement | null;
    let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
    if (categoryList?.value) {
        findIndexNoteData = categoryCardData.length - 1;
        categoryCardData[findIndexNoteData].heading = e.value;
        localStorage.setItem('notesData', JSON.stringify(categoryCardData));
        shawNote();
    }
}

const firstCreateNote = (): void => {
    const editor = document.querySelector('#editor .ql-editor') as HTMLElement | null;
    if (editor) {
        const categoryList = document.getElementById("categoryList") as HTMLSelectElement | null;
        let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
        if (categoryList?.value) {
            const findIndexNoteData = categoryCardData.length - 1;
            categoryCardData[findIndexNoteData].notes = editor.innerHTML;
            localStorage.setItem('notesData', JSON.stringify(categoryCardData));
            shawNote();
        }
    }
}

const getFirstParagraph = (htmlString: string): string => {
    const tempDiv = document.createElement('div') as HTMLElement;
    tempDiv.innerHTML = htmlString;
    const firstParagraph = tempDiv.querySelector('p') as HTMLElement;
    return firstParagraph ? firstParagraph.textContent || "" : "";
}

const shawNote = (): void => {
    let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
    const addedNotes = document.getElementById('addedNotes') as HTMLElement | null;
    if (addedNotes)
        addedNotes.innerHTML = "";
    categoryCardData.map((item: CreateCategoryCard) => {
        if (addedNotes) {
            const firstParagraph: string = getFirstParagraph(item.notes ? item.notes : "");
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
}
shawNote();

const cardNote = (category: string, date: string, heading: string, notes: string) => {
    const createdNotes = document.getElementById('createdNotes') as HTMLElement | null;
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
}

let cardId: number | string;
const createdCard = (e: HTMLElement): void => {
    let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
    categoryCardData.forEach((item: CreateCategoryCard) => item.isActive = false);

    let findIndexNoteData: CreateCategoryCard | any = categoryCardData.findIndex((x: CreateCategoryCard) => x.id === parseInt(e.id));
    categoryCardData[findIndexNoteData].isActive = true;
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    
    let findNoteData: CreateCategoryCard | any = categoryCardData.find((x: CreateCategoryCard) => x.id === parseInt(e.id));
    cardId = findNoteData.id
    cardNote(findNoteData.categoryName, findNoteData.date, findNoteData.heading, findNoteData.notes);
    shawNote();
};

const removeNote = (e: HTMLElement, id: string): void => {
    const confirmed: boolean = confirm("Are you sure you want to delete this note?");
    if (confirmed) {
        if (createdNotes)
            createdNotes.innerHTML = "";
        let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
        findIndexNoteData = categoryCardData.findIndex((x: CreateCategoryCard) => x.id === parseInt(id));
        categoryCardData.splice(findIndexNoteData, 1)
        localStorage.setItem('notesData', JSON.stringify(categoryCardData));
        shawNote();
    }
}

const cardNoteHeading = (e: HTMLInputElement): void => {
    const date:Date = new Date();
    let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
    // categoryCardData.sort((a, b) => b.editedTime - a.editedTime );
    findIndexNoteData = categoryCardData.findIndex((x: CreateCategoryCard) => x.id === cardId);
    categoryCardData[findIndexNoteData].heading = e.value;
    categoryCardData[findIndexNoteData].editedTime = date.getTime();
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    shawNote();
}

const cardNoteDetails = (quill: any): void => {
    const date:Date = new Date();
    let categoryCardData: CreateCategoryCard[] = getCategoryCardData();
    // categoryCardData.sort((a, b) => b.editedTime - a.editedTime );
    findIndexNoteData = categoryCardData.findIndex((x: CreateCategoryCard) => x.id === cardId);
    categoryCardData[findIndexNoteData].notes = quill.root.innerHTML;
    categoryCardData[findIndexNoteData].editedTime = date.getTime();
    localStorage.setItem('notesData', JSON.stringify(categoryCardData));
    shawNote();
}

function handleDragStart(event: DragEvent): void {
    if (event.target instanceof HTMLElement) {
        event.dataTransfer?.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    }
}

function handleDragOver(event: DragEvent): void {
    event.preventDefault();
}

function handleDrop(event: DragEvent): void {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging') as HTMLElement | null;
    const targetElement = (event.target as HTMLElement).closest('.add-notes-card') as HTMLElement | null;
    const addedNotes = document.getElementById('addedNotes') as HTMLElement | null;

    if (targetElement && draggingElement && addedNotes && targetElement !== draggingElement) {
        const bounding = targetElement.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;

        if (event.clientY - offset > 0) {
            addedNotes.insertBefore(draggingElement, targetElement.nextSibling);
        } else {
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

const searchCard = (): void => {
    const input = document.getElementById('searchInput') as HTMLInputElement | null;
    const searchValue: string = input?.value.toLowerCase() || '';
    const cardHeadings = document.getElementsByClassName('add-notes-card-heading');
    for (let i = 0; i < cardHeadings.length; i++) {
        const cardHeading = cardHeadings[i] as HTMLElement;
        const card = cardHeading.closest('.add-notes-card') as HTMLElement;
        if (card) {
            if (!cardHeading.innerHTML.toLowerCase().includes(searchValue)) {
                card.style.display = "none";
            } else {
                card.style.display = "block";
            }
        }
    }
}