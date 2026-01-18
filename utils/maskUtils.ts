
// Removes all non-digit characters from a string
const unmask = (value: string): string => value.replace(/\D/g, '');

export const maskCPF = (value: string): string => {
  const cleaned = unmask(value);
  return cleaned
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
};

export const maskPhone = (value: string): string => {
  const cleaned = unmask(value);
  if (cleaned.length <= 10) {
    return cleaned
      .slice(0, 10)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return cleaned
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

export const maskCEP = (value: string): string => {
  const cleaned = unmask(value);
  return cleaned
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');
};
