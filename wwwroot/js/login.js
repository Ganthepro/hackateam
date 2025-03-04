api = "http://localhost:5234";

async function Login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const response = await fetch(`${api}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const result = await response.json();
    setCookie("token", result.token, 12);
    window.location.href = `${api}/Explore`;
  } catch (error) {
    CreateErrorBlock("Login failed. Please check your email or password.");
  }
}
