function checkAuth() {
  if (localStorage.getItem("token") === null) {
    return false;
  } else {
    return true;
  }
}

async function signup() {
  if (!checkAuth()) {
    const formData = {
      first_name: document.getElementById("firstName").value,
      last_name: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch("/user/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        alert("Signup successful! You will be logged in now.");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert("Signup failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are already logged in.");
    window.location.href = "/";
  }
}

async function login() {
  if (!checkAuth()) {
    const formData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };
    try {
      const response = await fetch("/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        alert("Login successful!");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert("Login failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are already logged in.");
    window.location.href = "/";
  }
}

function logout() {
  if (checkAuth()) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    alert("Logout successful!");
  } else {
    alert("You are not logged in.");
  }
}
