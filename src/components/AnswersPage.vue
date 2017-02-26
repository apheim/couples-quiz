<template>
<div>
	<md-card v-for="(question, index) in room.questions">
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Question {{index + 1}}</div>
				<div class="md-title">{{question.Display}}</div>
			</md-card-header-text>

		</md-card-header>
		<md-card-content>
			<md-card v-for="(player, index) in room.players">
				<div class="md-title">{{player.name}}</div>
				<div>{{getAnswer(player, question.Id)}}</div>
			</md-card>
		</md-card-content>
	</md-card>
	<router-link :to="{ name: 'Home' }">
		<md-button class="md-raised md-primary">To Main Menu</md-button>

	</router-link>
	<md-button class="md-raised md-primary" @click.native="playAgain()">Play Again</md-button>

</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'Questions PAge',
	props: ['roomCode'],
	data() {
		return {
			room: {},
			answers: []
		}
	},
	created: function() {
		var me = this
		Axios.get('getRoom', {
				params: {
					room: this.roomCode
				}
			})
			.then(function(resp) {
				me.room = resp.data;
			})
	},
	methods: {
		getAnswer: function(player, questionId) {
			console.log(player.answers);
			return player.answers.filter(a => a.QuestionId == questionId)[0].Answer;
		},
		playAgain: function() {
			this.$socket.emit('playagain', this.roomCode);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
