var isClicked = false;
var userInput = '';

document.getElementById('button').onclick = function() {
	if(!isClicked && check()){
   		isClicked = true;
   		generate();
	}
};

function check(){
	userInput = document.getElementById("textbox").value
	if(userInput.length < 1){
		alert("Input is empty!");
		document.getElementById("textbox").value = '';
		return false;
	}
	var ch = /^[01]+$/.test(userInput);
	if(!ch){
		alert("Not a binary number");
		document.getElementById("textbox").value = '';
		return false;
	}
	return true;
}

function createConfig(details, data) {
	return {
		type: 'line',
		data: {
			labels: details.labels,
			datasets: [{
				label: 'steppedLine: ' + details.steppedLine,
				steppedLine: details.steppedLine,
				data: data,
				borderColor: details.color,
				fill: false,
			}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: details.label,
			}
		}
	};
}

function nrz(inputArr) {
	var arr = inputArr.concat();
	arr.forEach(function(part, index, theArray) {
		if(part == 0){
			theArray[index] = 0;
		}else{
			theArray[index] = 5;
		}
	});
	arr.push(arr.length - 1);
	return arr;
}

function nrzl(inputArr) {
	var arr = inputArr.concat();
	arr.forEach(function(part, index, theArray) {
		if(part == 0){
			theArray[index] = -5;
		}else{
			theArray[index] = 5;
		}
	});
	arr.push(arr.length - 1);
	return arr;
}

function nrzi(inputArr) {
	var arr = inputArr.concat();
	var arr2 = [];
	arr.forEach(function(part, index, theArray) {
		if(index == 0) {
			arr2.push(arr[index]);
			if(part == 0) {
				theArray[index] = -5;
			} else {
				theArray[index] = 	5;
			}
		} else {
			if(part == 0) {
				theArray[index] = theArray[index - 1];
				if(arr[index - 1] == -5){
					arr2.push(0);
				}else {
					arr2.push(1);
				}
			} else {
				theArray[index] = theArray[index - 1] * -1;
				if(arr[index - 1] == -5){
					arr2.push(1);
				}else {
					arr2.push(0);
				}
			}
		}
	});
	arr.push(arr[arr.length - 1]);
	arr2.push(arr2[arr2.length - 1]);
	return [arr, arr2];
}


function generate() {

	isClicked = false;
	var inputArr = userInput.split('');
	var container = document.querySelector('.container');
	$(".container").empty();

	var steppedLineSettings = [{
		steppedLine: true,
		label: 'Unipolar NRZ',
		color: 'rgb(255, 99, 132)',
		data: nrz(inputArr),
		labels: nrz(inputArr)
	}, {
		steppedLine: true,
		label: 'Polar NRZ-L',
		color: 'rgb(255, 99, 132)',
		data: nrzl(inputArr),
		labels: nrzl(inputArr)
	}, {
		steppedLine: true,
		label: 'Polar NRZ-I',
		color: 'rgb(255, 99, 132)',
		data: nrzi(inputArr)[0],
		labels: nrzi(inputArr)[1]
	}];

	steppedLineSettings.forEach(function(details) {
		var div = document.createElement('div');
		div.classList.add('chart-container');

		var canvas = document.createElement('canvas');
		div.appendChild(canvas);
		container.appendChild(div);

		var ctx = canvas.getContext('2d');
		var config = createConfig(details, details.data);
		new Chart(ctx, config);
	});
};
