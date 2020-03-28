
const url = "http://127.0.0.1:5000/";
const errorColor = '#F34335';
const warningColor = '#673AB7';


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

const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: url + 'login',
            data: {
                email,
                password
            }
        });
        const {token} = res.data;
        localStorage.setItem('token', token);
        window.location.href = url + 'home';
    } catch (error) {
        const statusCodeNumber = statusCode(error.message);
        console.log(statusCodeNumber);
        if(statusCodeNumber == 400)
            showToast("User doesn't exists", errorColor, 'error');
        else if(statusCodeNumber == 401)
            showToast('Credentials are not correct',warningColor, 'warning');
    }


}

document.querySelector('.login-form').addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});