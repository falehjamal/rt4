function Card(props: {
    variant?: string;
    extra?: string;
    children?: JSX.Element | any[];
    [x: string]: any;
}) {
    const { variant, extra, children, ...rest } = props;
    return (
        <div
            className={`shadow-3xl relative !z-5 flex flex-col rounded-[20px] bg-white bg-clip-border ${
                props.default
                    ? 'shadow-shadow-500 dark:shadow-none'
                    : 'shadow-shadow-100 dark:shadow-none'
            } dark:!bg-navy-800 dark:text-white ${extra}`}
            {...rest}
        >
            {children}
        </div>
    );
}

export default Card;
