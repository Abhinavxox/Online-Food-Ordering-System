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
        localStorage.setItem("is_vendor", data.user.is_vendor);
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
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("is_vendor", data.user.is_vendor);
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
    localStorage.removeItem("is_vendor");
    alert("Logout successful!");
  } else {
    alert("You are not logged in.");
  }
}

async function vendorProfile() {
  const is_vendor = localStorage.getItem("is_vendor");
  if (checkAuth() && is_vendor) {
    try {
      const response = await fetch("/vendor/profile/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        populateVendorForm(data);
      } else {
        const errorData = await response.json();
        alert("Vendor profile fetch failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are not authorized!");
  }
}

function populateVendorForm(vendor) {
  console.log(vendor);
  document.getElementById("name").value = vendor.name || "";
  document.getElementById("description").value = vendor.description || "";
  document.getElementById("address").value = vendor.address || "";
  document.getElementById("phone").value = vendor.phone || "";
  const vendorImage = document.querySelector("img[src]");
  if (vendor.image && vendorImage) {
    vendorImage.src = vendor.image;
  }
}

async function updateVendorProfile() {
  const is_vendor = localStorage.getItem("is_vendor");
  if (checkAuth() && is_vendor) {
    const form = document.getElementById("vendor-form");
    const formData = new FormData(form);

    try {
      const response = await fetch("/vendor/profile/update/", {
        method: "PUT",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Vendor profile updated successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Vendor profile update failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are not authorized!");
  }
}
