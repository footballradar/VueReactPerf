import faker from "faker";
import Rx from "rx";
import Immutable from "immutable";

const EVENT_INTERVAL = 100;

export function createGames(noOfGames = 5) {
    const games = Immutable.Range(0, noOfGames)
        .map(createGame)
        .toArray();

    return Rx.Observable.combineLatest(...games, (...args) => args);
}

export function createGame(delay) {
    const initialGame = generateFakeGame();
    return Rx.Observable.interval(EVENT_INTERVAL)
        .flatMap((i) => {
            const $ = Rx.Observable.of(i);
            return i === 0 ? $ : $.delay(delay * 1000);
        })
        .scan((game, tick) => {
            return updateGame(game);
        }, initialGame)
        .startWith(initialGame)
}

function updateGame(game) {
    game = game.update("clock", (sec) => sec + 1);

    game = maybeUpdate(5, game, () => game.updateIn(["score", "home"], (s) => s + 1));
    game = maybeUpdate(5, game, () => game.updateIn(["score", "away"], (s) => s + 1));

    game = maybeUpdate(8, game, () => game.updateIn(["cards", "yellow"], (s) => s + 1));
    game = maybeUpdate(2, game, () => game.updateIn(["cards", "red"], (s) => s + 1));

    game = maybeUpdate(10, game, () => game.update("outrageousTackles", (t) => t + 1));

    const randomPlayerIndex = randomNum(0, 4);
    const effortLevel = randomNum();
    const invitedNextWeek = faker.random.boolean();

    game = game.updateIn(["players", randomPlayerIndex], (player) => {
        return player.set("effortLevel", effortLevel).set("invitedNextWeek", invitedNextWeek);
    });

    return game;
}

function generateFakeGame() {
    return Immutable.fromJS({
        id: faker.random.uuid(),
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
        players: [1, 2, 3, 4, 5].map(generateFakePlayer)
    });
}

function generateFakePlayer() {
    return {
        name: faker.name.findName(),
        effortLevel: randomNum(),
        invitedNextWeek: faker.random.boolean()
    }
}

function maybeUpdate(prob, game, fn) {
    const num = randomNum(0, 100);
    return num <= prob ? fn(game) : game;
}

function randomNum(min, max) {
    min = min || 0;
    max = max || 10;
    return faker.random.number({
        "min": min,
        "max": max
    });
}
