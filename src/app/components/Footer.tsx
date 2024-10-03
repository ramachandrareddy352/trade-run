import React from "react";
import Image from "react-bootstrap/image";
import "bootstrap/dist/css/bootstrap.min.css";
import TwitterLogo from "../../images/twitter-logo.webp";
import InstaLogo from "../../images/insta-logo.jpg";
import TradeRunLogo from "../../images/trade-run.jpeg";
import GithubLogo from "../../images/github-logo.webp";
import LinkedInLogo from "../../images/linkedin-logo.webp";

export const Footer = () => {
  return (
    <div style={{ backgroundColor: "#000000" }}>
      <div className="container d-flex justify-content-center align-items-center py-3 text-white">
        <Image
          src={TradeRunLogo.src}
          alt="app-logo"
          width={50}
          height={50}
          style={{ float: "left" }}
        ></Image>
        <h1 className="mx-5"> TRADE RUN </h1>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <a
          href="https://twitter.com/TavanamRama"
          className="twitter"
          target="_blank"
        >
          <Image
            src={TwitterLogo.src}
            alt="twitter"
            width={40}
            height={40}
            className="mx-5"
          ></Image>
        </a>
        <a
          href="https://www.instagram.com/rama_chandra_reddy_tavanam/"
          className="instagram"
          target="_blank"
        >
          <Image
            src={InstaLogo.src}
            alt="twitter"
            width={35}
            height={35}
            className="mx-5"
          ></Image>
        </a>
        <a
          href="https://github.com/ramachandrareddy352"
          className="github"
          target="_blank"
        >
          <Image
            src={TwitterLogo.src}
            alt="twitter"
            width={30}
            height={30}
            className="mx-5"
          ></Image>
        </a>
        <a
          href="https://www.linkedin.com/in/ramachandratavanam/"
          className="linkedin"
          target="_blank"
        >
          <Image
            src={LinkedInLogo.src}
            alt="twitter"
            width={30}
            height={30}
            className="mx-5"
          ></Image>
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center py-1 text-white">
        <p> &copy; 2024 Trade Run. All rights reserved. </p>
      </div>
    </div>
  );
};
