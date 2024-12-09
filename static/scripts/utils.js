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

async function addFoodToCart(id) {
  if (checkAuth()) {
    const data = {
      food_item_id: id,
      quantity: 1,
    };

    try {
      const response = await fetch("/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Food item added to cart successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert("Failed to add food item to cart: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
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
        menuItem.className =
          "bg-white shadow-md rounded-lg overflow-hidden h-full flex flex-col";

        menuItem.innerHTML = `
          <div class="p-4 flex-grow">
            <h5 class="text-lg font-bold">${item.name}</h5>
            <p class="text-sm text-gray-500 mt-2">${item.description}</p>
          </div>
          <img src="${item.image}" alt="${item.name}" class="w-full px-4 h-32 object-cover rounded-md" />
          <div class="p-4 flex justify-between items-center">
            <span class="font-bold text-gray-700">${item.price}</span>
            <button class="bg-orange-500 text-white text-sm py-1 px-3 rounded hover:bg-orange-600 cursor-pointer"
              onclick="addFoodToCart(${item.id})">
              Add
            </button>
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

function createOrder() {
  if (checkAuth()) {
    fetch(`/order/create/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Order created successfully!");
        window.location.href = "/order/dashboard/";
      })
      .catch((error) => {
        alert("Error:", error.message);
      });
  } else {
    alert("Please login to create order!");
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
        updateCartUI(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  } else {
    alert("Please login to view cart!");
  }
}

async function removeFoodItemFromCart(foodItemId) {
  try {
    const response = await fetch(`/cart/remove/${foodItemId}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      alert("Food item removed from cart successfully!");
      window.location.reload();
    } else {
      const errorData = await response.json();
      alert(
        "Failed to remove food item from cart: " + JSON.stringify(errorData)
      );
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
  }
}

function updateCartUI(data) {
  const cartContainer = document.querySelector(".cart-container");
  const summaryContainer = document.querySelector(".border.rounded.shadow-sm");

  // Clear existing content
  cartContainer.innerHTML = "";

  // Populate vendor and items
  if (data.items.length === 0) {
    cartContainer.innerHTML = `
      <div class="flex items-center justify-center h-96 border rounded shadow-sm p-4 bg-white">
        <h3 class="text-xl font-bold text-gray-600 text-center">
          Your cart is empty! Add some food items to continue.
          <br />
          <a href="/" class="text-blue-500 hover:underline text-center">Browse Delicious Food!</a>
        </h3>
      </div>
      `;
  } else {
    data.items.forEach((vendorData) => {
      const vendorDiv = document.createElement("div");
      vendorDiv.className =
        "vendor-card border rounded shadow-sm p-4 bg-white mb-4";

      vendorDiv.innerHTML = `
      <div class="flex items-center mb-4">
        <img
          src="${vendorData.vendor.image}"
          alt="${vendorData.vendor.name} Logo"
          class="h-16 w-16 rounded-full border mr-4"
        />
        <div>
          <h5 class="text-lg font-bold">${vendorData.vendor.name}</h5>
          <p class="text-sm text-gray-600">${vendorData.vendor.address}</p>
          <p class="text-sm text-gray-600">${vendorData.vendor.phone}</p>
        </div>
      </div>
      <div class="food-items grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        ${vendorData.food
          .map(
            (item) => `
          <div class="food-item border rounded shadow-sm p-3 bg-gray-50 flex flex-col items-center relative">
            <button class="bg-red-500 text-white text-sm h-7 w-7 rounded-full hover:bg-red-600 cursor-pointer absolute -top-2 -right-2"
              onclick="removeFoodItemFromCart(${item.id})"
            >   
              X
            </button>
            <img
              src="${item.image}"
              alt="${item.name}"
              class="h-24 w-24 mb-2 object-cover"
            />
            <div class="text-center">
              <h6 class="font-bold text-gray-800">${item.name}</h6>
              <p class="text-sm text-gray-600">Price: ₹${item.price}</p>
              <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
              <p class="text-sm font-bold text-gray-900">Total: ₹${item.total_price}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
      cartContainer.appendChild(vendorDiv);
    });
  }

  // Calculate totals
  let total = 0;
  data.items.forEach((vendorData) => {
    vendorData.food.forEach((item) => {
      total += item.total_price;
    });
  });

  const discount = data.items.length == 0 ? 0 : 100;
  const deliveryCharge = data.items.length == 0 ? 0 : 50;
  const grandTotal = total + deliveryCharge - discount;

  // Update order summary
  summaryContainer.innerHTML = `
    <h5 class="text-lg font-bold">Order Summary</h5>
    <hr class="my-2" />
    <div class="flex justify-between text-gray-700">
      <span>Subtotal</span>
      <span>₹${total}</span>
    </div>
    <div class="flex justify-between text-gray-700">
      <span>Discount</span>
      <span>₹${discount}</span>
    </div>
    <div class="flex justify-between text-gray-700">
      <span>Delivery Charge</span>
      <span>₹${deliveryCharge}</span>
    </div>
    <hr class="my-2" />
    <div class="flex justify-between font-bold text-gray-900">
      <span>Grand Total</span>
      <span>₹${grandTotal}</span>
    </div>
    <button
      type="button"
      class="bg-orange-500 text-white text-lg font-bold w-full py-2 rounded mt-3 hover:bg-orange-600"
      onclick="createOrder()"
    >
      Proceed to Checkout
    </button>
  `;
}

async function getAllOrders() {
  if (checkAuth()) {
    try {
      const response = await fetch("/order/all/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const orders = await response.json();
        const ordersContainer = document.getElementById("orders");
        ordersContainer.innerHTML = ""; // Clear the loading message

        // Render orders dynamically
        orders.forEach((order, index) => {
          const orderHtml = `
            <div class="bg-white shadow rounded-lg p-4">
              <div class="flex justify-between">
                <div>
                  <h2 class="font-semibold text-lg text-gray-800">Order #${
                    index + 1
                  }</h2>
                  <p class="text-sm text-gray-600">Order ID: #${
                    order.order_id
                  }</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-500">${new Date(
                    order.created_at
                  ).toLocaleString()}</p>
                </div>
              </div>
              <div class="mt-2 text-gray-700">
                ${order.items
                  .map(
                    (item) =>
                      `<p>${item.food_item} (${item.vendor}) x ${
                        item.quantity
                      } - ₹${item.total_price.toFixed(2)}</p>`
                  )
                  .join("")}
              </div>
              <div class="mt-4 flex justify-between items-center">
                <p class="text-sm text-gray-600">
                  Total Price: <span class="font-semibold text-green-600">₹${order.total_price.toFixed(
                    2
                  )}</span>
                </p>
                <a href="#" class="text-orange-600 hover:underline text-sm">
                  View Details
                </a>
              </div>
            </div>
          `;
          ordersContainer.innerHTML += orderHtml;
        });
      } else {
        const errorData = await response.json();
        alert("Failed to fetch orders: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  } else {
    alert("Please login to view orders!");
    window.location.href = "/user/login/";
  }
}
