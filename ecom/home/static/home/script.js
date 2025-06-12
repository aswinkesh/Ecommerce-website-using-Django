
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    handleSearch();
});

// product search is enable here
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input");
    const productGrid = document.getElementById("homeproducts-container");
    const productCards = Array.from(
      productGrid.getElementsByClassName("product-card")
    );

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();

      productCards.forEach((card) => {
        const productName = card
          .querySelector(".product-name")
          .textContent.toLowerCase();
        const productCompany = card
          .querySelector(".product-company")
          .textContent.toLowerCase();
        

        if (
          productName.includes(searchTerm) ||
          productCompany.includes(searchTerm)
        ) {
          card.style.display = "block"; // Show matching product
        } else {
          card.style.display = "none"; // Hide non-matching product
        }
      });
    });
  });


  function updateCartCount() {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector(".cart-count").textContent = totalQuantity;
}

function addToCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    let existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart)); // Use sessionStorage
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", updateCartCount);



//user location capturing code
document.getElementById("location-btn").addEventListener("click", function () {
    let locationText = document.getElementById("location-text");
    locationText.innerText = "Fetching location...";

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        let addressParts = data.display_name.split(", ");
                        let addressLength = addressParts.length;

                        if (addressLength >= 4) {
                            let formattedAddress = `${addressParts[addressLength - 4]}, ${addressParts[addressLength - 3]}`;
                            locationText.innerText = formattedAddress;
                        } else {
                            locationText.innerText = data.display_name; 
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching address:", error);
                        locationText.innerText = "Error fetching location";
                    });
            },
            function (error) {
                locationText.innerText = "Connection error";
                console.error("Error:", error);
            }
        );
    } 
    else {
        locationText.innerText = "Geolocation not supported";
    }
    })  
    //location code end

 
    


    