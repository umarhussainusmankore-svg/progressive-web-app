const mode = document.getElementById("mode");

mode.onclick = () => {

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

mode.innerHTML="☀️";

}else{

mode.innerHTML="🌙";

}

};

document.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",function(e){

if(this.hash!==""){

e.preventDefault();

document.querySelector(this.hash).scrollIntoView({

behavior:"smooth"

});

}

});

});