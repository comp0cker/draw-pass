import React from 'react';
import Card from './Card';
import {Grid, Badge} from '@material-ui/core';

class Deck extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <Grid container>
                    {this.props.cards.map(obj => 
                        <Grid item>
                            <Badge badgeContent={obj.count} invisible={obj.count === 1} color="primary">
                                <Card 
                                    name={obj.name} 
                                    set={obj.set}
                                    number={obj.number}
                                    id={obj.id}
                                    imageUrl={obj.imageUrl}
                                    supertype={obj.supertype}
                                    subtype={obj.subtype}
                                    class="deck"
                                    view={this.props.view}
                                    count={obj.count}

                                    onCardClick={() => this.props.onDeckCardClick(obj.id)}/>
                            </Badge>
                        </Grid>
                    )}
                </Grid>
            </div>
        );
    }
};

export default Deck;