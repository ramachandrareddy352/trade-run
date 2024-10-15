"use client";

import { Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Image, Card, Button, Offcanvas, Form, Table } from "react-bootstrap";
import TradeRun from "../../images/trade-run.jpeg";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface Order {
  sno: number;
  id: number;
  collateral: string;
  size: string;
  leverage: number;
  LPrice: string;
  EPrice: string;
  MPrice: string;
  type: string;
  OType: string;
  status: string;
  ENTime: string;
  EXTime: string;
}

// Define the props type for the OrdersTable component
interface OrdersTableProps {
  orders: Order[];
}

export default function Perpetuals() {
  const [isLong, setIsLong] = useState<Boolean>(true);
  const [longType, setLongType] = useState<string>("primary");
  const [shortType, setShortType] = useState<string>("secondary");
  const changeToLong = () => {
    setIsLong(true);
    setLongType("primary");
    setShortType("secondary");
  };
  const changeToShort = () => {
    setIsLong(false);
    setLongType("secondary");
    setShortType("primary");
  };

  const [orderType, setOrderType] = useState<string>("market");
  const changeToMarket = () => {
    setOrderType("market");
  };
  const changeToPriceLimit = () => {
    setOrderType("priceLimit");
  };
  const changeToStopLoss = () => {
    setOrderType("stopLoss");
  };
  const changeToTimeLimit = () => {
    setOrderType("timeLimit");
  };

  const orders: any = [
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
    {
      sno: 1,
      id: 123,
      collateral: "USDC",
      size: "12,456",
      leverage: 1.34,
      LPrice: "$23,534",
      EPrice: "$12,779",
      MPrice: "$2,779",
      type: "LONG",
      OType: "MARKET",
      status: "Active",
      ENTime: "02/10/24-12:30",
      EXTime: "02/10/24-12:40",
    },
  ];

  useEffect(() => {
    // Dynamically load the TradingView script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    // Append the script to the body or head
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize TradingView widget
      new window.TradingView.widget({
        width: 1070,
        height: 550,
        symbol: "BTCUSD", // You can change this to any other symbol
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#ffffff",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_side_toolbar: false,
        withdateranges: true,
        allow_symbol_change: false,
        save_image: true,
        container_id: "tradingview_container",
      });
    };

    // Cleanup the script when the component is unmounted
    return () => {
      <div>document.body.removeChild(script);</div>;
    };
  }, []);

  const [rangeValue, setRangeValue] = useState(1);

  const handleRangeChange = (event: any) => {
    setRangeValue(event.target.value); // Update the state as the user moves the slider
  };

  return (
    <div>
      <div>
        <div style={{ display: "flex", alignContent: "space-between" }}>
          <div>
            <div
              className="mx-3 d-flex"
              style={{
                width: "1080px",
                height: "80px",
                marginTop: "80px",
                backgroundColor: "#131722",
                backdropFilter: "blur(10px)",
              }}
            >
              <div>
                <Form.Select
                  size="lg"
                  className="mt-3 mx-3"
                  style={{ width: "170px", height: "50px" }}
                >
                  <option>BTC/USD</option>
                  <option>ETH/USD</option>
                  <option>SOL/USD</option>
                  <option>DAI/USD</option>
                </Form.Select>
              </div>
              <div className="mx-4 mt-3">
                <span style={{ color: "grey" }}>Spot Price</span>
                <h6>$60,244.34</h6>
              </div>
              <div className="mx-4  mt-3">
                <span style={{ color: "grey" }}>
                  Available Liquidity(52%/48%)
                </span>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <h6>LL $33.02M</h6>
                  <h6>SS $31.37M</h6>
                </div>
              </div>
              <div className="mx-4 mt-3">
                <span style={{ color: "grey" }}>Open Interest(52%/48%)</span>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <h6>LL $33.02M</h6>
                  <h6>SS $31.37M</h6>
                </div>
              </div>
              <div className="mx-2 mt-3">
                <span style={{ color: "grey" }}>Total Volume</span>
                <h6>$143.67M</h6>
              </div>
              <div className="mx-2 mt-3">
                <span style={{ color: "grey" }}>Total Orders</span>
                <h6>2,564</h6>
              </div>
            </div>
            <div
              id="tradingview_container"
              className="mx-3"
              style={{ marginTop: "10px" }}
            ></div>
          </div>
          <div
            style={{
              width: "380px",
              height: "640px",
              marginTop: "80px",
              backgroundColor: "#131722",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ display: "flex", margin: "15px" }}>
              <Button
                variant={longType}
                style={{
                  width: "165px",
                  borderRadius: "0px",
                  border: "1px solid black",
                }}
                onClick={changeToLong}
              >
                Long
              </Button>
              <Button
                variant={shortType}
                style={{
                  width: "165px",
                  borderRadius: "0px",
                  border: "1px solid black",
                }}
                onClick={changeToShort}
              >
                Short
              </Button>
            </div>
            <div className="d-flex justify-content-between mx-3">
              <button
                className="btn p-0 m-0 text-decoration-none"
                style={{
                  color: `${orderType == "market" ? "white" : "grey"}`,
                }}
                onClick={changeToMarket}
              >
                Market
              </button>
              <button
                className="btn p-0 m-0 text-decoration-none"
                style={{
                  color: `${orderType == "priceLimit" ? "white" : "grey"}`,
                }}
                onClick={changeToPriceLimit}
              >
                Price Limit
              </button>
              <button
                className="btn p-0 m-0 text-decoration-none"
                style={{
                  color: `${orderType == "stopLoss" ? "white" : "grey"}`,
                }}
                onClick={changeToStopLoss}
              >
                Stop Loss
              </button>
              <button
                className="btn p-0 m-0 text-decoration-none"
                style={{
                  color: `${orderType == "timeLimit" ? "white" : "grey"}`,
                }}
                onClick={changeToTimeLimit}
              >
                Time Limit
              </button>
            </div>

            <div className="mx-3 my-3">
              <div
                className="mb-3"
                style={{
                  width: "325px",
                  height: "80px",
                  backgroundColor: "black",
                }}
              >
                <div
                  className="d-flex px-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>PAY: $12,456</span>
                  <span>BALANCE: 0.0</span>
                </div>
                <div
                  className="d-flex px-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <input
                    type="number"
                    placeholder="0.00"
                    style={{
                      width: "180px",
                      fontSize: "30px",
                      backgroundColor: "transparent",
                      textDecoration: "none",
                    }}
                  />
                  <Form.Select style={{ width: "100px", height: "50px" }}>
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>SOL</option>
                    <option>USDC</option>
                  </Form.Select>
                </div>
              </div>
              <div
                style={{
                  width: "325px",
                  height: "80px",
                  backgroundColor: "black",
                }}
              >
                <div
                  className="d-flex px-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <span>{isLong ? "LONG" : "SHORT"}</span>
                  <span>LEVERAGE: {rangeValue}</span>
                </div>
                <div
                  className="d-flex px-3"
                  style={{ justifyContent: "space-between" }}
                >
                  <h2>0.357</h2>
                  <Form.Select style={{ width: "100px", height: "50px" }}>
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>SOL</option>
                    <option>DAI</option>
                  </Form.Select>
                </div>
              </div>
              <hr style={{ color: "white" }} />

              <div>
                {orderType == "market" ? (
                  <p style={{ height: "80px" }}>
                    NOTE: A market order is an order to buy or sell an asset
                    immediately at the current market price. Place the order in
                    current price
                  </p>
                ) : null}
                {orderType == "priceLimit" ? (
                  <div
                    style={{
                      width: "325px",
                      height: "80px",
                      backgroundColor: "black",
                      boxShadow: "0px 0px 10px rgba(135, 206, 235, 0.7)",
                    }}
                  >
                    <div
                      className="d-flex px-3"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <span>PRICE</span>
                      <span>MARK: $12,345</span>
                    </div>
                    <div
                      className="d-flex px-3"
                      style={{ justifyContent: "space-between" }}
                    >
                      <input
                        type="number"
                        placeholder="0.00"
                        style={{
                          width: "180px",
                          height: "50px",
                          fontSize: "30px",
                          backgroundColor: "transparent",
                          textDecoration: "none",
                        }}
                      />
                      <h3>USD</h3>
                    </div>
                  </div>
                ) : null}
                {orderType == "stopLoss" ? (
                  <div
                    style={{
                      width: "325px",
                      height: "80px",
                      boxShadow: "5px 5px 10px #131752",
                    }}
                  >
                    <div
                      className="d-flex px-3"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <span>STOP LOSS</span>
                      <span>MARK: $12,345</span>
                    </div>
                    <div
                      className="d-flex px-3"
                      style={{ justifyContent: "space-between" }}
                    >
                      <input
                        type="number"
                        placeholder="0.00"
                        style={{
                          width: "180px",
                          height: "50px",
                          fontSize: "30px",
                          backgroundColor: "transparent",
                          textDecoration: "none",
                        }}
                      />
                      <h3>USD</h3>
                    </div>
                  </div>
                ) : null}
                {orderType == "timeLimit" ? (
                  <div
                    style={{
                      width: "325px",
                      height: "80px",
                      backgroundColor: "black",
                      boxShadow: "0px 0px 10px rgba(135, 206, 235, 0.7)",
                    }}
                  >
                    <div
                      className="d-flex px-3"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <span>TIME DIFF</span>
                      <span>MARK: $12,345</span>
                    </div>
                    <div
                      className="d-flex px-3"
                      style={{ justifyContent: "space-between" }}
                    >
                      <input
                        type="number"
                        placeholder="0.00"
                        style={{
                          width: "180px",
                          height: "50px",
                          fontSize: "30px",
                          backgroundColor: "transparent",
                          textDecoration: "none",
                        }}
                      />
                      <h3>TIME</h3>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mx-3">
              <form>
                <div className="form-group">
                  <label htmlFor="rangeSlider">Liquidity: {rangeValue}</label>
                  <input
                    type="range"
                    className="form-range"
                    id="rangeSlider"
                    min="1"
                    max="10"
                    step="0.01"
                    value={rangeValue}
                    onChange={handleRangeChange}
                  />
                </div>
              </form>
            </div>
            <div className="mx-3 my-2">
              <div className="d-flex justify-content-between">
                <span>Liquidation Price</span>
                <span>$24,000</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Protocol Fee</span>
                <span>0.13</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Funding Fee</span>
                <span>0.24</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Maintentance Margin</span>
                <span>5%</span>
              </div>
            </div>
            <div>
              <Button
                variant="primary"
                style={{ marginLeft: "100px", marginTop: "10px" }}
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-3 mt-3">
          <Button variant="primary">Positions</Button>
          <Button variant="primary">History</Button>
        </div>

        <div className="mb-5">
          <div className="mx-3">
            <OrdersTable orders={orders} />
          </div>
        </div>
      </div>
    </div>
  );
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Table
      striped
      bordered
      hover
      variant="dark"
      style={{
        width: "1480px",
        maxHeight: "300px",
        height: "fixContent",
        textAlign: "center",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
    >
      <thead>
        <tr style={{ position: "sticky", zIndex: 1 }}>
          <th>S.NO</th>
          <th>ID</th>
          <th>COLLATERAL</th>
          <th>SIZE</th>
          <th>LEVERAGE</th>
          <th>LIQ. PRICE ID</th>
          <th>ENTRY PRICE</th>
          <th>MARK PRICE</th>
          <th>TYPE</th>
          <th>ORDER TYPE</th>
          <th>STATUS</th>
          <th>ENTRY TIME</th>
          <th>EXIT TIME</th>
        </tr>
      </thead>
      {orders.length > 0 ? (
        <tbody>
          {orders.map((order) => (
            <tr key={order.sno}>
              <td>{order.sno}</td>
              <td>{order.id}</td>
              <td>{order.collateral}</td>
              <td>{order.size}</td>
              <td>{order.leverage}</td>
              <td>{order.LPrice}</td>
              <td>{order.EPrice}</td>
              <td>{order.MPrice}</td>
              <td>{order.type}</td>
              <td>{order.OType}</td>
              <td>{order.status}</td>
              <td>{order.ENTime}</td>
              <td>{order.EXTime}</td>
            </tr>
          ))}
        </tbody>
      ) : (
        <h1>NULL</h1>
      )}
    </Table>
  );
};
