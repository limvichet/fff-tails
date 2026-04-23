import { n as numUnicode } from './number-BUJwr6QZ.mjs';

function formatDateForInput(date) {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const [d, m, y] = date.split("-");
  return `${y}-${m}-${d}`;
}
function formatDateForOutput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${d}/${m}/${y}`;
}
function formatFullDate(dateInput) {
  if (!dateInput) return "";
  let date;
  if (dateInput.includes("/")) {
    const [d, m, y] = dateInput.split("/");
    date = /* @__PURE__ */ new Date(`${y}-${m}-${d}`);
  } else {
    date = new Date(dateInput);
  }
  const day = numUnicode(date.getDate());
  const year = numUnicode(date.getFullYear());
  const monthsKh = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ"
  ];
  const month = monthsKh[date.getMonth()];
  return `ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`;
}

export { formatDateForInput as a, formatFullDate as b, formatDateForOutput as f };
//# sourceMappingURL=date-D_--uZCu.mjs.map
