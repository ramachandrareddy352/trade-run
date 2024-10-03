"use client";

import React, { useState } from "react";
import { Card, Button, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
// import { platforms, valueFormatter } from "../airdrop/webUsageStats";

export default function Staking() {
  const [isFixed, setFixed] = useState(false);
  const handleCloseFixed = () => setFixed(false);
  const handleShowFixed = () => setFixed(true);

  return (
    <div>
      <div
        style={{
          backgroundImage: 'url("/images/home-background.jpg")',
          backgroundSize: "cover", // Ensures the background covers the entire page
          backgroundPosition: "center", // Centers the image
          backgroundRepeat: "no-repeat", // Avoids repeating the image
          backgroundAttachment: "fixed", // Keeps the image fixed while scrolling
          height: "100%", // Full viewport height
          width: "100%", // Full viewport width
          marginTop: "-60px",
          minHeight: "800px",
        }}
      >
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container">
            <Button variant="primary" onClick={handleShowFixed}>
              Fixed Staking
            </Button>
            <Button variant="primary" onClick={handleCloseFixed}>
              Variable Staking
            </Button>
          </div>

          {/* fixed staking */}
          <div className="container">
            {isFixed ? (
              <div
                className="container mb-5"
                style={{
                  width: "500px",
                  height: "600px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  float: "left",
                }}
              >
                <h1>Staking Dapp</h1>
                <p>0xeBec795c9c8bBD61FFc14A6662944748F299cAcf</p>
                <div>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">
                      LP Token
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="LP Token Address"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </div>
                <div style={{ display: "flex", color: "white" }}>
                  <div
                    style={{
                      border: "2px solid skyblue",
                      margin: "5px",
                      padding: "5px",
                    }}
                  >
                    <h6>30 DAYS</h6>
                    <h4>11% APY</h4>
                  </div>
                  <div
                    style={{
                      border: "2px solid skyblue",
                      margin: "5px",
                      padding: "5px",
                    }}
                  >
                    <h6>60 DAYS</h6>
                    <h4>12% APY</h4>
                  </div>
                  <div
                    style={{
                      border: "2px solid skyblue",
                      margin: "5px",
                      padding: "5px",
                    }}
                  >
                    <h6>90 DAYS</h6>
                    <h4>13% APY</h4>
                  </div>
                  <div
                    style={{
                      border: "2px solid skyblue",
                      margin: "5px",
                      padding: "5px",
                    }}
                  >
                    <h6>120 DAYS</h6>
                    <h4>14% APY</h4>
                  </div>
                </div>
                <div className="my-5">
                  <Button variant="primary" className="mx-3">
                    Stake By Approve
                  </Button>
                  <Button variant="primary">Stake By Signature</Button>
                </div>
                <hr style={{ color: "white" }} />
                <div>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">
                      Staking Id
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Staking Id"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <Button variant="primary">UnStake & Claim</Button>
                </div>
              </div>
            ) : (
              <div
                className="container mb-5"
                style={{
                  width: "500px",
                  height: "600px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  float: "left",
                }}
              >
                <h1>Staking Dapp</h1>
                <p>0xeBec795c9c8bBD61FFc14A6662944748F299cAcf</p>
                <br />
                <div>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">
                      LP Token
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="LP Token Address"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </div>
                <div className="my-4">
                  <p>Earn : 9% APY</p>
                  <Button variant="primary" className="mx-3">
                    Stake By Permit
                  </Button>
                  <Button variant="primary">Stake By Approve</Button>
                  <br />
                  <br />
                  <Button variant="primary" className="mx-5">
                    UnStake
                  </Button>
                </div>
                <hr style={{ color: "white" }} />
                <div>
                  <InputGroup
                    className="my-5"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <Button variant="primary">Claim Rewards</Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div
              className="my-5"
              style={{ display: "flex", alignContent: "space-between" }}
            >
              <div
                style={{
                  width: "300px",
                  height: "100px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                  margin: "0px 50px",
                }}
              >
                <h6>Total Tokens in Staking</h6>
                <h4>200 millions</h4>
              </div>
              <div
                style={{
                  width: "300px",
                  height: "100px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <h6>Total Tokens in Rewarded</h6>
                <h4>150 millions</h4>
              </div>
              {/* // above two in boxes, all the stakingId are at the profile page */}
            </div>
          </div>

          <div
            className="my-5"
            style={{ display: "flex", alignContent: "space-evenly" }}
          >
            <div>
              {/* claimed + pending for one graph */}
              {/* <PieChart
                series={[
                  {
                    data: platforms,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "white",
                      // outerRadius: 30,
                      // cornerRadius: 30,
                      paddingAngle: 30,
                      // arcLabelRadius: 30,
                    },
                    valueFormatter,
                  },
                ]}
                height={200}
                width={500}
              /> */}
            </div>
            {/* different types of tokens staked */}
            <div>
              {/* <PieChart
                series={[
                  {
                    data: platforms,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "white",
                      // outerRadius: 30,
                      // cornerRadius: 30,
                      paddingAngle: 30,
                      // arcLabelRadius: 30,
                    },
                    valueFormatter,
                  },
                ]}
                height={200}
                width={400}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
