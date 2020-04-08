let txtInput = document.querySelector('.txtInput');
let ulList = document.querySelector('ul');
let submit = document.querySelector('.submit');
let save = document.querySelector('.save');
submit.addEventListener('click', addItem);
save.addEventListener('click', saveList);
window.addEventListener('load', readJSON);
let jsonData = [];

function readJSON(){
	let url = localStorage.getItem('toDoListJSON');
	if (url !== null){
		fetch(url)
		.then(handleErrors)
	    .then(response => response.json())
	    .then(updateListFromJson)
	    .catch(function(error) {
	        console.log(error);
	    });
	}
}
function updateListFromJson(jsonTasks){
	for (let i =0 ; i<jsonTasks.length; i++){
		let title = jsonTasks[i].title;
		let done = jsonTasks[i].done;
		createLi(title,done);
	}
	jsonData = jsonTasks;
}

function createLi(title,done){
	let li = document.createElement('li');
	li.innerText = title;

	let cb = document.createElement('input');
	cb.type = "checkbox";
	cb.value = 'false';
	cb.className = "chckBox";
	cb.addEventListener('click', itemDone);

	if (done === 'true'){
		cb.checked = true;
		cb.value = 'true'
		li.classList.add('done');
	}

	let delBtn = document.createElement('i');
    delBtn.className = "far fa-times-circle deleteBtn";
    delBtn.addEventListener('click', removeTask);
    li.appendChild(delBtn);

	li.appendChild(cb);
	ulList.appendChild(li);
}

function removeTask(e){
	let title = e.target.parentElement.innerText;
	for (let i = 0; i < jsonData.length; i++){
		if (jsonData[i].title == title){
			console.log(jsonData);
			const index = jsonData.indexOf(jsonData[i]);
			jsonData.splice(index, 1);
			console.log(jsonData);
		}
	}
	e.target.parentElement.remove();
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function addItem(){
	if (txtInput.value.trim().length < 3 || titleExist(txtInput.value.trim()) ){
		alert('Task description should be unique and at least 3 characters long!');
	}else{
		createLi( txtInput.value.trim() , 'false');
		let liObject = {title: txtInput.value.trim(), done: 'false'};
		jsonData.push(liObject);
		txtInput.value = "";
	}
}

function titleExist(title){
	for (let i =0; i<jsonData.length; i++){
		if (jsonData[i].title === title){
			return true;
		}
	}
}
function saveList(){
	fetch('https://jsonblob.com/api/jsonBlob', {
		method: 'POST',
			headers: {
      	'Content-Type': 'application/json'
    	},
    	body: JSON.stringify(jsonData)
	})
	.then(handleErrors)
	.then(response => response.headers.get('location'))
	.then(function(blobId){
		localStorage.setItem('toDoListJSON', blobId);
	})
	.catch(function(error) {
        console.log(error);
    });
}
function itemDone(e){
	if (e.target.value === 'false'){
		e.target.parentElement.classList.add('done');
		e.target.value ='true';
		changeDoneInJson(e.target.parentElement.innerText.trim(),'true');
	}else{
		e.target.parentElement.classList.remove('done');
		e.target.value ='false';
		changeDoneInJson(e.target.parentElement.innerText.trim(),'false');
	}
}

function changeDoneInJson(title, done){
	for (let i =0; i<jsonData.length; i++){
		if (jsonData[i].title == title){
			jsonData[i].done = done;
			return;
		}
	}
}