export const HamburgerMenu = () => (
  <div className="relative  py-3 sm:max-w-xl lg:hidden">
    <nav>
      <button className="relative h-10 w-10  text-accent-secondary focus:outline-none">
        <span className="sr-only">Open main menu</span>
        <div className="absolute left-1/2 top-1/2  flex w-5 -translate-x-1/2 -translate-y-1/2  transform  flex-col gap-1">
          <span
            aria-hidden="true"
            className="absolute block h-0.5 w-5 transform bg-current transition duration-500 ease-in-out"
          ></span>
          <span
            aria-hidden="true"
            className="absolute my-3  block h-0.5 w-5  transform  bg-current transition duration-500 ease-in-out"
          ></span>
          <span
            aria-hidden="true"
            className="absolute block  h-0.5 w-5 transform bg-current  transition duration-500 ease-in-out"
          ></span>
        </div>
      </button>
    </nav>
  </div>
);
