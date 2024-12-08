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
        localStorage.setItem("user_id", data.user.id);
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
        localStorage.setItem("user_id", data.user.id);
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
    localStorage.removeItem("user_id");
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
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );
    formData.append("address", document.getElementById("address").value);
    formData.append("phone", document.getElementById("phone").value);
    if (document.getElementById("image").files.length > 0) {
      formData.append("image", document.getElementById("image").files[0]);
    }

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

async function addFoodItem() {
  const is_vendor = localStorage.getItem("is_vendor");
  if (checkAuth() && is_vendor) {
    const formData = new FormData();
    formData.append("name", document.getElementById("food-name").value);
    formData.append(
      "description",
      document.getElementById("food-description").value
    );
    formData.append("price", document.getElementById("food-price").value);
    if (document.getElementById("food-image").files.length > 0) {
      formData.append("image", document.getElementById("food-image").files[0]);
    }

    try {
      const response = await fetch("/vendor/food-item/add/", {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Food item added successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Failed to add food item: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are not authorized!");
  }
}

async function fetchFoodItems() {
  const is_vendor = localStorage.getItem("is_vendor");
  if (checkAuth() && is_vendor) {
    try {
      const response = await fetch("/vendor/food/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          const tableBody = document.getElementById("food-items-table-body");
          tableBody.innerHTML = "";

          data.forEach((item) => {
            const row = document.createElement("tr");

            row.innerHTML = `
              <td class="px-4 py-2 border-b text-center">${item.name}</td>
              <td class="px-4 py-2 border-b text-center">${item.description}</td>
              <td class="px-4 py-2 border-b text-center">${item.price}</td>
              <td class="px-4 py-2 border-b float-right">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md">
              </td>
            `;

            tableBody.appendChild(row);
          });
          console.log("Food items populated");
        } else {
          console.error("Data format error:", data);
        }
      } else {
        const errorData = await response.json();
        alert("Failed to fetch food items: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("You are not authorized!");
  }
}

async function fetchVendors() {
  try {
    const response = await fetch("/vendor/all", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const vendorsContainer = document.querySelector(".grid");

      vendorsContainer.innerHTML = "";

      data.forEach((vendor) => {
        const vendorCard = document.createElement("div");
        vendorCard.className = "bg-white rounded-lg shadow-md overflow-hidden";

        vendorCard.innerHTML = `
            <a class="relative " href = "/vendor/menu/${vendor.id}/"}">
              <img
                src="${vendor.image}"
                class="w-full h-40 object-cover"
                alt="${vendor.name}"
              />
              <div class="absolute top-2 left-2 bg-black text-white text-sm px-2 py-1 rounded">
                Special Offer
              </div>
            </div>
            <div class="p-4">
              <p class="text-green-600 text-sm mb-1">⭐ 4.5 • 30-40 mins</p>
              <h5 class="text-lg font-semibold mb-1">${vendor.name}</h5>
              <p class="text-gray-500 text-sm">
                ${vendor.description}<br />
                ${vendor.address}
              </p>
            </div>
          `;
        vendorsContainer.appendChild(vendorCard);
      });
    } else {
      const errorData = await response.json();
      alert("Failed to fetch vendors: " + JSON.stringify(errorData));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

async function fetchVendorMenu() {
  const url = window.location.href;
  const v = url.split("/menu/");
  const vendorId = v[v.length - 1].replace("/", "");

  try {
    const response = await fetch(`/vendor/food/${vendorId}`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      const menuContainer = document.getElementById("menu");

      menuContainer.innerHTML = "";

      data.forEach((item) => {
        const menuItem = document.createElement("div");

        menuItem.innerHTML = `
          <!-- Food Item ${item.id} -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="p-4">
              <h5 class="text-lg font-bold">${item.name}</h5>
              <p class="text-sm text-gray-500 mt-2">
                ${item.description}
              </p>
              <img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover mt-2 rounded-md" />
              <div class="flex justify-between items-center mt-4">
                <span class="font-bold text-gray-700">${item.price}</span>
                <button class="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600">
                  Add
                </button>
              </div>
            </div>
          </div>
        `;
        menuContainer.appendChild(menuItem);
      });
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

async function getVendorProfileForMenu() {
  const url = window.location.href;
  const v = url.split("/menu/");
  const vendorId = v[v.length - 1].replace("/", "");
  try {
    const response = await fetch(`/vendor/details/${vendorId}`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      document.querySelector(".name").textContent = data.name;
      document.querySelector("#name").textContent = data.name;
      document.querySelector("#description").textContent = data.description;
      document.querySelector(".address").textContent = data.address;
    } else {
      const errorData = await response.json();
      alert("Vendor profile fetch failed: " + JSON.stringify(errorData));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

function viewCart() {
  if (checkAuth()) {
    const user_id = localStorage.getItem("user_id");
    window.location.href = "/cart/view/" + user_id + "/";
  } else {
    alert("Please login to view cart!");
  }
}

function getCart() {
  if (checkAuth()) {
    fetch(`/cart/view/`, {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  } else {
    alert("Please login to view cart!");
  }
}
