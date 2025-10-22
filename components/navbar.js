class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        :host {
          display: block;
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        }
        nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .brand {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .brand:hover {
          transform: translateY(-1px);
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .nav-links {
          display: none;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          transition: all 0.3s;
          position: relative;
        }
        .nav-links a:hover {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transform: translateY(-1px);
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s;
          transform: translateX(-50%);
        }
        .nav-links a:hover::after {
          width: 80%;
        }
        .cart-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #1a1a1a;
          border-radius: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 16px rgba(31, 38, 135, 0.15);
        }
        .cart-button:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(31, 38, 135, 0.25);
        }
        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          color: #000;
        }
        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }
        @media (max-width: 767px) {
          .mobile-menu-button { display: block; }
          .cart-button { display: none; }
        }
      </style>
      <nav>
        <a href="#home" class="brand">🕯️ Jul.candles</a>
        <ul class="nav-links">
          <li><a href="#collection">Коллекция</a></li>
          <li><a href="#story">История</a></li>
          <li><a href="#faq">FAQ</a></li>
          <li>
            <button class="cart-button" id="openCart" type="button" aria-label="Открыть корзину">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Корзина
            </button>
          </li>
        </ul>
        <button class="mobile-menu-button" aria-label="Меню">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </nav>
    `;

    const cartButton = this.shadowRoot.getElementById('openCart');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        const cartFab = document.getElementById('cartFab');
        if (cartFab) cartFab.click();
      });
    }

    const links = this.shadowRoot.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
}
customElements.define('custom-navbar', CustomNavbar);
