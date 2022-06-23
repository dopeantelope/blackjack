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
  document.querySelector('.player-first').src = data.cards[0].image
  document.querySelector('.dealer-first').src = data.cards[1].image
  document.querySelector('.player-second').src = data.cards[2].image
  document.querySelector('.dealer-second').src = "img/back-card.jpeg"
  document.querySelector('.dealer-second').style.display = 'inline-block'
}

