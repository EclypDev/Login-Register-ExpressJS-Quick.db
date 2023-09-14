if(!localStorage.getItem('session_token')) {
    const container = document.createElement('div');
container.classList.add('display', 'container');

const h1 = document.createElement('h1');
h1.classList.add('margin');
h1.textContent = 'Login';

const display = document.createElement('div');
display.id = 'display';

const usernameLabel = document.createElement('label');
usernameLabel.textContent = 'Username';

const usernameInput = document.createElement('input');
usernameInput.placeholder = 'Ingrese un usuario';
usernameInput.id = 'username';
usernameInput.type = 'text';

const passwordLabel = document.createElement('label');
passwordLabel.textContent = 'Password';

const passwordInput = document.createElement('input');
passwordInput.placeholder = 'Ingrese una contraseña';
passwordInput.id = 'password';
passwordInput.type = 'password';

const loginButton = document.createElement('button');
loginButton.classList.add('btn');
loginButton.id = 'sendLoginData';
loginButton.textContent = 'Log In';

container.appendChild(h1);
container.appendChild(display);
container.appendChild(usernameLabel);
container.appendChild(usernameInput);
container.appendChild(passwordLabel);
container.appendChild(passwordInput);
container.appendChild(loginButton);

document.querySelector('main').appendChild(container);
let button = document.getElementById('sendLoginData');
    button.addEventListener('click', async (e) => {
        e.preventDefault();
    
        // Captura los valores de username y password dentro del evento clic
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let display = document.getElementById('display');
    
        const userData = {
            username: username,
            password: password
        };
    
        const URI = 'http://localhost:3000/api/session/login';
        if(username && password.length <= 8) {
            display.innerText = 'Datos de inicio de session incorrectos'
        } else {
            try {
                const response = await postData(URI, userData);
                if(response.error)  {
                    display.innerText = response.error
                } else {
                    button.innerHTML = `<div id="loadingIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#000" stroke-width="5">
                            <animate attributeName="r" values="20;40;20" dur="1.5s" begin="0s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>`
                let userData = response
                localStorage.setItem('session_userId', userData.userId)
                localStorage.setItem('session_token', userData.token)
                localStorage.setItem('session_email', userData.email)
                localStorage.setItem('session_username', userData.username)
                window.location.href = '/home'
                }
            } catch (error) {
                console.error(`Error en la solicitud POST: ${error.message}`);
            }
        }
        
    });
    
    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    
    }
    
} else {
    window.location.href = '/home'
}
