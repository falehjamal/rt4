import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/popover';
const PopoverHorizon = (props: {
    extra: string;
    trigger: JSX.Element;
    content: JSX.Element;
}) => {
    const { extra, trigger, content } = props;
    return (
        <Popover>
            <PopoverTrigger>{trigger}</PopoverTrigger>
            <PopoverContent
                className={`shadow-shadow-500 dark:!bg-navy-700 w-max rounded-xl bg-white px-4 py-3 text-sm shadow-xl dark:shadow-none ${extra}`}
            >
                {content}
            </PopoverContent>
        </Popover>
    );
};

export default PopoverHorizon;
