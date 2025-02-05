const loginEndpoint = "https://learn.reboot01.com/api/auth/signin";
const container = document.createElement('div');
container.className = 'container';

const loginBoxHTML = `
  <div class="login-box">
    <h2>Login</h2>
    <form id="login-form">
      <div class="input-box">
        <input type="text" id="username" placeholder="Email or Username" required>
        <label>Email or Username</label>
      </div>
      <div class="input-box">
        <input type="password" id="password" placeholder="Password" required>
        <label>Password</label>
      </div>
      <div id="error-message" style="color: red; margin-bottom: 10px; display: none;"></div>
      <button type="submit" class="btn">Login</button>
    </form>
  </div>
`;

container.innerHTML = loginBoxHTML;
document.body.appendChild(container);

if (!localStorage.getItem('jwt-token')) {
    for (let i = 0; i < 50; i++) {
        const span = document.createElement('span');
        span.style.setProperty('--i', i.toString());
        container.appendChild(span);
    }
} else {
    container.style.display = 'none';
}

const loginForm = document.getElementById("login-form") as HTMLFormElement;
const errorMessage = document.getElementById("error-message") as HTMLDivElement;

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const usernameOrEmail = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
        const response = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${btoa(`${usernameOrEmail}:${password}`)}`,
                "Content-Type": "application/json"
            },
        });

        const data = await response.json();
        
        if (response.ok) {
            errorMessage.style.display = 'none';
            localStorage.setItem("jwt-token", data);
            const spans = document.querySelectorAll('span');
            spans.forEach(span => span.remove());
            container.style.display = 'none';
            location.reload();
        } else {
            errorMessage.textContent = "Invalid username or password";
            errorMessage.style.display = 'block';
            throw new Error(data.error || "Login failed");
        }
    } catch (error) {
        errorMessage.textContent = "Invalid username or password";
        errorMessage.style.display = 'block';
        console.log("Invalid login credentials!");
    }
});
