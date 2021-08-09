require('dotenv').config()
  

const messages = document.getElementById('messages');
 const message = document.getElementById('message');
 console.log(messages);
  Pusher.logToConsole = true;


 const contact = localStorage.getItem('contact');
 const userDisplay = localStorage.getItem('userDisplay');
let pusher = new Pusher("2fbd7f578317fbccc208", {
  cluster: "eu",
});

 const room = 'private-' + contact;

 // 
 console.log(userDisplay);
 

 $('#btn-submit').on('click', () => {
   const message = $('#input').val();
   $('#input').val('');

   $.post(`/chat/${contact}`, {
     message
   })

 })

 function addMessage(data) {
   let li = document.createElement('li');

   const onlineUser = null;
   console.log('message', data.message);
   console.log('sender', data.sender);
   li.textContent = data.message;
   if (userDisplay === data.sender) {
     li.className = "list-group-item list-group-item-light text-end";
     console.log('sender', userDisplay, 'and sender.id')
   } else {
     li.className = "list-group-item list-group-item-primary";
   }

   messages.appendChild(li);
messages.scrollIntoView({block:"end", behavior:"smooth"});  

 };

 let channel = pusher.subscribe(room);
 channel.bind("pusher:subscription_succeeded", () => {

   console.log('bind from succed subscription')
 });
 channel.bind('message', (data) => {
   addMessage(data);

 });

 