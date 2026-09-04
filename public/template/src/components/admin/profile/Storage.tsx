import Card from 'components/card';
import CardMenu from 'components/card/CardMenu';
import { BsCloudCheck } from 'react-icons/bs';
const Storage = () => {
    return (
        <Card extra={'w-full h-full p-4'}>
            <div className="ml-auto">
                <CardMenu />
            </div>
            {/* Your storage */}
            <div className="mb-auto flex flex-col items-center justify-center">
                <div className="bg-lightPrimary text-brand-500 dark:!bg-navy-700 mt-2 flex items-center justify-center rounded-full p-[26px] text-5xl font-bold dark:text-white">
                    <BsCloudCheck />
                </div>
                <p className="text-navy-700 mt-3 mb-px text-2xl font-bold dark:text-white">
                    Your storage
                </p>
                <p className="px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8">
                    Supervise your drive space in the easiest way
                </p>
            </div>

            {/* Progress bar */}

            <div className="flex flex-col">
                <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-600">25.6 GB</p>
                    <p className="text-sm font-medium text-gray-600">50 GB</p>
                </div>
                <div className="bg-lightPrimary dark:!bg-navy-700 mt-2 flex h-3 w-full items-center rounded-full">
                    <span className="bg-brand-500 h-full w-1/2 rounded-full dark:!bg-white" />
                </div>
            </div>
        </Card>
    );
};

export default Storage;
