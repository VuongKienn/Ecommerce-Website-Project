var email = document.querySelector('#email');
var password = document.querySelector('#password');
var form = document.querySelector('form');

function showError(input, message){
    let parent = input.parentElement;
    let small= parent.querySelector('small')
    parent.classList.add('error')
    small.innerText = message;
}
function showSuccess(input){
    let parent = input.parentElement;
    let small= parent.querySelector('small')
    parent.classList.remove('error')
    small.innerText = '';
}
function checkEmptyError(listInput){
    let isEmptyError= false;
    listInput.forEach(input => {
        input.value = input.value.trim();

        if(!input.value){
            isEmptyError =true;
            showError(input,'Not allowed to leave blank')
        }
    });
    return isEmptyError;
}
form.addEventListener('submit', function(e){
    e.preventDefault();
    showSuccess(password)
    showSuccess(email)
    let isEmptyError = checkEmptyError([email, password]);
    // let isEmailError = checkEmailError(email);
    // let isUsernameLengthError = checkLengthError(username, 6,10);
    // let isPasswordLengthError = checkLengthError(password, 8, 12);
    // let isMatchError = checkMatchPasswordError(password, cofirmPassword);
    if( isEmailError){
        //do nothing
    }else{
        //call API
    }
})