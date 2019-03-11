/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

const cards  = document.getElementsByClassName("card");
const openCards =  [];
for(let i=0; i<cards.length; i++){
        cards[i].addEventListener("click", function(e){
        if(e.target != null){
          addToOpenedList(e.target);
        }
    });
}

const addToOpenedList = ((ele) => {
    openCards.push(ele);
    checkMatch(openCards);
});

const checkMatch = ((openCards) =>{
    let seen = {};
    let list_length = openCards.length;
    let firstPos = 0;
    let countMatch = 0;
    if (list_length > 1){
        let i = 0
        while(i<list_length){
            list_length -= 1;
            const property = openCards[i].className.toString();
            console.log(property);
            if (seen[property]){
                lockMatch(firstPos, i);
                break;
            }
            else{
                seen[property] = true;
                firstPos = i;
            }
            i++;
        }
        removeCards(openCards);
        incCounter();
        //checkAllMatch()
    }
    
});

//remove unmatched cards
const removeCards = ((openCards)=>{
    for(let i =0; i<openCards.length; i++){
        openCards.pop();
        openCards[i].style.backgroundColor = "#2e3d49";
    }
});

//Increment Counter
const incCounter = ()=>{
    let ele = document.getElementById("mv-counter")
    let val = parseInt(ele.innerHTML.toString());
    val += 1;
    ele.innerHTML = val;
    
};


//lock matched elements (openCards[i], openCards[firstPos])
const lockMatch = ((firstPos, secondPos)=>{
    console.log("here");
    openCards[firstPos].classList.add("match");
    openCards[secondPos].classList.add("match");

});

//check if all the cards are matched

//const checkAllMatch
