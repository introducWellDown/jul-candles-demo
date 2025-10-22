class CustomFooter extends HTMLElement{
  connectedCallback(){
    const year = new Date().getFullYear();
    this.attachShadow({mode:'open'});
    this.shadowRoot.innerHTML = `
      <style>
        :host{ display:block }
        footer{
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(255,255,255,0.3);
          color:#1a1a1a;
          margin-top: 40px;
        }
        .wrap{
          max-width:1120px; margin:0 auto; padding:22px 20px;
          display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap:16px;
        }
        h4{ margin:0 0 10px; font-size: 15px; color:#1a1a1a }
        a{ color:#1a1a1a; text-decoration:none }
        a:hover{ text-decoration:underline }
        .copy{ border-top:1px solid rgba(255,255,255,0.3); text-align:center; padding:12px 20px; opacity:.9 }
      </style>
      <footer>
        <div class="wrap">
          <div>
            <h4>Jul.candles</h4>
            <p>Ручные свечи из соевого воска и эфирных масел.</p>
          </div>
          <div>
            <h4>Навигация</h4>
            <div><a href="#collection">Коллекция</a></div>
            <div><a href="#story">История</a></div>
            <div><a href="#faq">FAQ</a></div>
          </div>
          <div>
            <h4>Контакты</h4>
            <div><a href="mailto:hello@julcandles.com">hello@julcandles.com</a></div>
            <div><a href="tel:+123456789">+1 (234) 567‑89</a></div>
          </div>
        </div>
        <div class="copy">© ${year} Jul.candles</div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);
