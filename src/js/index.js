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
        if (evenStyleFlag) {
            changeEvenStyle();
        }
        if (oddStyleFlag) {
            changeOddStyle();
        }
        let item = createNewItem(text);
        item.classList.add("newItem");
        let maxId = (taskList.length > 0) ? Math.max.apply(null, taskList.map(task => task.id)) : -1;
        maxId++;
        item.dataset.id = maxId;
        toDoList.prepend(item);
        taskList.unshift({"id":maxId, "compleated":false});
        localStorage.setItem(maxId, text);
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

function createNewItem(textTask) {
    let item = document.createElement("li");
    item.textContent = textTask;
    let btn = document.createElement("div");
    btn.classList.add("selfDeletingButton");
    item.append(btn);
    return item;
}

function delItem(item, changeStyleFlag = false) {
    return new Promise(function (resolve, reject) {
        document.body.style.pointerEvents = "none";
        item.classList.add("removing");
        let idItem = item.dataset.id;
        for (let i=0; i<taskList.length; i++) {
            if (idItem == taskList[i].id) {
                localStorage.removeItem(idItem);
                taskList.splice(i, 1);
                break
            }
        }
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
                    let idLastLI = taskList.findIndex(item => item.id == lastLI.dataset.id);
                    taskList.splice(idLastLI+1, 0, {"id":clone.dataset.id, "compleated":false});
                } else {
                    toDoList.prepend(clone);
                    taskList.unshift({"id":clone.dataset.id, "compleated":false});
                }
                localStorage.setItem(clone.dataset.id, clone.textContent);
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
                document.body.style.pointerEvents = "none";
                taskList.push({"id":clone.dataset.id, "compleated":true});
                localStorage.setItem(clone.dataset.id, clone.textContent);
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

function createTaskList() {
    if (localStorage.length == 0) {
        let tasks = ["Купить подарок на День рождения","Купить новый стол","Вытащить друзей на прогулку","Научиться готовить торт","Найти новую работу","Прочесть «Дюну»"];
        for (let task of tasks) {
            let item = createNewItem(task);
            item.dataset.id = localStorage.length;
            toDoList.append(item);
            taskList[localStorage.length]={"id":localStorage.length,"compleated":false};          
            localStorage.setItem(localStorage.length, task);
        }
        localStorage.setItem("localTaskList", JSON.stringify(taskList));
        localStorage.setItem("evenStyleFlag", "true");
        localStorage.setItem("oddStyleFlag", "false");
        evenStyleFlag = true;
        evenStyleBox.checked = true;
        changeEvenStyle();
    } else {
        taskList = JSON.parse(localStorage.getItem("localTaskList"));
        for (let i=0; i<taskList.length; i++) {
            let item = createNewItem(localStorage.getItem(taskList[i].id));
            item.dataset.id = taskList[i].id;
            if (taskList[i].compleated == true) {
                item.classList.add("completed");
            }
            toDoList.append(item);
        }
        evenStyleFlag = (localStorage.getItem("evenStyleFlag") === "true") ? true : false;
        oddStyleFlag = (localStorage.getItem("oddStyleFlag") === "true") ? true : false;
        if (evenStyleFlag) {
            evenStyleBox.checked = true;
            changeEvenStyle();
        }
        if (oddStyleFlag) {
            oddStyleBox.checked = true;
            changeOddStyle();
        }
    }
}

let evenStyleFlag = false,
    oddStyleFlag = false,
    taskList = [],
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
window.addEventListener("visibilitychange", () => {
    localStorage.setItem("evenStyleFlag", evenStyleFlag);
    localStorage.setItem("oddStyleFlag", oddStyleFlag);
    localStorage.setItem("localTaskList", JSON.stringify(taskList));
});

changeAddButton();
createTaskList();