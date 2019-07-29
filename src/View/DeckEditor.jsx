import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {CheckCircle, Info, Close, Warning} from '@material-ui/icons';
import {TextField, Button, FormControl, List, ListItem, ListItemText, Select, MenuItem, InputLabel, Badge} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import Deck from '../Card/Deck';
import Cookies from 'js-cookie';

const variantIcon = {
    success: CheckCircle,
    warning: Warning,
    error: Error,
    info: Info,
  };
  
  const useStyles1 = makeStyles(theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }));
  
  function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
            <Close className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
  }
  
  MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
  };

class DeckEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            cardInput: "",
            cardInputResults: [],
            renderDeck: false,
            loadedCards: [],
            searchResults: [],
            renderSearchResults: true,
            cardSaveOpen: false,
            saveDeckName: '',
            snackbarOpen: false,
            savedDecks: {},
            deleteConfirmationOpen: false
        };

        this.deleteCard = this.deleteCard.bind(this);
    }

    loadCookies() {
        this.setState({
            savedDecks: Cookies.getJSON()
        });
    }

    componentDidMount() {
        this.loadCookies();
    }

    handleChange(e) {
        this.setState({
            cardInput: e.target.value,
            renderSearchResults: true
        })
        
        fetch(this.getCardName(e.target.value))
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    searchResults: result.cards.map(card => {return card.name + " (" + card.set + " - " + card.number + ")"}) 
                });
            }
        )
        
    }

    getCardName(name) {
        // Parse name
        name = name.split(" GX").join("-GX");
        name = name.split(" EX").join("-EX");
        name = name.split(" ").join("+");

        var url = "https://api.pokemontcg.io/v1/cards/?name=" + name;
        return url;
    }

    getCardUrl(name, set, number) {
        // Parse name
        name = name.split(" GX").join("-GX");
        name = name.split(" EX").join("-EX");
        name = name.split(" ").join("+");

        var url = "https://api.pokemontcg.io/v1/cards/?name=" + name + "&set=" + set + "&number=" + number;
        return url;
    }

    loadCard(val) {
        let name = val.split(" (")[0];
        let set = val.split(" (")[1].split(" - ")[0];
        let number = val.split(" (")[1].split(" - ")[1].split(")")[0];

        fetch(this.getCardUrl(name, set, number))
        .then(res => res.json())
        .then(
            result => {
                if (this.state.loadedCards.filter(card => card.imageUrl === result.cards[0].imageUrl).length > 0) {
                    var temp = this.state.loadedCards;
                    var duplicateCard = temp.filter(card => card.imageUrl === result.cards[0].imageUrl)[0];

                    if (duplicateCard.count === 4 && !(duplicateCard.subtype === "Basic" && duplicateCard.supertype === "Energy")) {
                        this.setState({
                            snackbarOpen: true,
                            snackbarMessage: "You can't add more than 4 " + duplicateCard.name + "s!",
                            snackbarVariant: "warning",
                        });
                    }
                    else {
                        duplicateCard.count += 1;

                        this.setState({ 
                            loadedCards: temp,
                            cardInput: val,
                            renderSearchResults: false
                        }, () => {this.props.updateDeck(this.state.loadedCards);});
                    }
                }
                else {
                    let cardObj = {
                        "name": name,
                        "set": set,
                        "number": number,
                        "id": Date.now(),
                        "imageUrl": result.cards[0].imageUrl,
                        "subtype": result.cards[0].subtype,
                        "supertype": result.cards[0].supertype,
                        "count": 1
                    };

                    this.setState({ 
                        loadedCards: [...this.state.loadedCards, cardObj] ,
                        cardInput: val,
                        renderSearchResults: false
                    }, () => {this.props.updateDeck(this.state.loadedCards);})
                }
            }
        )
    }

    deleteCard(id) {;
        let newCards = this.state.loadedCards.filter(obj => obj.id != id);
        console.log(newCards);
        this.setState({ loadedCards: newCards }, () => {this.props.updateDeck(this.state.loadedCards);})
    }

    loadDeck(deck) {
        this.setState({
            loadedCards: Cookies.getJSON(deck),
            snackbarOpen: true,
            snackbarMessage: deck + " loaded!",
            snackbarVariant: "success",
            saveDeckName: deck
        });
    }

    saveDeck() {
        Cookies.set(this.state.saveDeckName, this.state.loadedCards);
        this.setState({
            snackbarOpen: true,
            snackbarMessage: "Deck saved!",
            snackbarVariant: "success"
        });

        // Close the Dialog after we're done :)
        this.handleClose();

        // Refresh the list of decks
        this.loadCookies();
    }

    newDeck() {
        this.wipeDeck();
        this.setState({
            saveDeckName: '',
            snackbarOpen: true,
            snackbarMessage: "New deck made!",
            snackbarVariant: "info"
        });
    }

    handleSaveDeckInput(e) {
        this.setState({
            saveDeckName: e.target.value
        })
    }

    handleClose() {
        this.setState({
            cardSaveOpen: false
        })
    }

    handleDeleteCardClose() {
        this.setState({
            deleteConfirmationOpen: false
        })
    }

    handleSnackbarClose() {
        this.setState({
            snackbarOpen: false
        })
    }

    wipeDeck() {
        this.setState({ loadedCards: [] })
    }

    deleteSavedDeck() {
        Cookies.remove(this.state.saveDeckName);
        this.wipeDeck();
        this.handleDeleteCardClose();
        this.setState({
            snackbarOpen: true,
            snackbarMessage: this.state.saveDeckName + " deleted!",
            snackbarVariant: "success",
            saveDeckName: ""
        });

        // Refresh the list of decks
        this.loadCookies();
    }

    renderCardInputSuggestions() {
        return (
            this.state.renderSearchResults === false ? null :
                <List component="nav" aria-label="main mailbox folders">
                    {this.state.searchResults.map(result => 
                        <ListItem button onClick={() => this.loadCard(result)}>
                            <ListItemText primary={result} />
                        </ListItem>)}
                </List>
            
        );
    }

    renderSnackbar() {
        return (
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={this.state.snackbarOpen}
                autoHideDuration={6000}
                onClose={() => this.handleSnackbarClose()}
            >
                <MySnackbarContentWrapper
                onClose={() => this.handleSnackbarClose()}
                variant={this.state.snackbarVariant}
                message={this.state.snackbarMessage}
                />
            </Snackbar>
        );
    }

    renderDeckSaveDialog() {
        return (
        <Dialog open={this.state.cardSaveOpen} onClose={() => this.handleCardClose()} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Choose a deck name</DialogTitle>
            <DialogContent>
            <DialogContentText>
                eg. Gas Deck
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                onInput={(e) => this.handleSaveDeckInput(e)}
                id="name"
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={() => this.saveDeck()} color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>
        )
    }

    renderDeckDeleteDialog() {
        return (
        <Dialog open={this.state.deleteConfirmationOpen} onClose={() => this.handleDeleteCardClose()} aria-labelledby="form-dialog-delete-title">
            <DialogTitle id="form-dialog-delete-title">Are you sure you want to delete {this.state.saveDeckName}?</DialogTitle>
            <DialogActions>
            <Button variant="contained" onClick={() => this.deleteSavedDeck()} color="primary">
                Yes
            </Button>
            <Button onClick={() => this.handleDeleteCardClose()} color="primary">
                No
            </Button>
            </DialogActions>
        </Dialog>
        )
    }

    renderLoadDeckSelect() {
        return(
            <form autoComplete="off" style={{
                display: 'flex',
                flexWrap: 'wrap',
              }}>
                <FormControl style={{minWidth: 120}}>   
                    <InputLabel htmlFor="age-simple">Load Deck</InputLabel>
                    <Select
                        value='sup'
                        onChange={(e) => this.loadDeck(e.target.value)}
                        inputProps={{
                            name: 'age',
                            id: 'age-simple',
                        }}
                        >
                        {Object.entries(this.state.savedDecks).map(deck => <MenuItem value={deck[0]}>{deck[0]}</MenuItem>)}
                    </Select>
                </FormControl>
            </form>
        )
    }

    kek() {
        this.setState({
            snackbarOpen: true,
            snackbarMessage: "no game yet sry XD",
            snackbarVariant: "info"
        });
    }

    render() {
        return (
            <div>
                <TextField
                    label="Enter a card"
                    placeholder="eg Pikachu" 
                    onInput={(e) => this.handleChange(e)} />

                {this.renderCardInputSuggestions()}
                {this.renderLoadDeckSelect()}

                <Button variant="contained" onClick={() => this.loadCard(this.state.cardInput)}>Insert another</Button>
                <Button variant="contained" onClick={() => this.wipeDeck()}>Clear deck</Button>
                <Button variant="contained" onClick={() => this.newDeck()}>New deck</Button>
                <Button variant="contained" onClick={() => this.state.saveDeckName === '' ? this.setState({ cardSaveOpen: true }) : this.saveDeck()}>Save deck</Button>
                {this.state.saveDeckName === '' ? null : <Button variant="contained" onClick={() => this.setState({ deleteConfirmationOpen: true })}>Delete deck</Button>}

                <Button variant="contained" color="primary" onClick={() => this.kek()}>Play the game</Button>

                {this.renderDeckSaveDialog()}
                {this.renderDeckDeleteDialog()}
                {this.renderSnackbar()}

                <Deck 
                    cards={this.state.loadedCards} 
                    onDeckCardClick={this.deleteCard}
                    view={true}
                />
            </div>
        );
    }
};

export default DeckEditor;

// 4 of each card
// 60 card cap