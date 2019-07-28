import React, { Component } from 'react';
import DeckEditor from './View/DeckEditor';
import Auth from '@aws-amplify/auth';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';

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
                    {this.state.user.length === 0 ? 
                    <Button onClick={() => Auth.federatedSignIn()}>Sign In</Button> :
                    <Typography variant="h5" component="h5">
                        Hello {this.state.user}!
                    </Typography>
                    }

                    <DeckEditor toggleViewState={this.toggleViewState} updateDeck={this.updateDeck} />
                </Container>
            </div>
        );
    }
}

export default App;
