<template>
<div>
	<md-card>
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Congrats! You Connected. How Sweet.</div>
				<div class="md-title">Now what's your name?</div>
			</md-card-header-text>
		</md-card-header>
		<md-card-actions>
			<md-input-container>
				<label>Name</label>
				<md-input type="text" v-model="name"></md-input>
			</md-input-container>
		</md-card-actions>
    <div v-on:click="sendName()"><md-button class="md-raised md-primary">Send</md-button></div>
	</md-card>
</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	data() {
		return {
        name : null
		}
	},
  methods: {
    sendName: function(){
      console.log("sending name");
        this.$socket.emit('sendName', this.name);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
