/* ==========================================================
   MSAA SOLUTIONS — JAVASCRIPT ASAS
   Fail ini mengurus navigasi, skrin memuat, animasi dan borang.
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = location.hash === "#organisasi" ? "organisasi" : document.body.dataset.page;
  const pages = [
    ["home", "Utama", "index.html"],
    ["tentang", "Tentang Kami", "tentang.html"],
    ["organisasi", "Carta Organisasi", "tentang.html#organisasi"],
    ["perkhidmatan", "Perkhidmatan", "perkhidmatan.html"],
    ["hubungi", "Hubungi Kami", "hubungi.html"],
  ];

  // Cipta navigasi dan kaki laman yang seragam pada setiap halaman.
  const navLinks = pages
    .map(([id, label, href]) => `<a href="${href}" ${currentPage === id ? 'aria-current="page"' : ""}>${label}</a>`)
    .join("");

  document.getElementById("site-header").innerHTML = `
    <a class="skip-link" href="#main-content">Langkau ke kandungan</a>
    <header class="site-header">
      <div class="container nav-inner">
        <a class="brand" href="index.html" aria-label="MSAA Solutions — laman utama">
          <img class="brand-logo" src="assets/logo-msaa.png" alt="">
          <span class="brand-text">MSAA <small>SOLUTIONS</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false"
          aria-controls="main-nav" aria-label="Buka menu">☰</button>
        <nav class="nav-links" id="main-nav" aria-label="Navigasi utama">
          ${navLinks}
        </nav>
      </div>
    </header>`;

  const footerLinks = pages.map(([, label, href]) => `<a href="${href}">${label}</a>`).join("");
  document.getElementById("site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">MSAA <span>SOLUTIONS</span></div>
            <p>MSAA Solutions menyediakan perkhidmatan pembinaan,
              penyelenggaraan dan pembekalan. Syarikat beralamat di Ipoh, Perak.</p>
          </div>
          <div>
            <h3>PAUTAN</h3>
            <div class="footer-links">${footerLinks}</div>
          </div>
          <div>
            <h3>HUBUNGI</h3>
            <div class="footer-contact">
              No. 61, Tingkat 1,<br>Jalan Meru Bestari A8,<br>
              Bandar Meru Raya,<br>30020 Ipoh, Perak.<br><br>
              <a href="tel:+6058310231">05-831 0231</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span id="year"></span> MSAA Solutions. Hak cipta terpelihara.</span>
          <span>No. Pendaftaran: 202103212868 (JR0124198-H)</span>
        </div>
      </div>
    </footer>`;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Menu mudah alih boleh dibuka dan ditutup menggunakan butang.
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    menuButton.textContent = open ? "✕" : "☰";
  }

  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      menuButton.focus();
    }
  });

  // Tukar penanda menu apabila pautan carta pada halaman yang sama dipilih.
  function updateActiveMenu() {
    const page = location.hash === "#organisasi" ? "organisasi" : document.body.dataset.page;
    menu.querySelectorAll("a").forEach((link, index) => {
      if (pages[index][0] === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("hashchange", updateActiveMenu);

  // Skrin memuat dipaparkan pada setiap lawatan atau pertukaran halaman.
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.setAttribute("aria-label", "Laman sedang dimuat");
  loader.innerHTML = `
    <div class="loader-content">
      <div class="animated-logo">
        <span class="logo-halo" aria-hidden="true"></span>
        <div class="logo-panel"><img src="assets/logo-msaa.png" alt="Logo MSAA Solutions"></div>
      </div>
      <p>LAMAN SEDANG DIMUAT</p>
      <div class="loader-bar"><span></span></div>
    </div>`;
  document.body.appendChild(loader);
  document.body.classList.add("is-loading");
  window.setTimeout(
    () => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    },
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1100,
  );

  // Lapisan warna memberi peralihan sebelum menuju ke halaman lain.
  const transition = document.createElement("div");
  transition.className = "page-transition";
  transition.setAttribute("aria-hidden", "true");
  transition.innerHTML = `
    <div class="transition-content">
      <div class="animated-logo">
        <span class="logo-halo" aria-hidden="true"></span>
        <div class="logo-panel"><img src="assets/logo-msaa.png" alt=""></div>
      </div>
      <p>MSAA SOLUTIONS</p>
    </div>`;
  document.body.appendChild(transition);
  let navigating = false;

  // Pulihkan halaman jika pelayar menggunakannya semula melalui butang Kembali.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    navigating = false;
    transition.classList.remove("is-active");
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    setMenu(false);
    updateActiveMenu();
  });

  document.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        link.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = new URL(href, location.href);
      // Pautan telefon atau aplikasi luar tidak melalui animasi laman.
      if (!["http:", "https:", "file:"].includes(target.protocol) || target.protocol !== location.protocol) return;
      if (
        target.origin !== location.origin ||
        (target.pathname === location.pathname && target.search === location.search)
      )
        return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      transition.classList.add("is-active");
      // Logo kekal dipaparkan selama lima saat pada semua tetapan peranti.
      window.setTimeout(() => {
        location.href = target.href;
      }, 5000);
    });
  });

  // Setiap seksyen menerima animasi masuk secara berperingkat apabila ditatal.
  const motionGroups = [
    ".hero-grid",
    ".feature-grid",
    ".facts-grid",
    ".registration-grid",
    ".services-list",
    ".organization-tree",
    ".location-grid",
    ".contact-list",
  ];
  document.querySelectorAll(".cta-inner, .contact-list > div").forEach((element) => {
    element.classList.add("reveal");
  });
  document.querySelectorAll(".organization-connector").forEach((element) => {
    element.classList.add("line-reveal");
  });
  motionGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      [...group.children]
        .filter((element) => element.classList.contains("reveal"))
        .forEach((element, index) => {
          element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 110}ms`);
        });
    });
  });

  const motionElements = document.querySelectorAll(".reveal, .line-reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    // Mulakan selepas skrin memuat hilang supaya animasi halaman pertama kelihatan.
    window.setTimeout(() => {
      motionElements.forEach((element) => observer.observe(element));
    }, 1050);
  } else {
    motionElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Borang membuka WhatsApp dengan mesej yang disediakan oleh pelawat.
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const nameField = contactForm.elements.namedItem("nama");
    const phoneField = contactForm.elements.namedItem("telefon");
    const messageField = contactForm.elements.namedItem("mesej");
    const fallbackLink = document.getElementById("whatsapp-fallback");

    // Padam mesej ralat apabila pelawat membetulkan maklumat.
    [nameField, phoneField, messageField].forEach((field) => {
      field.addEventListener("input", () => field.setCustomValidity(""));
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameField.value.trim();
      const phone = phoneField.value.trim();
      const details = messageField.value.trim();
      const digitCount = phone.replace(/\D/g, "").length;

      nameField.setCustomValidity(name ? "" : "Sila masukkan nama penuh anda.");
      phoneField.setCustomValidity(
        /^\+?[0-9][0-9\s()-]*$/.test(phone) && digitCount >= 8 && digitCount <= 15
          ? ""
          : "Sila masukkan nombor telefon yang sah, contohnya 012-345 6789.",
      );
      messageField.setCustomValidity(details ? "" : "Sila nyatakan butiran pertanyaan anda.");
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const message = `Salam sejahtera. Saya ingin mendapatkan maklumat mengenai perkhidmatan MSAA Solutions.\n\nNama: ${name}\nNombor telefon: ${phone}\nPerkhidmatan: ${data.get("perkhidmatan")}\n\nButiran pertanyaan: ${details}`;
      const whatsappUrl = `https://wa.me/60125097527?text=${encodeURIComponent(message)}`;
      fallbackLink.href = whatsappUrl;
      fallbackLink.hidden = false;
      document.getElementById("form-status").textContent =
        "Mesej pertanyaan telah disediakan. Jika WhatsApp tidak dibuka, gunakan pautan di bawah. Semak mesej sebelum menekan Hantar dalam WhatsApp.";
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Waze menggunakan carian aplikasi pada peranti mudah alih dan Live Map pada komputer.
  const wazeLink = document.getElementById("waze-directions");
  if (wazeLink) {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (isMobile) wazeLink.href = wazeLink.dataset.appHref;
  }

  // Alamat boleh disalin untuk carian manual dalam Waze Live Map.
  const copyAddress = document.getElementById("copy-address");
  if (copyAddress) {
    copyAddress.addEventListener("click", async () => {
      const address = document.getElementById("office-address").textContent.trim();
      const status = document.getElementById("address-status");
      try {
        await navigator.clipboard.writeText(address);
        status.textContent = "Alamat telah disalin. Tampal alamat ini dalam ruangan destinasi Waze Live Map.";
      } catch {
        status.textContent =
          "Alamat tidak dapat disalin secara automatik. Sila pilih dan salin alamat yang dipaparkan.";
      }
    });
  }
});
