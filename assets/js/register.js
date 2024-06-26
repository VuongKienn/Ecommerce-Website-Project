var username = document.querySelector('#username');
var email = document.querySelector('#email');
var password = document.querySelector('#password');
var cofirmPassword = document.querySelector('#cofirm');
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
function checkEmailError(input){
    const regexEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  input.value= input.value.trim()

  let isEmailError =!regexEmail.test(input.value) ;

  if(!regexEmail.test(input.value)){
    showError(input,'Email Invalid')
  }
  return isEmailError;
}
function checkLengthError(input, min , max){
    input.value= input.value.trim();
    if(input.value.length < min){
        showError(input, ` Must be at least ${min} characters`)
        return true;
    }
    if(input.value.length > max){
        showError(input, `Must not exceed  ${max} characters`)
        return true;
    }
    return false;
    
}
function checkMatchPasswordError(passwordInput, cofirmPasswordInput){
    if(passwordInput.value !== cofirmPasswordInput.value){
        showError(cofirmPasswordInput, 'Password does not match');
        return true
    }
    return false 
}


form.addEventListener('submit', function(e){
    e.preventDefault();
    showSuccess(username)
    showSuccess(password)
    showSuccess(email)
    showSuccess(cofirmPassword)
    let isEmptyError = checkEmptyError([username, email, password, cofirmPassword]);
    let isEmailError = checkEmailError(email);
    let isUsernameLengthError = checkLengthError(username, 6,10);
    let isPasswordLengthError = checkLengthError(password, 8, 12);
    let isMatchError = checkMatchPasswordError(password, cofirmPassword);
    if( isEmailError|| isEmptyError ||isMatchError|| isPasswordLengthError|| isUsernameLengthError){
        //do nothing
    }else{
        //call API
    }
})
