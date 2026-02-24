import Swal from "sweetalert2";

/**
 * @param {string} title
 * @param {string} message
 * @returns {void}
 * @example
 * successMessage("Success", "Your Report has been downloaded");
 **/
export function successMessage(title, message, event) {
  Swal.fire({
    title: `<span class="text-md font-semibold">${title}</span>`,
    html: `<span class="text-md font-semibold">${message}</span>`,
    timer: 2000,
    timerProgressBar: true,
    icon: "success",
    customClass: {
      title: "text-md",
    },
    padding: "1rem",
  }).then(() => {
    if (event) {
      event();
    }
  });
}
