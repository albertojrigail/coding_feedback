'use strict';
const request = require('request');
const TWENTY_SECONDS = 5000;

const start = (say, sendButton, userId) => {
	const id = userId;
	say('Take your time to read the prompt thoroughly...').then(() => {
		// Get random problem from database
		request('http://34.96.245.124:2999/problem', function(err, res, body) {

			// Fetch details from problem and display them
			const json = JSON.parse(body);
			const problemId = json['_id'];
			const userId = 'albertojrigail';
			const title = json['title'];
			const prompt = json['prompt'];
			const solutionTemplate = json['solution_template'];
			
			say('*'+title+'*').then(() => {
				say(prompt).then(() => {
					// Set HTML for code snippet
					let htmlCode = '<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?lang=py&amp;skin=sunburst"></script>' + 
					'<div style="margin:auto;"><pre class="prettyprint">';
					solutionTemplate.forEach(line => {
						htmlCode += line + '<br/>';
					});
					htmlCode += '</pre></div>';

					// Set parameters for requesting snippets
					const data = {
						html: htmlCode,
						css: "",
						google_fonts: "Roboto"
					}
					
					// Authentication
					const API_ID = "ca2e9be6-9728-4f7b-a46c-1cdce4bc0676";
					const API_KEY= "f32f2ad1-7ac7-48bc-8e51-4bab98348502";
					
					// Create an image by sending a POST to the API.
					request.post(
						{
							url:'https://hcti.io/v1/image',
							form: data,
							auth: {
								user: API_ID,
								pass: API_KEY,
							}
						}, function(error,response,newBody) {
							let imageUrl = JSON.parse(newBody)["url"];
							say("This is a template for the solution:").then(() => {
								say({
									attachment: "image",
									url: imageUrl,
								}).then(() => {
									let url = 'http://34.96.245.124:2999/?uid=' + id + '&pid=' + problemId;
									sendButton('Are you ready to start coding?',
									[{title: 'yes', payload: 'yes-' + url}, {title: 'no', payload: 'no-' + url}])
								});
							});
						}
					);
				});
			})
		});	
	});
}


const state = (payload, say, sendButton) => {
	// get payload info
	let payloadArray = payload.split('-');
	let answer = payloadArray[0];
	let url = payloadArray[1];

	// verify answer
	if(answer === 'yes') {
		say('Great! You should open this website for submission:' + url).then(() => {
			say("You can submit your solution within five minutes").then(() => {
				say({
					attachment: "image",
					url: 'https://i.makeagif.com/media/3-17-2017/oBvss1.gif'
				}).then(() => {
					sendButton("When you're done submitting on the external website, come back here and confirm below:",
					[{title:"Successful Submission", payload: "successful-"}, {title: "Failed Submission", payload: "failed-"}])
				});
			});
		});
	} else if (answer === 'no') {
		say('That is fine. Take your time...').then(() => {
			setTimeout(() => {}, TWENTY_SECONDS).then(() => {
				sendButton('Now, are you ready to start coding?',
				[{title: 'yes', payload: 'yes-' + url}, {title: 'no', payload: 'no-' + url}])
			});
		});
	} else if (answer === 'successful') {
		sendButton("Congratulations! Your solution ")


		sendButton("Congratulations! Do you wanna play again?", [{title: 'yes', payload: 'restart'}, 'no']);

	} else if (answer === 'failed') {
		say("We are so sad that this happened? We appreciate an email with feedback to: mailto:ajrc@princeton.edu");
	}
};

module.exports = {
	filename: 'challenge1',
	title: 'Coding Puzzle Feedback',
	introduction: [
		"Hi! Let's do a coding puzzle!\n\n" +
		'I will show you a coding puzzle question, and you should provide the code for the solution. ' +
		'After your submission, you may be asked to give feedback to a classmate.' +
		'If you do, you may receive feedback on your solution.\n\n' +
		'Good Luck!'		
    	],
	start: start,
	state: state,
};