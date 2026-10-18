/* IronFuel - Interacciones
   1) Menú adaptable (móvil)
   2) Filtro de productos por categoría
   3) Validación accesible del formulario
   Sin dependencias externas. */

(function () {
  "use strict";

  /* ---------- 1. Menú adaptable ---------- */
  function initMenu() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("menu-principal");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Cerrar al elegir un enlace
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Filtro de productos ---------- */
  function initFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product");
    const status = document.getElementById("filter-status");
    if (!buttons.length || !products.length) return;

    function applyFilter(category) {
      let visible = 0;
      products.forEach(function (item) {
        const show = category === "todos" || item.dataset.category === category;
        item.hidden = !show;
        if (show) visible += 1;
      });

      buttons.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.dataset.filter === category));
      });

      if (status) {
        status.textContent = "Mostrando " + visible + (visible === 1 ? " producto." : " productos.");
      }
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.dataset.filter);
      });
    });
  }

  /* ---------- 3. Validación accesible del formulario ---------- */
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Devuelve un mensaje de error o "" si el campo es válido
  function getErrorMessage(field) {
    const value = field.value.trim();

    switch (field.id) {
      case "nombre":
        if (!value) return "Escribe tu nombre completo.";
        if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        return "";
      case "correo":
        if (!value) return "Escribe tu correo electrónico.";
        if (!EMAIL_REGEX.test(value)) return "Ingresa un correo válido, por ejemplo nombre@dominio.com.";
        return "";
      case "producto":
        return value ? "" : "Selecciona un producto de interés.";
      case "mensaje":
        if (!value) return "Escribe tu mensaje.";
        if (value.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
        return "";
      case "acepto":
        return field.checked ? "" : "Debes aceptar para poder enviar la consulta.";
      default:
        return "";
    }
  }

  function showError(field, message) {
    const errorEl = document.getElementById("error-" + field.id);
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = !message;
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    const message = getErrorMessage(field);
    showError(field, message);
    return message === "";
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    const summary = document.getElementById("form-summary");
    if (!form || !summary) return;

    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    function showSummary(text, isSuccess) {
      summary.textContent = text;
      summary.hidden = false;
      summary.classList.toggle("is-success", isSuccess);
      summary.focus();
    }

    // Validar al salir de cada campo y limpiar el error al corregir
    fields.forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
      field.addEventListener("change", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const invalid = fields.filter(function (field) {
        return !validateField(field);
      });

      if (invalid.length > 0) {
        showSummary(
          "Hay " + invalid.length + (invalid.length === 1 ? " campo" : " campos") + " por corregir.",
          false
        );
        invalid[0].focus(); // lleva al primer error
        return;
      }

      form.reset();
      showSummary("¡Gracias! Tu consulta fue registrada (demostración, no se envían datos).", true);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initFilter();
    initForm();
  });
})();