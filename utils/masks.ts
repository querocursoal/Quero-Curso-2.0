/**
 * Input Mask Utilities
 * Centralized functions for formatting user input
 */

// CPF Mask: 000.000.000-00
export const maskCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

// Validate CPF digit
export const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11 || /^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return false;

    return true;
};

// Phone Mask: (00) 0 0000-0000
export const maskPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numbers
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3');
};

// Currency Mask: R$ 0.000,00
export const maskCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseFloat(numbers) / 100;
    return amount.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Parse currency back to number
export const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return parseFloat(numbers) / 100;
};

// Date Mask: DD/MM/YYYY
export const maskDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
        .slice(0, 8)
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
};

// Validate Date
export const validateDate = (value: string): boolean => {
    const [day, month, year] = value.split('/').map(Number);
    if (!day || !month || !year) return false;
    if (year < 1900 || year > 2100) return false;
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    return day >= 1 && day <= daysInMonth;
};

// Email Validation
export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Workload Mask: "000 horas"
export const maskWorkload = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers ? `${numbers} horas` : '';
};

// Parse workload back to number
export const parseWorkload = (value: string): string => {
    return value.replace(/\D/g, '');
};
