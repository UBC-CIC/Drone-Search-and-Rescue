import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import {useNavigate} from 'react-router-dom'

export const Header = () => {
  const navigate = useNavigate()
  const isActive = (path) => window.location.pathname === path;

  const handlePress = async (page) => {
    navigate(page);
  }
  return (
    <div className="bg-gray-300 flex justify-between">
      <Navbar
        isBordered={true}
        maxWidth={"full"}
        shouldHideOnScroll={false}
        classNames={{
          item: [
            "flex",
            "relative",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        <NavbarBrand>
          <p className="font-bold text-inherit">CPEN-491-Drone-Footage</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive={isActive("/about")}>
            <Link color={!isActive("/about") && "foreground"} onClick={() => handlePress("/about")}>
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem isActive={isActive("/")}>
            <Link color={!isActive("/") && "foreground"} onClick={() => handlePress("/")}>
              Upload Footage
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" isActive={isActive("/settings")}>
        </NavbarContent>
      </Navbar>
    </div>
  );
};
