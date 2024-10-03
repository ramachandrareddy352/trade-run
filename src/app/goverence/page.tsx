"use client";

import React, { useState } from "react";
import {
  Card,
  Button,
  Offcanvas,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
// import { desktopOS, platforms, valueFormatter } from "../airdrop/webUsageStats";

export default function BuyTokens() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          color: "white",
        }}
      >
        <div className="container">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    autoFocus
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Example textarea</Form.Label>
                  <Form.Control as="textarea" rows={3} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <div style={{ display: "flex", alignContent: "space-evenly" }}>
            <div>
              <h1>TRADE-RUN Goverence</h1>
              <p style={{ width: "1000px" }}>
                Aave is a fully decentralized, community governed protocol by
                the AAVE token-holders. AAVE token-holders collectively discuss,
                propose, and vote on upgrades to the protocol. AAVE
                token-holders (Ethereum network only) can either vote themselves
                on new proposals or delagate to an address of choice. To propose
                you have to minimum 100 tokens and any one can queue and execute
                the proposal. Voting delay(delay between proposal created and
                voting starts to analysis for that proposal), votig period
              </p>
            </div>
            <div className="mx-5 my-5">
              <Button variant="primary" onClick={handleShow}>
                Create Proposal
              </Button>
            </div>
          </div>
          {/* fixed staking */}
          <div
            className="mx-5 my-5"
            style={{ display: "flex", alignContent: "space-evenly" }}
          >
            <div
              style={{
                width: "1150px",
                height: "800px",
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
              <h1>BUY Tokens</h1>
              <p>0xeBec795c9c8bBD61FFc14A6662944748F299cAcf</p>
              <br />
              <div style={{ width: "300px", marginLeft: "50px" }}>
                <Form.Select size="lg">
                  <option>Select collateral token</option>
                </Form.Select>
                <br />
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                  <Form.Control
                    placeholder="Amount to get"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </InputGroup>
              </div>
              <div className="my-5">
                <p>Current goverenec token price : 12.5$</p>
                <p>Collateral you have to pay : 12.5 tokens</p>
                <p>Total tokens you have : 1_000_000 tokens</p>
                <br />
                <Button variant="primary" className="mx-5">
                  Buy Tokens
                </Button>
              </div>
            </div>
            <div>
              <div
                style={{
                  width: "400px",
                  height: "200px",
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
                <h6>Your Info</h6>
                <h4>2.5 millions</h4>
              </div>
              <div
                className="my-5"
                style={{
                  width: "400px",
                  height: "300px",
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
                <h6>Delegated power</h6>
                <p>
                  Use your AAVE, stkAAVE, or aAave balance to delegate your
                  voting and proposition powers. You will not be sending any
                  tokens, only the rights to vote and propose changes to the
                  protocol. You can re-delegate or revoke power to self at any
                  time.Learn more.
                </p>
                <Button variant="primary">Delegate</Button>
              </div>
              {/* <div>
                <PieChart
                  series={[
                    {
                      data: desktopOS,
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "white",
                        // outerRadius: 30,(different stages of proposal in percentage)
                        // cornerRadius: 30,
                        paddingAngle: 30,
                        // arcLabelRadius: 30,
                      },
                      valueFormatter,
                    },
                  ]}
                  width={500}
                  height={200}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
