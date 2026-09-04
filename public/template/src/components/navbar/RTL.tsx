import React from 'react';
import Dropdown from 'components/dropdown';
import { FiAlignJustify } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import navbarimage from '/public/img/layout/Navbar.png';
import { BsArrowBarUp } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import Image from 'next/image';
import {
    IoMdNotificationsOutline,
    IoMdInformationCircleOutline,
} from 'react-icons/io';
import avatar from '/public/img/avatars/avatar4.png';

const Navbar = (props: { brandText: string; [x: string]: any }) => {
    const { onOpenSidenav, brandText, mini, hovered } = props;
    const [darkmode, setDarkmode] = React.useState(
        document.body.classList.contains('dark'),
    );
    return (
        <nav
            className={`linear fixed top-3 left-3 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/30 transition-all duration-175 ${
                mini === false
                    ? 'w-[calc(100vw_-_6%)] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_350px)] 2xl:w-[calc(100vw_-_365px)]'
                    : mini === true && hovered === true
                      ? 'w-[calc(100vw_-_6%)] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_350px)] 2xl:w-[calc(100vw_-_365px)]'
                      : 'w-[calc(100vw_-_6%)] md:w-[calc(100vw_-_8%)] lg:w-[calc(100vw_-_6%)] xl:w-[calc(100vw_-_180px)] 2xl:w-[calc(100vw_-_195px)]'
            } p-2 backdrop-blur-xl md:top-4 md:left-[30px] xl:top-[20px] dark:bg-[#0b14374d]`}
        >
            <div className="ml-[6px]">
                <div className="h-6 w-[224px] pt-1">
                    <a
                        className="text-navy-700 text-sm font-normal hover:underline dark:text-white dark:hover:text-white"
                        href=" "
                    >
                        Pages
                        <span className="text-navy-700 hover:text-navy-700 mx-1 text-sm dark:text-white">
                            {' '}
                            /{' '}
                        </span>
                    </a>
                    <NavLink
                        className="text-navy-700 text-sm font-normal capitalize hover:underline dark:text-white dark:hover:text-white"
                        href="#"
                    >
                        {brandText}
                    </NavLink>
                </div>
                <p className="text-navy-700 shrink text-[33px] capitalize dark:text-white">
                    <NavLink
                        href="#"
                        className="hover:text-navy-700 font-bold capitalize dark:hover:text-white"
                    >
                        {brandText}
                    </NavLink>
                </p>
            </div>

            <div className="shadow-shadow-500 dark:!bg-navy-800 relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2 dark:shadow-none">
                <div className="bg-lightPrimary text-navy-700 dark:bg-navy-900 flex h-full items-center rounded-full xl:w-[225px] dark:text-white">
                    <p className="pr-2 pl-3 text-xl">
                        <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                    </p>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-lightPrimary text-navy-700 dark:bg-navy-900 block h-full w-full rounded-full text-sm font-medium outline-none placeholder:!text-gray-400 sm:w-fit dark:text-white dark:placeholder:!text-white"
                    />
                </div>
                <span
                    className="flex cursor-pointer text-xl text-gray-600 xl:hidden dark:text-white"
                    onClick={onOpenSidenav}
                >
                    <FiAlignJustify className="h-5 w-5" />
                </span>
                {/* start Notification */}
                <Dropdown
                    button={
                        <p className="cursor-pointer">
                            <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                        </p>
                    }
                    animation="origin-[65%_0%] md:origin-top-end transition-all duration-300 ease-in-out"
                    classNames={
                        'py-2 top-4 -left-[230px] md:-left-[440px] w-max'
                    }
                >
                    <div className="shadow-shadow-500 dark:!bg-navy-700 flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl sm:w-[460px] dark:text-white dark:shadow-none">
                        <div className="flex items-center justify-between">
                            <p className="text-navy-700 text-base font-bold dark:text-white">
                                Notification
                            </p>
                            <p className="text-navy-700 text-sm font-bold dark:text-white">
                                Mark all read
                            </p>
                        </div>

                        <button className="flex w-full items-center">
                            <div className="from-brand-400 to-brand-500 flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b py-4 text-2xl text-white">
                                <BsArrowBarUp />
                            </div>
                            <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                    New Update: Horizon UI Dashboard PRO
                                </p>
                                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                                    A new update for your downloaded item is
                                    available!
                                </p>
                            </div>
                        </button>

                        <button className="flex w-full items-center">
                            <div className="from-brand-400 to-brand-500 flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b py-4 text-2xl text-white">
                                <BsArrowBarUp />
                            </div>
                            <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                                <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                                    New Update: Horizon UI Dashboard PRO
                                </p>
                                <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                                    A new update for your downloaded item is
                                    available!
                                </p>
                            </div>
                        </button>
                    </div>
                </Dropdown>
                {/* start Horizon PRO */}
                <Dropdown
                    button={
                        <p className="cursor-pointer">
                            <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                        </p>
                    }
                    classNames={
                        'py-2 top-6 -left-[250px] md:-left-[330px] w-max'
                    }
                    animation="origin-[75%_0%] md:origin-top-end transition-all duration-300 ease-in-out"
                >
                    <div className="shadow-shadow-500 dark:!bg-navy-700 flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl dark:text-white dark:shadow-none">
                        <div
                            style={{
                                backgroundImage: `url(${navbarimage.src})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                            }}
                            className="mb-2 aspect-video w-full rounded-lg"
                        />
                        <a
                            href="!#"
                            className="px-full linear bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200 flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold text-white transition duration-200 hover:text-white"
                        >
                            Download now
                        </a>
                        <a
                            href="!#"
                            className="px-full linear text-navy-700 hover:text-navy-700 flex cursor-pointer items-center justify-center rounded-xl border py-[11px] font-bold transition duration-200 hover:bg-gray-200 dark:!border-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white dark:active:bg-white/10"
                        >
                            See Documentation
                        </a>
                        <a
                            href="#!"
                            className="px-full linear text-navy-700 hover:text-navy-700 flex cursor-pointer items-center justify-center rounded-xl py-[11px] font-bold transition duration-200 hover:bg-black dark:text-white dark:hover:text-white"
                        >
                            Try Horizon Free
                        </a>
                    </div>
                </Dropdown>
                <div
                    className="cursor-pointer text-gray-600"
                    onClick={() => {
                        if (darkmode) {
                            document.body.classList.remove('dark');
                            setDarkmode(false);
                        } else {
                            document.body.classList.add('dark');
                            setDarkmode(true);
                        }
                    }}
                >
                    {darkmode ? (
                        <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
                    ) : (
                        <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
                    )}
                </div>
                {/* Profile & Dropdown */}
                <Dropdown
                    button={
                        <Image
                            width="2"
                            height="20"
                            className="h-10 w-10 rounded-full"
                            src={avatar}
                            alt="Elon Musk"
                        />
                    }
                    classNames={'py-2 top-8 -left-[180px] w-max'}
                >
                    <div className="shadow-shadow-500 dark:!bg-navy-700 flex h-max w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat pb-4 shadow-xl dark:text-white dark:shadow-none">
                        <div className="mt-3 ml-4">
                            <div className="flex items-center gap-2">
                                <p className="text-navy-700 text-sm font-bold dark:text-white">
                                    👋 Hey, Adela
                                </p>{' '}
                            </div>
                        </div>
                        <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20" />

                        <div className="mt-3 ml-4 flex flex-col">
                            <a
                                href=" "
                                className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                            >
                                Profile Settings
                            </a>
                            <a
                                href=" "
                                className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                            >
                                Newsletter Settings
                            </a>
                            <a
                                href=" "
                                className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                            >
                                Log Out
                            </a>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </nav>
    );
};

export default Navbar;
