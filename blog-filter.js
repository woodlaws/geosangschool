(() => {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const groups = [...document.querySelectorAll("[data-group]")];
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      for (const item of buttons) item.setAttribute("aria-pressed", String(item === button));
      for (const group of groups) group.hidden = filter !== "전체" && group.dataset.group !== filter;
    });
  }

  const toggle = document.querySelector(".blog-menu-toggle");
  const menu = document.querySelector("#blog-mobile-nav");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      menu.hidden = !open;
    });
  }
})();
