<template>
<div>
	<md-card>
		<md-card-header>
			<md-card-header-text>
				<div class="md-title">Here's your Room Code</div>

				<div class="md-title">{{code}}</div>
			</md-card-header-text>
		</md-card-header>

		<div class="md-title">Waiting For your Partner</div>
    <div style="text-align:center;">
      <md-spinner :md-size="150" md-indeterminate style="display:inline-block"></md-spinner>
    </div>
		<md-card-actions>
			<router-link :to="{ name: 'Home' }">
				<md-button>Cancel</md-button>
			</router-link>
		</md-card-actions>

	</md-card>

</div>
</template>

<script>
import Axios from 'axios'

export default {
	name: 'hello',
	data() {
		return {
			code: null
		}
	},
	created: function() {
		var me = this
		Axios.get('getRoomCode')
			.then(function(resp) {
				let code = resp.data.toUpperCase();
				me.code = code;
				me.$socket.emit('joinRoom', code);
			})
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
