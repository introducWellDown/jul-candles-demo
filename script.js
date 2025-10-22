// Products data
const products = [
  { id: 1, name: 'Тыквенный латте', price: 1200, desc: 'Кремовая тыква, корица и ваниль — уют кофейни в дождливый день.', img: 'https://images.unsplash.com/photo-1504548840739-580b10ae7715?q=80&w=1200&auto=format&fit=crop', badge: 'хит' },
  { id: 2, name: 'Яблочный пирог', price: 900, desc: 'Печёные яблоки, корица и карамель — запах домашней кухни и пледа.', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop', badge: 'топ' },
  { id: 3, name: 'Дымный кедр', price: 1400, desc: 'Глубокий древесный аромат с дымной нотой костра после прогулки.', img: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1200&auto=format&fit=crop' },
  { id: 4, name: 'Корица и апельсин', price: 1100, desc: 'Пряная корица и сочный цитрус — бодрящая классика сезона.', img: 'https://images.unsplash.com/photo-1519681392303-8f282b46ebdc?q=80&w=1200&auto=format&fit=crop', badge: 'новинка' },
  { id: 5, name: 'Ваниль и каштан', price: 1500, desc: 'Сладкая ваниль и жареный каштан с ореховыми оттенками.', img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=1200&auto=format&fit=crop' },
  { id: 6, name: 'Лесной мох', price: 1300, desc: 'Свежесть влажного мха и коры — утро в туманном лесу.', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop' }
];

// Cart state
let cart = [];
const LS_KEY = 'jul_cart_v2';
const rub = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

function loadCart(){
  try { cart = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { cart = []; }
}
function saveCart(){ localStorage.setItem(LS_KEY, JSON.stringify(cart)); }

function updateCartCount(){
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderProducts(){
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(product => `
    <article class="ios-product-card">
      <div class="ios-product-image">
        <img src="${product.img}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="ios-product-badge">${product.badge}</span>` : ''}
      </div>
      <div class="ios-product-content">
        <h3 class="ios-product-title">${product.name}</h3>
        <p class="ios-product-description">${product.desc}</p>
        <div class="ios-product-footer">
          <span class="ios-product-price">${rub.format(product.price)}</span>
          <button class="ios-button-primary" onclick="addToCart(${product.id})">
            <i data-feather="shopping-cart" class="w-4 h-4 mr-2"></i>
            В корзину
          </button>
        </div>
      </div>
    </article>
  `).join('');
  feather.replace();
}

function addToCart(productId){
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  saveCart(); updateCartCount();

  const cartFab = document.getElementById('cartFab');
  cartFab.classList.add('cart-bounce');
  setTimeout(() => cartFab.classList.remove('cart-bounce'), 600);
}

function changeQuantity(productId, delta){
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== productId);
  saveCart(); updateCartCount(); renderCart();
}

function removeItem(productId){
  cart = cart.filter(i => i.id !== productId);
  saveCart(); updateCartCount(); renderCart();
}

function renderCart(){
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItems || !cartTotal) return;

  if (cart.length === 0){
    cartItems.innerHTML = `
      <div class="text-center py-12">
        <i data-feather="shopping-bag" class="w-16 h-16 mx-auto text-ios-text-secondary mb-4"></i>
        <p class="text-ios-text-secondary">Ваша корзина пуста</p>
      </div>`;
    cartTotal.textContent = rub.format(0);
    feather.replace();
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const itemTotal = item.qty * item.price; total += itemTotal;
    return `
      <div class="flex flex-col gap-4 pb-4 border-b border-ios-border last:border-0">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-semibold text-lg mb-2">${item.name}</h4>
            <div class="flex items-center gap-3">
              <button onclick="changeQuantity(${item.id}, -1)" class="ios-icon-button">
                <i data-feather="minus" class="w-4 h-4"></i>
              </button>
              <span class="font-semibold w-8 text-center">${item.qty}</span>
              <button onclick="changeQuantity(${item.id}, 1)" class="ios-icon-button">
                <i data-feather="plus" class="w-4 h-4"></i>
              </button>
              <button onclick="removeItem(${item.id})" class="ios-icon-button text-ios-danger ml-2">
                <i data-feather="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-xl text-ios-primary">${rub.format(itemTotal)}</p>
            <p class="text-sm text-ios-text-secondary">${rub.format(item.price)} × ${item.qty}</p>
          </div>
        </div>
      </div>`;
  }).join('');
  cartTotal.textContent = rub.format(total);
  feather.replace();
}

function toggleCart(open){
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  if (!overlay || !drawer) return;

  if (open){
    overlay.classList.remove('hidden');
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('cart-drawer-open');
    renderCart();
  } else {
    overlay.classList.add('hidden');
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('cart-drawer-open'); // allow re-animate next time
  }
}

function checkout(){
  if (cart.length === 0) return;
  let message = 'Здравствуйте! Хочу оформить заказ:%0A%0A';
  let total = 0;
  cart.forEach(item => {
    const s = item.qty * item.price; total += s;
    message += `• ${item.name} — ${item.qty} шт. (${rub.format(item.price)}) = ${rub.format(s)}%0A`;
  });
  message += `%0AИтого: ${rub.format(total)}%0A%0AСообщите, пожалуйста, варианты доставки.`;
  window.open(`https://t.me/bokyed?text=${message}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart(); renderProducts(); updateCartCount();

  const cartFab = document.getElementById('cartFab');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartFab?.addEventListener('click', () => toggleCart(true));
  cartClose?.addEventListener('click', () => toggleCart(false));
  cartOverlay?.addEventListener('click', () => toggleCart(false));
  checkoutBtn?.addEventListener('click', checkout);

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleCart(false); });
});
