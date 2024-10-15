"use client";

import React, { useState, useEffect, Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Offcanvas, Form, Table } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";
import { FaCartArrowDown } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { futuresAbi } from "@/abi/futuresAbi";
import { erc20PermitAbi } from "@/abi/erc20PermitAbi";
import { erc20MetadataAbi } from "@/abi/erc20MetadataAbi";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
  useSignTypedData,
  useBlock,
} from "wagmi";
import {
  formatBigInt,
  formatBigIntForPrice,
} from "../constants/formatBigIntValues";
import { UINT256_MAX, UINT32_MAX } from "../constants/values";

interface Order {
  initialPrice: string;
  strikePrice: string;
  createdDate: String;
  expirationDate: string;
  margin: number;
  status: number;
  collateral: [string];
  amount: [string];
}

// Define the props type for the OrdersTable component
interface OrdersTableProps {
  orders: Order[];
}

export default function Futures() {
  const account = useAccount();
  const { connectors, connect, status, error, isError } = useConnect();

  const {
    data: hash,
    writeContract,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();

  const [items, setItems] = useState<Number[]>([1, 2, 3, 4, 5, 56]);
  const collateral = useState<String[]>(["USDC, AAVE, USDT, ETH, WBTC"]);

  // modal states
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // modal create states
  const [showCreate, setShowCreate] = useState(false);
  const handleCreateClose = () => setShowCreate(false);
  const handleCreateShow = () => setShowCreate(true);

  // canva status
  const [showCanva, setShowCanva] = useState(false);
  const handleCloseCanva = () => setShowCanva(false);
  const handleShowCanva = () => setShowCanva(true);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
  };

  const orders: any = [
    { collateral: "USDC", amount: "2456" },
    { collateral: "WBTC", amount: "6.3" },
    { collateral: "WETH", amount: "12.2" },
    { collateral: "DAI", amount: "1327" },
  ];

  return (
    <div>
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            I will not close if you click outside me. Do not even try to press
            escape key.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Understood</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCreate} onHide={handleCreateClose}>
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
            <Button variant="secondary" onClick={handleCreateClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateClose}>
              {/* change the buttion functuons */}
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <Offcanvas show={showCanva} onHide={handleCloseCanva} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </Offcanvas.Body>
        </Offcanvas>

        <div>
          <div className="container">
            <br />
            <br />
            <br />
            <br />
            <p style={{ textIndent: "50px" }}>
              Create you To use a numbers array with useState in Next.js, you
              can follow these steps. This involves initializing the state with
              an array of numbers and providing a way to update that state.To
              use a numbers array with useState in Next.js, you can follow these
              steps. This involves initializing the state with an array of
              numbers and providing a way to update that state.This involves
              initializing the state with an array of numbers and providing a
              way to update that state.
            </p>
            <br />
            <Button
              variant="primary"
              className="mx-5"
              onClick={handleCreateShow}
            >
              Create Contract
            </Button>
            <Button
              className="mx-5"
              variant="primary"
              onClick={handleShowCanva}
            >
              My Cart
            </Button>
          </div>

          <div className="container mt-5">
            <h1>Live Contracts</h1>
            <br />
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 70 }}>
                  <Card
                    style={{
                      width: "22rem",
                      boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                      margin: 5,
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title>#1(ID)</Card.Title>
                        <span style={{ color: "grey", fontSize: "12px" }}>
                          * ACTIVE
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ color: "grey" }}
                      >
                        <span>Created Date</span>
                        <span>Expiration Date</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <h6>02/10/24-11:23</h6>
                        <h6>15/10/24-12:00</h6>
                      </div>
                      <Card.Text>
                        <OrdersTable orders={orders} />
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <span>Initial Price</span>
                        <h6>$23,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Strike Price</span>
                        <h6>$26,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Margin to Pay</span>
                        <h6>$3,477(5%)</h6>
                      </div>
                      <div className="d-flex justify-content-around my-2">
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Buy Contract
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Settle Contract
                        </Button>
                        <Button>
                          <FaCartArrowDown />
                        </Button>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span>more info &rarr;</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container mt-5">
            <h1>Bought Contracts</h1>
            <br />
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 70 }}>
                  <Card
                    style={{
                      width: "22rem",
                      boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                      margin: 5,
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title>#1(ID)</Card.Title>
                        <span style={{ color: "grey", fontSize: "12px" }}>
                          * ACTIVE
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ color: "grey" }}
                      >
                        <span>Created Date</span>
                        <span>Expiration Date</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <h6>02/10/24-11:23</h6>
                        <h6>15/10/24-12:00</h6>
                      </div>
                      <Card.Text>
                        <OrdersTable orders={orders} />
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <span>Initial Price</span>
                        <h6>$23,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Strike Price</span>
                        <h6>$26,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Margin to Pay</span>
                        <h6>$3,477(5%)</h6>
                      </div>
                      <div className="d-flex justify-content-around my-2">
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Buy Contract
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Settle Contract
                        </Button>
                        <Button>
                          <FaCartArrowDown />
                        </Button>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span>more info &rarr;</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container mt-5">
            <h1>Setteled Contracts</h1>
            <br />
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 70 }}>
                  <Card
                    style={{
                      width: "22rem",
                      boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                      margin: 5,
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title>#1(ID)</Card.Title>
                        <span style={{ color: "grey", fontSize: "12px" }}>
                          * ACTIVE
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ color: "grey" }}
                      >
                        <span>Created Date</span>
                        <span>Expiration Date</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <h6>02/10/24-11:23</h6>
                        <h6>15/10/24-12:00</h6>
                      </div>
                      <Card.Text>
                        <OrdersTable orders={orders} />
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <span>Initial Price</span>
                        <h6>$23,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Strike Price</span>
                        <h6>$26,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Margin to Pay</span>
                        <h6>$3,477(5%)</h6>
                      </div>
                      <div className="d-flex justify-content-around my-2">
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Buy Contract
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Settle Contract
                        </Button>
                        <Button>
                          <FaCartArrowDown />
                        </Button>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span>more info &rarr;</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container my-5">
            <h1>Closed Contracts</h1>
            <br />
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 70 }}>
                  <Card
                    style={{
                      width: "22rem",
                      boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                      margin: 5,
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <Card.Title>#1(ID)</Card.Title>
                        <span style={{ color: "grey", fontSize: "12px" }}>
                          * ACTIVE
                        </span>
                      </div>
                      <div
                        className="d-flex justify-content-between"
                        style={{ color: "grey" }}
                      >
                        <span>Created Date</span>
                        <span>Expiration Date</span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <h6>02/10/24-11:23</h6>
                        <h6>15/10/24-12:00</h6>
                      </div>
                      <Card.Text>
                        <OrdersTable orders={orders} />
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <span>Initial Price</span>
                        <h6>$23,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Strike Price</span>
                        <h6>$26,678</h6>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Margin to Pay</span>
                        <h6>$3,477(5%)</h6>
                      </div>
                      <div className="d-flex justify-content-around my-2">
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Buy Contract
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Settle Contract
                        </Button>
                        <Button>
                          <FaCartArrowDown />
                        </Button>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <span>more info &rarr;</span>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Table striped bordered hover size="sm" style={{ textAlign: "center" }}>
      <thead>
        <tr style={{ position: "sticky", zIndex: 1 }}>
          <th>COLLATERAL</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      {orders.length > 0 ? (
        <tbody>
          {orders.map((order) => (
            <tr>
              <td>{order.collateral}</td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <h1>NULL</h1>
      )}
    </Table>
  );
};
