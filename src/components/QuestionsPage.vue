<template>
<div>
	<transition name="custom-classes-transition" enter-active-class="animated fadeInRight" mode="out-in"  leave-active-class="animated fadeOutLeft"  >
		<md-card v-if="!waiting" v-bind:key="currentIndex">
			<md-card-header>
				<md-card-header-text>
					<div class="md-title">Question {{currentIndex + 1}}</div>
					<div class="md-title">{{currentQuestion.Question}}</div>
				</md-card-header-text>
			</md-card-header>
			<md-card-actions>
				<md-input-container>
					<label>Answer</label>
					<md-input id="answer" type="text" @keyup.enter.native="nextQuestion()" v-model="currentQuestion.Answer"></md-input>
				</md-input-container>
			</md-card-actions>
			<md-card-actions>
				<div @click="nextQuestion()">
					<md-button>Next</md-button>
				</div>
			</md-card-actions>
		</md-card>
	</transition>
	<transition name="custom-classes-transition" enter-active-class="animated fadeInRight">
	<md-card v-if="waiting" transition="fadeLeft">
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Good Job, You Answered First</div>
				<div class="md-title">Waiting on Your Partner's Answers</div>
			</md-card-header-text>
		</md-card-header>
		<div style="text-align:center;">
			<md-spinner :md-size="150" md-indeterminate style="display:inline-block"></md-spinner>
		</div>
		<md-card-actions>
			<router-link :to="{ name: 'Home' }">
				<md-button>Cancel</md-button>
			</router-link>
		</md-card-actions>
	</md-card>
	</transition
</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	props: ['room', 'playerId'],
	data() {
		return {
			questions: [],
			waiting: false,
			currentIndex: 0
		}
	},
	created: function() {
		var me = this;
		Axios.get('getQuestions', {
				params: {
					room: this.room,
					player: this.playerId
				}
			})
			.then(function(resp) {
				me.questions = resp.data;
			})
	},
	methods: {
		sendAnswers: function() {
			this.$socket.emit('sendAnswers', this.questions);
			this.waiting = true;
		},
		nextQuestion: function() {
			if (++this.currentIndex == this.questions.length)
				this.sendAnswers();

			setTimeout(function(){
				document.getElementById("answer").focus();
			},2000);
		}
	},
	computed: {
		currentQuestion() {
			if (this.questions.length == 0 || this.currentIndex >= this.questions.length) return {};
			return this.questions[this.currentIndex];
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
