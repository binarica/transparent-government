const apiKey = 'aNBCUhvCkSJWLGMimGFor0Jmw49DCDtPU7Hw6Esa';

const app = new Vue({
	el: '#app',
	computed: {
		isLoading: function () {
			return !this.members || !this.members.length;
		}
	},
	data: {
		members: [],
		filteredMembers: [],
		partyFilter: [],
		stateFilter: ''
	},
	methods: {
		getfilteredMembers: function () {
			const selectedParties = this.partyFilter;
			const selectedState = this.stateFilter;

			this.filteredMembers = this.members.filter(member => (
				selectedParties.length === 0 || selectedParties.indexOf(member.party) !== -1)).filter(member => (
				selectedState === '' || selectedState === member.state));
		}
	},
	beforeMount() {
		const init = {
			headers: {
				'X-API-Key': apiKey
			}
		};

		fetch(remoteUrl, init).then((response) => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.statusText);
		}).then((json) => {
			this.members = json.results[0].members;
			this.getfilteredMembers();
		}).catch((error) => {
			console.log("Request failed: " + error.message);
		});
	}
});