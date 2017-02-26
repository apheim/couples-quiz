<template>
<div class="hello">
	<div>
		<img src="../assets/cupid.png" />
		<h1>Couple Quiz</h1>
	</div>
	<router-link :to="{ name: 'NewRoom' }">
		<md-button class="md-raised md-primary">Start New Game</md-button>
	</router-link>
	<md-button class="md-raised md-primary" @click.native="openDialog('dialog6')">Join Game</md-button>
	<md-dialog-prompt md-input-maxlength="6" v-model="promptValue" :md-title="'Pleas Enter Code'" :md-ok-text="'Ok'" :md-cancel-text="'Cancel'" @open="onOpen" @close="onClose" ref="dialog6">
	</md-dialog-prompt>

	<div id="andrew">
		<div class="img-logo-container">
			<a href="http://www.andrewheim.com">
				<img src="../assets/andrew.jpg" />
			</a>
		</div>
		<p>Made By <a href="http://www.andrewheim.com">Andrew Heim</a>
			<p>
	</div>
</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	sockets: {
		connect: function() {
			console.log('socket connected')
		}
	},
	data() {
		return {
			msg: 'Welcome to Your Vue.js App',
			promptValue: "",
		}
	},
	methods: {
		openDialog(ref) {
			this.$refs[ref].open()
		},
		closeDialog(ref) {


			this.$refs[ref].close()
		},
		onOpen() {
			console.log('Opened')
		},
		onClose(type, d) {
			let me = this;
			let code = this.promptValue;
			Axios.post('joinRoom', {
					code: code,
				})
				.then(function(response) {
					if (response) {
						me.$socket.emit('joinRoom', code);
					}
					console.log(response)
				})
				.catch(function(error) {
					console.log(error)
				});
			console.log('Closed', type)
		}
	},
	created: function() {

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.img-logo-container {
	height: 100;
	width: 100px;
	overflow: hidden;
	margin: 10px auto 10px auto;
	border-radius: 100px;
	border-style: solid;
	border-width: 5px;
}
#andrew{
	margin-top: 50px;
}
</style>
