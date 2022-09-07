class Cards {
  constructor() {
    this.cards = [];
    this.count = 0;
  }
    deal(card1, card2) {
      this.cards.push(card1, card2)
    }
    addCard(card) {
      this.cards.push(card)
    }
    addCount(value) {
      this.count += +value
    }

    initialCount() {
      let valuesArray = playerCards.cards.map(element => element.value)
      this.convertToNum(valuesArray)
    }

    convertToNum(card) {
      card.forEach(element => {
        if (element === 'JACK' || element === 'QUEEN' || element === 'KING') {
          this.addCount(10)
        } else if (element === 'ACE'){
          this.addCount(11)
          console.log('fuck its an ace')
        } else {
          this.addCount(element)
        }
      })
    }

    checkBlackjack() {
      if (this.count == 21) {
        document.querySelector('.result').style.display = 'flex'
        document.querySelector('.result').innerText = 'BlackJack!'

      }
    }
  }

const playerCards = new Cards()
const dealerCards = new Cards()
let deckId = ''

async function getDeck(){
  try {
    const response = await fetch('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');
    const deck = await response.json();
    deckId = deck.deck_id
    dealCards(deckId)

  } catch (err) {
    console.log(`error ${err}`);
  }
}

getDeck()


async function dealCards(deckId){
  try {
    const response = await fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`);
    const deal = await response.json();
    const gameDisplay = new GameDisplay(deal)
    document.getElementById('deal-button').addEventListener('click', gameDisplay.deal)
    document.getElementById('stand-button').addEventListener('click', gameDisplay.stand)
    document.getElementById('hit-button').addEventListener('click', gameDisplay.hit)
  } catch (err) {
    console.log(`error ${err}`);
  }
}


function GameDisplay(deal) {
  this.result = document.querySelector('.result')
  this.titleScreen = document.querySelector('.title-screen')
  this.playerCardDisplay = document.querySelector('.player-cards')
  this.playerFirstCard = document.querySelector('.playerFirstCard')  
  this.playerSecondCard = document.querySelector('.playerSecondCard')  
  this.dealerFirstCard = document.querySelector('.dealerFirstCard')  
  this.dealerSecondCard = document.querySelector('.dealerSecondCard')  
  this.dealerCardDisplay = document.querySelector('.dealer-cards')
  this.dealerCount = document.querySelector('.dealer-count')
  this.playerCount = document.querySelector('.player-count')
  this.dealButton = document.querySelector('#deal-button')
  this.hitButton = document.querySelector('#hit-button')
  this.standButton = document.querySelector('#stand-button')

  this.deal = () => {
    this.titleScreen.style.display = 'none'
    playerCards.deal(deal.cards[0], deal.cards[2])
    dealerCards.deal(deal.cards[1], deal.cards[3])
    playerCards.initialCount()
    playerCards.checkBlackjack()
    
    this.playerFirstCard.src = playerCards.cards[0].image
    this.dealerFirstCard.src = dealerCards.cards[0].image
    this.playerSecondCard.src = playerCards.cards[1].image
    this.dealerSecondCard.src = "img/back-card.jpeg"
    this.dealerSecondCard.style.display = 'inline-block'
    this.showPlayerScore()
    this.showDealerScore()
  }

  this.hit = () => {
    async function getOneCard(){
      try {
        const response = await fetch(`http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const oneCard = await response.json();
        playerCards.addCard(oneCard.cards[0]);
        console.log(playerCards.cards)
      } catch (err) {
        console.log(`error ${err}`);
      }
    }
    getOneCard()
    this.appendPlayerCard()
    this.updatePlayerScore()

  }

  this.appendPlayerCard = () => {
    const newPlayerCard = document.createElement('img')
    newPlayerCard.src = playerCards.cards[playerCards.cards.length - 1].image
    document.querySelector('#player-cards').appendChild(newPlayerCard)
  }

  this.appendDealerCard = () => {
    const newDealerCard = document.createElement('img')
    newDealerCard.src = dealerCards.cards[dealerCards.cards.length - 1].image
    document.querySelector('#dealer-cards').appendChild(newCard)
  }

  this.showPlayerScore = () => {
    this.playerCount.innerText = playerCards.count
    this.playerCount.style.display = 'flex'
  }

  this.showDealerScore = () => {
    this.dealerCount.innerText = dealerCards.count
    this.dealerCount.style.display = 'flex'
  }

  this.updatePlayerScore = () => {
    this.getCardValue(playerCards.cards[playerCards.cards.length - 1])
    this.showPlayerScore()
  }

  this.updateDealerScore = () => {
    dealerCards.addCount(19)
    this.showDealerScore()
  }

  this.getCardValue = (card) => {
    let value = card.value

    if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
      value = 10
    } else if (value === 'ACE'){
        if (playerCards.count >= 11) {
          value = 1
        } else {
          value = 11
        }
    }

    if (value + playerCards.count > 21) {
      playerCards.addCount(+value)
      this.stand()
    } else {
      playerCards.addCount(+value)
    }

  }


  this.stand = () => {
    console.log('sttoood')
    this.result.style.display = 'flex'
    this.result.innerText = 'Bust!'

  }
}
