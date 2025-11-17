/* Jul.Candles — финальный script.js
   - Карточка: стеклянная плитка + мини‑карусель фото
   - Клик по карточке/кнопке → оверлей
   - Оверлей: карусель, выбор аромата и количества
   - В корзине каждая (товар + аромат) живёт отдельной позицией
   - Справа выезжающая корзина + оформление в Telegram
   - Форма «давайте дружить» тоже формирует сообщение в Telegram
*/

/* -----------------------------
   ДАННЫЕ ТОВАРОВ (ПРИМЕР)
   ----------------------------- */

const scents_list = ['Мандарин',
  'Мамин какао',
  'Имбирный пряник',
  'Морозное утро',
  'Пряный глинтвейн',
  'Рождественский очаг',
  'Сибирская облепиха',
]
const products = [
  {
    id: 1,
    name: 'Мандаринка',
    price: 300,
    desc: 'Свеча, которая точно скрасит празднование Нового Года',
    imgs: [
      'resource/cards_image/manda_solo.jpg',
      'resource/cards_image/manda_k.jpg',
      'resource/cards_image/manda_3k.jpg',
      'resource/cards_image/manda_mnogo.jpg'
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 2,
    name: 'Ёлка',
    price: 500,
    desc: 'Подарит атмосферу зимних праздников',
    imgs: [
      'resource/cards_image/elka_state_sneg.jpg',
      'resource/cards_image/elka_r.jpg',
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 3,
    name: 'Карусель (Белая)',
    price: 1500,
    desc: 'Свеча, возвращающая в детство',
    imgs: [
      'resource/cards_image/white_solo.jpg',
      'resource/cards_image/test.jpg',
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 4,
    name: 'Карусель (Красная)',
    price: 1500,
    desc: 'Свеча, возвращающая в детство',
    imgs: [
      'resource/cards_image/res_solo.jpg',
      'resource/cards_image/test.jpg',
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 5,
    name: 'Новогодний шарик',
    price: 700,
    desc: 'Идеальное дополнение к новогоднему декору',
    imgs: [
      'resource/cards_image/white.jpg',
      'resource/cards_image/white_state.jpg',
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 6,
    name: 'Олень',
    price: 400,
    desc: 'Дарит атмосферу уюта',
    imgs: [
      'resource/cards_image/olen_k.jpg',
      'resource/cards_image/olen_e.jpg',
      'resource/cards_image/olen_state.jpg',
    ],
    scents: scents_list,
    badge: 'хит'
  },
  {
    id: 7,
    name: 'Свечка в банке',
    price: 900,
    desc: 'Скрасит зимние вечера',
    imgs: [
      'resource/cards_image/banka_ip.jpg',
      'resource/cards_image/banka_m.jpg',
      'resource/cards_image/banka_mk.jpg',
      'resource/cards_image/banka_nu.jpg',
      'resource/cards_image/banka_pg.jpg',
      'resource/cards_image/banka_ro.jpg',
      'resource/cards_image/banka_so.jpg',

    ],
    scents: scents_list,
    badge: 'хит',
  },
]


/* -----------------------------
   СОСТОЯНИЕ И УТИЛИТЫ
   ----------------------------- */

let cart = [];
const LS_KEY = 'jul_cart_v2';
const rub = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0
});

const VISIBLE_STEP = 6;
let visibleCount = VISIBLE_STEP;

function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function qs(sel, root = document) {
  return root.querySelector(sel);
}
function qsa(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/* -----------------------------
   ИНЖЕКЦИЯ СТИЛЕЙ
   ----------------------------- */

function injectOverlayCSS() {
  if (document.getElementById('jul-overlay-styles')) return;
  const css = `
  /* ============= CARD AS ONE TILE ============= */
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 24px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 8px 32px rgba(31,38,135,0.15);
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease;
    height: 100%;
  }

  .product-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(31,38,135,0.25);
  }

  .pc-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .pc-title {
    margin: 4px 0 0;
    font-weight: 600;
  }

  .pc-desc {
    margin: 0;
    color: #8E8E93;
  }

  .pc-foot {
    margin-top: auto;
    padding-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .pc-price {
    font-weight: 600;
  }

  /* In-card carousel */
  .pc-media {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }
  .pc-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
    transition: transform .25s ease;
  }
  .product-card:hover .pc-img { transform: scale(1.05); }
  .pc-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(0,0,0,0.35);
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
  }
  .pc-prev { left: 8px; }
  .pc-next { right: 8px; }
  .pc-dots {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 4px;
    z-index: 2;
  }
  .pc-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.6);
  }
  .pc-dot.active { background: #007AFF; }

  /* ============= OVERLAY ============= */
  .product-overlay {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }
  .product-overlay.open { display: flex; }
  .product-overlay-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(10px);
  }
  .product-overlay-content {
    position: relative;
    max-width: 960px;
    width: 100%;
    margin: 16px;
    z-index: 1;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(31,38,135,0.15);
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(20px) saturate(180%);
  }
  .overlay-layout {
    display: grid;
    grid-template-columns: minmax(0,1.1fr) minmax(0,1fr);
    gap: 24px;
    padding: 24px;
  }
  @media (max-width: 768px) {
    .overlay-layout { grid-template-columns: 1fr; }
  }
  .overlay-close {
    position: absolute;
    top: 12px;
    right: 12px;
    border: none;
    background: rgba(255,255,255,0.85);
    border-radius: 999px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 18px;
    line-height: 32px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .overlay-media {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
  }
  .overlay-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }
  .overlay-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: rgba(0,0,0,0.35);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .overlay-prev { left: 12px; }
  .overlay-next { right: 12px; }
  .overlay-dots {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
  }
  .overlay-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.5);
    cursor: pointer;
  }
  .overlay-dot.active { background: #007AFF; }
  .overlay-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .overlay-title { margin: 0; }
  .overlay-desc { margin: 0; }
  .overlay-price { font-weight: 600; font-size: 18px; }

  .overlay-label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 14px;
    position: relative;
  }

  .overlay-qty {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14px;
  }
  .overlay-qty-label {
    color: #111111;
  }

  .overlay-info,
  .overlay-title,
  .overlay-desc,
  .overlay-price,
  .overlay-label,
  .overlay-qty-label {
    color: #111111;
  }

  /* скрытый select — стили не критичны, он hidden */
  #overlayScent {
    width: 100%;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,0.12);
    padding: 10px 40px 10px 16px;
    background: rgba(255,255,255,0.95);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    font-size: 14px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  .overlay-qty-ctrl {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    border-radius: 999px;
    background: rgba(255,255,255,0.9);
    border: 1px solid #C6C6C8;
  }
  .overlay-qty-ctrl button {
    width: 28px;
    height: 28px;
    border-radius: 999px;
    border: none;
    background: rgba(0,0,0,0.06);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  #overlayQty {
    width: 48px;
    border: none;
    text-align: center;
    font-size: 15px;
    background: transparent;
    outline: none;
  }

  #overlayAddToCart {
    margin-top: 12px;
    align-self: flex-start;
    padding: 10px 20px;
    border-radius: 999px;
    border: none;
    background: linear-gradient(135deg, #ff9500 0%, #ff3b30 100%);
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(255,149,0,0.4);
    transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
  }
  #overlayAddToCart:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 32px rgba(255,149,0,0.55);
    filter: brightness(1.03);
  }
  #overlayAddToCart:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(255,149,0,0.35);
  }

  /* Кастомный dropdown */
  .overlay-select {
    position: relative;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,0.12);
    padding: 10px 40px 10px 16px;
    background: rgba(255,255,255,0.95);
    box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    font-size: 14px;
    cursor: pointer;
  }
  .overlay-select::after {
    content: "▾";
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: rgba(0,0,0,0.5);
  }
  .overlay-select-current {
    display: inline-block;
  }
  .overlay-select-options {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 4px;
    border-radius: 16px;
    background: rgba(255,255,255,0.98);
    box-shadow: 0 16px 40px rgba(0,0,0,0.2);
    max-height: 260px;
    overflow-y: auto;
    z-index: 5;
  }
  .overlay-select-option {
    padding: 8px 14px;
    font-size: 14px;
  }
  .overlay-select-option:hover {
    background: rgba(0,0,0,0.04);
  }
  `;
  const style = document.createElement('style');
  style.id = 'jul-overlay-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/* -----------------------------
   ИНЖЕКЦИЯ РАЗМЕТКИ ОВЕРЛЕЯ
   ----------------------------- */

function injectOverlayHTML() {
  if (document.getElementById('productOverlay')) return;

  const tpl = document.createElement('div');
  tpl.innerHTML = `
    <div id="productOverlay" class="product-overlay" aria-hidden="true">
      <div class="product-overlay-backdrop"></div>
      <div class="product-overlay-content">
        <button class="overlay-close" type="button" aria-label="Закрыть">×</button>
        <div class="overlay-layout">
          <div class="overlay-media">
            <button class="overlay-nav overlay-prev" type="button">‹</button>
            <img class="overlay-img" src="" alt="">
            <button class="overlay-nav overlay-next" type="button">›</button>
            <div class="overlay-dots"></div>
          </div>
          <div class="overlay-info">
            <h2 class="overlay-title"></h2>
            <p class="overlay-desc"></p>
            <div class="overlay-price"></div>

            <div class="overlay-label">
              <span>Аромат</span>
              <div id="overlayScentCustom" class="overlay-select"></div>
              <select id="overlayScent" hidden></select>
            </div>

            <div class="overlay-qty">
              <span class="overlay-qty-label">Количество</span>
              <div class="overlay-qty-ctrl">
                <button type="button" class="overlay-qty-dec">−</button>
                <input id="overlayQty" type="number" min="1" value="1" inputmode="numeric">
                <button type="button" class="overlay-qty-inc">+</button>
              </div>
            </div>

            <button id="overlayAddToCart" class="btn btn-primary btn-large" type="button">
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(tpl.firstElementChild);
}

/* -----------------------------
   ОВЕРЛЕЙ: ЛОГИКА
   ----------------------------- */

let currentProduct = null;
let currentImageIndex = 0;

function overlayRefs() {
  const overlayEl = document.getElementById('productOverlay');
  return {
    overlayEl,
    overlayImg: qs('.overlay-img', overlayEl),
    overlayTitle: qs('.overlay-title', overlayEl),
    overlayDesc: qs('.overlay-desc', overlayEl),
    overlayPrice: qs('.overlay-price', overlayEl),
    overlayScentSelect: qs('#overlayScent', overlayEl), // скрытый select
    overlayDots: qs('.overlay-dots', overlayEl),
    overlayAddBtn: qs('#overlayAddToCart', overlayEl),
    overlayClose: qs('.overlay-close', overlayEl),
    overlayBackdrop: qs('.product-overlay-backdrop', overlayEl),
    overlayPrev: qs('.overlay-prev', overlayEl),
    overlayNext: qs('.overlay-next', overlayEl),
    overlayQtyInput: qs('#overlayQty', overlayEl),
    overlayQtyInc: qs('.overlay-qty-inc', overlayEl),
    overlayQtyDec: qs('.overlay-qty-dec', overlayEl)
  };
}

function renderOverlayImages(product) {
  const { overlayImg, overlayDots } = overlayRefs();
  if (!product.imgs || !product.imgs.length) {
    overlayImg.src = '';
    overlayImg.alt = '';
    overlayDots.innerHTML = '';
    return;
  }
  overlayImg.src = product.imgs[currentImageIndex];
  overlayImg.alt = product.name;
  overlayDots.innerHTML = product.imgs
    .map(
      (_, idx) =>
        `<span class="overlay-dot ${idx === currentImageIndex ? 'active' : ''}" data-idx="${idx}"></span>`
    )
    .join('');
}

/* кастомный дропдаун для аромата */
function renderScentSelect(product) {
  const selectHidden = document.getElementById('overlayScent');
  const selectCustom = document.getElementById('overlayScentCustom');
  if (!selectHidden || !selectCustom) return;

  const scents = Array.isArray(product.scents) ? product.scents : [];

  // очищаем на случай повторного открытия
  selectHidden.innerHTML = '';
  selectCustom.innerHTML = '';

  // заполняем скрытый select
  selectHidden.innerHTML = scents
    .map((s) => `<option value="${s}">${s}</option>`)
    .join('');

  // видимая текущая подпись
  const current = document.createElement('span');
  current.className = 'overlay-select-current';
  current.textContent = scents[0] || '';
  selectCustom.appendChild(current);

  // список опций
  const list = document.createElement('div');
  list.className = 'overlay-select-options';
  list.innerHTML = scents
    .map((s) => `<div class="overlay-select-option" data-value="${s}">${s}</div>`)
    .join('');
  selectCustom.appendChild(list);
  list.style.display = 'none';

  // открытие/закрытие списка
  selectCustom.onclick = (e) => {
    e.stopPropagation();
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
  };

  // выбор опции
  list.addEventListener('click', (e) => {
    e.stopPropagation(); // не даём клику всплыть до selectCustom
    const opt = e.target.closest('.overlay-select-option');
    if (!opt) return;
    const value = opt.dataset.value;
    selectHidden.value = value;      // ставим выбранный аромат
    current.textContent = value;     // обновляем текст в «таблетке»
    list.style.display = 'none';     // закрываем список
  });

  // клик вне — закрыть
  document.addEventListener(
    'click',
    (e) => {
      if (!selectCustom.contains(e.target)) {
        list.style.display = 'none';
      }
    },
    { once: true }
  );
}

function openProductOverlay(product) {
  const {
    overlayEl,
    overlayTitle,
    overlayDesc,
    overlayPrice,
    overlayQtyInput
  } = overlayRefs();

  currentProduct = product;
  currentImageIndex = 0;

  overlayTitle.textContent = product.name;
  overlayDesc.textContent = product.desc || '';
  overlayPrice.textContent = rub.format(product.price);

  if (overlayQtyInput) overlayQtyInput.value = '1';

  renderOverlayImages(product);
  renderScentSelect(product); // кастомный список ароматов

  overlayEl.classList.add('open');
  overlayEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProductOverlay() {
  const { overlayEl } = overlayRefs();
  overlayEl.classList.remove('open');
  overlayEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentProduct = null;
}

function bindOverlayEvents() {
  const {
    overlayDots,
    overlayPrev,
    overlayNext,
    overlayAddBtn,
    overlayClose,
    overlayBackdrop,
    overlayScentSelect,
    overlayQtyInput,
    overlayQtyInc,
    overlayQtyDec
  } = overlayRefs();

  overlayClose.addEventListener('click', closeProductOverlay);
  overlayBackdrop.addEventListener('click', closeProductOverlay);

  overlayPrev.addEventListener('click', () => {
    if (!currentProduct?.imgs?.length) return;
    currentImageIndex =
      (currentImageIndex - 1 + currentProduct.imgs.length) %
      currentProduct.imgs.length;
    renderOverlayImages(currentProduct);
  });

  overlayNext.addEventListener('click', () => {
    if (!currentProduct?.imgs?.length) return;
    currentImageIndex =
      (currentImageIndex + 1) % currentProduct.imgs.length;
    renderOverlayImages(currentProduct);
  });

  overlayDots.addEventListener('click', (e) => {
    const dot = e.target.closest('.overlay-dot');
    if (!dot || !currentProduct) return;
    currentImageIndex = Number(dot.dataset.idx) || 0;
    renderOverlayImages(currentProduct);
  });

  function normQty() {
    if (!overlayQtyInput) return 1;
    const raw = parseInt(overlayQtyInput.value, 10);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }

  overlayQtyDec?.addEventListener('click', () => {
    if (!overlayQtyInput) return;
    const q = Math.max(1, normQty() - 1);
    overlayQtyInput.value = String(q);
  });

  overlayQtyInc?.addEventListener('click', () => {
    if (!overlayQtyInput) return;
    const q = normQty() + 1;
    overlayQtyInput.value = String(q);
  });

  overlayAddBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const scent = overlayScentSelect.value;
    const qty = overlayQtyInput
      ? Math.max(1, parseInt(overlayQtyInput.value, 10) || 1)
      : 1;
    addConfiguredToCart(currentProduct, scent, qty);
    closeProductOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qs('.product-overlay.open')) {
      closeProductOverlay();
    }
  });
}

/* -----------------------------
   КОРЗИНА
   ----------------------------- */

function addConfiguredToCart(product, scent, qty = 1) {
  if (!product) return;

  const key = `${product.id}_${scent || ''}`;
  const amount = Math.max(1, qty | 0);

  const existing = cart.find((item) => item.key === key);
  if (existing) {
    existing.qty += amount;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      price: product.price,
      scent: scent || null,
      qty: amount
    });
  }

  saveCart();
  updateCartCount();
  renderCart();
}

function updateQty(key, delta) {
  const item = cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.key !== key);
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(key) {
  cart = cart.filter((i) => i.key !== key);
  saveCart();
  updateCartCount();
  renderCart();
}

function renderCart() {
  const list =
    document.getElementById('cartList') ||
    document.getElementById('cartItems');
  const totalEl =
    document.getElementById('cartTotal') ||
    document.getElementById('cartTotalSum');

  if (list) {
    if (!cart.length) {
      list.innerHTML = `<div class="cart-empty">Ваша корзина пуста</div>`;
    } else {
      list.innerHTML = cart
        .map((item) => {
          const itemTotal = item.price * item.qty;
          return `
          <div class="cart-item" data-key="${item.key}">
            <div class="cart-item-main">
              <div class="cart-item-title">${item.name}</div>
              ${item.scent
              ? `<div class="cart-item-scent">${item.scent}</div>`
              : ``
            }
            </div>
            <div class="cart-item-ctrl">
              <button class="ci-dec" type="button">−</button>
              <span class="ci-qty">${item.qty}</span>
              <button class="ci-inc" type="button">+</button>
              <div class="ci-sum">${rub.format(itemTotal)}</div>
              <button class="ci-del" type="button" aria-label="Удалить">×</button>
            </div>
          </div>
        `;
        })
        .join('');

      qsa('.cart-item', list).forEach((row) => {
        const key = row.dataset.key;
        const dec = qs('.ci-dec', row);
        const inc = qs('.ci-inc', row);
        const del = qs('.ci-del', row);
        dec?.addEventListener('click', () => updateQty(key, -1));
        inc?.addEventListener('click', () => updateQty(key, +1));
        del?.addEventListener('click', () => removeFromCart(key));
      });
    }
  }

  if (totalEl) {
    const total = cart.reduce(
      (sum, i) => sum + i.price * i.qty,
      0
    );
    totalEl.textContent = rub.format(total);
  }
}

function checkoutTelegram() {
  if (!cart.length) return;

  const lines = cart.map((item) => {
    const scentPart = item.scent ? ` (${item.scent})` : '';
    return `• ${item.name}${scentPart} × ${item.qty} = ${item.price * item.qty
      }₽`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const text = encodeURIComponent(
    `Здравствуйте! Хочу оформить заказ:\n` +
    lines.join('\n') +
    `\nИтого: ${total}₽`
  );

  window.open(`https://t.me/bokyed?text=${text}`, '_blank');
}

/* -----------------------------
   ФОРМА «ДАВАЙТЕ ДРУЖИТЬ» → TELEGRAM
   ----------------------------- */

function submitCollabToTelegram() {
  const nameInput = document.getElementById('collabName');
  const emailInput = document.getElementById('collabEmail');
  const projectInput = document.getElementById('collabProject');

  if (!nameInput || !emailInput || !projectInput) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const project = projectInput.value.trim();

  if (!name || !email || !project) {
    alert('Пожалуйста, заполните все поля формы.');
    return;
  }

  const text = encodeURIComponent(
    `Новая заявка на сотрудничество:\n` +
    `Имя: ${name}\n` +
    `E-mail: ${email}\n` +
    `Проект: ${project}`
  );

  window.open(`https://t.me/bokyed?text=${text}`, '_blank');
}

/* -----------------------------
   ВЫЕЗЖАЮЩАЯ КОРЗИНА (SIDEBAR)
   ----------------------------- */

function bindCartDrawer() {
  const fab = document.getElementById('cartFab');
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  const closeBtn = document.getElementById('cartClose');

  if (!fab || !drawer) return;

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  fab.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
}

/* -----------------------------
   РЕНДЕР КАТАЛОГА (+ LOAD MORE)
   ----------------------------- */

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  const slice = products.slice(0, visibleCount);

  grid.innerHTML = slice
    .map((product) => {
      const firstImg = product.imgs?.[0] || '';
      const dots = (product.imgs || [])
        .map(
          (_, i) =>
            `<span class="pc-dot ${i === 0 ? 'active' : ''
            }" data-idx="${i}"></span>`
        )
        .join('');
      return `
      <article class="product-card" data-id="${product.id}">
        <div class="pc-media">
          <button class="pc-nav pc-prev" type="button" aria-label="Предыдущее фото">‹</button>
          <img class="pc-img" src="${firstImg}" alt="${product.name}">
          <button class="pc-nav pc-next" type="button" aria-label="Следующее фото">›</button>
          <div class="pc-dots">${dots}</div>
        </div>
        <div class="pc-body">
          <h3 class="pc-title">${product.name}</h3>
          ${product.desc ? `<p class="pc-desc">${product.desc}</p>` : ``
        }
          <div class="pc-foot">
            <div class="pc-price">${rub.format(product.price)}</div>
            <button class="btn btn-primary btn-add" type="button">Добавить в корзину</button>
          </div>
        </div>
      </article>
    `;
    })
    .join('');

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      visibleCount < products.length ? 'inline-flex' : 'none';
  }

  qsa('.product-card', grid).forEach((card) => {
    const id = Number(card.dataset.id);
    const product = products.find((p) => p.id === id);
    if (!product) return;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add')) return;
      if (e.target.closest('.pc-nav')) return;
      if (e.target.closest('.pc-dots')) return;
      openProductOverlay(product);
    });

    const addBtn = qs('.btn-add', card);
    addBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductOverlay(product);
    });

    const imgEl = qs('.pc-img', card);
    const prev = qs('.pc-prev', card);
    const next = qs('.pc-next', card);
    const dotsWrap = qs('.pc-dots', card);
    let idx = 0;

    function updateCardImage() {
      if (!product.imgs?.length) return;
      imgEl.src = product.imgs[idx];
      qsa('.pc-dot', dotsWrap).forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }

    prev?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!product.imgs?.length) return;
      idx =
        (idx - 1 + product.imgs.length) %
        product.imgs.length;
      updateCardImage();
    });

    next?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!product.imgs?.length) return;
      idx = (idx + 1) % product.imgs.length;
      updateCardImage();
    });

    dotsWrap?.addEventListener('click', (e) => {
      e.stopPropagation();
      const dot = e.target.closest('.pc-dot');
      if (!dot) return;
      idx = Number(dot.dataset.idx) || 0;
      updateCardImage();
    });
  });
}

/* -----------------------------
   ИНИЦИАЛИЗАЦИЯ
   ----------------------------- */

function init() {
  injectOverlayCSS();
  injectOverlayHTML();
  bindOverlayEvents();
  bindCartDrawer();
  loadCart();
  updateCartCount();
  renderCart();
  renderProducts();

  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn?.addEventListener('click', checkoutTelegram);

  const collabBtn = document.getElementById('collabSubmit');
  collabBtn?.addEventListener('click', submitCollabToTelegram);

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn?.addEventListener('click', () => {
    visibleCount += VISIBLE_STEP;
    renderProducts();
  });
}

document.addEventListener('DOMContentLoaded', init);
