import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    alt = 'RT 4',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img src="/logo.png" alt={alt} className={className} {...props} />
    );
}
