<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  sockets: {
    startGame: function(){
      this.$router.push('StartGame');
    },
    goToQuestions:function(roomCode){
      console.log(roomCode);
      this.$router.push({ name: 'Questions', params: { room: roomCode }});
    },
    goToAnswers:function(roomCode){
      this.$router.push({ name: 'Answers', params: { roomCode: roomCode }});
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
