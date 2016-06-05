import simulacra from 'simulacra'
import faker from 'faker'

const template = document.createElement('template')
const data = window.data = { game: [] }
let i, j, clock = 0

for (i = 0, j = 50; i < j; i++) data.game.push({
  clock: 0,
  score: {
    home: 0,
    away: 0
  },
  teams: {
    home: faker.address.city(),
    away: faker.address.city()
  },
  outrageousTackles: 0,
  cards: {
    yellow: 0,
    red: 0
  },
  players: Array.apply(null, Array(5)).map(() => ({
    name: faker.name.findName(),
    effortLevel: Math.round(Math.random() * 10),
    invitedNextWeek: Math.random() > 0.5
  }))
})

setInterval(() => {
  clock++
  let i, j, game, x
  for (i = 0, j = data.game.length; i < j; i++) {
    game = data.game[i]

    x = clock - i * 10
    game.clock = x > 1 ? x : 1

    if (x < 0) continue

    if (Math.random() < 0.05) game.score = { home: game.score.home, away: game.score.away + 1 }
    if (Math.random() < 0.05) game.score = { home: game.score.home + 1, away: game.score.away }

    if (Math.random() < 0.08) game.cards.yellow++
    if (Math.random() < 0.02) game.cards.red++

    if (Math.random() < 0.1) game.outrageousTackles++

    let player = game.players[Math.floor(Math.random() * 5)]
    player.effortLevel = Math.round(Math.random() * 10)
    player.invitedNextWeek = Math.random() > 0.5
  }
}, 100)

template.innerHTML = `
<table>
    <thead>
        <tr>
            <th width="50px">Clock</th>
            <th width="50px">Score</th>
            <th width="200px">Teams</th>
            <th>Outrageous Tackles</th>
            <th width="100px">Cards</th>
            <th width="100px">Players</th>
            <th width="100px"></th>
            <th width="100px"></th>
            <th width="100px"></th>
            <th width="100px"></th>
        </tr>
    </thead>
    <tbody>
        <tr data-id="game">
            <td class="u-center" data-id="clock"></td>
            <td class="u-center" data-id="score"></td>
            <td class="cell--teams" data-id="teams"></td>
            <td class="u-center" data-id="outrageousTackles"></td>
            <td>
                <div class="cards" data-id="cards">
                    <div class="cards__card cards__card--yellow" data-id="yellowCard"></div>
                    <div class="cards__card cards__card--red" data-id="redCard"></div>
                </div>
            </td>
            <td data-id="player">
                <div class="player">
                    <p class="player__name">
                        <span data-id="name"></span>
                        <span class="u-small" data-id="nextWeekMsg"></span>
                    </p>
                    <div data-id="effortClass"></div>
                </div>
            </td>
        </tr>
    </tbody>
</table>
`

document.body.appendChild(simulacra(data, [ template.content, {
  game: [ id`game`, {
    clock: id`clock`,
    score: [ id`score`, (node, value) => `${value.home}-${value.away}` ],
    teams: [ id`teams`, (node, value) => `${value.home} - ${value.away}` ],
    outrageousTackles: id`outrageousTackles`,
    cards: [ id`cards`, {
      yellow: id`yellowCard`,
      red: id`redCard`
    } ],
    players: [ id`player`, {
      name: id`name`,
      invitedNextWeek: [ id`nextWeekMsg`, (node, value) => value ? 'Not coming again' : 'Doing well' ],
      effortLevel: [ id`effortClass`, (node, value) => {
        node.className = 'player__effort ' + (value < 5 ? 'player__effort--low' : 'player__effort--high')
      } ]
    } ]
  } ]
} ]))

function id (strings) {
  return '[data-id="' + strings[0] + '"]'
}
