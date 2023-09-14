if (!localStorage.getItem('session_token')) {
  let button = document.getElementById('sendRegisterData');
  let username = document.getElementById('user');
  let password = document.getElementById('password');
  let confirmPassword = document.getElementById('confirm-password');
  let email = document.getElementById('email');
  let display = document.getElementById('display');

  const URI = 'http://localhost:3000/api/session/register';

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  button.addEventListener('click', async (e) => {
    e.preventDefault(); // Corrección: Agregar paréntesis para llamar a la función

    const userData = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    if (password.value.length < 8) {
      display.innerText = 'La contraseña debe tener 8 caracteres o más';
    } else if (password.value !== confirmPassword.value) {
      display.innerText = 'Las contraseñas no coinciden';
    } else {
      // Cambio: Se ejecuta la animación del botón solo si la validación de contraseña pasa
      button.innerHTML = `<div id="loadingIcon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#000" stroke-width="5">
                  <animate attributeName="r" values="20;40;20" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
          </svg>
      </div>`;

      const response = await postData(URI, userData);
      let useData = response;
      console.log(useData)

      if (useData.userId) {
        localStorage.setItem('session_userId', useData.userId);
        localStorage.setItem('session_token', useData.token);
        localStorage.setItem('session_email', useData.email);
        localStorage.setItem('session_username', useData.username);
      }

      if (response.error) {
        display.innerText = response.error;
      } else {
        // Cambio: Redireccionar después de un registro exitoso
        window.location.href = '/home';
      }
    }
  });
} else {
  window.location.href = '/home';
}
