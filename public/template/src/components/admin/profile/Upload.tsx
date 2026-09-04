import { MdFileUpload } from 'react-icons/md';
import Card from 'components/card';

const Upload = () => {
    return (
        <Card className="font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 2xl:grid-cols-11 dark:shadow-none">
            <div className="bg-lightPrimary dark:!bg-navy-700 col-span-5 h-full w-full rounded-xl 2xl:col-span-6">
                <button className="dark:!border-navy-700 flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 lg:pb-0">
                    <MdFileUpload className="text-brand-500 text-[80px] dark:text-white" />
                    <h4 className="text-brand-500 text-xl font-bold dark:text-white">
                        Upload Files
                    </h4>
                    <p className="mt-2 text-sm font-medium text-gray-600">
                        PNG, JPG and GIF files are allowed
                    </p>
                </button>
            </div>

            <div className="dark:!bg-navy-800 col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pb-4 pl-3">
                <h4 className="text-navy-700 text-left text-xl leading-9 font-bold dark:text-white">
                    Complete Your Profile
                </h4>
                <p className="mt-2 text-base leading-1 font-normal text-gray-600">
                    Stay on the pulse of distributed projects with an anline
                    whiteboard to plan, coordinate and discuss
                </p>
                <button className="linear bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 mt-4 flex items-center justify-center rounded-xl px-2 py-2 text-base font-medium text-white transition duration-200 dark:text-white">
                    Publish now
                </button>
            </div>
        </Card>
    );
};

export default Upload;
