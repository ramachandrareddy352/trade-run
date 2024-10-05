"use client";

import React, { useEffect } from "react";
import { Container, Nav, Navbar, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TradeRunLogo from "../../images/trade-run.jpeg";
import ProfileLogo from "../../images/profile-icon.png";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaWallet } from "react-icons/fa";

export default function StaticNavbar() {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connect, status, error, isError } = useConnect();

  useEffect(() => {
    if (isError) {
      toast.error(`User refued to connect wallet`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    }
  }, [isError, error]);
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="navbar-transparent fixed-top"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Container>
        <Navbar.Brand href="/">
          <Image src={TradeRunLogo.src} alt="Profile" width={40} height={40} />
        </Navbar.Brand>
        <Navbar.Brand href="/" className="text-white mr-5">
          TRADE-RUN &nbsp;&nbsp;&nbsp;
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="text-white" href="/futures">
              Futures
            </Nav.Link>
            <Nav.Link href="/airdrop" className="text-white">
              Perpetuals
            </Nav.Link>
            <Nav.Link href="#features" className="text-white">
              Pools
            </Nav.Link>
            <Nav.Link href="#pricing" className="text-white">
              Goverence
            </Nav.Link>
            <Nav.Link href="#features" className="text-white">
              Docs
            </Nav.Link>
          </Nav>
          <Nav>
            {account.address ? (
              <Nav.Item className="my-2 mx-4">
                <Image
                  src={ProfileLogo.src}
                  alt="Profile"
                  width={40}
                  height={40}
                />
              </Nav.Item>
            ) : (
              <Nav.Item></Nav.Item>
            )}
            <Nav.Item className="mt-2">
              {account.status === "connected" ? (
                <Button variant="primary" onClick={() => disconnect()}>
                  <FaWallet
                    style={{ marginTop: "-5px", marginRight: "10px" }}
                  />
                  {account.address.slice(0, 6)}...
                  {account.address.slice(38, 42)}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => connect({ connector: connectors[0] })}
                >
                  <FaWallet
                    style={{ marginTop: "-5px", marginRight: "10px" }}
                  />
                  {status === "pending" ? `Connecting` : `Connect Wallet`}
                </Button>
              )}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
