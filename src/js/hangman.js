/* jshint esversion: 6 */
/* jshint expr: true */
;(function() {
	'use strict';

	const TASKLIST = [
		{
			question: "Полосатая лошадка?",
			answer: "Зебра"
		}, {
			question: "Столица Казахстана?",
			answer: "Астана"
		}, {
			question: "Один из друзей Винни-Пуха?",
			answer: "Ослик"
		}, {
			question: "Единица мощности?",
			answer: "Ватт"
		}, {
			question: "Континентальный «кенгурятник»?",
			answer: "Австралия"
		}];
	
	class Hangman {
		constructor() {
			this.taskCount = TASKLIST.length;
			this.life = 5;
		}

		Run() {
			this.level = 0;
			this.tasks = [...Array(this.taskCount).keys()];
		}

		ChangeLevel() {
			++this.level;
			this.life = 5;
			this.currentTask = this.GetRandomTask();
			this.remainingLetters = this.currentTask.answer.length;
		}

		GetGameState() {
			if (this.life == 0) {
				return {status: false, message: "gameover"};
			}

			if (this.remainingLetters > 0) {
				return {status: true};
			}
			
			if (this.level == this.taskCount) {
				return {status: false, message: "wingame"};
			}

			return {status: false, message: "nextlevel"};
		}

		GetRandomTask() {
			if (this.tasks.length > 0) {
				let randomIndex = Math.floor(Math.random() * this.tasks.length);
				let task = this.tasks.splice(randomIndex, 1);
				let taskIndex = task.shift();
				let randomTask = TASKLIST[taskIndex];
				return randomTask;
			}
		}
	}

	window.Hangman = Hangman;
})();