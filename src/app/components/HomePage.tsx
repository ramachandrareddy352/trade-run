import React from "react";
import Image from "react-bootstrap/Image";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TodayVolume from "../../images/today-volume.jpg";
import TotalVolume from "../../images/total-volume.jpg";
import TotalUsers from "../../images/total-users.png";

export const HomePage = () => {
  return (
    <div>
      <div className="text-white p-5  container">
        <div style={{ marginTop: "100px" }}>
          <h1 style={{ fontSize: "3rem" }}>Decentralized Exchange</h1>
          <h1 style={{ fontSize: "3rem" }}>Futures & Perpetuals</h1>
        </div>

        <div className="mt-3" style={{ maxWidth: "600px" }}>
          <p className="text-grey">
            Trade BTC, ETH, AVAX and other top cryptocurrencies with up to 100x
            leverage directly from your wallet
          </p>
          <br />
          <button className="btn btn-primary">Get Started</button>
          {/* read documentation page */}
        </div>
      </div>
      <Container className="my-5">
        <Row>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <div>
              <Image
                src={TotalVolume.src}
                alt="img-1"
                width={70}
                height={70}
                style={{ float: "left", marginTop: "15px", marginLeft: "20px" }}
              ></Image>
              <div>
                <p style={{ color: "grey", marginTop: "10px" }}>
                  Total Volume Traded
                </p>
                <h3>$1234567890</h3>
              </div>
            </div>
          </Col>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <div>
              <Image
                src={TodayVolume.src}
                alt="img-1"
                width={60}
                height={60}
                style={{
                  float: "left",
                  marginTop: "15px",
                  marginLeft: "20px",
                }}
              ></Image>
              <div>
                <p style={{ color: "grey", marginTop: "10px" }}>
                  Today Volume Traded
                </p>
                <h3>$1234567890</h3>
              </div>
            </div>
          </Col>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <div>
              <Image
                src={TotalUsers.src}
                alt="img-1"
                width={60}
                height={60}
                style={{ float: "left", margin: "20px" }}
              ></Image>
              <div>
                <p style={{ color: "grey", marginTop: "10px" }}>Total Users</p>
                <h3>4,567,890</h3>
              </div>
            </div>
          </Col>
        </Row>
        <a href="#" className="my-5">
          <p className="text-center text-white my-4">Market Overview &rarr;</p>
        </a>
      </Container>
      <hr />
      <div className="my-5">
        <h1>Get Goverence Token</h1>
        <p>
          These are the ways to earn or get the goverence tokens. Which give
          Goverence power for voting and make proposals to update the protocol.
        </p>
      </div>
      <Container className="mb-5">
        <Row>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <h4 style={{ color: "grey", marginTop: "10px" }}>
              Stake LP tokens
            </h4>
            <h6>
              Staking LP tokens in DeFi protocols involves locking liquidity
              provider tokens into smart contracts to earn rewards or interest.
              Staking LP tokens in DeFi protocols involves locking liquidity
              provider tokens into smart contracts to earn rewards or interest.
            </h6>
          </Col>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <h4 style={{ color: "grey", marginTop: "10px" }}>
              Merkle Airdrops
            </h4>
            <h6>
              Staking LP tokens in DeFi protocols involves locking liquidity
              provider tokens into smart contracts to earn rewards or
              interest.Staking LP tokens in DeFi protocols involves locking
              liquidity provider tokens into smart contracts to earn rewards or
              interest.
            </h6>
          </Col>
          <Col
            className="bg-transparent text-white text-center m-4"
            style={{
              backdropFilter: "blur(20px)",
              boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
            }}
          >
            <h4 style={{ color: "grey", marginTop: "20px" }}>
              Buy Goverence Tokens
            </h4>
            <h6>
              Staking LP tokens in DeFi protocols involves locking liquidity
              provider tokens into smart contracts to earn rewards or interest.
              Staking LP tokens in DeFi protocols involves locking liquidity
              provider tokens into smart contracts to earn rewards or interest.
            </h6>
          </Col>
        </Row>
      </Container>
      <hr />
      <div>
        <div className="my-5">
          <h1 className="text-white">Current Networks Available</h1>
          <p className="text-white">
            These are the networks available to intrecat with Trade-Run
            protocol. These are the networks available to intrecat with
            Trade-Run protocol.
          </p>
        </div>

        <Container className="mb-5">
          <Row>
            <Col
              className="bg-transparent text-white text-center m-4"
              style={{
                backdropFilter: "blur(20px)",
                boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                width: "600px",
                height: "150px",
              }}
            >
              <div className="m-2">
                <div style={{ float: "left" }}>
                  <Image
                    src="/images/ethereum-logo.webp"
                    alt="img"
                    width={130}
                    height={130}
                  ></Image>
                </div>
                <h1 className="mx-5 mt-5 px-5" style={{ float: "right" }}>
                  SEPOLIA
                </h1>
              </div>
            </Col>
            <Col
              className="bg-transparent text-white text-center m-4"
              style={{
                backdropFilter: "blur(20px)",
                boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                width: "600px",
                height: "150px",
              }}
            >
              <div className="m-2">
                <div style={{ float: "left" }}>
                  <Image
                    src="/images/ethereum-logo.webp"
                    alt="img"
                    width={130}
                    height={130}
                  ></Image>
                </div>
                <h1 className="mx-5 mt-5 px-5" style={{ float: "right" }}>
                  SEPOLIA
                </h1>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
