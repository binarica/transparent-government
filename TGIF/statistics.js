const apiKey = 'aNBCUhvCkSJWLGMimGFor0Jmw49DCDtPU7Hw6Esa';

const topTenPercent = -0.1;
const bottomTenPercent = 0.1;

const app = new Vue({
	el: '#app',
	computed: {
		isLoading: function () {
			return !this.members || !this.members.length;
		}
	},
	data: {
		members: [],
		democrats: [],
		republicans: [],
		independents: [],
		leastLoyalMembers: [],
		mostLoyalMembers: [],
		leastEngagedMembers: [],
		mostEngagedMembers: []
	},
	methods: {
		calculateStatistics: function () {

			this.members.forEach(member => {
				switch (member.party) {
					case "D":
						this.democrats.push(member);
						break;
					case "R":
						this.republicans.push(member);
						break;
					case "I":
						this.independents.push(member);
				}
			});

			this.leastLoyalMembers = this.calculatePercentile(this.members, "votes_with_party_pct", bottomTenPercent);
			this.mostLoyalMembers = this.calculatePercentile(this.members, "votes_with_party_pct", topTenPercent);
			this.leastEngagedMembers = this.calculatePercentile(this.members, "missed_votes_pct", topTenPercent);
			this.mostEngagedMembers = this.calculatePercentile(this.members, "missed_votes_pct", bottomTenPercent);
		},

		calculateAverageVotesWithParty: function (partyMembers) {
			const votesWithParty = partyMembers.map(member => member.votes_with_party_pct);
			if (votesWithParty && votesWithParty.length > 0) {
				const avg = votesWithParty.reduce((accumulator, currentValue, currentIndex, array) => {
					accumulator += currentValue;
					return (currentIndex === array.length - 1) ? accumulator / array.length : accumulator;
				});

				return avg.toFixed(2);
			} else {
				return 0;
			}
		},

		calculatePercentile: function (partyMembers, statistic, percentile) {
			let result;

			partyMembers.sort((a, b) => a[statistic] - b[statistic]);
			let i = parseInt(partyMembers.length * percentile);

			if (i > 0) {
				// Calculate bottom K percent

				// Include duplicate values within the percentile
				while (i < partyMembers.length &&
					partyMembers[i][statistic] > 0 &&
					partyMembers[i][statistic] == partyMembers[i + 1][statistic]) {
					i++;
				}
				result = partyMembers.slice(0, i);
			} else {
				// Calculate top K percent

				// Display from top to bottom
				result = partyMembers.slice(i).reverse();
			}

			return result;
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
			this.calculateStatistics();
		}).catch((error) => {
			console.log("Request failed: " + error.message);
		});
	}
});