"use client";

import React, { useState, useEffect, Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Offcanvas, Form, Table } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";
import { FaCartArrowDown } from "react-icons/fa";
import { LiaFileContractSolid } from "react-icons/lia";
import { PiGpsFixBold } from "react-icons/pi";

export default function Futures() {
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
    slidesToShow: 2,
    speed: 500,
    autoplay: true,
  };

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
        }}
      >
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
                      width: "30rem",
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
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>COLLATERAL</th>
                              <th>AMOUNT</th>
                              <th>Inital PRICE</th>
                              <th>Current PRICE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Otto</td>
                              <td>@mdo</td>
                              <td>$12,456.34</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Thornton</td>
                              <td>@fat</td>
                              <td>$2,456.97</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>@twitter</td>
                              <td>$56.23</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Text>
                      <div className="d-flex justify-content-around">
                        <span>Initial Price</span>
                        <h6>$23,678</h6>
                      </div>
                      <div className="d-flex justify-content-evenly">
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
                <div key={idx} style={{ width: 30 }}>
                  <Card
                    style={{
                      width: "30rem",
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
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>COLLATERAL</th>
                              <th>AMOUNT</th>
                              <th>Inital PRICE</th>
                              <th>Current PRICE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Otto</td>
                              <td>@mdo</td>
                              <td>$12,456.34</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Thornton</td>
                              <td>@fat</td>
                              <td>$2,456.97</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>@twitter</td>
                              <td>$56.23</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
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
                          Drop Contract
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleShow}
                          style={{ fontSize: "16px" }}
                        >
                          Settle Contract
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
                <div key={idx} style={{ width: 30 }}>
                  <Card
                    style={{
                      width: "30rem",
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
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>COLLATERAL</th>
                              <th>AMOUNT</th>
                              <th>Inital PRICE</th>
                              <th>Current PRICE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Otto</td>
                              <td>@mdo</td>
                              <td>$12,456.34</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Thornton</td>
                              <td>@fat</td>
                              <td>$2,456.97</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>@twitter</td>
                              <td>$56.23</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
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
                <div key={idx} style={{ width: 30 }}>
                  <Card
                    style={{
                      width: "30rem",
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
                        <Table striped bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>COLLATERAL</th>
                              <th>AMOUNT</th>
                              <th>Inital PRICE</th>
                              <th>Current PRICE</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Otto</td>
                              <td>@mdo</td>
                              <td>$12,456.34</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Thornton</td>
                              <td>@fat</td>
                              <td>$2,456.97</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>@twitter</td>
                              <td>$56.23</td>
                              <td>
                                $12,456.34
                                <span
                                  style={{ color: "grey", fontSize: "15px" }}
                                >
                                  (+0.25%)
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
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
