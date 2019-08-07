import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

import {Grid, Badge, Button} from '@material-ui/core';

import _ from 'underscore';

class Game extends React.Component {
    constructor(props) {
        super(props);

        let spreadDeck = [];
        props.deck.forEach(card => {
            for (let count = 0; count < card.count; count += 1) {
                spreadDeck.push(card);
            }
        });

        // Shuffle deck to start game :)
        spreadDeck = _.shuffle(spreadDeck);

        this.state = {
            deck: spreadDeck,
            hand: [],
            discard: [],
            prizes: []
        };
    }

    setupGame() {
        this.drawCard(7);
        this.setPrize(6);
    }

    drawCard(num) {
        if (this.state.deck.length === 0) {
            // do some cool alert thing
            return;
        }

        let newHand = [...this.state.hand, this.state.deck[this.state.deck.length - num]];
        let newDeck = this.state.deck.slice(0, this.state.deck.length - num);

        this.setState({
            hand: newHand,
            deck: newDeck
        });
    }

    takePrize() {
        if (this.state.prizes.length === 0) {
            // do some cool alert thing
            return;
        }

        let newHand = [...this.state.hand, this.state.prizes[this.state.prizes.length - 1]];
        let newPrizes = this.state.prizes.slice(0, this.state.prizes.length - 1);

        this.setState({
            hand: newHand,
            prizes: newPrizes
        });
    }

    setPrize(num) {
        if (this.state.deck.length === 0) {
            // do some cool alert thing
            return;
        }

        let newDeck = [...this.state.deck, this.state.prizes[this.state.prizes.length - num]];
        let newPrizes = this.state.prizes.slice(0, this.state.prizes.length - num);

        this.setState({
            deck: newDeck,
            prizes: newPrizes
        });
    }

    renderCard(card) {
        return (
            <Draggable
                defaultPosition={{x: 0, y: 0}}
                position={null}>
                <div>
                    <img draggable="false" src={card.imageUrl}></img>
                </div>
            </Draggable>
        )
    }

    renderHand() {
        return (
            <Grid container>
                {this.state.hand.map(card =>
                    <Grid item>
                        {this.renderCard(card) }
                    </Grid>   
                )}
            </Grid>
        );
    }

    renderDeck() {
        return (
            <Badge badgeContent={this.state.deck.length} color="primary">
                <img onClick={() => this.drawCard(1)} src="https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg"></img>
            </Badge>
        );
    }

    renderPrizes() {
        return (
            <Badge badgeContent={this.state.prizes.length} color="primary">
                <img onClick={() => this.takePrize()} src="https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg"></img>
            </Badge>
        )
    }
    
    render() {
        console.log(this.state.deck);
        return(
            <div>
                {this.renderDeck()}
                {this.renderPrizes()}
                {this.renderHand()}
            </div>
        );
    }
}

export default Game;