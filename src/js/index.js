function changeEvenStyle(changeFlag = false) {
    let listItems = toDoList.querySelectorAll("li:nth-of-type(2n)");
    if (changeFlag) {
        evenStyleFlag = !evenStyleFlag;
    }
    for (let item of listItems) {
        item.classList.toggle("even");
    }
}

function changeOddStyle(changeFlag = false) {
    let listItems = toDoList.querySelectorAll("li:nth-of-type(2n+1)");
    if (changeFlag) {
        oddStyleFlag = !oddStyleFlag;
    }
    for (let item of listItems) {
        item.classList.toggle("odd");
    }
}

function addNewItemEnter(event) {
    if (event.key == "Enter") {
        addNewItem();
    }
}

function addNewItem() {
    document.body.style.pointerEvents = "none";
    let text = inputForm.value;
    inputForm.value = "";
    if (text !== "") {
        let item = document.createElement("li");
        if (evenStyleFlag) {
            changeEvenStyle();
        }
        if (oddStyleFlag) {
            changeOddStyle();
        }
        item.classList.add("newItem");
        item.textContent = text;
        let btn = document.createElement("div");
        btn.classList.add("selfDeletingButton");
        item.append(btn);
        toDoList.prepend(item);
        if (evenStyleFlag) {
            changeEvenStyle();
        }
        if (oddStyleFlag) {
            changeOddStyle();
        }
        item.offsetHeight;
        item.classList.remove("newItem");
    }
    document.body.style.pointerEvents = "auto";
}

function delItem(item, changeStyleFlag = false) {
    return new Promise(function (resolve, reject) {
        document.body.style.pointerEvents = "none";
        item.classList.add("removing");
        if ((evenStyleFlag || oddStyleFlag) == false) {
            setTimeout(() => {
                item.remove();
                document.body.style.pointerEvents = "auto";
                resolve();
            }, 1000);
        }
        if (evenStyleFlag) {
            changeEvenStyle();
            setTimeout(() => {
                item.remove();
                if (!changeStyleFlag) changeEvenStyle();
                document.body.style.pointerEvents = "auto";
                resolve();
            }, 1000);
        }
        if (oddStyleFlag) {
            changeOddStyle()
            setTimeout(() => {
                item.remove();
                if (!changeStyleFlag) changeOddStyle();
                document.body.style.pointerEvents = "auto";
                resolve();
            }, 1000);
        }
    });
}

function changeCompletedStyle(event) {
    if (event.target.tagName != "LI") return;
    let clone = event.target.cloneNode(true);
    if (event.target.classList.contains("completed")) {
        clone.classList.remove("completed");
        clone.classList.add("newItem");
        let listItems = toDoList.querySelectorAll("li:not(.completed)");
        delItem(event.target, true).then(
            () => {
                document.body.style.pointerEvents = "none";
                if (listItems.length != 0) {
                    let lastLI = listItems[listItems.length - 1];
                    lastLI.after(clone);
                } else {
                    toDoList.prepend(clone);
                }
                if (evenStyleFlag) {
                    clone.classList.remove("even");
                    changeEvenStyle();
                }
                if (oddStyleFlag) {
                    clone.classList.remove("odd");
                    changeOddStyle();
                }
                clone.offsetHeight;
                clone.classList.remove("newItem");
                document.body.style.pointerEvents = "auto";
            });
    } else {
        clone.classList.add("completed", "newItem");
        delItem(event.target, true).then(
            () => {
                toDoList.append(clone);
                if (evenStyleFlag) {
                    clone.classList.remove("even");
                    changeEvenStyle();
                }
                if (oddStyleFlag) {
                    clone.classList.remove("odd");
                    changeOddStyle();
                }
                clone.offsetHeight;
                clone.classList.remove("newItem");
                document.body.style.pointerEvents = "auto";
            });
    }
}

function delCurrentItem(event) {
    if (event.target.tagName == "DIV") {
        let parent = event.target.closest("li");
        delItem(parent);
    }
}

function delLastItem() {
    let listItems = toDoList.querySelectorAll("li");
    if (listItems.length != 0) {
        let item = listItems[listItems.length - 1];
        delItem(item);
    }
}

function delFirstItem() {
    let item = toDoList.querySelector("li");
    if (item !== null) {
        delItem(item);
    }
}

function changeAddButton() {
    let mediaQuery = window.matchMedia("(max-width: 610px)");
    let btn = document.getElementById("addBtn");
    if (mediaQuery.matches) {
        btn.textContent = "\u{271A}";
    } else {
        btn.textContent = "Добавить";
    }
}

let evenStyleFlag = false,
    oddStyleFlag = false,
    toDoList = document.getElementById("toDoList"),
    delLastBtn = document.getElementById("delLastBtn"),
    delFirstBtn = document.getElementById("delFirstBtn"),
    addBtn = document.getElementById("addBtn"),
    evenStyleBox = document.getElementById("checkboxEven"),
    oddStyleBox = document.getElementById("checkboxOdd"),
    inputForm = document.getElementById("inputForm");

delLastBtn.addEventListener("click", delLastItem);
delFirstBtn.addEventListener("click", delFirstItem);
addBtn.addEventListener("click", addNewItem);
inputForm.addEventListener("keydown",addNewItemEnter);
evenStyleBox.addEventListener("click", changeEvenStyle);
oddStyleBox.addEventListener("click", changeOddStyle);
toDoList.addEventListener("click", delCurrentItem);
toDoList.addEventListener("click", changeCompletedStyle);
window.addEventListener("resize", changeAddButton);

changeEvenStyle(true);
changeAddButton();