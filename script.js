document.addEventListener('DOMContentLoaded', function() {
    const candidates = {
        chairperson: [
            { name: 'John Doe', image: 'images/john_doe.jpg' },
            { name: 'Jane Smith', image: 'images/jane_smith.jpg' }
        ],
        viceChairperson: [
            { name: 'Michael Johnson', image: 'images/michael_johnson.jpg' },
            { name: 'Emily Davis', image: 'images/emily_davis.jpg' }
        ],
        cashier: [
            { name: 'Chris Lee', image: 'images/chris_lee.jpg' },
            { name: 'Jessica Taylor', image: 'images/jessica_taylor.jpg' }
        ],
        katibu: [
            { name: 'David Brown', image: 'images/david_brown.jpg' },
            { name: 'Laura White', image: 'images/laura_white.jpg' }
        ],
        secretary: [
            { name: 'Robert Miller', image: 'images/robert_miller.jpg' },
            { name: 'Sarah Wilson', image: 'images/sarah_wilson.jpg' }
        ]
    };

    for (const [category, candidatesList] of Object.entries(candidates)) {
        const container = document.getElementById(`${category}Candidates`);
        candidatesList.forEach(candidate => {
            const candidateDiv = document.createElement('div');
            candidateDiv.className = 'candidate';
            
            const candidateLabel = document.createElement('label');
            candidateLabel.innerHTML = `<img src="${candidate.image}" alt="${candidate.name}"><br>${candidate.name}`;
            
            const candidateInput = document.createElement('input');
            candidateInput.type = 'radio';
            candidateInput.name = category;
            candidateInput.value = candidate.name;
            candidateInput.required = true;
            
            candidateLabel.prepend(candidateInput);
            candidateDiv.appendChild(candidateLabel);
            container.appendChild(candidateDiv);
        });
    }

    document.getElementById('votingForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const regNumber = document.getElementById('regNumber').value;
        const chairperson = document.querySelector('input[name="chairperson"]:checked').value;
        const viceChairperson = document.querySelector('input[name="viceChairperson"]:checked').value;
        const cashier = document.querySelector('input[name="cashier"]:checked').value;
        const katibu = document.querySelector('input[name="katibu"]:checked').value;
        const secretary = document.querySelector('input[name="secretary"]:checked').value;

        const userKey = `${regNumber}-voted`;

        if (localStorage.getItem(userKey)) {
            document.getElementById('message').textContent = 'You have already voted!';
            return;
        }

        localStorage.setItem(userKey, true);

        const votes = {
            chairperson,
            viceChairperson,
            cashier,
            katibu,
            secretary
        };

        localStorage.setItem('votes', JSON.stringify(votes));

        sendVoteSMS(name, regNumber, votes);

        document.getElementById('message').textContent = 'Thank you for voting!';
        document.getElementById('votingForm').reset();
    });

    function sendVoteSMS(name, regNumber, votes) {
        fetch('/.netlify/functions/sendVoteSMS', {
            method: 'POST',
            body: JSON.stringify({ name, regNumber, votes }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('SMS sent successfully');
            } else {
                console.error('Failed to send SMS', data.error);
            }
        })
        .catch(error => {
            console.error('Error sending SMS', error);
        });
    }
});
