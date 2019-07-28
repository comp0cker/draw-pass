import React, { Component } from 'react';
import DeckEditor from './View/DeckEditor';
import Auth from '@aws-amplify/auth';

class App extends Component {
    constructor() {
        super();
        this.state = {
            view: "deckEdit",
            deck: [],
            user: ''
        }

        this.toggleViewState = this.toggleViewState.bind(this);
        this.updateDeck = this.updateDeck.bind(this);
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser()
            .then(user => 
                this.setState({
                    user: user.attributes.email
                })
            );
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
            <div>
                <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
                <div>Hello {this.state.user}!</div>
                <DeckEditor toggleViewState={this.toggleViewState} updateDeck={this.updateDeck} />
            </div>
        );
    }
}

export default App;
