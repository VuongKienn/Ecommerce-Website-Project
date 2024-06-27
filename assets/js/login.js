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
    if( isEmailError){
        //do nothing
    }else{
        //call API
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
        
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
        
            try {
                // Gọi API đăng nhập
                const loginResponse = await fetch('YOUR_LOGIN_API_ENDPOINT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
        
                if (loginResponse.ok) {
                    // Đăng nhập thành công, gửi OTP qua email
                    const otpResponse = await fetch('SEND_OTP_API', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });
        
                    if (otpResponse.ok) {
                        // Hiển thị form xác thực OTP
                        document.getElementById('loginForm').classList.add('hidden');
                        document.getElementById('Verification').classList.remove('hidden');
        
                        // Bắt sự kiện submit của form xác thực OTP
                        document.getElementById('Verification').addEventListener('submit', async function(e) {
                            e.preventDefault();
        
                            const otpCode = document.getElementById('otpCode').value;
        
                            try {
                                // Gọi API xác thực OTP
                                const verifyOtpResponse = await fetch('VERIFY_OTP_API', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ email, otpCode })
                                });
        
                                if (verifyOtpResponse.ok) {
                                    // OTP xác thực thành công, lấy Keycloak token
                                    const keycloakResponse = await fetch('KEYCLOAK_API', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ email, password })
                                    });
        
                                    if (keycloakResponse.ok) {
                                        const keycloakData = await keycloakResponse.json();
                                        const keycloakToken = keycloakData.keycloakToken;
        
                                        // Lưu Keycloak token vào localStorage
                                        localStorage.setItem('keycloakToken', keycloakToken);
        
                                        // Chuyển hướng sau khi đăng nhập thành công
                                        window.location.href = '../index.html';
                                    } else {
                                        const keycloakErrorData = await keycloakResponse.json();
                                        console.error('Lấy Keycloak token thất bại:', keycloakErrorData);
                                        alert('Lấy Keycloak token thất bại. Vui lòng thử lại.');
                                    }
                                } else {
                                    const verifyOtpErrorData = await verifyOtpResponse.json();
                                    console.error('Xác thực OTP thất bại:', verifyOtpErrorData);
                                    alert('Xác thực OTP thất bại. Vui lòng kiểm tra lại mã OTP.');
                                }
                            } catch (error) {
                                console.error('Có lỗi xảy ra:', error);
                                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
                            }
                        });
                    } else {
                        const otpErrorData = await otpResponse.json();
                        console.error('Gửi OTP thất bại:', otpErrorData);
                        alert('Gửi OTP thất bại. Vui lòng thử lại.');
                    }
                } else {
                    const loginErrorData = await loginResponse.json();
                    console.error('Đăng nhập thất bại:', loginErrorData);
                    alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
                }
            } catch (error) {
                console.error('Có lỗi xảy ra:', error);
                alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        });
        
        
    }
})