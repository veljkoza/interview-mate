import { FC, useState } from "react";

export const useToggler = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { open, close, toggle, isOpen };
};
