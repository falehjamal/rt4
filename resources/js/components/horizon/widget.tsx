import type { ReactNode } from 'react';

export default function Widget({
    icon,
    title,
    subtitle,
}: {
    icon: ReactNode;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="relative flex flex-grow items-center rounded-[20px] bg-white px-4 py-5 shadow-[14px_17px_40px_4px_rgba(112,144,176,0.08)]">
            <div className="flex h-[90px] items-center">
                <div className="bg-light-primary rounded-full p-3">
                    <span className="text-brand-500 flex items-center">
                        {icon}
                    </span>
                </div>
            </div>
            <div className="ml-4 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h4 className="text-navy-700 text-xl font-bold">{subtitle}</h4>
            </div>
        </div>
    );
}
