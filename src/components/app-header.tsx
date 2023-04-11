import { Container } from "./containers";
import Image from "next/image";
import logoSrc from "assets/logo2.png";
import { HamburgerMenu } from "./mobile-menu";
import { NAVIGATION, ROUTES } from "~/consts/navigation";
import Link from "next/link";
import { Button } from "./buttons";

export const AppHeader = () => (
  <header className="absolute left-0 top-0  z-10 w-full">
    <Container className="flex items-center justify-between py-8 ">
      <Image
        src={logoSrc}
        height={64}
        width={64}
        className="h-16 w-16 cursor-pointer"
        alt="Interview mate logo"
      />
      <HamburgerMenu />
      <nav className="hidden lg:block">
        <ul className="flex items-center gap-14 text-accent-secondary">
          {NAVIGATION.map((link) => (
            <li key={link.text}>
              <Link href={link.to}>{link.text}</Link>
            </li>
          ))}
          <Button href={ROUTES["interview-creator"]} variant="mini">
            Have a mock interview
          </Button>
        </ul>
      </nav>
    </Container>
  </header>
);
