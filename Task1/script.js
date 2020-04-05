(function currMonth() {
  let month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  let d = new Date();
  document.querySelector('.month').innerText = month[d.getMonth()];
})();

window.addEventListener('load', readFromLocalStorage);

let submitBtn = document.querySelector('.submit');
let itemValue = document.querySelector('.itemValue');
let itemDesc = document.querySelector('.itemDesc');
let incomeList = document.querySelector('.incomeList');
let expenseList = document.querySelector('.expenseList');
let type = document.querySelector('select');
let totalBudget = document.querySelector('.budgetAmount');
let totalIncome = document.querySelector('.totalIncome');
let totalExpense = document.querySelector('.totalExpense');
let expensePercentage = document.querySelector('.expensePercentage');
submitBtn.addEventListener('click', addItem);

function readFromLocalStorage(){
	let incomes = 0;
	let expenses = 0;
	for (let i = 0; i< localStorage.length; i++){
		if ( localStorage.key(i)[0] ==0 ){
			let itemData = JSON.parse(localStorage.getItem(localStorage.key(i)));
			appendNewIncomeItem(itemData[0],itemData[1]);
			incomes += eval(itemData[1]);	
		}
		else if (localStorage.key(i)[0] == 1){ 
			let itemData2 = JSON.parse(localStorage.getItem(localStorage.key(i)));
			appendNewExpenseItem(itemData2[0],itemData2[1]);
			expenses += eval(itemData2[1]);	
		}
	}
	if (incomes!== 0){
		totalIncome.innerText = '+ ' + incomes.toFixed(2);
	}
	if (expenses!== 0){
		totalExpense.innerText = '- ' + expenses.toFixed(2);
	}
	insertBudget((incomes - expenses).toFixed(2));
	updatePercengates();
}

function addItem(){
	if (localStorage.getItem(0 + itemDesc.value) !== null || localStorage.getItem(1 + itemDesc.value) !== null){
		alert('Description must be unique!');
	}else{
		if (itemValue.value !== "" && itemValue.value>0 && itemDesc.value.trim() !== ""){
			if (type.value == 'income'){
				createItem(itemValue.value, itemDesc.value, 'income');
			}else{
				createItem(itemValue.value, itemDesc.value, 'expense');
			}
		}else{
			alert("Please check your input data!");
		}
	}
}
function appendNewIncomeItem(desc, value){
	let li = document.createElement('li');
	let incomeSpan = document.createElement('span');
	incomeSpan.classList.add('liIncomeAmount');
	incomeSpan.innerText = '+ ' + value;
	li.innerText = desc;
	li.appendChild(incomeSpan);
	incomeList.appendChild(li);
}
function appendNewExpenseItem(desc,value){
	let li = document.createElement('li');
	let expenseSpan = document.createElement('span');
	expenseSpan.classList.add('liExpenseAmount')
	expenseSpan.innerText = '- ' + value;
	
	li.innerText = desc;

	let deleteBtn = document.createElement('i');
	deleteBtn.className = 'far fa-times-circle itemDeleteBtn';
	li.appendChild(deleteBtn); 
	deleteBtn.addEventListener('click', deleteExpenseItem);

	let percentageSpan = document.createElement('span');
	percentageSpan.innerText = '%';
	percentageSpan.classList.add('liPercentage')

	li.appendChild(percentageSpan);
	li.appendChild(expenseSpan);
	expenseList.appendChild(li);
}
function createItem(value, desc, type){
	if (type === "income"){
		appendNewIncomeItem(desc, Number(value).toFixed(2));
		//now add income item to localStorage:
		addToLocalStorage(desc, Number(value).toFixed(2), type);
	}else{
		appendNewExpenseItem(desc, Number(value).toFixed(2));
		addToLocalStorage(desc,Number(value).toFixed(2),type) ; //add to localStorage
	}
	updateIncomeExpense(value,type);
	updateBudget(value, type);
}
function updateBudget(value,type){
	if (type=="expense"){
		value = -1 * value;
	}
	let curValue = eval(totalBudget.innerText);
	let newValue = (curValue + Number(value)).toFixed(2);

	insertBudget(newValue);
	updatePercengates();
}
function insertBudget(newValue){
	if (newValue > 0 ){
		totalBudget.innerText = "+ " + newValue;
	}else if (newValue < 0){
		totalBudget.innerText = "- " + newValue*(-1).toFixed(2);
	}else{
		totalBudget.innerText = "0.00";
	}
}
function updateIncomeExpense(value,type){
	let element = totalIncome;
	if (type=="expense"){
		element = totalExpense;
	}
	let curValue = Math.abs(eval(element.innerText));
	let newValue = (curValue + Number(value)).toFixed(2);

	if ( type === "income"){
		element.innerText = "+ " + newValue;
	}else{
		if (newValue == 0){
			element.innerText = "0.00";
		}else{
			element.innerText = "- " + newValue;
		}
		
	}
}

function deleteExpenseItem(e){
	let liItem = e.target.parentElement;
	let value = eval (liItem.lastElementChild.innerText); //uvijek negativan broj
	liItem.remove();
	localStorage.removeItem('1'+ liItem.firstChild.textContent); //remove from localStorage
	updateIncomeExpense(value, 'expense');
	updateBudget(value*-1, 'income');
}

function updatePercengates(){
	let totalExpenses = Math.abs(eval(totalExpense.innerText));
	let allMoney = eval(totalIncome.innerText) + totalExpenses;
	if (totalExpenses === 0){
		expensePercentage.style.display = 'none';
	}else{
		let expPercentage = (Math.abs(eval(totalExpense.innerText)) / allMoney * 100).toFixed(2);
		expensePercentage.innerText = expPercentage + "%";
		expensePercentage.style.display = 'inline-block';
	}
	//now update all percenteages in expenses list
	let expenseItemList = [...expenseList.children];
	expenseItemList.forEach(function(item){
		let singleExpPerc = (Math.abs(eval(item.lastElementChild.innerText))/totalExpenses*100).toFixed(2);
		item.children[1].innerText = singleExpPerc+"%";
	}) 
}

function addToLocalStorage(desc,value,type){
	let flag = 0;
	if (type === 'expense'){
		flag = 1;
	}
	let item = [desc, value]
	let itemJSON = JSON.stringify(item);
	let itemKey = flag + desc;
	localStorage.setItem(itemKey, itemJSON);
	//key = 0/1 (income/expense flag) + desc. 
}