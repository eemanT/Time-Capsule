let capsules = JSON.parse(localStorage.getItem("capsules")) || [];

const form = document.getElementById("capsuleForm");
const display = document.getElementById("capsuleDisplay");
const keyIcon = document.querySelector(".unlock-key");
const funMessage = document.getElementById("funMessage");

const confirmModal = document.getElementById("confirmModal");
const reallySureModal = document.getElementById("reallySureModal");
const pastModal = document.getElementById("pastModal");

let capsuleToDeleteIndex = null;

form.addEventListener("submit", function(e){
  e.preventDefault();
  const message = document.getElementById("message").value;
  const unlockDate = document.getElementById("unlockDate").value;

  const today = new Date().toISOString().split("T")[0];
  if (unlockDate < today) {
    pastModal.style.display = "flex";
    return;
  }

  capsules.push({ text: message, date: unlockDate, opened: false });
  localStorage.setItem("capsules", JSON.stringify(capsules));

  form.reset();
  displayCapsules();

  alert(" Your words are safe with me... ehehe 😉 ");
});

document.getElementById("pastOk").addEventListener("click", () => {
  pastModal.style.display = "none";
});

function displayCapsules(){
  display.innerHTML = "";
  const now = new Date();

  capsules.forEach((capsule, index) => {
    const container = document.createElement("div");
    container.classList.add('capsule-container');

    // Unlock at midnight
    const unlockDateTime = new Date(capsule.date + "T00:00:00");

    if (now >= unlockDateTime) {
      container.classList.add('unlocked');
      if (!capsule.opened) {
        container.innerHTML = `
          <span>Your capsule is ready to be opened!</span>
          <button class="open-btn">Open Capsule</button>
          <span class="delete-icon" title="Delete Capsule">🗑️</span>
        `;
        const openBtn = container.querySelector(".open-btn");
        openBtn.addEventListener("click", () => {
          capsule.opened = true;
          localStorage.setItem("capsules", JSON.stringify(capsules));
          displayCapsules();
        });
      } else {
        /* ------- ONLY CHANGE NEEDED: render text in a flex-safe block ------- */
        container.innerHTML = `
          <span class="capsule-text"></span>
          <span class="delete-icon" title="Delete Capsule">🗑️</span>
        `;
        // Put the user text safely into the capsule-text span
        const textSpan = container.querySelector(".capsule-text");
        textSpan.textContent = `🎉 ${capsule.text}`;
        /* ------------------------------------------------------------------- */
      }
    } else {
      container.classList.add('locked');
      container.innerHTML = `
        <span>🔒 Capsule locked until ${capsule.date}</span>
        <span class="delete-icon" title="Delete Capsule">🗑️</span>
      `;
    }

    const deleteBtn = container.querySelector(".delete-icon");
    deleteBtn.addEventListener("click", () => {
      capsuleToDeleteIndex = index;
      confirmModal.style.display = "flex";
    });

    display.appendChild(container);
  });
}

keyIcon.addEventListener("click", () => {
  funMessage.textContent = "Chill, it's just a key 😏";
  funMessage.style.opacity = 1;
  funMessage.style.animation = "floatUp 2s forwards";

  void funMessage.offsetWidth;

  setTimeout(() => {
    funMessage.style.opacity = 0;
    funMessage.style.animation = "";
  }, 2000);
});

document.getElementById("confirmYes").addEventListener("click", () => {
  confirmModal.style.display = "none";
  reallySureModal.style.display = "flex";
});

document.getElementById("confirmNo").addEventListener("click", () => {
  confirmModal.style.display = "none";
  capsuleToDeleteIndex = null;
});

document.getElementById("reallyYes").addEventListener("click", () => {
  if (capsuleToDeleteIndex !== null) {
    capsules.splice(capsuleToDeleteIndex, 1);
    localStorage.setItem("capsules", JSON.stringify(capsules));
    capsuleToDeleteIndex = null;
    displayCapsules();
  }
  reallySureModal.style.display = "none";
});

document.getElementById("reallyNo").addEventListener("click", () => {
  reallySureModal.style.display = "none";
  capsuleToDeleteIndex = null;
});

displayCapsules();

// 🔄 Auto-check every minute
setInterval(displayCapsules, 60000);
