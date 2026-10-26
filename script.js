(function(){

  const FN = window.FN = window.FN || {};

  const CART_KEY = "frognutri_cart";

  const safeJSON = (v, f) => {
    try {
      return JSON.parse(v);
    } catch(e) {
      return f;
    }
  };

  /* =========================
     USER
     ========================= */

  FN.user = () => safeJSON(
    localStorage.getItem('fn_user'),
    ''
  );


  /* =========================
     SHARED CART
     DÙNG CHUNG VỚI product.html
     ========================= */

  FN.cart = () => {
    const cart = safeJSON(
      localStorage.getItem(CART_KEY),
      []
    );

    return Array.isArray(cart) ? cart : [];
  };


  FN.saveCart = (cart) => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );

    FN.updateCartCount();
  };


  FN.updateCartCount = () => {

    const total = FN.cart().reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );

    document
      .querySelectorAll('[data-cart-count]')
      .forEach(element => {
        element.textContent = total;
      });
  };


  /* =========================
     TOAST
     ========================= */

  FN.toast = (msg) => {

    const el = document.getElementById('toast');

    if (!el) return;

    el.textContent = msg;
    el.classList.add('show');

    clearTimeout(window.__fnToast);

    window.__fnToast = setTimeout(() => {
      el.classList.remove('show');
    }, 2800);
  };


  /* =========================
     MONEY
     ========================= */

  FN.money = (v) => {
    return Number(v).toLocaleString('vi-VN') + 'đ';
  };


  /* =========================
     PRODUCTS
     ID + PRICE ĐỒNG BỘ product.html
     ========================= */

  FN.products = [

    {
      id: 'bot-ech-nguyen-ban',
      name: 'Bột ếch nguyên bản',
      price: 30000,
      status: 'Đang bán',
      image: 'assets/img/bot-ech-nguyen-ban.jpg',
      desc: 'Sản phẩm bột ếch nguyên bản của FrogNutri.'
    },

    {
      id: 'bot-ech-mix-3-vi',
      name: 'Bột ếch mix 3 vị',
      price: 39000,
      status: 'Đang bán',
      image: 'assets/img/anh-sp.jpg',
      desc: 'Bột ếch kết hợp cùng 3 nguyên liệu thực vật.'
    },

    {
      id: 'khoai',
      name: 'Bột ếch + khoai lang tím',
      price: null,
      status: 'Nghiên cứu',
      image: 'assets/img/fallback-khoai.svg',
      desc: 'Công thức đang được nghiên cứu với khoai lang tím địa phương.'
    },

    {
      id: 'cai',
      name: 'Bột ếch + củ cải muối',
      price: null,
      status: 'Nghiên cứu',
      image: 'assets/img/fallback-cai.svg',
      desc: 'Phiên bản nghiên cứu khả năng kết hợp bột ếch với củ cải muối.'
    },

    {
      id: 'hu-dua',
      name: 'Bột ếch + củ hủ dừa',
      price: null,
      status: 'Nghiên cứu',
      image: 'assets/img/fallback-hudua.svg',
      desc: 'Phiên bản nghiên cứu kết hợp bột ếch với củ hủ dừa.'
    }

  ];


  /* =========================
     AUTH
     ========================= */

  // Website is public: browsing does not require an account.
  FN.requireAuth = () => true;

  /* =========================
     ADD TO CART
     ========================= */

  FN.addToCart = (id) => { window.open('https://www.tiktok.com/@frognutri_2627?_r=1&_t=ZS-9AWNxAIgA8j', '_blank', 'noopener,noreferrer'); return; /* cart disabled; orders continue on TikTok */

    if (!FN.requireAuth()) {
      return;
    }

    const product = FN.products.find(
      item => item.id === id
    );

    if (!product || product.price == null) {

      FN.toast(
        'Phiên bản này đang trong quá trình nghiên cứu.'
      );

      return;
    }

    const cart = FN.cart();

    const existing = cart.find(
      item => item.id === id
    );

    if (existing) {

      existing.quantity =
        Number(existing.quantity || 0) + 1;

    } else {

      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });

    }

    FN.saveCart(cart);

    FN.toast('Đã thêm sản phẩm vào giỏ 🛒');

    renderCartIfPresent();
  };


  /* =========================
     RENDER CART
     ========================= */

  function renderCartIfPresent() {

    const list = document.getElementById('cartList');

    if (!list) {
      return;
    }

    const cart = FN.cart();

    list.innerHTML = cart.length

      ? cart.map((item, index) => `

          <div class="order-item">

            <div>
              <b>${item.name}</b>
              <small>
                ${FN.money(item.price)} / túi
              </small>
            </div>

            <div class="qty">

              <button
                type="button"
                data-minus="${index}">
                −
              </button>

              <b>${item.quantity}</b>

              <button
                type="button"
                data-plus="${index}">
                +
              </button>

            </div>

            <b>
              ${FN.money(
                Number(item.price) *
                Number(item.quantity || 0)
              )}
            </b>

          </div>

        `).join('')

      : '<div class="empty">🛒 Chưa có sản phẩm trong giỏ.</div>';


    const total = cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
        Number(item.quantity || 0),
      0
    );


    const totalElement =
      document.getElementById('cartTotal');

    if (totalElement) {
      totalElement.textContent =
        FN.money(total);
    }


    /* GIẢM SỐ LƯỢNG */

    list
      .querySelectorAll('[data-minus]')
      .forEach(button => {

        button.onclick = () => {

          const cart = FN.cart();

          const index =
            Number(button.dataset.minus);

          if (!cart[index]) {
            return;
          }

          cart[index].quantity =
            Number(cart[index].quantity || 0) - 1;

          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }

          FN.saveCart(cart);

          renderCartIfPresent();
        };

      });


    /* TĂNG SỐ LƯỢNG */

    list
      .querySelectorAll('[data-plus]')
      .forEach(button => {

        button.onclick = () => {

          const cart = FN.cart();

          const index =
            Number(button.dataset.plus);

          if (!cart[index]) {
            return;
          }

          cart[index].quantity =
            Number(cart[index].quantity || 0) + 1;

          FN.saveCart(cart);

          renderCartIfPresent();
        };

      });

  }


  /* =========================
     RENDER PRODUCTS
     ========================= */

  function renderProducts() {

    const box =
      document.getElementById('productList');

    if (!box) {
      return;
    }

    box.innerHTML = FN.products
      .map(product => `

        <article class="card product-card">

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <span class="tag">
            ${product.status}
          </span>

          <h3>
            ${product.name}
          </h3>

          <p>
            ${product.desc}
          </p>

          <div class="price">
            ${
              product.price != null
                ? FN.money(product.price)
                : 'Chưa công bố giá'
            }
          </div>

          <button
            class="btn ${
              product.price != null
                ? 'primary'
                : 'secondary'
            } full"

            ${
              product.price != null
                ? ''
                : 'disabled'
            }

            data-add="${product.id}"
          >

            ${
              product.price != null
                ? 'Thêm vào giỏ 🛒'
                : 'Đang nghiên cứu'
            }

          </button>

        </article>

      `)
      .join('');


    box
      .querySelectorAll('[data-add]')
      .forEach(button => {

        button.onclick = () => {

          FN.addToCart(
            button.dataset.add
          );

        };

      });

  }


  /* =========================
     AUTH
     ========================= */

  function setupAuth() {

    document
      .querySelectorAll('[data-open-auth]')
      .forEach(button => {

        button.onclick = () => {

          const modal =
            document.getElementById('authModal');

          if (!modal) {
            return;
          }

          modal.classList.add('show');

          const mode =
            button.dataset.openAuth;

          document
            .querySelectorAll('[data-auth-mode]')
            .forEach(element => {

              element.classList.toggle(
                'active',
                element.dataset.authMode === mode
              );

            });

        };

      });


    document
      .querySelectorAll('[data-close-auth]')
      .forEach(button => {

        button.onclick = () => {

          document
            .getElementById('authModal')
            ?.classList.remove('show');

        };

      });


    const form =
      document.getElementById('authForm');

    if (form) {

      form.onsubmit = event => {

        event.preventDefault();

        const name =
          document.getElementById('authName')
            ?.value.trim();

        const email =
          document.getElementById('authEmail')
            ?.value.trim();

        if (!name || !email) {

          FN.toast(
            'Vui lòng nhập đủ thông tin.'
          );

          return;
        }


        localStorage.setItem(
          'fn_user',
          JSON.stringify({
            name,
            email
          })
        );


        document
          .getElementById('authModal')
          ?.classList.remove('show');


        FN.updateAccountUI();

        FN.toast(
          'Đăng nhập thành công ✨'
        );

      };

    }

  }


  /* =========================
     ACCOUNT
     ========================= */

  FN.updateAccountUI = () => {

    const user = FN.user();

    document
      .querySelectorAll('[data-account-name]')
      .forEach(element => {

        element.textContent =
          user ? user.name : 'Khách';

      });


    document
      .querySelectorAll('[data-login]')
      .forEach(element => {

        element.textContent =
          user ? 'Đã đăng nhập' : 'Đăng nhập';

      });


    document
      .querySelectorAll('[data-logout]')
      .forEach(element => {

        element.style.display =
          user ? 'inline-flex' : 'none';

      });

  };


  function setupAccount() {

    const logout =
      document.querySelector('[data-logout]');

    if (!logout) {
      return;
    }

    logout.onclick = () => {

      localStorage.removeItem(
        'fn_user'
      );

      FN.updateAccountUI();

      FN.toast(
        'Đã đăng xuất.'
      );

    };

  }


  /* =========================
     ORDER
     ========================= */

  function setupOrder() {

    renderProducts();

    renderCartIfPresent();

    const form =
      document.getElementById('checkoutForm');

    const gate =
      document.getElementById('orderGate');

    if (!form) {
      return;
    }


    const reveal = () => {

      if (!FN.requireAuth()) {
        return;
      }

      if (!FN.cart().length) {

        FN.toast(
          'Giỏ hàng đang trống 🛒'
        );

        return;
      }

      gate?.classList.add('hidden');

      form.classList.remove('hidden');

      const user = FN.user();

      if (user) {

        const name =
          document.getElementById('shipName');

        if (name) {
          name.value = user.name || '';
        }

      }

    };


    document
      .getElementById('checkoutBtn')
      ?.addEventListener(
        'click',
        reveal
      );


    if (FN.user()) {

      gate?.classList.add('hidden');

      form.classList.remove('hidden');

      const user = FN.user();

      const name =
        document.getElementById('shipName');

      if (name) {
        name.value = user.name || '';
      }

    }


    form.onsubmit = event => {

      event.preventDefault();

      if (!FN.requireAuth()) {
        return;
      }

      const cart = FN.cart();

      if (!cart.length) {

        FN.toast(
          'Giỏ hàng đang trống.'
        );

        return;
      }


      const order = {

        id:
          'FN-' +
          Date.now()
            .toString()
            .slice(-6),

        items: cart,

        name:
          document.getElementById(
            'shipName'
          )?.value || '',

        phone:
          document.getElementById(
            'shipPhone'
          )?.value || '',

        address:
          document.getElementById(
            'shipAddress'
          )?.value || '',

        note:
          document.getElementById(
            'shipNote'
          )?.value || '',

        date:
          new Date().toLocaleString('vi-VN')

      };


      const orders =
        safeJSON(
          localStorage.getItem('fn_orders'),
          []
        ) || [];


      orders.unshift(order);


      localStorage.setItem(
        'fn_orders',
        JSON.stringify(orders)
      );


      /* XÓA GIỎ HÀNG CHUNG */

      FN.saveCart([]);


      form.reset();


      if (FN.user()) {

        const name =
          document.getElementById('shipName');

        if (name) {
          name.value =
            FN.user().name || '';
        }

      }


      const result =
        document.getElementById(
          'orderResult'
        );

      if (result) {

        result.innerHTML = `

          <div class="success">

            <b>
              🎉 Đã tiếp nhận đơn #${order.id}
            </b>

            <p>
              FrogNutri sẽ gọi xác minh trong
              khung 13:00–20:00,
              từ thứ Hai đến thứ Bảy.
            </p>

          </div>

        `;

      }


      renderCartIfPresent();

      FN.toast(
        'Đã gửi thông tin đặt mua ✨'
      );

    };

  }


  /* =========================
     SURVEY
     ========================= */

  function setupSurvey() {

    const form =
      document.getElementById('surveyForm');

    if (!form) {
      return;
    }

    form.onsubmit = event => {

      event.preventDefault();

      const data =
        Object.fromEntries(
          new FormData(form)
        );


      const surveys =
        safeJSON(
          localStorage.getItem('fn_surveys'),
          []
        ) || [];


      surveys.push({

        ...data,

        date:
          new Date()
            .toLocaleString('vi-VN')

      });


      localStorage.setItem(
        'fn_surveys',
        JSON.stringify(surveys)
      );


      form.reset();


      const result =
        document.getElementById(
          'surveyResult'
        );

      if (result) {

        result.innerHTML =
          '<div class="success">' +
          'Cảm ơn bạn đã đóng góp ý kiến cho FrogNutri! 🌱' +
          '</div>';

      }

    };

  }


  /* =========================
     STORAGE SYNC
     ========================= */

  window.addEventListener(
    'storage',
    event => {

      if (event.key === CART_KEY) {

        FN.updateCartCount();

        renderCartIfPresent();

      }

    }
  );


  /* =========================
     PAGE SHOW
     ========================= */

  window.addEventListener(
    'pageshow',
    () => {

      FN.updateCartCount();

      renderCartIfPresent();

    }
  );


  /* =========================
     INIT
     ========================= */

  document.addEventListener(
    'DOMContentLoaded',
    () => {

      document
        .querySelectorAll('.reveal')
        .forEach(element => {

          if (
            !('IntersectionObserver' in window)
          ) {

            element.classList.add(
              'is-visible'
            );

            return;

          }


          const observer =
            new IntersectionObserver(
              entries => {

                entries.forEach(entry => {

                  if (
                    entry.isIntersecting
                  ) {

                    entry.target.classList.add(
                      'is-visible'
                    );

                    observer.unobserve(
                      entry.target
                    );

                  }

                });

              },
              {
                threshold: .08
              }
            );


          observer.observe(element);

        });


      document
        .querySelectorAll('[data-mobile]')
        .forEach(button => {

          button.onclick = () => {

            document
              .querySelector('.links')
              ?.classList.toggle('open');

          };

        });


      FN.updateCartCount();

      FN.updateAccountUI();

      setupAuth();

      setupAccount();

      setupOrder();

      setupSurvey();


      document
        .querySelectorAll('[data-logout]')
        .forEach(button => {

          button.style.display =
            FN.user()
              ? 'inline-flex'
              : 'none';

        });

    }
  );

})();

/* =========================================================
   FrogNutri shared shell + persistent Supabase session guard
   Auth accounts are stored by Supabase Auth, not plain localStorage.
   ========================================================= */
(function frogNutriSharedShell(){
  const FB_URL='https://www.facebook.com/share/1M3Qi7Em8s/?mibextid=wwXIfr';
  const TIKTOK_URL='https://www.tiktok.com/@frognutri_2627?_r=1&_t=ZS-9AWNxAIgA8j';
  const fbSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8z"/></svg>';
  const ttSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.8 6.8 0 0 1-4.2-1.4v8.1a5.8 5.8 0 1 1-5-5.7v3.2a2.7 2.7 0 1 0 1.9 2.6V2.5h3.1c.2 2 1.8 3.6 4.2 3.9z"/></svg>';
  const escAttr = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  function unifyHeader(){
    document.querySelectorAll('.brand').forEach(brand=>{
      if(!brand.querySelector('.brand-socials')){
        const group=document.createElement('span'); group.className='brand-socials';
        group.innerHTML='<a class="brand-social fb" href="'+escAttr(FB_URL)+'" target="_blank" rel="noopener noreferrer" aria-label="Facebook FrogNutri" title="Facebook">'+fbSvg+'</a><a class="brand-social tt" href="'+escAttr(TIKTOK_URL)+'" target="_blank" rel="noopener noreferrer" aria-label="TikTok Shop FrogNutri" title="TikTok Shop">'+ttSvg+'</a>';
        brand.appendChild(group);
      }
    });
    document.querySelectorAll('.nav .links').forEach(links=>{
      if(!links.querySelector('.facebook-nav')){
        const a=document.createElement('a');a.className='social-nav facebook-nav';a.href=FB_URL;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','Facebook FrogNutri');a.innerHTML=fbSvg+'<span>Facebook</span>';links.appendChild(a);
      }
      if(!links.querySelector('.tiktok-nav')){
        const a=document.createElement('a');a.className='social-nav tiktok-nav';a.href=TIKTOK_URL;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label','TikTok Shop FrogNutri');a.innerHTML=ttSvg+'<span>TikTok Shop</span>';links.appendChild(a);
      }
    });
    document.querySelectorAll('[data-mobile]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.nav-inner')?.querySelector('.links')?.classList.toggle('open')));
  }
  // Public access: do not initialize auth or redirect visitors to an account page.
  function protectPages(){
    document.documentElement.classList.remove('fn-auth-check');
    document.documentElement.style.visibility = 'visible';
  }
  document.addEventListener('DOMContentLoaded',()=>{unifyHeader();protectPages();});
})();
