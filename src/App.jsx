import React, { Component } from 'react';
import DeckEditor from './DeckEditor';
import Game from './Game';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonAppBar from './Components/ButtonAppBar'

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
                <Container maxWidth="md">
                    <ButtonAppBar user={this.state.user}/>
                    {
                        this.state.view === 'deckEdit' ?
                            <DeckEditor toggleViewState={this.toggleViewState} updateDeck={this.updateDeck} />
                            : <Game deck={this.state.deck}/>
                    }
                </Container>
            </div>
        );
    }
}

export default App;
