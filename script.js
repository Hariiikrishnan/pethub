

var itag = document.createElement("i");
itag.classList.add("fa")
itag.classList.add("fa-circle-o-notch")
itag.classList.add("fa-spin")

var username = localStorage.getItem("username")
var token = localStorage.getItem("token")
var uid = localStorage.getItem("uid")

console.log(username);
console.log(token);
console.log(uid);

var clickedPost;


const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

// if(token!=null){
    
// getAllPost();
// // window.location.href="./index.html"
// }else{
    //     loadNothing("")
    // }
 

function handleSideBar(){
    document.getElementsByClassName("sidebarMenu")[0].classList.add("show");
}
function closeSideBar(){
    document.getElementsByClassName("sidebarMenu")[0].classList.remove("show");
}


function authenticate(next){
    if(token!=null){
        return true;
        // next();
    }else{
        return false;
    }
}

function handlePost(){
    
    const state = authenticate();
    console.log(state)
    if(state){

        var formBtn = document.getElementsByClassName("formBtn")[0];
        formBtn.innerHTML=""
        // formBtn.appendChild(itag);
        startLoader(formBtn);
        
        const config = {
            headers: {
            'content-type': 'multipart/form-data',
            Authorization: "Bearer " + token,
        }
    }


    var petname = document.getElementsByClassName("inputGet")[0].value;
    var petHolder = document.getElementsByClassName("inputGet")[1].value;
    var address = document.getElementsByClassName("inputGet")[2].value;
    var amount = document.getElementsByClassName("inputGet")[3].value;
    var phNo = document.getElementsByClassName("inputGet")[4].value;
    var petImg = document.getElementsByClassName("inputGet")[5].files[0];
    // console.log(petImg);

    var formData = new FormData();
    
    formData.append("file",petImg);
    formData.append("petName",petname);
    formData.append("petHolder",petHolder);
    formData.append("address",address);
    formData.append("amount",amount);
    formData.append("phNo",phNo);
    
    
    axios.post(`http://localhost:3001/addPet/${uid}`,formData,config).then((res)=>{
        console.log(res);
        
        if(res.data!=null){
            formBtn.removeChild(itag);
            formBtn.innerHTML="Done"
            window.location.href="./index.html"
        }
    }).catch((err)=>{
        formBtn.removeChild(itag);
        formBtn.innerHTML="Retry"
    })
}else{
    window.location.href="./login.html"
}
}


function getAllPost(){
    
    axios.get("http://localhost:3001/allPets").then((res)=>{

    // console.log(res.data.results);
    if(res.data.results.length!=0){
        loadPetPots(res.data.results,"feed");
    }
    else{
        loadNothing("feed", "No Posts Found. Kindly Add Some Posts");
    }
    // console.log("here");
    })
    
}

function getOwnPets(){

    if(token!=null){

        
            axios.get(`http://localhost:3001/pets/${uid}`,config).then((res)=>{
                
                console.log(res.data.results);
                if(res.data.results.length!=0){
                    loadPetPots(res.data.results,"wishlistFeed");
                }
                else{
                    loadNothing("wishlistFeed", "No Posts Found. Kindly Add Some Posts");
                }
                // console.log("here");
            }).catch((err)=>{
                if(err.response.status==500){

                    loadNothing("wishlistFeed","Unexpected Error, Try Again")
                }
            })
        
    }else{
        loadNothing("wishlistFeed","Kindly Login and Try Again!")
        console.log("Login")
    }
        
}

function getAccountName(){
  
    var tag = document.getElementsByClassName("accountName")[0];
    tag.innerHTML = "Hello " + username.charAt().toUpperCase() + username.slice(1) + "!";
    return tag;
}


function loadNothing(className,textMsg){
    var text = document.createElement("h2");
    text.innerHTML =textMsg;
    text.style = "margin:50px;text-align:center";
    const element = document.getElementsByClassName(className)[0];
    console.log(element)
    element.appendChild(text);
}

function handleSearch(){
    var searchText = document.getElementsByClassName("searchInput")[0];
    
    let name = searchText.value.toLowerCase();
    
    console.log(name);

    if(searchText!=null){
        axios.get(`http://localhost:3001/search/${name}`,config).then((res)=>{
            console.log(res);
            // createPostDom()
            // loadPetPots(res.data.results,"feed")
             replaceFeed("feed",res.data.results)
        }).catch((err)=>{
            console.log(err);
        })
    }
}


function replaceFeed(className,data){
    // const currentData = document.getElementsByClassName("postContainer");
    // console.log(currentData[0]);
    const element = document.getElementsByClassName(className)[0];

    
    element.replaceChildren();
    for(i=0;i<data.length;i++){
        const postDom = createPostDom(data[i]);
        element.appendChild(postDom)
    }

    // element.removeChild(...currentData);
    // var content = loadPetPots(data,"feed");
    // element.replaceChildren(content);
   
}

function wishListApi(){
    
    axios.get(`http://localhost:3001/wishlisted/${uid}`,config).then((res)=>{
        console.log(res);
        
        if(res.data.results!=0){
            loadPetPots(res.data.results,"wishlistFeed");
        }else{
            loadNothing("wishlistFeed", "No Wishlists yet. Kindly Add Some Posts")
        }
    }).catch((err)=>{
        console.log(err);
    })
}


function createPostDom(pet){
    
    // for(i=0;i<pets.length;i++){
        var container = document.createElement("div");
        container.classList.add("postContainer");
        
        var innerContainer = document.createElement("div");
        
        var petImg = document.createElement('img');
        petImg.src = pet.imgUrl;
        
        
        
        var button = document.createElement("button");
  
        button.innerHTML = '<span class="material-symbols-outlined"> favorite</span>';

        // button.innerHTML = '<i class="fa-regular fa-heart"></i>';


        let pid = pet.p_id;
        button.addEventListener("click",()=>{
            addWishList(pid);
        })
        
        innerContainer.classList.add("innerCont");
        innerContainer.appendChild(petImg);
        innerContainer.appendChild(button);


        var petName = document.createElement('h3');
        let nameString = pet.petName.charAt().toUpperCase()+pet.petName.slice(1);
        var petNameNode = document.createTextNode(nameString);
        var petAmount = document.createElement('h4');
        var amountNode = document.createTextNode("Rs."  + pet.amount);
        var phNo = document.createElement('p');
        var phNoNode = document.createTextNode(pet.phNo);
        var address = document.createElement('p');
        let addressString = pet.address.charAt().toUpperCase()+pet.address.slice(1);
        var addressNode = document.createTextNode(addressString);
        
        petName.appendChild(petNameNode);
        petAmount.appendChild(amountNode);
        address.appendChild(addressNode);
        phNo.appendChild(phNoNode);

        container.appendChild(innerContainer);
        container.appendChild(petName);
        container.appendChild(petAmount);
        container.appendChild(address);
        container.appendChild(phNo);
        // console.log()
        return container;
    // }
}

function loadPetPots(pets,className){
    // console.log(pets);

        for(i=0;i<pets.length;i++){

            const postDom = createPostDom(pets[i]);

            // console.log(postDom)
            
            const element = document.getElementsByClassName(className)[0];

            // console.log(element)
            element.appendChild(postDom);
            // }
        }
    // return element;
}



function handleLogin(){

   
   
    var formBtn = document.getElementsByClassName("loginBtn")[0];
    formBtn.innerHTML="";

    startLoader(formBtn);
   

    var username = document.getElementsByClassName("loginInput")[0];
    console.log(username.value);
   

    var password = document.getElementsByClassName("loginInput")[1];
    console.log(password.value);


    if(username.value!="" && password.value!=""){
        loginApi(username.value,password.value,formBtn);
    }else{
        handleError("loginForm","Kindly Check Your Credentials");
        stopLoader(formBtn);
        formBtn.innerHTML="Login"
    }
}



function loginApi(username,password,formBtn){


    axios.post("http://localhost:3001/login",{
        username:username,
        password:password
    }).then((res)=>{
        console.log(res);
   
     
        if(res.data!=null){
            


            // userCred=res.data.user;
// console.log(res.data.token)
            localStorage.setItem("username", res.data.user.username);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("uid", res.data.user.u_id);

          
            window.location.href="./index.html"
        }
    }).catch((err)=>{
        console.log(err.response.status);

        if(err.response.status === 401){
            handleError("loginForm","Invalid Credentials");
            stopLoader(formBtn);
        formBtn.innerHTML="Login"
        }
      
    })

}


function handleRegister(){

    var formBtn = document.getElementsByClassName("registerBtn")[0];
    formBtn.innerHTML="";

    startLoader(formBtn);


    var username = document.getElementsByClassName("registerInput")[0];
    var password = document.getElementsByClassName("registerInput")[1];
    var confirmPassword = document.getElementsByClassName("registerInput")[2];

    console.log(username.value)
    console.log(password.value)
    console.log(confirmPassword.value)


    if(username.value==="" && password.value==="" && confirmPassword.value===""){
        handleError("registerForm","Kindly Enter All Credentials");
    
        stopLoader(formBtn);
        formBtn.innerHTML="Sign Up"
    }else{
        if( password.value != confirmPassword.value){
            handleError("registerForm","Both Passwords Field must be Same");
            stopLoader(formBtn);
            formBtn.innerHTML="Sign Up";
        }else{

            registerApi(username.value,password.value);
        }
    }
}


function registerApi(username,password){

    axios.post("http://localhost:3001/register",{
        username:username,
        password:password
    }).then((res)=>{
        console.log(res);
     
        if(res.status===200 && res.data.token!=null){
           
            // formBtn.removeChild(itag);
            // formBtn.innerHTML="Done"

            localStorage.setItem("username", res.data.user.username);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("uid", res.data.user.u_id);

            window.location.href="./index.html"
        }
    }).catch((err)=>{
        console.log(err);
        // formBtn.removeChild(itag);
        // formBtn.innerHTML="Retry"
    })
}


function handleError(className,msg){
   
    // console.log("error");

    var errorElement = document.createElement("p");
    errorElement.innerHTML = msg;

    const container = document.getElementsByClassName(className)[0];
    container.appendChild(errorElement);
    setTimeout(()=>{
        container.removeChild(errorElement);
    },2000)
}







function startLoader(tag){
    tag.appendChild(itag);
}

function stopLoader(tag){
    tag.removeChild(itag);
}

function changeBtnState(tag,msg){
    tag.innerHTML=msg;
}



function addWishList(pid){
    console.log(pid);

    if(token!=null){
        axios.post(`http://localhost:3001/addWish/${uid}/${pid}`,config,{

        }).then((res)=>{
            console.log(res);
        }).catch((err)=>{
            console.log(err);
        })
    }else{
        window.location.href="./login.html"
    }
}

