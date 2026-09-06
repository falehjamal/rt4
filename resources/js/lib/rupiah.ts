export function digitsOnly(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits === '') {
        return '';
    }

    return String(Number(digits));
}

export function digitsFromNominal(
    value: string | number | null | undefined,
): string {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const raw = String(value).trim();

    if (/^\d+\.\d{1,2}$/.test(raw)) {
        return digitsOnly(raw.slice(0, raw.indexOf('.')));
    }

    if (raw.includes(',')) {
        return digitsOnly(raw.slice(0, raw.indexOf(',')));
    }

    return digitsOnly(raw);
}

export function formatRupiahDigits(digits: string): string {
    if (digits === '') {
        return '';
    }

    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(Number(digits));
}

export function formatRupiah(value: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}
