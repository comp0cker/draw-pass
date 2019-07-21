import React, { Component } from 'react';
import DeckEditor from './View/DeckEditor';

class App extends Component {
    constructor() {
        super();
        this.state = {
            view: "deckEdit",
            deck: []
        }

        this.toggleViewState = this.toggleViewState.bind(this);
        this.updateDeck = this.updateDeck.bind(this);
    }

    toggleViewState(view) {
        this.setState({
            view: view
        })
    }

    updateDeck(deck) {
        this.setState({ deck: deck });
    }

    render() {
        return (
            <DeckEditor toggleViewState={this.toggleViewState} updateDeck={this.updateDeck} />
        );
    }
}

export default App;
