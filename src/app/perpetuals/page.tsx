"use client";

import { Select } from "@mui/material";
import { useEffect, useState } from "react";
import { Image, Card, Button, Offcanvas, Form } from "react-bootstrap";
import TradeRun from "../../images/trade-run.jpeg";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Perpetuals() {
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
        width: 1080,
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
                backgroundColor: "black",
                backdropFilter: "blur(10px)",
              }}
            >
              <div>
                <Form.Select
                  size="lg"
                  className="my-3 mx-2"
                  style={{ width: "170px", height: "60px" }}
                >
                  <option>BTC/USD</option>
                  <option>ETH/USD</option>
                  <option>SOL/USD</option>
                  <option>DAI/USD</option>
                </Form.Select>
              </div>
              <div className="mx-4 my-4" style={{ textAlign: "center" }}>
                <span>$60,244.34</span>
                <h6>-0.12%</h6>
              </div>
              <div className="mx-4 my-4" style={{ textAlign: "center" }}>
                <span>Available Liquidity(52% / 48%)</span>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <h6>LL $33.02M</h6>
                  <h6>SS $31.37M</h6>
                </div>
              </div>
              <div className="mx-4 my-4" style={{ textAlign: "center" }}>
                <span>Open Interest(52% / 48%)</span>
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <h6>LL $33.02M</h6>
                  <h6>SS $31.37M</h6>
                </div>
              </div>
              <div className="mx-4 my-4" style={{ textAlign: "center" }}>
                <span>Total Volume</span>
                <h6>$143.67M</h6>
              </div>
              <div className="mx-4 my-4" style={{ textAlign: "center" }}>
                <span>Total Orders</span>
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
            className="mx-3"
            style={{
              width: "360px",
              height: "640px",
              marginTop: "80px",
              backgroundColor: "black",
              backdropFilter: "blur(5px)",
            }}
          >
            <div style={{ display: "flex", margin: "15px" }}>
              <Button
                variant="primary"
                style={{ width: "165px", borderRadius: "0px" }}
              >
                Long
              </Button>
              <Button
                variant="primary"
                style={{ width: "165px", borderRadius: "0px" }}
              >
                Short
              </Button>
            </div>
            <div className="d-flex justify-content-between mx-3">
              <span>Market</span>
              <span>Price Limit</span>
              <span>Stop Loss</span>
              <span>Time Limit</span>
            </div>

            <div className="mx-3 my-3">
              <div
                className="mb-3"
                style={{
                  width: "325px",
                  height: "70px",
                  backgroundColor: "skyblue",
                }}
              >
                INPUT-1
              </div>
              <div
                style={{
                  width: "325px",
                  height: "70px",
                  backgroundColor: "skyblue",
                }}
              >
                INPUT-2
              </div>
              <hr style={{ color: "white" }} />

              <div
                style={{
                  width: "325px",
                  height: "70px",
                  backgroundColor: "skyblue",
                }}
              >
                INPUT-3
              </div>
            </div>
            <div className="mx-3 mb-3">
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
            <div className="mx-3 my-3">
              <h6>Liquidation Price: $25,000</h6>
              <h6>Protocol fee: 0.47</h6>
              <h6>Funding fee: 0.24</h6>
              <h6>Maintenance Margin: 5%</h6>
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

        <div>
          <div
            className="mx-3"
            style={{
              width: "1480px",
              height: "300px",
              border: "2px solid red",
              backdropFilter: "blur(5px)",
            }}
          >
            <div className="mx-3 my-3 d-flex justify-content-between">
              <span>S.No</span>
              <span>Position ID</span>
              <span>Collateral</span>
              <span>Size</span>
              <span>Leverage</span>
              <span>Liquidation Price</span>
              <span>Entry Price</span>
              <span>Mark Price</span>
              <span>Long/Short</span>
              <span>Order Type</span>
              <span>Status</span>
              <span>Entry Time</span>
              <span>Exit Time</span>
            </div>
            <hr style={{ color: "white" }} />
            <div
              className="mx-3"
              style={{
                height: "220px",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
              <p>Hello world</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
