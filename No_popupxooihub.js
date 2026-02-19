(() => {
  if (window.__POPUP_BLOCKER_MENU__) {
    console.log("⚠️ Popup Blocker Menu đã tồn tại.");
    return;
  }

  const STATE = {
    enabled: true,
    hidden: false,
    originalOpen: window.open,
    originalAssign: location.assign,
    originalReplace: location.replace,
  };

  function enableBlock() {
    STATE.enabled = true;

    window.open = function (url, name, specs) {
      console.warn("🚫 Blocked window.open:", url);
      return null;
    };

    location.assign = function (url) {
      console.warn("🚫 Blocked location.assign:", url);
    };

    location.replace = function (url) {
      console.warn("🚫 Blocked location.replace:", url);
    };

    updateStatus();
    console.log("🟢 Popup Blocker: ON");
  }

  function disableBlock() {
    STATE.enabled = false;

    window.open = STATE.originalOpen;
    location.assign = STATE.originalAssign;
    location.replace = STATE.originalReplace;

    updateStatus();
    console.log("🔴 Popup Blocker: OFF");
  }

  function removeMenu() {
    disableBlock();
    document.getElementById("ocq-popup-menu")?.remove();
    document.getElementById("ocq-popup-icon")?.remove();
    delete window.__POPUP_BLOCKER_MENU__;
    console.log("🧹 Popup Blocker Menu removed.");
  }

  // ===== MENU UI =====
  const menu = document.createElement("div");
  menu.id = "ocq-popup-menu";
  menu.style = `
    position:fixed;
    top:120px;
    left:20px;
    width:260px;
    background:rgba(10,10,20,.95);
    color:#fff;
    border-radius:16px;
    border:2px solid #00ff66;
    font-family:Arial;
    z-index:999999999;
    box-shadow:0 0 20px rgba(0,0,0,.7);
    user-select:none;
    overflow:hidden;
  `;

  menu.innerHTML = `
    <div id="ocq-header" style="
      padding:12px;
      font-weight:bold;
      background:rgba(0,255,100,.15);
      display:flex;
      justify-content:space-between;
      align-items:center;
      cursor:move;
    ">
      <span>🛡️ Popup Blocker</span>
      <span id="ocq-status" style="font-size:12px; opacity:.9;">...</span>
    </div>

    <div style="padding:12px; display:flex; flex-direction:column; gap:10px;">
      <button id="ocq-toggle" style="
        padding:10px;
        border-radius:12px;
        border:none;
        cursor:pointer;
        font-weight:bold;
        background:#00ff66;
        color:#000;
      ">ON</button>

      <button id="ocq-hide" style="
        padding:10px;
        border-radius:12px;
        border:none;
        cursor:pointer;
        font-weight:bold;
        background:#444;
        color:#fff;
      ">Ẩn Menu</button>

      <button id="ocq-remove" style="
        padding:10px;
        border-radius:12px;
        border:none;
        cursor:pointer;
        font-weight:bold;
        background:#ff3333;
        color:#fff;
      ">Xóa Tool</button>

      <div style="font-size:12px; opacity:.7; line-height:1.4;">
        ⚡ Chặn popup: window.open<br>
        ⚡ Chặn redirect: location.assign/replace<br>
        👑 Menu kéo thả được
      </div>
    </div>
  `;

  document.body.appendChild(menu);

  // ===== ICON WHEN HIDDEN =====
  const icon = document.createElement("div");
  icon.id = "ocq-popup-icon";
  icon.style = `
    position:fixed;
    top:120px;
    left:20px;
    width:55px;
    height:55px;
    background:rgba(10,10,20,.95);
    border:2px solid #00ff66;
    border-radius:16px;
    z-index:999999999;
    display:none;
    cursor:pointer;
    font-size:26px;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    user-select:none;
    box-shadow:0 0 15px rgba(0,0,0,.6);
  `;
  icon.innerText = "🛡️";
  document.body.appendChild(icon);

  // ===== UPDATE UI =====
  function updateStatus() {
    const status = document.getElementById("ocq-status");
    const toggle = document.getElementById("ocq-toggle");

    if (!status || !toggle) return;

    if (STATE.enabled) {
      status.innerText = "🟢 ON";
      toggle.innerText = "TẮT BLOCK";
      toggle.style.background = "#00ff66";
      toggle.style.color = "#000";
      menu.style.border = "2px solid #00ff66";
      icon.style.border = "2px solid #00ff66";
    } else {
      status.innerText = "🔴 OFF";
      toggle.innerText = "BẬT BLOCK";
      toggle.style.background = "#ff3333";
      toggle.style.color = "#fff";
      menu.style.border = "2px solid #ff3333";
      icon.style.border = "2px solid #ff3333";
    }
  }

  // ===== BUTTON EVENTS =====
  document.getElementById("ocq-toggle").onclick = () => {
    STATE.enabled ? disableBlock() : enableBlock();
  };

  document.getElementById("ocq-hide").onclick = () => {
    menu.style.display = "none";
    icon.style.display = "flex";
    STATE.hidden = true;
  };

  document.getElementById("ocq-remove").onclick = () => {
    removeMenu();
  };

  icon.onclick = () => {
    icon.style.display = "none";
    menu.style.display = "block";
    STATE.hidden = false;
  };

  // ===== DRAG SYSTEM =====
  function makeDrag(el, handle) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      el.style.left = (e.clientX - offsetX) + "px";
      el.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // mobile touch support
    handle.addEventListener("touchstart", (e) => {
      isDragging = true;
      const t = e.touches[0];
      offsetX = t.clientX - el.offsetLeft;
      offsetY = t.clientY - el.offsetTop;
    });

    document.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const t = e.touches[0];
      el.style.left = (t.clientX - offsetX) + "px";
      el.style.top = (t.clientY - offsetY) + "px";
    });

    document.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  makeDrag(menu, document.getElementById("ocq-header"));
  makeDrag(icon, icon);

  // ===== EXPORT CONTROL =====
  window.__POPUP_BLOCKER_MENU__ = {
    enable: enableBlock,
    disable: disableBlock,
    remove: removeMenu,
    state: STATE,
  };

  // Start ON
  enableBlock();
})();
