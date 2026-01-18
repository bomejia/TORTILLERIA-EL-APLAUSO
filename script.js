// Inicializar carrito desde localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let tempQuantity = 1;

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
    document.getElementById('cart-total').textContent = 'Total: $0 MXN';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <span>${item.name} - $${item.price} c/u x ${item.quantity} = $${itemTotal}</span>
      <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  document.getElementById('cart-total').textContent = `Total: $${total} MXN`;
}

// Abrir modal de cantidad
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const name = this.dataset.name;
    const price = parseFloat(this.dataset.price);

    currentProduct = { name, price };
    tempQuantity = 1;

    document.getElementById('quantity').textContent = tempQuantity;
    updateTempPrice();
    document.getElementById('quantity-modal').style.display = 'flex';
  });
});

// Controles de cantidad
document.getElementById('increase').addEventListener('click', () => {
  tempQuantity++;
  document.getElementById('quantity').textContent = tempQuantity;
  updateTempPrice();
});

document.getElementById('decrease').addEventListener('click', () => {
  if (tempQuantity > 1) {
    tempQuantity--;
    document.getElementById('quantity').textContent = tempQuantity;
    updateTempPrice();
  }
});

function updateTempPrice() {
  if (!currentProduct) return;
  const total = currentProduct.price * tempQuantity;
  document.getElementById('total-price').textContent = `$${total.toFixed(2)} MXN`;
}

// Confirmar y agregar
document.getElementById('confirm-quantity').addEventListener('click', () => {
  if (!currentProduct) return;

  const { name, price } = currentProduct;
  const quantity = tempQuantity;

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  saveCart();
  updateCartCount();
  alert(`¡${quantity} kg de ${name} agregado(s) al carrito!`);

  document.getElementById('quantity-modal').style.display = 'none';
  tempQuantity = 1;
  currentProduct = null;
});

// Cerrar modal cantidad
document.getElementById('close-quantity').addEventListener('click', () => {
  document.getElementById('quantity-modal').style.display = 'none';
  tempQuantity = 1;
  currentProduct = null;
});

// Eliminar del carrito
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  renderCart();
};

// Abrir carrito
document.getElementById('cart-icon').addEventListener('click', function() {
  renderCart();
  document.getElementById('cart-modal').style.display = 'flex';
});

document.getElementById('close-cart').addEventListener('click', function() {
  document.getElementById('cart-modal').style.display = 'none';
});

// Finalizar pedido
document.getElementById('finalize-order').addEventListener('click', function() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  document.getElementById('cart-modal').style.display = 'none';
  document.getElementById('client-form-modal').style.display = 'flex';
});

// Mostrar/ocultar dirección
document.querySelectorAll('input[name="delivery"]').forEach(radio => {
  radio.addEventListener('change', function() {
    document.getElementById('delivery-address-group').style.display = 
      this.value === 'domicilio' ? 'block' : 'none';
  });
});

// Enviar formulario cliente
document.getElementById('client-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const delivery = document.querySelector('input[name="delivery"]:checked').value;
  const address = delivery === 'domicilio' ? document.getElementById('client-address').value.trim() : 'Recoger en tienda';

  if (!name || !phone) {
    alert('Por favor completa nombre y teléfono.');
    return;
  }

  const orderNumber = Math.floor(10000 + Math.random() * 90000);

  const details = `
    <p><strong>Número de Pedido:</strong> #${orderNumber}</p>
    <p><strong>Cliente:</strong> ${name}</p>
    <p><strong>Teléfono:</strong> ${phone}</p>
    <p><strong>Entrega:</strong> ${delivery === 'tienda' ? 'Recoger en tienda' : 'Envío a domicilio'}</p>
    ${delivery === 'domicilio' ? `<p><strong>Dirección:</strong> ${address}</p>` : ''}
    <p style="color:#8b5e3c; font-weight:bold; margin-top:15px;">¡Tu pedido ha sido confirmado!</p>
    <p>Pronto nos pondremos en contacto para coordinar.</p>
  `;

  document.getElementById('confirmation-details').innerHTML = details;
  document.getElementById('client-form-modal').style.display = 'none';
  document.getElementById('confirmation-modal').style.display = 'flex';

  cart = [];
  saveCart();
  updateCartCount();
});

document.getElementById('close-form').addEventListener('click', function() {
  document.getElementById('client-form-modal').style.display = 'none';
});

document.getElementById('close-confirmation').addEventListener('click', function() {
  document.getElementById('confirmation-modal').style.display = 'none';
});

// Feedback
document.getElementById('feedback-icon').addEventListener('click', function() {
  document.getElementById('feedback-modal').style.display = 'flex';
});

document.getElementById('close-feedback').addEventListener('click', function() {
  document.getElementById('feedback-modal').style.display = 'none';
});

document.getElementById('feedback-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('¡Gracias por tu opinión! La revisaremos con mucho gusto para seguir mejorando. 😊');
  document.getElementById('feedback-modal').style.display = 'none';
  this.reset();
});

// Cerrar cualquier modal al clic fuera
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    if (event.target.id === 'quantity-modal') {
      tempQuantity = 1;
      currentProduct = null;
    }
  }
});

updateCartCount();