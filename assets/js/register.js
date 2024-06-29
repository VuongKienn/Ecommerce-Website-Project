
var registerForm = document.querySelector('#registerForm');
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
function sendOTP(email) {
    return fetch('url_api_send_otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send OTP');
        }
        return response.json();
    });
}
function registerUser(username, email, password, verificationCode) {
    return fetch('url_api_register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            verificationCode: verificationCode
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to register');
        }
        return response.json();
    });
}
// Function để đăng nhập người dùng sau khi đăng ký thành công
function loginUser(username, password) {
    return fetch('url_api_login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        return response.json();
    });
}

registerForm.addEventListener('submit', function(e){
    var username = document.querySelector('#username');
    var email = document.querySelector('#email');
    var password = document.querySelector('#password');
    var cofirmPassword = document.querySelector('#cofirm');

    e.preventDefault();
    showSuccess(username)
    showSuccess(password)
    showSuccess(email)
    showSuccess(cofirmPassword)
    
    let isEmailError = checkEmailError(email);
    let isUsernameLengthError = checkLengthError(username, 6,10);
    let isPasswordLengthError = checkLengthError(password, 8, 12);
    let isMatchError = checkMatchPasswordError(password, cofirmPassword);
    let isEmptyError = checkEmptyError([username, email, password, cofirmPassword]);
    if( isEmailError|| isEmptyError ||isMatchError|| isPasswordLengthError|| isUsernameLengthError){
        //do nothing
    }else{
        //call API
        sendOTP(emailInput.value)
        .then(data => {
            // Gửi OTP thành công, hiển thị form xác nhận OTP và ẩn form đăng ký
            document.getElementById('Verification').classList.remove('hidden');
            registerForm.classList.add('hidden');

            // Xử lý sự kiện submit form xác nhận OTP
            document.getElementById('Verification').addEventListener('submit', function(e) {
                e.preventDefault();
                var verificationCodeInput = document.getElementById('verificationCode').value.trim();

                registerUser(usernameInput.value, emailInput.value, passwordInput.value, verificationCodeInput)
                .then(data => {
                    console.log('Registration successful:', data);
                    // Xử lý thành công sau khi đăng ký 
                    loginUser(usernameInput.value, passwordInput.value)
                    .then(loginData => {
                        console.log('Login successful:', loginData);
                        // Lưu thông tin đăng nhập vào localStorage 
                        localStorage.setItem('token', loginData.token);
                        // Chuyển hướng đến trang sau khi đăng nhập thành công
                        window.location.href = '../index.html';
                    })
                })
                .catch(error => {
                    console.error('Error registering:', error.message);
                    // Xử lý lỗi khi đăng ký không thành công
                });
            });
        })
        .catch(error => {
            console.error('Error sending OTP:', error.message);
            // Xử lý lỗi khi gửi OTP không thành công
        });
    }
});


