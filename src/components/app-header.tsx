import { Container } from "./containers";
import { HamburgerMenu } from "./mobile-menu";
import { NAVIGATION, ROUTES } from "~/consts/navigation";
import Link from "next/link";
import { Button } from "./buttons";
import { Logo } from "./logo";
import { Popover, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { RiLoaderFill, RiUser4Fill } from "react-icons/ri";
import { Fragment } from "react";
import Image from "next/image";
import { SignInButton, UserButton, useClerk } from "@clerk/nextjs";

export default function UserPopover() {
  const { user, loaded, signOut } = useClerk();

  if (!user) return <SignInButton />;
  // const { data: session, status } = useSession();
  if (!loaded)
    return (
      <div className="animate-spin">
        <RiLoaderFill />
      </div>
    );

  const getImg = () => {
    const userImg = user?.profileImageUrl;
    if (userImg) {
      return (
        <Image
          height={40}
          width={40}
          src={userImg}
          alt={`${user.username || ""} photo`}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }

    return (
      <RiUser4Fill
        className={`text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80`}
        aria-hidden="true"
      />
    );
  };

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex h-10 w-10 items-center  justify-center rounded-full border border-accent-secondary text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            {getImg()}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 flex -translate-x-1/2 transform  flex-col whitespace-nowrap rounded-lg border-2 border-accent-secondary bg-background">
              <Link href={ROUTES["my-interviews"]} className=" p-4 text-left">
                My interviews
              </Link>
              {/* <button className=" p-4 text-left">My profile</button> */}
              <button
                className=" p-4 text-left"
                onClick={() => {
                  void signOut();
                  close();
                }}
              >
                Log out
              </button>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}

export const AppHeader = () => (
  <header className="absolute left-0 top-0  z-10 w-full">
    <Container className="flex items-center justify-between py-8 ">
      <Link href="/">
        <Logo className="h-16 w-16 cursor-pointer" />
      </Link>
      {/* <HamburgerMenu /> */}
      <div className="text-accent-secondary lg:hidden">
        <UserPopover />
      </div>
      <nav className="hidden lg:block">
        <ul className="flex items-center gap-14 text-accent-secondary">
          {/* {NAVIGATION.map((link) => (
            <li key={link.text}>
              <Link href={link.to}>{link.text}</Link>
            </li>
          ))} */}
          <Button href={ROUTES["interview-creator"]} variant="mini">
            Have a mock interview
          </Button>
          <UserPopover />
        </ul>
      </nav>
    </Container>
  </header>
);
