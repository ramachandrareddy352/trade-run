"use client";

import React, { useState, useEffect, Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Offcanvas, Form } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Modal from "react-bootstrap/Modal";

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
    slidesToShow: 3,
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
            <p>
              Create you To use a numbers array with useState in Next.js, you
              can follow these steps. This involves initializing the state with
              an array of numbers and providing a way to update that state.To
              use a numbers array with useState in Next.js, you can follow these
              steps. This involves initializing the state with an array of
              numbers and providing a way to update that state.
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
                <div key={idx} style={{ width: 30 }}>
                  <Card
                    style={{
                      width: "18rem",
                      boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                      margin: 5,
                    }}
                  >
                    <Card.Body>
                      <Card.Title>Card Title</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Card Subtitle
                      </Card.Subtitle>
                      <Card.Text>
                        <p>BTC-1</p>
                        <p>ETH-2</p>
                        <p>BTC-1</p>
                        <p>ETH-2</p>
                        <p>BTC-1</p>
                        <p>ETH-2</p>
                      </Card.Text>
                      <Button variant="primary" onClick={handleShow}>
                        Buy Contract
                      </Button>
                      <Button variant="primary" className="ml-3">
                        Add Cart
                      </Button>
                      <p className="text-center mt-3">more info &rarr;</p>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container mt-5">
            <h1>Bought Contracts</h1>
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 30 }}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>Card Title</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Card Subtitle
                      </Card.Subtitle>
                      <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the cards content.
                      </Card.Text>
                      <Button variant="primary">Card Link</Button>
                      <Button variant="primary">Another Link</Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container mt-5">
            <h1>Setteled Contracts</h1>
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 30 }}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>Card Title</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Card Subtitle
                      </Card.Subtitle>
                      <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the cards content.
                      </Card.Text>
                      <Button variant="primary">Card Link</Button>
                      <Button variant="primary">Another Link</Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
          </div>

          <div className="container my-5">
            <h1>Expired Contracts</h1>
            <Slider {...settings}>
              {items.map((item, idx) => (
                <div key={idx} style={{ width: 30 }}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>Card Title</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        Card Subtitle
                      </Card.Subtitle>
                      <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the cards content.
                      </Card.Text>
                      <Button variant="primary">Card Link</Button>
                      <Button variant="primary">Another Link</Button>
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
