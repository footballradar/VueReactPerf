import React from "react";
import ReactDOM from "react-dom";
//import Perf from "react-addons-perf";
//window.ReactPerf = Perf;

import {createGames} from "./react.data.withoutImmutable";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: []
        }
    }

    componentDidMount() {
        const games$ = createGames(500);
        this.sub = games$.subscribe((games) => this.setState({ games }));
    }

    componentWillUnmount() {
        this.sub.dispose();
    }

    render() {
        return <Games games={this.state.games} />;
    }
}

class Games extends React.Component {
    render() {
        const games = this.props.games.map((game, i) => <Game key={i} game={game} />);

        return (
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
                    {games}
                </tbody>
            </table>
        )
    }
}

class Game extends React.Component {

    shouldComponentUpdate(nextProps){
        return nextProps.game !== this.props.game;
    }

    render() {
        const game = this.props.game;
        const score = `${game.score.home}-${game.score.away}`;
        const teams = `${game.teams.home} - ${game.teams.away}`;

        const yellowCards = game.cards.yellow;
        const redCards = game.cards.red;

        return (
            <tr>
                <td className="u-center">{game.clock}</td>
                <td className="u-center">{score}</td>
                <td className="cell--teams">{teams}</td>
                <td className="u-center">{game.outrageousTackles}</td>
                <td>
                    <div className="cards">
                        <div className="cards__card cards__card--yellow">{yellowCards}</div>
                        <div className="cards__card cards__card--red">{redCards}</div>
                    </div>
                </td>
                {game.players.map((p, i) => <Player key={i} player={p} />) }
            </tr>
        )
    }
}

class Player extends React.Component {

    shouldComponentUpdate(nextProps){
        return nextProps.player !== this.props.player;
    }
    
    render() {
        const player = this.props.player;

        const effortClass = player.effortLevel < 5 ? "player__effort--low" : "player__effort--high";

        return (
            <td>
                <div className="player">
                    <p className="player__name">
                        <span>{player.name}</span>
                        <span className="u-small">
                            {player.invitedNextWeek ? "Not coming again" : "Doing well"}
                        </span>
                    </p>

                    <div className={"player__effort " + effortClass}>
                    </div>
                </div>
            </td>
        )
    }
}

ReactDOM.render(React.createElement(App), document.querySelector("#app"));
