"use client";

import React, { useState } from "react";
import { Card, Button, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Staking() {
  const [isFixed, setFixed] = useState(false);
  const handleCloseFixed = () => setFixed(false);
  const handleShowFixed = () => setFixed(true);
  const [days, setDays] = useState<Number>(30);

  const changeTo30 = () => {
    setDays(30);
  };
  const changeTo60 = () => {
    setDays(60);
  };
  const changeTo90 = () => {
    setDays(90);
  };
  const changeTo120 = () => {
    setDays(120);
  };

  const platform1 = [
    {
      label: "Tokens solded",
      value: 200,
    },
    {
      label: "Tokens UnSolded",
      value: 150,
    },
  ];
  const platform2 = [
    {
      label: "USDC",
      value: 467,
    },
    {
      label: "DAI",
      value: 120,
    },
    {
      label: "WETH",
      value: 47,
    },
    {
      label: "WBTC",
      value: 12,
    },
    {
      label: "LINK",
      value: 267,
    },
    {
      label: "USDT",
      value: 520,
    },
  ];
  const valueFormatter1 = (item: { value: number }) => `${item.value}`;
  // const valueFormatter2 = (item: { value: number }) =>
  //   `$${formatBigInt(BigInt(item.value), 8)}`;
  const valueFormatter2 = (item: { value: number }) => `$${item.value}`;

  return (
    <div>
      <div>
        <div>
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
                  height: "690px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  float: "left",
                }}
              >
                <br />
                <h1>Staking Dapp</h1>
                <p style={{ color: "grey" }}>
                  0xeBec795c9c8bBD61FFc14A6662944748F299cAcf
                </p>
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
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button
                    className="text-decoration-none"
                    style={{
                      color: `${days == 30 ? "black" : "grey"}`,
                      backgroundColor: `${days != 30 ? "transparent" : "white"}`,
                    }}
                    onClick={changeTo30}
                  >
                    <span>30 DAYS</span>
                    <h6>11% APY</h6>
                  </Button>
                  <Button
                    className="text-decoration-none"
                    style={{
                      color: `${days == 60 ? "black" : "grey"}`,
                      backgroundColor: `${days != 60 ? "transparent" : "white"}`,
                    }}
                    onClick={changeTo60}
                  >
                    <span>60 DAYS</span>
                    <h6>12% APY</h6>
                  </Button>
                  <Button
                    className="text-decoration-none"
                    style={{
                      color: `${days == 90 ? "black" : "grey"}`,
                      backgroundColor: `${days != 90 ? "transparent" : "white"}`,
                    }}
                    onClick={changeTo90}
                  >
                    <span>90 DAYS</span>
                    <h6>13% APY</h6>
                  </Button>
                  <Button
                    className="text-decoration-none"
                    style={{
                      color: `${days == 120 ? "black" : "grey"}`,
                      backgroundColor: `${days != 120 ? "transparent" : "white"}`,
                    }}
                    onClick={changeTo120}
                  >
                    <span>120 DAYS</span>
                    <h6>14% APY</h6>
                  </Button>
                </div>
                <br />
                <p>
                  Price of Token : <b>$1.34</b>
                </p>
                <div
                  className="my-4"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button variant="primary">Stake By Approve</Button>
                  <Button variant="primary">Stake By Signature</Button>
                </div>
                <hr style={{ color: "white", margin: "2px", padding: "0px" }} />
                <hr style={{ color: "white", margin: "2px", padding: "0px" }} />
                <div>
                  <br />
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
                  <span>
                    Total Claimed Tokens : <b>2,355</b>
                  </span>
                  <br />
                  <span>
                    Total Pending Tokens : <b>1,355</b>
                  </span>
                  <br />
                  <br />
                  <Button variant="primary">UnStake & Claim</Button>
                </div>
              </div>
            ) : (
              <div
                className="container mb-5"
                style={{
                  width: "500px",
                  height: "690px",
                  backdropFilter: "blur(10px)",
                  boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  float: "left",
                }}
              >
                <br />
                <h1>Staking Dapp</h1>
                <p>0xeBec795c9c8bBD61FFc14A6662944748F299cAcf</p>
                <h5>
                  Earn : <i>9%</i> APY
                </h5>
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
                  <InputGroup style={{ width: "370px", marginLeft: "50px" }}>
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                </div>
                <div
                  className="my-4"
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <Button variant="primary" className="mx-3">
                    Stake By Permit
                  </Button>
                  <Button variant="primary">Stake By Approve</Button>
                </div>
                <h6>
                  Current Token Price : <b>$1.56</b>
                </h6>
                <div className="mt-3">
                  <Button variant="primary">UnStake</Button>
                </div>
                <br />
                <hr style={{ color: "white", margin: "2px" }} />
                <hr style={{ color: "white", margin: "2px" }} />
                <div>
                  <InputGroup
                    className="my-4"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">
                      Receiver
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Receiver Address"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <InputGroup
                    className="my-4"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <div className="mb-3">
                    <span>
                      Total Claimed Tokens : <b>2,355</b>
                    </span>
                    <br />
                    <span>
                      Total Pending Tokens : <b>1,355</b>
                    </span>
                  </div>
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
                <h6>Total Tokens in Rewards</h6>
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
                <h6>Total Tokens Claimed</h6>
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
              <PieChart
                series={[
                  {
                    data: platform1,
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
                    valueFormatter: valueFormatter1,
                  },
                ]}
                height={200}
                width={500}
              />
            </div>
            {/* different types of tokens staked */}
            <div>
              <PieChart
                series={[
                  {
                    data: platform2,
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
                    valueFormatter: valueFormatter2,
                  },
                ]}
                height={200}
                width={400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
