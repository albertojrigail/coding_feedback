'use strict';

const start = (say, sendButton) => {
    // const rand= Math.floor(Math.random() * 10);     // returns a random integer from 0 to 9
	const rand = 0;
	const str = '*CODING PUZZLE:* \n\n' + puzzlesText[rand] + '\n\n Take your time to read the prompt thoroughly';
	say(str).then(() => {
		await new Promise(resolve => setTimeout(resolve, 2000));
		state('no', 'Are you ready to start coding?', ['yes', 'no']);
	});	
	
};


const state = (payload, say, sendButton) => {
	if(payload === 'yes') {
		say('Great! You will be redirected a website for your submission!').then(() => {
			window.open()

		});
	} else {
		say('No problem, take your time!').then(() => {
			await new Promise(resolve => setTimeout(resolve, 4000));
			state('no', 'Are you ready now?', ['yes', 'no']);
		});
	}


	say({attachment:'image', url: solutionPhoto[0],}).then(() => {
		say({text:'🎉 Congratulations! You have finished the challenge!'}).then(() => {
			sendButton('Play again?', [
				{title: 'Yes!', payload: 'restart'},
				'No'
			]);
		});
	});
	
};

module.exports = {
	filename: 'bubblesort',
	title: 'Coding Puzzle Feedback',
	introduction: [
		"Hi! Let's do a coding puzzle!/n ",
		'I will show you a coding puzzle question, and you should provide the code for the solution.\n',
		'After your submission, you may be asked to give feedback to a classmate.\n',
		'If you do, you may receive feedback on your solution.\n',
		'Good Luck!'		
    	],
	start: start,
	state: state
};

// Section for Data

// This list contains the prompts for several coding puzzles
const puzzles = [
    "You are given the array paths, where paths[i] = [cityAi, cityBi] means there exists a direct path going from cityAi to cityBi. \n Return the destination city, that is, the city without any path outgoing to another city.\n" +
    "It is guaranteed that the graph of paths forms a line without any loop, therefore, there will be exactly one destination city.",
]

// contains images for sample solutions of coding puzzles
var solutionPhoto = [
    'https://4.bp.blogspot.com/-w5mxkIEGAt8/XI1DXbCCYBI/AAAAAAAAAPA/nyc478tI0Fg43ikj_YeWllrCyOSCtWmGACLcBGAs/w800/fin.png',
]