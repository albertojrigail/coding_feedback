'use strict';
const request = require('request');
const axios = require('axios').default;

const TWENTY_SECONDS = 5000;

const start = (say, sendButton) => {
	say('Take your time to read the prompt thoroughly...').then(() => {
		const now = Date.now();

		// GET RANDOM PROBLEM
		// make request to get problem from database
		request('http://34.96.245.124:2999/problem', function(err, res, body) {
			let json = JSON.parse(body);
			let problemId = json['_id'];
			let userId = 'albertojrigail';
			let title = json['title'];
			let prompt = json['prompt'];
			let solutionTemplate = json['solution_template'];
			
			let url = 'http://34.96.245.124:2999/?uid=' + userId + '&pid=' + problemId +'&datetime=' + now;

			let script = '<script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?lang=py&amp;skin=sunburst"></script>';
			let starthtml = '<pre class="prettyprint">';
			let middlehtml = '';
			solutionTemplate.forEach(element => {
				middlehtml += element + '<br/>';
			});
			let endhtml = '</pre>';
			
			say('*'+title+'*').then(() => {
				say(prompt).then(() => {
					// GET IMAGE
					// Make request to get image snippet
					const data = {
						html: script + starthtml + middlehtml + endhtml,
						css: "",
						google_fonts: "Roboto"
					}
					
					const API_ID = "ca2e9be6-9728-4f7b-a46c-1cdce4bc0676";
					const API_KEY= "f32f2ad1-7ac7-48bc-8e51-4bab98348502";
					
					// Create an image by sending a POST to the API.
					// Retrieve your api_id and api_key from the Dashboard. https://htmlcsstoimage.com/dashboard
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
								});
							})
						}
					);
				});
			})
		});

		
	})
};


const state = (payload, say) => {
	if(payload === 'yes') {
		say('Great! You should open this website for submission').then(() => {
		});
	} else {
		say('That is fine. Take your time...').then(() => {
			setTimeout(() => {}, TWENTY_SECONDS).then(() => {
				sendButton('Are you ready to start coding?', ['yes', 'no'])
			});
		});
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