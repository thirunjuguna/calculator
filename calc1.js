

let equationArray = [];
let currentDisplay = "";
let decCount = 0;
let buttons = document.querySelectorAll('.button');
for (let x = 0; x<buttons.length; x++) {
	buttons[x].addEventListener('click', function(e) {
		let y = this.textContent
		addToArray(y);
	});
}

window.addEventListener('keydown', function(e) {
	if (e.key == 1 || e.key ==2 || e.key ==3 || e.key ==4 || e.key == 5 || e.key ==6 || e.key ==7 || e.key ==8 || e.key ==9 || e.key ==0 || e.key == '+' ||
		e.key == '-' || e.key == '*' || e.key == '/' || e.key == '.' || e.key == '=') {
		addToArray(e.key);
	}
	if (e.key == 'Enter') { //This deals with recording the keys on keyboard for calculator
		addToArray('=');
	}
	if (e.key == 'Backspace') {
		addToArray('DEL');
	}

});





function addToArray(butVal) {
	let buttonValue = butVal.toString();
	let decContinue = 'Yes';
	if (buttonValue == '.') {
		decContinue = decimalCheck(buttonValue); //All keys and selections are added to an array then checked for value to decide what to do
	}
	if (decContinue == 'no') {
		let pleaseWork = 0;
	}
	else {
	equationArray.push(buttonValue);
	}
	let equalsButton = false;
	
	if (currentDisplay !== "") { //Lets the user continue operating on the answer if theres an operator, if not it resets the equation to just the new number entered
		if (buttonValue == '+' || buttonValue == '-' || buttonValue == '/' || buttonValue == '*') {
			let nothing = buttonValue;
			currentDisplay = '';


		}
		else {
			equationArray = [];
			equationArray.push(buttonValue);
			currentDisplay = "";
		}
	} 
	for (let i = 0; i<equationArray.length; i++) {
		
		if (equationArray[i] == 'DEL') {
			equationArray.splice(i-1, 2);
		}

		if (equationArray[i] == '+' || equationArray[i] == '-' || equationArray[i] == '*' || equationArray[i] == '/') {
			let placeholder =  ' ' + equationArray[i] + ' ';
			equationArray.splice(i, 1, placeholder);
			

		}

		if (equationArray[i] == '=') {
			equationArray[i] = ' ='; //equals sign is now live 
			equalsButton = true;
		}

		
	
	}

	if (butVal == 'AC') {
		equationArray = [];
		currentDisplay = "";
	
	}

	let negArray = equationArray.slice(0, equationArray.length);
	for (let j = 0; j<negArray.length; j++) {
		if(negArray[j] == '(-)') { //Allows me to keep negative and minus signs seperate
			negArray[j] = '-';
		}
	}
	
	let equationString = negArray.join('');
	const displayCont = document.querySelector('#display');
	const bigDisplay = document.querySelector('#currentDisplay');
	bigDisplay.textContent = currentDisplay;
	let equate = document.querySelector('#equation');
	equate.textContent = equationString;
	displayCont.insertBefore(equate, bigDisplay);
	displayCont.appendChild(bigDisplay);

	if (equalsButton) {
		operate(equationString); //once equals button is live then its time to solve
	}


}

function operate(stringVal) {
	let checkArray = stringVal.split(" ");
	let equalSignRemover = checkArray.length - 1;
	checkArray.splice(equalSignRemover, 1); //splits the string and turns it into an array to operate
	let returnDisplay = "";
	let operateArray = [];

	for (let k = 0; k<checkArray.length; k++) {
		let z = k % 2;
		if (z == 0) {
			let numbaCheck = parseFloat(checkArray[k]); //checks that even numbers in the array are numbers
			//if (numbaCheck == NaN) {
			if (isNaN(numbaCheck) == true) {
				returnDisplay = "Error";
				
				break;
			}
			else {
				operateArray[k] = numbaCheck;
			}
		}
		else if ( z == 1) {
			let OC = checkArray[k];
			if (OC == '+' || OC == '-' || OC == '*' || OC == '/') { //checks that odd numbers are operators
				operateArray[k] = OC;
			}
			else {
				returnDisplay = "Error";
				break;
			}
		}
	}

	if (returnDisplay !== "Error") {
		let lengthCounter = operateArray.length;
		for (let a = 0; a<lengthCounter; a++) {
			if (operateArray[a] == '*') {
				let multiplyVal = multiply(operateArray[a-1], operateArray[a+1]); //PEMDAS so multiplication and division go first from left to right
				operateArray.splice(a-1, 3, multiplyVal);
				a = 0;
				lengthCounter -=2;
			}
			if (operateArray[a] == '/') {
				let divideVal = divide(operateArray[a-1], operateArray[a+1]);
				if (divideVal == 'Error') {          //catching divide by zero
					returnDisplay = 'Error';
					break
				}
				else {
				operateArray.splice(a-1, 3, divideVal);
				a = 0;
				lengthCounter -=2;
				}
			}
			
		}

	if (returnDisplay !== 'Error') {
		for (let b = 0; b<lengthCounter; b++) {
			if (operateArray[b] == '+') {
				let addVal = add(operateArray[b-1], operateArray[b+1]);
				operateArray.splice(b-1, 3, addVal);
				b = 0;
				lengthCounter -=2;
			}
			if (operateArray[b] == '-') {
				let subVal = subtract(operateArray[b-1], operateArray[b+1]);
				operateArray.splice(b-1, 3, subVal);
				b = 0;
				lengthCounter -=2;
			}
		}

		
		returnDisplay = operateArray[0].toString();
	}


	}
	equationArray = [];
	equationArray.push(returnDisplay);

	let displayContainer = document.querySelector('#display');
	let answerDisplay = document.querySelector('#currentDisplay');

	answerDisplay.textContent = returnDisplay;
	displayContainer.appendChild(answerDisplay);

	currentDisplay = "Answered";


}

function multiply(num1, num2) {
	let one = Math.round(num1 * 100000);
	let two = Math.round(num2 * 100000);
	let bigAns = one * two;
	let ans = bigAns/ 10000000000;
	return ans;
}

function divide(num1, num2) {
	if (num2 == 0) {
		return 'Error';                  //Catching divide by zero 
	}
	else {
		let one = Math.round(num1 * 100000);
		let two = Math.round(num2 * 100000);
		let bigAns = one / two;
		let medAns = Math.round(bigAns * 100000)
		let ans = medAns / 100000;
	return ans;
	}
}

function add(num1, num2) {
	let one = Math.round(num1 * 100000);
	let two = Math.round(num2 * 100000);
	let bigAns = one + two;
	let ans = bigAns / 100000;
	return ans;
}

function subtract(num1, num2) {
	let one = Math.round(num1 * 100000);
	let two = Math.round(num2 * 100000);
	let bigAns = one - two;
	let ans = bigAns / 100000;
	return ans;
}

function decimalCheck(input) {
	let returnVal = 'yes';
	for (let r = equationArray.length; r > -1; r--) { //makes sure there aren't two decimals in the same number
		if (equationArray[r] == input) {
			returnVal = "no";
			break;
		}
		if (equationArray[r] == ' + ' || equationArray[r] == ' - ' || equationArray[r] == ' * ' || equationArray[r] == ' / ') {
			returnVal == 'yes';
			break;
		}
	}
	return returnVal;
}


