import React from 'react';

class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.cardBack || (!this.props.view && (this.props.class === "deck" || this.props.class === "prize"))) {
            return (
                <img 
                src="https://upload.wikimedia.org/wikipedia/en/3/3b/Pokemon_Trading_Card_Game_cardback.jpg"
                className={this.props.class}
                height="139.583px"
                width="100px"
                onClick={() => this.props.onCardClick() }/>
            );
        }
        return (
            <img 
                src={this.props.imageUrl} 
                className={this.props.class}
                height="139.583px"
                width="100px"
                onClick={() => this.props.onCardClick() }/>
        );
    }
}

export default Card;