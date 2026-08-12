const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz6AcmHTnKrApNczD70T9GN2nNxImwdIpGuR09smacDZHkjaYno_CuXBUvIoXXLceoE/exec';

// モバイルナビゲーション
const menuBtn = document.querySelector(".menu");
const mobileNav = document.querySelector(".mobile-nav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("open");
  });
  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileNav.classList.remove("open"));
  });
}

// スクロール時の要素表示アニメーション
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// フィルター機能
const filterBtns = document.querySelectorAll(".filters button");
const cards = document.querySelectorAll(".card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.style.display = show ? "" : "none";
    });
  });
});

// モーダル機能
const modal = document.querySelector(".modal");

if (modal) {
  const modalArt = modal.querySelector(".modal-art");
  const modalTitle = modal.querySelector(".modal-copy h2");
  const modalCopy = modal.querySelector(".modal-copy p");
  const closeBtn = modal.querySelector(".close");
  const backdrop = modal.querySelector(".backdrop");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title || "";
      modalCopy.textContent = card.dataset.copy || "";
      const visual = card.querySelector(".visual");
      modalArt.className = "modal-art";

      if (visual) {
        visual.classList.forEach((c) => {
          if (c.startsWith("v")) modalArt.classList.add(c);
        });
      }

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// フローティングCTA制御
const floatingCta = document.getElementById("floatingCta");
const heroEl = document.querySelector(".hero");
const contactEl = document.getElementById("contact");

if (floatingCta && heroEl && contactEl && "IntersectionObserver" in window) {
  let pastHero = false;
  let inContact = false;

  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      updateFloating();
    });
  }, { threshold: 0 });

  heroObs.observe(heroEl);

  const contactObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      inContact = entry.isIntersecting;
      updateFloating();
    });
  }, { threshold: 0.15 });

  contactObs.observe(contactEl);

  function updateFloating() {
    floatingCta.classList.toggle("show", pastHero && !inContact);
  }
}

// お問い合わせフォーム送信（GAS連携）
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const topic = (data.get("topic") || "").toString().trim();
    const timing = (data.get("timing") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !topic || !message) {
      showStatus("必須項目が未入力です。ご確認ください。", "err");
      return;
    }

    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.disabled = true;
      button.textContent = "送信中...";
    }

    try {
      // GASへのCORS回避用リクエストの設定
      const payload = new URLSearchParams({
        name: name,
        email: email,
        topic: topic,
        timing: timing,
        message: message
      });

      await fetch(GAS_ENDPOINT, {
        method: "POST",
        mode: "no-cors", // CORSエラーを回避
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload
      });

      // no-corsモードではレスポンス内容が取得できないため、例外が出なければ成功とみなします
      showStatus("お問い合わせを受け付けました。ありがとうございます。", "ok");
      form.reset();
    } catch (error) {
      console.error("送信エラー:", error);
      showStatus("送信に失敗しました。時間をおいてもう一度お試しください。", "err");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "この内容で相談する →";
      }
    }
  });
}

function showStatus(text, type) {
  let statusEl = document.querySelector(".form-status");

  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.className = "form-status";
    if (form) form.appendChild(statusEl);
  }

  if (statusEl) {
    statusEl.textContent = text;
    statusEl.className = `form-status show ${type}`;
  }
}
