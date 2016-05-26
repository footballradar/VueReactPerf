import faker from "faker";
import Rx from "rx";

const EVENT_INTERVAL = 1000;

export function createGames(noOfGames = 5) {
    const games = Array.apply(null, { length: noOfGames }).map(Number.call, Number)
        .map(createGame);

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
    game.clock = game.clock + 1;

    maybeUpdate(5, () => game.score.home = game.score.home + 1);
    maybeUpdate(5, () => game.score.away = game.score.away + 1);

    maybeUpdate(8, () => game.cards.yellow = game.cards.yellow + 1);
    maybeUpdate(2, () => game.cards.red = game.cards.red + 1);

    maybeUpdate(10, () => game.outrageousTackles = game.outrageousTackles + 1);

    const randomPlayerIndex = randomNum(0, 4);
    const effortLevel = randomNum();
    const invitedNextWeek = faker.random.boolean();

    const previousEffortLevel = game.players[randomPlayerIndex].effortLevel;
    const previousInvitedNextWeek = game.players[randomPlayerIndex].invitedNextWeek;

    if (previousEffortLevel !== effortLevel || previousInvitedNextWeek !== invitedNextWeek) {
        game.players[randomPlayerIndex].effortLevel = effortLevel;
        game.players[randomPlayerIndex].invitedNextWeek = invitedNextWeek;
        game.players[randomPlayerIndex] = Object.assign({}, game.players[randomPlayerIndex]);
    }

    return Object.assign({}, game);
}

function generateFakeGame() {
    return {
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
    };
}

function generateFakePlayer() {
    return {
        name: faker.name.findName(),
        effortLevel: randomNum(),
        invitedNextWeek: faker.random.boolean()
    }
}

function maybeUpdate(prob, fn) {
    const num = randomNum(0, 100);
    if (num <= prob) {
        fn();
    }
}

function randomNum(min, max) {
    min = min || 0;
    max = max || 10;
    return faker.random.number({
        "min": min,
        "max": max
    });
}
