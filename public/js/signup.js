const url = "http://127.0.0.1:5000/"

const errorColor = '#F34335';

const showToast = (text, backgroundColor, className) => {
    Toastify({
        text,
        backgroundColor,
        className,
        duration: 2000
    }).showToast();
}
const statusCode = (str) => {
    const error_arr = str.split(' ');
    let statusCode = error_arr[error_arr.length - 1];
    statusCode = parseInt(statusCode);
    return statusCode;
}

const validate = (name, email, password, confirmPassword) => {
    const nameLength = name.length;
    const passwordLength = password.length;
    const confirmPasswordLength = confirmPassword.length;
    const min = 4;
    const max = 20;

    const errors = [];

    if(nameLength < min || nameLength >= max-10)
        errors.push({name: `Field 'Name' must be from ${min} to ${max} characters`});
    
    if(passwordLength < min || passwordLength > max)
        errors.push({password: `Field 'Password' must be from ${min} to ${max} characters`});

    if(confirmPassword !== password)
        errors.push({confirmPassword: `'Password' and 'Confirm Password' must be equal`});

    return errors;
}
const signup = async(name, email, password, confirmPassword) => {
    const errors = validate(name, email, password, confirmPassword);
       
    for(let e of errors)
        showToast(Object.values(e), errorColor, 'error');
    
    try {
        const res = await axios({
            method: 'POST',
            url: url + 'signup',
            data: {
                name,
                email,
                password,
                confirmPassword
            }
        });
        const {token} = res.data;
        localStorage.setItem('token', token);
        window.location.href = url + 'home';
    } catch (error) {
        const statusCodeNumber = statusCode(error.message);
        console.log(statusCodeNumber);
        if(statusCodeNumber == 400)
            showToast('User already exists', errorColor, 'error');
    }
}


document.querySelector('.signup-form').addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(name, email, password, confirmPassword);
});