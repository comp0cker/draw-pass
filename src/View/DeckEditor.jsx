import React from 'react';
import {TextField, Button} from '@material-ui/core';

class DeckEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            cardInput: "",
            cardInputResults: [],
            renderDeck: false,
            loadedCards: [],
            searchResults: []
        };

        this.deleteCard = this.deleteCard.bind(this);
    }

    handleChange(e) {
        this.setState({
            cardInput: e.target.value
        })
        
        fetch(this.getCardUrl(e.target.value))
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    searchResults: result.cards.map(card => {return card.name + " (" + card.set + " - " + card.number + ")"}) 
                });
            }
        )
        
    }

    getCardUrl(input) {
        input = input.split(" GX").join("-GX");
        input = input.split(" EX").join("-EX");

        var url = "https://api.pokemontcg.io/v1/cards/?name=";

        var name = input.split(" ").join("+");
        return url + name;
    }

    loadCard(val) {
        let name = val.split(" (")[0]
        let set = val.split(" (")[1].split(" - ")[0]
        let number = val.split(" (")[1].split(" - ")[1].split(")")[0]

        fetch(this.getCardUrl(name, set, number))
        .then(res => res.json())
        .then(
            result => {
                let cardObj = {
                    "name": name,
                    "set": set,
                    "number": number,
                    "id": Date.now(),
                    "imageUrl": result.cards[0].imageUrl,
                    "supertype": result.cards[0].supertype
                };
                
                this.setState({ 
                    loadedCards: [...this.state.loadedCards, cardObj] ,
                    cardInput: val
                }, () => {this.props.updateDeck(this.state.loadedCards);})
            }
        )
    }

    deleteCard(id) {;
        let newCards = this.state.loadedCards.filter(obj => obj.id != id);
        console.log(newCards);
        this.setState({ loadedCards: newCards }, () => {this.props.updateDeck(this.state.loadedCards);})
    }

    render() {
        return (
            <div>
                <TextField
                    label="Enter a card"
                    placeholder="eg Pikachu" 
                    onInput={(e) => this.handleChange(e)} />

                <Button variant="contained" onClick={() => this.loadCard(this.state.cardInput)}>Insert another</Button>
                <Button variant="contained" color="primary" onClick={() => this.props.toggleViewState("game")}>Play the game</Button>

                {
                    this.state.searchResults.map(result => <p>{result}</p>)
                }
            </div>
        );
    }
};

export default DeckEditor;