/* =========================
   Lightweight cart (localStorage)
========================= */
const CART_KEY = "demo_cart_v1";
const SHIPPING = 7.00;

function getCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function setCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function money(n){ return Number(n).toFixed(2); }

function calcSubtotal(items){
  return items.reduce((sum, it) => sum + (it.price * it.qty), 0);
}

function renderMini(){
  const items = getCart();
  const count = items.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = calcSubtotal(items);
  $("#cartCount, #cartCountTitle, #cartCountMobile").text(count);

  $("#cartCount, #cartCountTitle").text(count);
  $("#cartMiniTotal").text(money(subtotal));
}

function renderCart(){
  const items = getCart();
  const $body = $("#cartBody");
  $body.empty();

  if(!items.length){
    $body.append(`
      <div class="cart-empty">
        <div class="empty-icon"><i class="bi bi-bag"></i></div>
        <div class="empty-text">There are no more items in your cart</div>
        <a href="#" class="btn btn-dark w-100">CONTINUE SHOPPING</a>
      </div>
    `);
    renderMini();
    return;
  }

  items.forEach(it => {
    $body.append(`
      <div class="cart-item">
        <img src="${it.image}" alt="">
        <div class="flex-grow-1">
          <p class="cart-name">${it.name}</p>
          <div class="cart-meta">${it.qty} X</div>
          <div class="fw-semibold">$${money(it.price)}</div>
        </div>
        <button class="cart-remove js-remove" data-id="${it.id}" title="Remove">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `);
  });

  const subtotal = calcSubtotal(items);
  const total = subtotal + SHIPPING;

  $body.append(`
    <div class="cart-totals">
      <div class="rowline"><span>${items.length} item</span><span>$${money(subtotal)}</span></div>
      <div class="rowline"><span>Shipping</span><span>$${money(SHIPPING)}</span></div>
      <div class="rowline fw-bold"><span>Total (tax excl.)</span><span>$${money(total)}</span></div>
      <div class="rowline fw-bold"><span>Total (tax incl.)</span><span>$${money(total)}</span></div>
      <div class="rowline"><span>Taxes:</span><span>$0.00</span></div>

      <div class="cart-actions">
        <a class="btn btn-dark" href="#">VIEW CART</a>
        <a class="btn btn-dark" href="#">CHECK OUT</a>
      </div>
    </div>
  `);

  renderMini();
}

function addToCart(p){
  const items = getCart();
  const found = items.find(x => x.id === p.id);
  if(found){ found.qty += 1; }
  else { items.push({ ...p, qty: 1 }); }
  setCart(items);
  renderCart();
}

function removeFromCart(id){
  const items = getCart().filter(x => x.id !== id);
  setCart(items);
  renderCart();
}

/* =========================
   Dropdown hover (desktop)
========================= */
function enableHoverDropdown(){
  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  if(!isDesktop) return;

  const HIDE_DELAY = 250;

  // -------- NAV dropdown hover (MORE) --------
  $(".dropdown-hover").each(function(){
    const $dd = $(this);
    let t = null;

    $dd.on("mouseenter", function(){
      clearTimeout(t);
      $dd.addClass("show");
      $dd.find(".dropdown-menu").addClass("show");
    });

    $dd.on("mouseleave", function(){
      t = setTimeout(function(){
        $dd.removeClass("show");
        $dd.find(".dropdown-menu").removeClass("show");
      }, HIDE_DELAY);
    });
  });

  // -------- Mega menu hover (hamburger area) --------
  $(".menu-hover").each(function(){
    const $wrap = $(this);
    let t2 = null;

    $wrap.on("mouseenter", function(){
      clearTimeout(t2);
      $("#megaMenu").addClass("show");
    });

    $wrap.on("mouseleave", function(){
      t2 = setTimeout(function(){
        $("#megaMenu").removeClass("show");
      }, HIDE_DELAY);
    });
  });
}


$(function(){
  enableHoverDropdown();

  // Add to cart
  $(document).on("click", ".js-add-to-cart", function(){
    const $btn = $(this);
    addToCart({
      id: $btn.data("id"),
      name: $btn.data("name"),
      price: Number($btn.data("price")),
      image: $btn.data("image")
    });
  });

  // Remove
  $(document).on("click", ".js-remove", function(){
    removeFromCart($(this).data("id"));
  });

  // First load render
  renderCart();
});



// category carosel
$(function(){
  $("#categorySlider").owlCarousel({
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    smartSpeed: 800,
    navText: ["‹", "›"],
    responsive: {
      0: { items: 2, margin: 10 },    // Mobile
      576: { items: 3 },              // Small Tab
      768: { items: 4 },              // Tab
      992: { items: 5 }               // Desktop (Screenshot style)
    }
  });
});


// Featured product slider
$(function(){
  // Product Slider Init
  $("#productSlider").owlCarousel({
    loop: true,
    margin: 0,
    nav: true,
    dots: false,
    autoplay: false,
    navText: ["‹", "›"],
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      992: { items: 4 }
    }
  });
});

// Review slider
$(function(){
  $("#reviewSlider").owlCarousel({
    items: 1,             // Show 1 item
    loop: true,           // Infinite Loop
    margin: 0,
    nav: true,            // Show Arrows
    dots: false,          // No Dots
    autoplay: true,       // Enable Autoplay
    autoplayTimeout: 5000,// Wait 5 seconds
    
    // Smooth Slide Settings
    smartSpeed: 1000,     // 1000ms = 1s duration for slide (Smooth)
    autoplayHoverPause: true, // Pause when mouse over
    
    // Custom Icons (Bootstrap Icons)
    navText: ["<i class='bi bi-arrow-left'></i>", "<i class='bi bi-arrow-right'></i>"] 
  });
});


// Post Slider
$(function(){
  // Latest News Slider Init
  $("#newsSlider").owlCarousel({
    loop: true,
    margin: 30,           // Gap between items
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    smartSpeed: 1000,     // Smooth slide speed
    autoplayHoverPause: true,
    navText: ["<i class='bi bi-arrow-left'></i>", "<i class='bi bi-arrow-right'></i>"],
    responsive: {
      0: { items: 1 },    // Mobile
      768: { items: 2 },  // Tablet
      992: { items: 3 }   // Desktop (Screenshot style)
    }
  });
});


// Password show
(() => {
  const input = document.getElementById("loginPassword");
  const btn = document.getElementById("togglePasswordBtn");
  if (!input || !btn) return;

  btn.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "HIDE" : "SHOW";
  });
})();





  $(function () {
    const $productsWrapper = $('#productsWrapper');
    const $productItems = $productsWrapper.find('.product-item');
    const $productCount = $('#productCount');

    const $gridViewBtn = $('#gridViewBtn');
    const $listViewBtn = $('#listViewBtn');
    const $sortSelect = $('#sortSelect');

    const $minRange = $('#minPrice');
    const $maxRange = $('#maxPrice');
    const $minInput = $('#minPriceInput');
    const $maxInput = $('#maxPriceInput');
    const $minLabel = $('#minPriceLabel');
    const $maxLabel = $('#maxPriceLabel');

    const $brandSearch = $('#brandSearch');
    const $brandCheckboxes = $('.brand-filter');

    // -------- VIEW TOGGLE --------
    function setView(mode) {
      if (mode === 'grid') {
        $productsWrapper.removeClass('list-view');
        $gridViewBtn.addClass('active');
        $listViewBtn.removeClass('active');
      } else {
        $productsWrapper.addClass('list-view');
        $listViewBtn.addClass('active');
        $gridViewBtn.removeClass('active');
      }
    }

    $gridViewBtn.on('click', function () {
      setView('grid');
    });

    $listViewBtn.on('click', function () {
      setView('list');
    });

    // -------- PRICE RANGE SYNC --------
    function clampRanges() {
      let minVal = parseInt($minRange.val(), 10);
      let maxVal = parseInt($maxRange.val(), 10);

      if (minVal > maxVal) {
        const tmp = minVal;
        minVal = maxVal;
        maxVal = tmp;
      }

      $minRange.val(minVal);
      $maxRange.val(maxVal);
      $minInput.val(minVal);
      $maxInput.val(maxVal);
      $minLabel.text(minVal);
      $maxLabel.text(maxVal);
    }

    $minRange.on('input', clampRanges);
    $maxRange.on('input', clampRanges);

    $minInput.on('input', function () {
      let v = parseInt($(this).val() || 0, 10);
      if (isNaN(v)) v = 0;
      $minRange.val(v);
      clampRanges();
      applyFilters();
    });

    $maxInput.on('input', function () {
      let v = parseInt($(this).val() || 0, 10);
      if (isNaN(v)) v = 0;
      $maxRange.val(v);
      clampRanges();
      applyFilters();
    });

    $minRange.on('change', function () {
      clampRanges();
      applyFilters();
    });

    $maxRange.on('change', function () {
      clampRanges();
      applyFilters();
    });

    // -------- BRAND SEARCH UI --------
    $brandSearch.on('input', function () {
      const q = $(this).val().toLowerCase().trim();
      $brandCheckboxes.each(function () {
        const $cb = $(this);
        const label = $cb.next('label').text().toLowerCase();
        const show = !q || label.indexOf(q) !== -1;
        $cb.closest('.form-check').toggle(show);
      });
    });

    // -------- FILTER + SORT CORE --------
    function getActiveBrands() {
      const brands = [];
      $brandCheckboxes.each(function () {
        const $cb = $(this);
        if ($cb.is(':checked')) {
          brands.push($cb.val().toLowerCase());
        }
      });
      return brands;
    }

    function applyFilters() {
      const minVal = parseInt($minRange.val(), 10);
      const maxVal = parseInt($maxRange.val(), 10);
      const activeBrands = getActiveBrands();

      let visibleCount = 0;

      $productItems.each(function () {
        const $item = $(this);
        const price = parseInt($item.data('price'), 10);
        const brand = String($item.data('brand') || '').toLowerCase();

        const inPrice = price >= minVal && price <= maxVal;
        const inBrand =
          activeBrands.length === 0 || activeBrands.indexOf(brand) !== -1;

        const show = inPrice && inBrand;
        $item.toggle(show);

        if (show) visibleCount++;
      });

      $productCount.text(visibleCount);
    }

    function applySort() {
      const mode = $sortSelect.val();
      const itemsArray = $productItems
        .filter(function () {
          return $(this).is(':visible');
        })
        .toArray();

      itemsArray.sort(function (a, b) {
        const $a = $(a);
        const $b = $(b);
        const priceA = parseInt($a.data('price'), 10);
        const priceB = parseInt($b.data('price'), 10);
        const dateA = new Date($a.data('date'));
        const dateB = new Date($b.data('date'));

        if (mode === 'priceLowHigh') {
          return priceA - priceB;
        }
        if (mode === 'priceHighLow') {
          return priceB - priceA;
        }
        // latest
        return dateB - dateA;
      });

      $.each(itemsArray, function (_, item) {
        $productsWrapper.append(item);
      });
    }

    $sortSelect.on('change', function () {
      applySort();
    });

    $brandCheckboxes.on('change', function () {
      applyFilters();
      applySort();
    });

    // -------- INITIALIZE --------
    clampRanges();
    applyFilters();
    applySort();
    setView('grid');
  });

  


// Scroll to top
$(function(){
  $("#toTopBtn").on("click", function(){
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

