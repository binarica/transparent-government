var members = data.results[0].members;

var partyFilter = document.querySelector('#party-filter');
var stateFilter = document.querySelector('#state-filter');

var selectedParties = [];
var selectedState = '';

function updateUI() {

    let filteredMembers = members.filter(member => (
        selectedParties.length === 0 || selectedParties.indexOf(member.party) !== -1)
    ).filter(member => (
        selectedState === '' || selectedState === member.state)
    );

    let tbody = document.querySelector('tbody');
    let stringToAppend = "";

    filteredMembers.forEach(function (member) {
        stringToAppend +=
        '<tr><td><a href="' + member.url + '" target="_blank">' +
        member.last_name + ' ' +
        member.first_name + ' ' +
        (member.middle_name || '') + '</a></td><td>' +
        member.party + '</td><td>' +
        member.state + '</td><td>' +
        member.seniority + '</td><td>' +
        member.votes_with_party_pct + '%</td></tr>';
    });

    tbody.innerHTML = stringToAppend;
};

updateUI();

partyFilter.onchange = function() {
    let checkedBoxes = this.querySelectorAll('input[name="party"]:checked');
    selectedParties = Array.from(checkedBoxes).map(e => e.value);
    updateUI();
};

stateFilter.onchange = function() {
    selectedState = this.value;
    updateUI();
};