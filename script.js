// script.js

// Haftanın günleri ve saatleri
const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const hours = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);

// Local Storage'dan randevuları yükle
const appointments = JSON.parse(localStorage.getItem("appointments")) || {};

// DOM elementlerini seç
const daySelect = document.getElementById("day-select");
const schedule = document.getElementById("schedule");
const modal = document.getElementById("modal");
const modalTime = document.getElementById("modal-time");
const appointmentText = document.getElementById("appointment-text");
const saveAppointment = document.getElementById("save-appointment");
const closeModal = document.getElementById("close-modal");
const dayStatus = document.getElementById("day-status");

let selectedDay = null;
let selectedTime = null;

// Günleri açılır menüye ekle
function populateDaySelect() {
  days.forEach(day => {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  });
}

// Doluluk oranını hesapla ve göster
function renderDayStatus() {
  dayStatus.innerHTML = "";
  days.forEach(day => {
    const totalHours = hours.length;
    const bookedHours = hours.filter(hour => appointments[`${day}-${hour}`]).length;
    const percentage = Math.round((bookedHours / totalHours) * 100);

    const statusBar = document.createElement("div");
    statusBar.className = "status-bar";

    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = `${percentage}%`;

    const statusText = document.createElement("span");
    statusText.className = "status-text";
    statusText.textContent = `${day}: %${percentage}`;

    progressContainer.appendChild(progressBar);
    statusBar.appendChild(progressContainer);
    statusBar.appendChild(statusText);

    dayStatus.appendChild(statusBar);
  });
}

// Programı oluştur
function renderSchedule(day) {
  schedule.innerHTML = "";
  if (!day) return;

  hours.forEach(hour => {
    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";

    const timeLabel = document.createElement("span");
    const appointmentInfo = appointments[`${day}-${hour}`];

    timeLabel.textContent = appointmentInfo
      ? `${hour} - ${appointmentInfo}`
      : hour;

    const timeButton = document.createElement("button");
    if (appointmentInfo) {
      timeButton.textContent = "Sil";
      timeButton.className = "delete";
      timeButton.addEventListener("click", () => confirmAndDeleteAppointment(day, hour));
    } else {
      timeButton.textContent = "Ekle";
      timeButton.addEventListener("click", () => openModal(day, hour));
    }

    timeSlot.appendChild(timeLabel);
    timeSlot.appendChild(timeButton);
    schedule.appendChild(timeSlot);
  });
}

// Modalı aç
function openModal(day, time) {
  selectedDay = day;
  selectedTime = time;
  modal.style.display = "block";
  modalTime.textContent = `${day}, ${time}`;
  appointmentText.value = "";
}

// Randevu kaydet
saveAppointment.addEventListener("click", () => {
  const text = appointmentText.value.trim();
  if (text) {
    appointments[`${selectedDay}-${selectedTime}`] = text;
    localStorage.setItem("appointments", JSON.stringify(appointments));
    closeModalModal();
    renderSchedule(selectedDay);
    renderDayStatus();
  }
});

// Modalı kapat
closeModal.addEventListener("click", closeModalModal);
function closeModalModal() {
  modal.style.display = "none";
}

// Randevu silme onayı
function confirmAndDeleteAppointment(day, time) {
  const confirmDelete = confirm("Bu randevuyu silmek istediğinizden emin misiniz?");
  if (confirmDelete) {
    delete appointments[`${day}-${time}`];
    localStorage.setItem("appointments", JSON.stringify(appointments));
    renderSchedule(day);
    renderDayStatus();
  }
}

// Gün seçildiğinde saatleri göster
daySelect.addEventListener("change", event => {
  renderSchedule(event.target.value);
});

// Başlangıçta günleri doldur ve ilk durum
populateDaySelect();
renderDayStatus();
