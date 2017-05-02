const linksList = document.querySelector('.links');
const addItems = document.querySelector('.add-items');
const checkAll = document.querySelector('.check-all');
const uncheckAll = document.querySelector('.uncheck-all');
const deleteAll = document.querySelector('.delete-all');
const linkTextBox = document.querySelector('[name=linkTxt]');
const error = document.querySelector('.error');
let links =  JSON.parse(localStorage.getItem('links')) || [];
const starIncrement = 20;



function isURL(str) {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)?(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.startsWith(`file:///C:/`) || str.length < 2083 && url.test(str) ;
}

//add a link
function addItem(e){
  e.preventDefault();
  const text = linkTextBox.value;
  if(!isURL(text)){
    reportError();
    return;
  }
  console.log(text);
  const link = {
    text,
    timesClicked: 0
  }
  links.push(link);
  localStorage.setItem('links',JSON.stringify(links));
  populateLinks(links,linksList);
  this.reset();
  linkTextBox.focus = true;
}

//report error not a link
function reportError(){

  error.style.display ='flex';
  setTimeout(()=>{
    error.style.display ='none';
  },1500);

}
//display the links
function populateLinks(links=[],linksList){
  linksList.innerHTML = links.map((link,i)=>{
    return `
    <li>
    <span class="fa fa-star  " data-star=star${i}></span>
    <label for="item${i}">${link.text}</label>
    <span data-index=${i} class="fa fa-close options"></span>
    <span data-index=${i} class="fa fa-external-link options"></span>
    </li>
    `
  }).join('');

  if(links.length === 0){
    linksList.innerHTML = '<p class="links-heading">Add Your Links...</p>';
  }
  links.forEach((link,i) =>{
    if(link.timesClicked !== 0){
      starRating(i,starIncrement);
    }
  });
}
//toggle a link
function handleLinkEvents(e){
    if(e.target.matches('label')) return;

    if(e.target.matches('span')){
        const span = e.target;
        const index =  span.dataset.index;
        const star = document.querySelector(`[data-star=star${index}]`);
        console.log(star);

        //copy link to clipboard
        if(span.classList.contains('fa-copy')){console.log("Link copied: ",links[index].text);}
        //delete a link
        if(span.classList.contains('fa-close')){
           links.splice(index,1);
          localStorage.setItem('links',JSON.stringify(links));
           populateLinks(links,linksList);
          console.table(links);
        }
        //open the link on a new tab
        if(span.classList.contains('fa-external-link')){
          var a = document.createElement('a');
          a.target = "_blank";
          a.href = (links[index].text.includes("://")) ? links[index].text : "http://"+(links[index].text).trim();
          a.click();

          //count times clicked
            links[index].timesClicked +=1;
            starRating(index,starIncrement);
            localStorage.setItem('links',JSON.stringify(links));
        }

    }


}

//color the stars
function starRating(index,starIncrement){
  const starPer = (links[index].timesClicked >= 100) ? 100 : links[index].timesClicked * starIncrement;
  document.styleSheets[1].addRule(`[data-star=star${index}]::after`, `width:${starPer}%`);
}

addItems.addEventListener('submit',addItem);
linksList.addEventListener('click',handleLinkEvents);

deleteAll.addEventListener('click',()=>{
  console.log('hey');
  linksList.innerHTML='';
  links = [];
  localStorage.removeItem('links');
});

populateLinks(links,linksList);

//hide error on click
const html = document.querySelector('html');
html.addEventListener('click',()=>{
  error.style.display = 'none';
});
