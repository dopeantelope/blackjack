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

document.querySelector('button').addEventListener('click', drawCard)

function drawCard(){
  const url = `http://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        boardInit(data)
      })
      .catch(err => {
          console.log(`error ${err}`)
      });

}

function boardInit(data) {
  // deals the cards with a dealer card face down
  document.querySelector('h2').style.display = 'none'
  document.querySelector('.title-screen').style.display = 'none'
  document.querySelector('.player-first').src = data.cards[0].image
  document.querySelector('.dealer-first').src = data.cards[1].image
  document.querySelector('.player-second').src = data.cards[2].image
  document.querySelector('.dealer-second').src = "img/back-card.jpeg"
  document.querySelector('.dealer-second').style.display = 'inline-block'

  let p1 = convertToNum((data.cards[0].value))
  let p2 = convertToNum((data.cards[2].value))
  let d1 = convertToNum((data.cards[1].value))

  let playerTotal = p1 + p2
  let dealerTotal = d1

  score(playerTotal, dealerTotal)

  // stand
  document.getElementById('stand').onclick = function() {
    document.querySelector('.dealer-second').src = data.cards[3].image
    document.querySelector('h2').style.display = 'inline-block'
    document.querySelector('h2').innerText = `Dealer Wins!`

  }

  function score(playerTotal, dealerTotal) {
    document.querySelector('.dealer-count').style.display = 'flex'
    document.querySelector('.player-count').style.display = 'flex'
    document.querySelector('.dealer-count').innerText = dealerTotal
    document.querySelector('.player-count').innerText = playerTotal
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