/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const mainContainer = document.getElementsByClassName("content_container")[0];
let cards  = document.getElementsByClassName("card");
const resetBtn = document.getElementsByClassName("restart")[0];
let openCards = [];
const playAgainContainer= document.getElementsByClassName("play-again-container")[0];
const deckContainer = document.getElementsByClassName("deck")[0];
playAgainContainer.style.textAlign = "center";
playAgainContainer.style.display = "none";
let counterEle = document.getElementById("mv-counter");
let counterVal = parseInt(counterEle.innerHTML.toString());
let availRatings = [];
let  stars = document.getElementsByClassName("star-fa");
let  starCount  = stars.length;
let counter = 0;
let obj = {};

// Shuffle function from http://stackoverflow.com/a/2450976
const shuffle = ((array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
});


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

resetBtn.addEventListener("click", function(e){
    counterEle.innerHTML = 0;
    resetGame(cards);
});

const removeMainClasses = (ele) => {
    ele.style.fontSize = "0px";
    ele.classList.remove("match");
    ele.classList.remove("open");
}

for(let i=0; i<cards.length; i++){
        cards[i].setAttribute("id" , "card_"+i)
        cards[i].addEventListener("click", function(e){
        if(e.target != null){
            addToOpenedList(e);
        }
    });
}

const addToOpenedList = ((e) => {
   const  ele = e.target;
   ele.style.backgroundColor = "#02b3e4"; 
   ele.style.fontSize = "33px";

   if(!isInArray(ele)){
        if(openCards.length>1){
            checkMatch(openCards);
        }
        incCounter();
   }
});

const isInArray = (item) =>{
   if(openCards.length == 0){
       counter =0;
        openCards[0]=item;
   }

    for(let i =0; i<openCards.length; i++){
        if(obj[item.getAttribute("id").toString()]){
            counter++;
            return true;
        }
        else{
            if(counter != 0){
                openCards.push(item);
            }
            counter++;
            obj[item.getAttribute("id").toString()] = true;
            return false;
        }
    }
    return false;
}

const checkMatch = ((openCards) =>{
    let seen = {};
    let list_length = openCards.length;
    let firstPos = 0;
    const property = openCards[0].firstChild.nextElementSibling.className.toString();
    seen[property] = true;
    if (list_length > 1){
        let i = 1
        while(i<list_length){
            list_length -= 1;
            const property = openCards[i].firstChild.nextElementSibling.className.toString();
            if (seen[property]){
                lockMatch(firstPos, i);
                break;
               
            }
            else{
                unMatch(firstPos, i);
                break;
         
            }
            i++;
        }
        removeCardsFromList(firstPos, i);
    } 
});

//remove unmatched cards
const unMatch = ((firstPos, secondPos)=>{
    let newCard = Object.assign({},openCards);
    openCards[firstPos].style.backgroundColor = "#DC143C";
    openCards[secondPos].style.backgroundColor = "#DC143C";
    openCards[firstPos].style.fontSize = "33px";
    openCards[secondPos].style.fontSize = "33px";

    setTimeout(()=>{
        newCard[firstPos].style.backgroundColor = "#2e3d49";
        newCard[secondPos].style.backgroundColor = "#2e3d49";
        newCard[firstPos].style.fontSize = "0px";
        newCard[secondPos].style.fontSize = "0px";
    } , 500);
    obj = {};
});

//remove all cards from the list
const removeCardsFromList = ((firstPos, secondPos) =>{
    openCards.splice(firstPos-1, 1);
    openCards.splice(secondPos-1, 1);
});

//Increment Counter
const incCounter = ()=>{
    counterVal += 1;
    counterEle.innerHTML = counterVal;
    if(doAllMatch() && counterVal == 16){
        reduceRatings();
        reduceRatings();
        starCount = 1;
        setTimeout (()=>{
            showCongratsPage(counterVal);
        },300);
        
    }
    else if(doAllMatch() && counterVal > 16) {
        reduceRatings();
        starCount = 2;
        setTimeout (()=>{
            showCongratsPage(counterVal);
        },300);
    }
};

const getStarRatings = () => {
    let counter = 0;
    for(let i =0; i<availRatings.length; i++){
        const cssProp = window.getComputedStyle(availRatings[i], null).getPropertyValue("background-color").toString();
        if(cssProp != "rgba(0,0,0,0)"){
            counter++;
        }
    }
    return counter;
}

const reduceRatings =  () => {
    for (let i = 0; i<stars.length; i++){
        if(stars[i].classList.toString() != "far fa-star"){
            availRatings.push(stars[i]);
        }
    }
    let lastEle = availRatings[availRatings.length-1];
    lastEle.classList.remove("star-fa");
    lastEle.classList.remove("fa");
    lastEle.classList.add("far") 
}

const showCongratsPage  = ((val) => {
    playAgainContainer.style.display = "block";
    mainContainer.style.display = 'none';
    const headerEle  = document.createElement("h2");
    const headerText = document.createTextNode("Congratulations! You won");
    headerEle.appendChild(headerText);
    playAgainContainer.append(headerEle)

    const paragraph = document.createElement("p");
    const literal  = `With ${val} Moves and ${starCount} Stars`;
    const text  = document.createTextNode(literal);
    paragraph.append(text);
    headerEle.after(paragraph);

    const ele = document.createElement("p");
    const txt = document.createTextNode("Wooooooo!");
    ele.append(txt);
    paragraph.after(ele);

    const btn = document.createElement("button");
    const btnText = document.createTextNode("play again");
    btn.append(btnText);
    btn.style.backgroundColor = "#02ccba";
    btn.addEventListener("click", function(e){
        counterEle.innerHTML = 0;
        mainContainer.style.display = "inline-block";
        playAgainContainer.innerHTML= "";
        for(let i=0; i<cards.length; i++){
            removeMainClasses(cards[i]);
        }
        resetGame(cards);
    });
    ele.after(btn);
});

const doAllMatch = ()=>{
    for(let i=0; i<cards.length; i++){
        const ele = cards[i];
        const cssProp =  window.getComputedStyle(ele, null).getPropertyValue("background-color").toString();
        if(cssProp  != "rgb(2, 204, 186)"){
            return false
        }
    }
    return true;
}

//lock matched elements (openCards[i], openCards[firstPos])
const lockMatch = ((firstPos, secondPos)=>{
    openCards[firstPos].style.backgroundColor = "#02ccba";
    openCards[secondPos].style.backgroundColor = "#02ccba";
    openCards[firstPos].style.pointerEvents = "none";
    openCards[secondPos].style.pointerEvents = "none";
    obj = {};
});

const resetGame = ((array)=>{
    let shuffledArray = shuffle(cards);
    resetStars();
    starCount = 0;
    obj = {};
    counterVal = 0;
    for (let i =0; i<shuffledArray.length; i++){
        deckContainer.appendChild(shuffledArray[i])  ;
        shuffledArray[i].style.backgroundColor = "#2e3d49";
        shuffledArray[i].style.pointerEvents = "auto";
        removeMainClasses(shuffledArray[i]);
        openCards = [];
    }
});

const resetStars = () => {
    let stars = document.getElementsByClassName("fa-star")
    for(let i =0; i<stars.length; i++){
        stars[i].classList.add("star-fa");
        stars[i].classList.add("fa");
        stars[i].classList.remove("far") 
    }
}