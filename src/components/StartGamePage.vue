<template>
<div>
	<md-card v-if="!waiting">
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Congrats! You Connected. How Sweet.</div>
				<div class="md-title">Now what's your name?</div>
			</md-card-header-text>
		</md-card-header>
		<md-card-actions>
			<md-input-container>
				<label>Name</label>
				<md-input type="text" @keyup.enter.native="sendName()" v-model="name"></md-input>
			</md-input-container>
		</md-card-actions>
		<div @click="sendName()">
			<md-button class="md-raised md-primary">Send</md-button>
		</div>
	</md-card>
	<transition name="custom-classes-transition" enter-active-class="animated fadeInRight">
			<md-card v-if="waiting">
				<md-card-header>
					<md-card-header-text>
						<div class="md-title">Looks Like You're The Fast One</div>
						<div class="md-title">Waiting on Your Partner's Name</div>
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
	</transition>
</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	data() {
		return {
			name: null,
			waiting: false
		}
	},
	methods: {
		sendName: function() {
			this.$socket.emit('sendName', this.name);
			this.waiting = true;
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
