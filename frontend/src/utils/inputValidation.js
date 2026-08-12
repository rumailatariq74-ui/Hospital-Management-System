export const digitsOnly = (value) => String(value).replace(/\D/g, "");

export const decimalOnly = (value) => {
  const cleaned = String(value).replace(/[^\d.]/g, "");
  const [first, ...rest] = cleaned.split(".");
  return rest.length ? `${first}.${rest.join("")}` : first;
};

export const numericInputProps = {
  inputMode: "numeric",
  pattern: "[0-9]*",
};

export const decimalInputProps = {
  inputMode: "decimal",
  pattern: "[0-9]*[.]?[0-9]*",
};
