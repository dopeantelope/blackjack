import * as s from './selectorvariables.js'

let deckId = ''
getFetch()
function getFetch(){
  const url = 'http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6'

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        deckId = data.deck_id
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

document.querySelector('button').addEventListener('click', deal)

function deal(){
  const url = `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        reset()
        boardInit(data)
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

}

function reset() {
  s.playerFirstCard.src = ''
  s.dealerFirstCard.src = ''
  s.playerSecondCard.src = ''
  s.dealerSecondCard.src = ''
  s.dealerSecondCard.style.display = ''
}

function boardInit(data) {
  // deals the cards with a dealer card face down
  s.result.style.display = 'none'
  s.titleScreen.style.display = 'none'
  s.playerFirstCard.src = data.cards[0].image
  s.dealerFirstCard.src = data.cards[1].image
  s.playerSecondCard.src = data.cards[2].image
  s.dealerSecondCard.src = "img/back-card.jpeg"
  s.dealerSecondCard.style.display = 'inline-block'

  let p1 = convertToNum((data.cards[0].value))
  let p2 = convertToNum((data.cards[2].value))
  let d1 = convertToNum((data.cards[1].value))

  let playerTotal = p1 + p2
  let dealerTotal = d1

  playerScore(playerTotal)
  dealerScore(dealerTotal)

  s.hitButton.addEventListener('click', hitMe)

  function hitMe() {
    const url = `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
  
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
          console.log(data)
          const newCard = document.createElement('img')
          newCard.src = data.cards[0].image
          document.querySelector('.player-cards').appendChild(newCard)
          playerTotal += convertToNum(data.cards[0].value)
          playerScore(playerTotal)

        })
        .catch(err => {
            console.log(`error ${err}`)
        });
  
  }




  // stand
  document.getElementById('stand').addEventListener('click', stand)
  
  function stand() {
    s.dealerSecondCard.src = data.cards[3].image
    s.result.style.display = 'inline-block'
    dealerTotal += convertToNum(data.cards[3].value)
    dealerScore(dealerTotal)
    s.result.innerText = `Dealer Wins!`

  }

  function playerScore (playerCount) {
    s.playerCount.style.display = 'flex'
    s.playerCount.innerText = playerTotal
    if (playerCount > 21) {
      bust()
    }
  }

  function dealerScore (dealerCount) {
    s.dealerCount.style.display = 'flex'
    s.dealerCount.innerText = dealerTotal
  }

  function bust() {
    s.result.style.display = 'inline-block'
    s.result.innerText = 'Bust!'
  }

}

function convertToNum(val){
  if(val === 'ACE'){
    return 11
  }else if(val === 'KING'){
    return 10
  }else if(val === 'QUEEN'){
    return 10
  }else if(val === 'JACK'){
    return 10
  }else{
    return Number(val)
  }
}