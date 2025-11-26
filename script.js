### 3. script.js (JavaScript)
```javascript
let teams = ['Спартак', 'Динамо', 'Зенит', 'ЦСКА'];
let matches = {};

function initTeamInputs() {
    const teamInputsDiv = document.getElementById('teamInputs');
    teamInputsDiv.innerHTML = '';
    
    teams.forEach((team, index) => {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'team-input';
        inputDiv.innerHTML = `
            Команда ${index + 1}:
            
        `;
        teamInputsDiv.appendChild(inputDiv);
    });
}

function saveTeams() {
    const newTeams = [];
    let allFilled = true;
    
    for (let i = 0; i < teams.length; i++) {
        const value = document.getElementById(`teamName${i}`).value.trim();
        if (value === '') {
            allFilled = false;
            alert(`Пожалуйста, заполните название команды ${i + 1}`);
            break;
        }
        newTeams.push(value);
    }
    
    if (allFilled) {
        teams = newTeams;
        matches = {};
        initMatches();
        updateTable();
        alert('Названия команд обновлены! Результаты матчей сброшены.');
        toggleSettings();
    }
}

function toggleSettings() {
    const settingsDiv = document.getElementById('teamSettings');
    const showBtn = document.getElementById('showSettingsBtn');
    
    if (settingsDiv.style.display === 'none') {
        settingsDiv.style.display = 'block';
        showBtn.style.display = 'none';
        initTeamInputs();
    } else {
        settingsDiv.style.display = 'none';
        showBtn.style.display = 'inline-block';
    }
}

function initMatches() {
    const matchesDiv = document.getElementById('matches');
    matchesDiv.innerHTML = '';
    
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            const matchKey = `${i}-${j}`;
            if (!matches[matchKey]) {
                matches[matchKey] = { team1Sets: 0, team2Sets: 0 };
            }
            
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match-input';
            matchDiv.innerHTML = `
                ${teams[i]} vs ${teams[j]}
                
                    ${teams[i]}:
                    
                
                
                    ${teams[j]}:
                    
                
                Сохранить
            `;
            matchesDiv.appendChild(matchDiv);
        }
    }
    
    const resetBtn = document.createElement('button');
    resetBtn.className = 'reset-btn';
    resetBtn.textContent = 'Сбросить все результаты';
    resetBtn.onclick = resetAll;
    matchesDiv.appendChild(resetBtn);
}

function saveMatch(matchKey, team1Idx, team2Idx) {
    const team1Sets = parseInt(document.getElementById(`team1-${matchKey}`).value) || 0;
    const team2Sets = parseInt(document.getElementById(`team2-${matchKey}`).value) || 0;
    
    if (team1Sets === 0 && team2Sets === 0) {
        matches[matchKey] = { team1Sets: 0, team2Sets: 0 };
        updateTable();
        return;
    }
    
    if (team1Sets > 2 || team2Sets > 2 || team1Sets < 0 || team2Sets < 0) {
        alert('Количество сетов должно быть от 0 до 2!');
        return;
    }
    
    if ((team1Sets === 2 && team2Sets <= 1) || (team2Sets === 2 && team1Sets <= 1)) {
        matches[matchKey] = { team1Sets, team2Sets };
        updateTable();
    } else {
        alert('Некорректный счёт! Для победы нужно выиграть 2 сета. Возможные счета: 2:0, 2:1');
    }
}

function calculatePoints(setsWon, setsLost) {
    if (setsWon === 2 && setsLost === 0) return 3;
    if (setsWon === 2 && setsLost === 1) return 2;
    if (setsWon === 1 && setsLost === 2) return 1;
    return 0;
}

function updateTable() {
    const stats = teams.map(team => ({
        team,
        games: 0,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        points: 0
    }));
    
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            const matchKey = `${i}-${j}`;
            const match = matches[matchKey];
            
            if (match.team1Sets > 0 || match.team2Sets > 0) {
                stats[i].games++;
                stats[j].games++;
                
                stats[i].setsWon += match.team1Sets;
                stats[i].setsLost += match.team2Sets;
                stats[j].setsWon += match.team2Sets;
                stats[j].setsLost += match.team1Sets;
                
                if (match.team1Sets === 2) {
                    stats[i].wins++;
                    stats[j].losses++;
                    stats[i].points += calculatePoints(match.team1Sets, match.team2Sets);
                    stats[j].points += calculatePoints(match.team2Sets, match.team1Sets);
                } else if (match.team2Sets === 2) {
                    stats[j].wins++;
                    stats[i].losses++;
                    stats[j].points += calculatePoints(match.team2Sets, match.team1Sets);
                    stats[i].points += calculatePoints(match.team1Sets, match.team2Sets);
                }
            }
        }
    }
    
    stats.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const aRatio = a.setsWon - a.setsLost;
        const bRatio = b.setsWon - b.setsLost;
        return bRatio - aRatio;
    });
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    stats.forEach((stat, index) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            ${index + 1}
            ${stat.team}
            ${stat.games}
            ${stat.wins}
            ${stat.losses}
            ${stat.setsWon}:${stat.setsLost}
            ${stat.points}
        `;
    });
}

function resetAll() {
    if (confirm('Вы уверены, что хотите сбросить все результаты?')) {
        matches = {};
        initMatches();
        updateTable();
    }
}

initTeamInputs();
initMatches();
updateTable();
```
