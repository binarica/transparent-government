const Home = { template: '<p>home page</p>' }

const routes = {
  '/home': 'Home',
  '/house-data': 'HouseData',
  '/senate-data': 'SenateData',
  '/house-attendance': 'HouseAttendance',
  '/senate-attendance': 'SenateAttendance',
  '/house-party-loyalty': 'HousePartyLoyalty',
  '/senate-party-loyalty': 'SenatePartyLoyalty'
}

new Vue({
  el: '#app',
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      console.log(this.currentRoute);
      return routes[this.currentRoute]
    }
  },
  render (h) { return h(this.ViewComponent) }
})