import Vue from 'vue'
import Router from 'vue-router'
import HomePage from 'components/HomePage'
import NewRoomPage from 'components/NewRoomPage'
import QuestionsPage from 'components/QuestionsPage'
import StartGamePage from 'components/StartGamePage'
import AnswersPage from 'components/AnswersPage'
import VueMaterial from 'vue-material'
import VueSocketio from 'vue-socket.io';

require('vue-material/dist/vue-material.css')

Vue.use(VueMaterial)
Vue.use(Router)
Vue.use(VueSocketio, window.location.orgin);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/NewRoom',
      name: 'NewRoom',
      component: NewRoomPage
    },
    {
      path: '/StartGame',
      name: 'StartGame',
      component: StartGamePage
    },
    {
      path: '/Questions',
      name: 'Questions',
      component: QuestionsPage,
      props: true
    },
    {
      path: '/Answers',
      name: 'Answers',
      component: AnswersPage,
      props: true
    }
  ]
})
