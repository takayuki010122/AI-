// ---- 設定 ----
const CONTACT_EMAIL = "contact@example.com"; // 実際の問い合わせ先メールアドレスへ変更してください

// ---- モバイルメニュー ----
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

// ---- スクロール reveal ----
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// ---- ギャラリーフィルター ----
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

// ---- 作品モーダル ----
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
  closeBtn && closeBtn.addEventListener("click", closeModal);
  backdrop && backdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

// ---- フローティングCTA(ヒーロー通過後〜問い合わせセクション到達前に表示) ----
const floatingCta = document.getElementById("floatingCta");
const heroEl = document.querySelector(".hero");
const contactEl = document.getElementById("contact");
if (floatingCta && heroEl && contactEl && "IntersectionObserver" in window) {
  let pastHero = false;
  let inContact = false;

  const heroObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        updateFloating();
      });
    },
    { threshold: 0 }
  );
  heroObs.observe(heroEl);

  const contactObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        inContact = entry.isIntersecting;
        updateFloating();
      });
    },
    { threshold: 0.15 }
  );
  contactObs.observe(contactEl);

  function updateFloating() {
    floatingCta.classList.toggle("show", pastHero && !inContact);
  }
}

// ---- 問い合わせフォーム(バックエンド未接続のため mailto で送信) ----
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
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

    const subject = `【LPよりご相談】${topic}`;
    const bodyLines = [
      `お名前：${name}`,
      `メールアドレス：${email}`,
      `ご相談内容：${topic}`,
      `ご希望の時期：${timing || "未記入"}`,
      "",
      "メッセージ：",
      message,
    ];
    const body = bodyLines.join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    showStatus(
      "メールアプリが開きます。内容をご確認のうえ送信してください。",
      "ok"
    );
  });
}

function showStatus(text, type) {
  let statusEl = document.querySelector(".form-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.className = "form-status";
    form.appendChild(statusEl);
  }
  statusEl.textContent = text;
  statusEl.className = `form-status show ${type}`;
}
