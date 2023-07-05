const logoutButton = document.getElementById('logout');


logoutButton.addEventListener('click' , () => {
    fetch('/api/sessions/logout').then(result=>{
        if(result.status===200){
            window.location.replace('/login');
        }
    })
})