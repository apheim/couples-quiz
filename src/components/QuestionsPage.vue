<template>
<div>
	<h1>{{room}}</h1>
	<md-card v-for="(item, index) in questions">
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Question {{index + 1}}</div>
				<div class="md-title">{{item.Question}}</div>
			</md-card-header-text>
		</md-card-header>
		<md-card-actions>
			<md-input-container>
				<label>Answer</label>
				<md-input type="text" v-model="item.Answer"></md-input>
			</md-input-container>
		</md-card-actions>
	</md-card>
	<div v-on:click="sendAnswers()">
		<md-button class="md-raised md-primary">Send</md-button>
	</div>
</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	props: ['room'],
	data() {
		return {
			questions: null,
			answers: []
		}
	},
	created: function() {
		var me = this
		console.log(this.room);
		Axios.get('getQuestions', {
				params: {
					room: this.room
				}
			})
			.then(function(resp) {
				me.questions = resp.data;
			})
	},
  methods: {
    sendAnswers: function(){
      this.$socket.emit('sendAnswers', this.questions);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
