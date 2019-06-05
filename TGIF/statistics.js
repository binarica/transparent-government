const members = data.results[0].members;

let statistics = {
	"numDemocrats": 0,
	"numRepublicans": 0,
	"numIndependents": 0,
	"pctVotesDemocrats": 0,
	"pctVotesRepublicans": 0,
	"pctVotesIndependents": 0
};

let democrats = [];
let republicans = [];
let independents = [];

members.forEach(member => {
	switch (member.party) {
		case "D":
		democrats.push(member);
		break;
		case "R":
		republicans.push(member);
		break;
		case "I":
		independents.push(member);
	}
});

statistics.numDemocrats = democrats.length;
statistics.numRepublicans = republicans.length;
statistics.numIndependents = independents.length;

statistics.pctVotesDemocrats = calculateAverageVotesWithParty(democrats);
statistics.pctVotesRepublicans = calculateAverageVotesWithParty(republicans);
statistics.pctVotesIndependents = calculateAverageVotesWithParty(independents);

statistics.pctVotesTotal = calculateAverageVotesWithParty(members);

function calculateAverageVotesWithParty(partyMembers) {
	let votesWithParty = partyMembers.map(member => member.votes_with_party_pct);
	if (votesWithParty && votesWithParty.length > 0) {
		const avg = votesWithParty.reduce((accumulator, currentValue, currentIndex, array) => {  
			accumulator += currentValue;
			return (currentIndex === array.length - 1) ? accumulator/array.length : accumulator;
		});

		return avg.toFixed(2);
	} 
	else {
		return 0;
	} 
}

function calculatePercentile(partyMembers, statistic, percentile) {
	let result;

	partyMembers.sort((a, b) => a[statistic] - b[statistic]);
	let i = parseInt(partyMembers.length * percentile);

	if (i > 0) {
		// Calculate bottom K percent

		// Include duplicate values within the percentile
		while (i < partyMembers.length
			&& partyMembers[i][statistic] > 0
			&& partyMembers[i][statistic] == partyMembers[i + 1][statistic]) {
			i++;
		}
		result = partyMembers.slice(0, i);
	}
	else {
		// Calculate top K percent

		// Display from top to bottom
		result = partyMembers.slice(i).reverse();
	}

	return result;
}

statistics.leastLoyal = calculatePercentile(members, "votes_with_party_pct", 0.1);
statistics.mostLoyal = calculatePercentile(members, "votes_with_party_pct", -0.1);
statistics.leastEngaged = calculatePercentile(members, "missed_votes_pct", -0.1);
statistics.mostEngaged = calculatePercentile(members, "missed_votes_pct", 0.1);

createGlanceTable(document.querySelector('#at-a-glance'));
createLoyaltyTable(statistics.leastLoyal, document.querySelector('#least-loyal'));
createLoyaltyTable(statistics.mostLoyal, document.querySelector('#most-loyal'));
createAttendanceTable(statistics.leastEngaged, document.querySelector('#least-engaged'));
createAttendanceTable(statistics.mostEngaged, document.querySelector('#most-engaged'));

function createGlanceTable(el) {

	if (el != null) {

		let tbody = el.querySelector('tbody');
		let stringToAppend = "";

		stringToAppend +=
		'<tr><td>Democrats</td><td>' + statistics.numDemocrats + '</td><td>' + statistics.pctVotesDemocrats + '%</td></tr>' +
		'<tr><td>Republicans</td><td>' + statistics.numRepublicans + '</td><td>' + statistics.pctVotesRepublicans + '%</td></tr>' +
		'<tr><td>Independents</td><td>' + statistics.numIndependents + '</td><td>' + statistics.pctVotesIndependents + '%</td></tr>' +
		'<tr><td>Total</td><td>' + members.length + '</td><td>' + statistics.pctVotesTotal + '%</td></tr>'

		tbody.innerHTML = stringToAppend;
	}
};

function createLoyaltyTable(selectedMembers, el) {

	if (el != null) {

		let tbody = el.querySelector('tbody');
		let stringToAppend = "";

		selectedMembers.forEach(function (member) {
			stringToAppend +=
			'<tr><td><a href="' + member.url + '" target="_blank">' +
			member.last_name + ' ' +
			member.first_name + ' ' +
			(member.middle_name || '') + '</a></td><td>' +
			member.total_votes + '</td><td>' +
			member.votes_with_party_pct + '%</td></tr>';
		});

		tbody.innerHTML = stringToAppend;
	}
};

function createAttendanceTable(selectedMembers, el) {

	if (el != null) {
		
		let tbody = el.querySelector('tbody');
		let stringToAppend = "";

		selectedMembers.forEach(function (member) {
			stringToAppend +=
			'<tr><td><a href="' + member.url + '" target="_blank">' +
			member.last_name + ' ' +
			member.first_name + ' ' +
			(member.middle_name || '') + '</a></td><td>' +
			member.missed_votes + '</td><td>' +
			member.missed_votes_pct + '%</td></tr>';
		});

		tbody.innerHTML = stringToAppend;
	}
};