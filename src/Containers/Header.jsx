import styled from "styled-components";
import { useState, useEffect } from "react";

const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  height: 56px;
  position: relative;
  align-items: center;
  background-color: #fff;
  font-family: Barlow;
  font-size: medium;
`;

// Define MobileMenu component
const MobileMenu = () => {
  return (
    <div className={"mobile-menu"}>
      <a href="#home">Home</a>
      <a href="#news">News</a>
      <a href="#shop">Shop</a>
      <a href="#contact">Contact</a>
      <a href="#about">About</a>
      <a href="#privacy">Privacy Policy</a>
    </div>
  );
};

export default function Header() {
  const [isShown, setIsShown] = useState(false);

  const toggleMobileMenu = () => {
    setIsShown(!isShown);
  };

  return (
    <>
      <HeaderBar>
        <div>
          <img src="./InMachines_Logo_positive_RGB.svg" className="navLogo" />
        </div>
        <div>
          <h1 className="Title">OLSK Small Laser V2 / Fabulaser Mini V3</h1>
        </div>

        <div className="navMenu">
          <ul>
            <li>
              <a href="#home" className="active">
                Assembly Manual
              </a>
            </li>
            <li>
              <a href="#news">How To</a>
            </li>
            <li>
              <a href="#contact">Tools</a>
            </li>
            <li>
              <a href="#about">Contact</a>
            </li>
          </ul>
        </div>
        <button className="hamburger" onClick={toggleMobileMenu}>
          &#8801;
        </button>
      </HeaderBar>
    </>
  );
}
