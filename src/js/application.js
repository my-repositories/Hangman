/* jshint esversion: 6 */
/* jshint expr: true */
;(function() {
	'use strict';

	const HTML = {
		winGame: `
			<h2>Игра пройдена!</h2>
			<p>Желаете начать сначала?</p>
			<footer>
			<input type="button" value="Нет" class="btn cancel">
			<input type="button" value="Да" class="btn confirm">
			</footer>
		`,
		nextLevel: `
			<h2>Уровень ##LEVEL## пройден!</h2>
			<p>Перейти на следующий уровень?</p>
			<footer>
			<input type="button" value="Отмена" class="btn cancel">
			<input type="button" value="Продолжить" class="btn confirm">
			</footer>
		`,
		gameOver: `
			<h2>Игра окончена!</h2>
			<p>Попробовать еще?</p>
			<footer>
			<input type="button" value="Нет" class="btn cancel">
			<input type="button" value="Да" class="btn confirm">
			</footer>
		`
	};
	
	class Application {

		constructor() {
			this.game = document.querySelector(".game");
			this.title = this.game.querySelector(".game-title");
			this.question = this.game.querySelector(".game-question");
			this.answer = this.game.querySelector(".game-answer");
			this.keyboard = this.game.querySelector(".game-keyboard");
			this.keyboardButtons = [];
			this.hangman = new Hangman();
			this.canvas = new Canvas();
			this.CreateKeyBoard();
			this.AddEvents();
		}

		Init() {
			this.hangman.Run();
			this.LoadNextLevel();
		}

		CreateKeyBoard() {
			let keys = ["йцукенгшщзхъ", "фывапролджэ", "ячсмитьбю"];

			for (let i = 0, keysLength = keys.length; i < keysLength; ++i) {
				let row = document.createElement("div");
				row.className = "row";

				for (let j = 0, rowLength = keys[i].length; j < rowLength; ++j) {
					let index = this.keyboardButtons.length;
					this.keyboardButtons[index] = document.createElement("span");
					this.keyboardButtons[index].className = "game-keyboard-button";
					this.keyboardButtons[index].innerText = keys[i][j];
					row.append(this.keyboardButtons[index]);
				}
				this.keyboard.append(row);
			}

		}

		LoadNextLevel() {
			this.ResetGameArea();
			this.hangman.ChangeLevel();
			this.title.innerText = `Вопрос №${this.hangman.level} из ${this.hangman.taskCount}`;
			this.question.innerText = this.hangman.currentTask.question;

			for (let i = 0, size = this.hangman.currentTask.answer.length; i < size; i++) {
				let letter = document.createElement("span");
				letter.className = "game-answer-letter";
				letter.innerText = "_";
				this.answer.append(letter);
			}
			this.answerLetters = this.answer.querySelectorAll(".game-answer-letter");
		}

		ResetGameArea() {
			this.canvas.Clear();
			let keys = this.keyboard.querySelectorAll(".game-keyboard-button");
			for (let i = 0, size = keys.length; i < size; i++) {
				keys[i].classList.remove('disabled');
			}
			while (this.answer.firstChild) {
				this.answer.removeChild(this.answer.firstChild);
			}
		}

		CheckGame() {
			let state = this.hangman.GetGameState();

			if (state.status) {
				return true;
			}

			if (state.message == "gameover") {
				ShowPopup({
					body: HTML.gameOver,
					onconfirm: this.Init.bind(this)
				});
			} else if (state.message == "wingame") {
				ShowPopup({
					body: HTML.winGame,
					onconfirm: this.Init.bind(this)
				});
			} else {
				ShowPopup({
					body: HTML.nextLevel.replace('##LEVEL##', this.hangman.level),
					onconfirm: this.LoadNextLevel.bind(this)
				});
			}
			return false;
		}

		AddEvents() {
			this.keyboard.addEventListener("click", (e) => {
				let target = e.target;
				if (!target.classList.contains("game-keyboard-button")) {
					return;
				}

				if (!this.CheckGame()) {
					return;
				}

				if (this.FindKeyByCode(target.innerText) != -1) {
					target.classList.add("disabled");
					this.HandleStep(target.innerText);
					this.CheckGame();
				}
			});

			document.body.addEventListener("keyup", (e) => {
				let key = this.FindKeyByCode(e.key);
				if (key != -1) {
					key.classList.remove("active");
					key.click();
				}
			});

			document.body.addEventListener("keydown", (e) => {
				let key = this.FindKeyByCode(e.key);
				if (key != -1) {
					key.classList.add("active");
				}
			});
		}

		HandleStep(char) {
			if (!this.HasOccurrences(char)) {
				--this.hangman.life;
				this.canvas.Draw();
			}
		}

		/**
		* Replaces all underscores with a `char` in `this.answerLetters` if `char` has  occurences in `this.hangman.currentTask.answer`
		*
		* @param {String} char - a letter to search for in a answer of current task
		* @returns true if has occurrences
		*/
		HasOccurrences(char) {
			let hasOccurrences = false;
			for(let i = 0, size = this.hangman.currentTask.answer.length; i < size; i++) {
				if (this.hangman.currentTask.answer[i].toLowerCase() === char) {
					this.answerLetters[i].innerText = char;
					--this.hangman.remainingLetters;
					hasOccurrences = true;
				}
			}
			return hasOccurrences;
		}

		FindKeyByCode(code) {
			code = this.ParseKey(code);

			let keys = this.keyboard.querySelectorAll(".game-keyboard-button");
			keys = [...keys].filter(item => item.innerText == code);
			if (keys.length == 0 || keys[0].classList.contains("disabled")) {
				return -1;
			}

			return keys.shift();
		}

		/**
		* @param {String} code - a symbol for replace
		* @returns russian letter by ignoring the keyboard layout
		*/
		ParseKey(code) {
			const ru = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
			const en = "f,dult`;pbqrkvyjghcnea[wxio]sm'.z";
			let index = en.indexOf(code.toLowerCase());

			return (index === -1) ? code : ru[index];
		}
	}

	window.Application = Application;
})();