$(document).ready(function() {
    console.log("Document ready!");

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let discountApplied = false;
    let deliveryCharge = 0;

    // Function to update the cart/alert
    function updateCart() {
        console.log("Updating cart...");
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Calculate totals
    function calculateTotals() {
        
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discount = discountApplied ? -10 : 0;
        let vat = (subtotal + discount + deliveryCharge) * 0.15;
        let total = subtotal + discount + vat + deliveryCharge;
        return { subtotal, discount, vat, total };
    }

    //Cart Items in Cart
    function renderCart() {
     
        $('#cart-items').html(cart.map(item => {
            console.log("Rendering item: ", item);
            if (item.price == null || isNaN(item.price)) {
                console.error("Invalid price for item: ", item);
                return `<div>Invalid item with no price</div>`;
            }
            return `
                <div>
                    Product ID: ${item.id}, Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}
                </div>
            `;
        }).join(''));
        let { subtotal, discount, vat, total } = calculateTotals();
        $('#subtotal').text(subtotal.toFixed(2));
        $('#discount').text(discount.toFixed(2));
        $('#vat').text(vat.toFixed(2));
        $('#delivery').text(deliveryCharge.toFixed(2));
        $('#total').text(total.toFixed(2));
    }

    // Add to cart button 
    $('.add-to-cart').click(function() {
        console.log("Add to cart clicked...");
        let id = $(this).data('id');
        let price = parseFloat($(this).data('price'));
        if (isNaN(price)) {
            console.error("Invalid price: ", price);
            return;
        }
        let item = cart.find(item => item.id === id);

        if (item) {
            item.quantity++;
        } else {
            cart.push({ id, price, quantity: 1 });
        }

        updateCart();
        let { total } = calculateTotals();
        alert(`Item added to cart! Current total: R${total.toFixed(2)}`);
    });

  
    if (window.location.pathname.endsWith('cart.html')) {
        console.log("On cart page...");
        renderCart();

        // Apply discount form 
        $('#discount-form').submit(function(e) {
            e.preventDefault();
            
            discountApplied = true;
            renderCart();
            alert("Discount applied!");
        });

        // Delivery options show/hide 
        $('input[name="delivery"]').change(function() {
         
            if ($(this).val() === 'delivery') {
                $('#delivery-options').slideDown();
            } else {
                $('#delivery-options').slideUp();
                deliveryCharge = 0;
                renderCart();
            }
        });

        // Update total
        $('input[name="delivery-option"]').change(function() {
          
            if ($(this).val() === 'standard') {
                deliveryCharge = 10;
            } else if ($(this).val() === 'express') {
                deliveryCharge = 25;
            }
            renderCart();
        });

        // Confirm order button 
        $('#confirm-order').click(function() {
            let { total } = calculateTotals();
            let reference = Math.random().toString(36).substring(2, 15);
            alert(`Order confirmed! Total: R${total.toFixed(2)}. Reference number: ${reference}`);
            cart = [];
            localStorage.removeItem('cart');
            discountApplied = false;
            deliveryCharge = 0;
            renderCart();
        });

        // Clear cart button 
        $('#clear-cart').click(function() {
           
            cart = [];
            localStorage.removeItem('cart');
            discountApplied = false;
            deliveryCharge = 0;
            renderCart();
            alert("Cart cleared!");
        });
    }

    // jQuery effects (WAS HERE PREVIOUSLY!!!!)
    $('header').hover(
        function() { $(this).css('background-color', '#555'); },
        function() { $(this).css('background-color', '#333'); }
    );

    $('nav ul li').hide().slideDown('slow');
    $('main').fadeIn(1000);
});
