import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    digitsFromNominal,
    digitsOnly,
    formatRupiahDigits,
} from '@/lib/rupiah';
import { cn } from '@/lib/utils';

type Props = {
    id: string;
    name: string;
    defaultValue?: string | number | null;
    required?: boolean;
    placeholder?: string;
    className?: string;
};

export default function RupiahInput({
    id,
    name,
    defaultValue = '',
    required = false,
    placeholder = '0',
    className,
}: Props) {
    const [digits, setDigits] = useState(() => digitsFromNominal(defaultValue));

    return (
        <div
            className={cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 flex h-9 overflow-hidden rounded-md border shadow-xs focus-within:ring-[3px]',
                className,
            )}
        >
            <span className="bg-light-primary text-muted-foreground flex items-center px-3 text-sm font-medium">
                Rp
            </span>
            <Input
                id={id}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                required={required}
                value={formatRupiahDigits(digits)}
                placeholder={placeholder}
                className="h-full border-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                onChange={(event) => {
                    setDigits(digitsOnly(event.target.value));
                }}
            />
            <input type="hidden" name={name} value={digits} />
        </div>
    );
}
