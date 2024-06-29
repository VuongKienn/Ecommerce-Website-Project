var email = document.querySelector('#email');
var password = document.querySelector('#password');
var loginForm = document.querySelector('#loginForm');

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
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    showSuccess(password)
    showSuccess(email)

    let isEmailError = checkEmailError(email);
    let isEmptyError = checkEmptyError([email, password]);
    if( isEmailError){
        //do nothing
    }else{
        //call API  
        callLoginAPI(email.value, password.value);
    }
});
function callLoginAPI(email, password) {
    fetch('URL_API_DANG_NHAP', {////////////////////////////////////////
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        // Xử lý thành công đăng nhập
        console.log('Login successful:', data);
        
        // Lưu access token và refresh token vào localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Gọi hàm để lấy thông tin từ access token và xử lý tùy theo role
        handleRoleAuthorization(data.accessToken);
    })
    .catch(error => {
        // Xử lý lỗi đăng nhập
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    });
}

function handleRoleAuthorization(accessToken) {
    // Giải mã access token để lấy thông tin user, ví dụ như role
    const payload = parseJwt(accessToken);
    const userRole = payload.role;

    // Xử lý tùy theo role, ví dụ chuyển hướng đến trang phù hợp
    if (userRole === 'admin') {
        window.location.href = 'admin_dashboard.html';
    } else if (userRole === 'user') {
        window.location.href = '../index.html';
    } else {
        alert('Role not recognized');
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}