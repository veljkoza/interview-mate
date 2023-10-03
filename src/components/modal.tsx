import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, PropsWithChildren, useState } from "react";
import { Heading } from "./typography";
import { Logo } from "./logo";
import { Button } from "./buttons";

interface Modal {
  isOpen: boolean;
  onClose: () => void;
}

export const MyModal: FC<Modal & PropsWithChildren> = ({
  isOpen,
  children,
  onClose,
}) => {
  const closeModal = () => onClose();
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-muted-default p-6 text-left align-middle shadow-xl transition-all">
                  {/* <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Payment successful
                  </Dialog.Title> */}
                  <Logo />
                  <Heading size={4} variant="secondary" className="mt-5">
                    Congratulations on completing your first mock interview!
                  </Heading>
                  <div className="mt-6">
                    <p className="text-sm leading-6 text-white">
                      As a incentive to keep getting better we award you with{" "}
                      <span className="font-bold text-accent-secondary">
                        20
                      </span>{" "}
                      additional interview questions!
                    </p>
                  </div>

                  <div className="mt-8">
                    <Button variant="mini" onClick={() => closeModal()}>
                      Got it, thanks!
                    </Button>
                    {/* <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button> */}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
