// Маска телефона
// Находим все input с type="tel"
const phoneInputs = document.querySelectorAll('input[type="tel"]');

// Применяем обработчики к каждому полю
phoneInputs.forEach(phoneInput => {
  // Устанавливаем начальное значение при фокусе, если поле пустое
  phoneInput.addEventListener("focus", function() {
    if (!this.value || this.value === "") {
      this.value = "+7 (";
    }
  });

  phoneInput.addEventListener("input", function(e) {
    var val = this.value.replace(/\D/g, "");
    var newVal = "";

    // Если номер не начинается с 7, очищаем поле и ставим +7 (
    if (val.length > 0 && !val.startsWith("7")) {
      val = "";
      newVal = "+7 (";
    } else if (val.length > 0) {
      newVal = "+7 (";
      if (val.length > 1) {
        newVal += val.substring(1, 4);
        if (val.length >= 4) newVal += ") " + val.substring(4, 7);
        if (val.length >= 7) newVal += "-" + val.substring(7, 9);
        if (val.length >= 9) newVal += "-" + val.substring(9, 11);
      }
    }

    this.value = newVal;

    // Валидация в реальном времени (используем ближайший элемент с классом error)
    const phoneError = this.closest('.form-group')?.querySelector('.phone-error') || 
                      document.getElementById(`${this.id}-error`);
    
    if (phoneError) {
      if (val.length === 11 && val.startsWith("7")) {
        phoneError.classList.add("hidden");
      } else {
        phoneError.classList.remove("hidden");
      }
    }
  });

  // Обработчик для удаления символов при backspace/delete
  phoneInput.addEventListener("keydown", function(e) {
    // Если нажали Backspace и значение равно "+7 (", то очищаем поле полностью
    if (e.key === "Backspace" && this.value === "+7 (") {
      this.value = "";
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      const selectionStart = this.selectionStart;
      const value = this.value;

      // Если пытаемся удалить символ маски, перемещаем курсор назад
      if (
        selectionStart > 0 &&
        (value[selectionStart - 1] === "(" ||
          value[selectionStart - 1] === ")" ||
          value[selectionStart - 1] === "-" ||
          value[selectionStart - 1] === " ")
      ) {
        this.selectionStart = selectionStart - 1;
        this.selectionEnd = selectionStart - 1;
        e.preventDefault();
      }
    }
  });
});
