import { Navbar, Dropdown, Avatar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <Navbar fluid={true} border={true}>
      <Navbar.Brand href="/">
        <Image
          src="https://img.logoipsum.com/279.svg"
          width={60}
          height={20}
          className="mr-3 h-6 sm:h-9"
          alt="Analytic Measures logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Analytic Measures
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<Avatar alt="User settings" placeholderInitials="MS" />}
        >
          <Dropdown.Header>
            <span className="block text-sm">Matt Serrano</span>
            <span className="block truncate text-sm font-medium">
              m@analyticmeasures.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link href="/playground">Playground</Link>
        <Link href="/">About</Link>
        <Link href="/">Services</Link>
        <Link href="/">Pricing</Link>
        <Link href="/">Contact</Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
