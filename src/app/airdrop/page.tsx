"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { merkelAbi } from "@/abi/airdropAbi";
import { goverenceTokenAbi } from "@/abi/goverenceTokenAbi";
import {
  MERKEL_AIRDROP_CONTRACT,
  GOVERENCE_TOKEN_CONTRACT,
  PRESALE_CONTRACT,
} from "../constants/contractAddress";
import { presaleAbi } from "@/abi/presaleAbi";
import {
  formatBigInt,
  formatBigIntForPrice,
} from "../constants/formatBigIntValues";

const getAirdrops = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/airdrop", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to get data");
    }
    console.log(res.json);
    return res.json;
  } catch (error) {
    console.log(error);
    console.log("Error in catch");
  }
};

export default async function Airdrop() {
  const account = useAccount();
  const {
    data: hash,
    writeContract,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();

  const { connectors, connect, status, error, isError } = useConnect();

  const [roundID, setRoundID] = useState<bigint>();
  const [claimer, setClaimer] = useState<string>();
  const [amount, setAmount] = useState<bigint>();

  const airdrops = await getAirdrops();
  console.log(airdrops);

  const claimAirdrop = async () => {
    if (roundID && claimer && amount && account.status === "connected") {
      writeContract({
        address: MERKEL_AIRDROP_CONTRACT,
        abi: merkelAbi,
        functionName: "claimAirdrop",
        args: [roundID, `0x${claimer}`, amount, []],
      });
    } else {
      toast.error(`Fill all the required fields`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const goverenceTokenBalance = useReadContract({
    abi: goverenceTokenAbi,
    address: GOVERENCE_TOKEN_CONTRACT,
    functionName: "balanceOf",
    args: [`0x${account.address}`],
  });

  const price = useReadContract({
    abi: presaleAbi,
    address: PRESALE_CONTRACT,
    functionName: "getCurrentPrice",
    args: [BigInt(0)],
  });

  const remainingTokenInAirdrop = useReadContract({
    abi: merkelAbi,
    address: MERKEL_AIRDROP_CONTRACT,
    functionName: "airdropSupplyRemaining",
    args: [],
  });

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
    if (writeIsError && account.status === "connected") {
      toast.error(`Claiming Airdrop Tokens Failed`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(writeError);
    }
  }, [isError, error, writeError]);

  const platforms = [
    {
      label: "UnClaimed Tokens",
      value: Number(
        formatBigInt(
          remainingTokenInAirdrop.data
            ? remainingTokenInAirdrop.data
            : BigInt(0),
          18
        )
      ),
    },
    {
      label: "Claimed Tokens",
      value: Number(
        formatBigInt(
          remainingTokenInAirdrop.data
            ? BigInt(6000000000000000000000000) - remainingTokenInAirdrop.data
            : BigInt(0),
          18
        )
      ),
    },
  ];
  const valueFormatter = (item: { value: number }) => `${item.value}`;

  return (
    <div>
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
      <Button variant="secondary" onClick={getAirdrops}>
        Get Airdrops
      </Button>
      <div>
        <div className="container">
          <br />
          <br />
          <br />
          <div
            className="container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              className="my-5"
              style={{
                width: "500px",
                height: "550px",
                backdropFilter: "blur(10px)",
                boxShadow: "5px 4px 10px rgba(135, 206, 235, 0.7)",
                // display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <br />
              <h1>Claim Airdrop Tokens</h1>
              <p style={{ color: "grey" }}>
                0xdd4c8c2aDb5C72723FD01D5fB63380D217114DC9
              </p>
              <br />
              <div>
                <InputGroup
                  className="mb-3"
                  style={{ width: "400px", marginLeft: "50px" }}
                >
                  <InputGroup.Text id="roundid">Round ID</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter Airdrop round ID"
                    aria-label="Username"
                    aria-describedby="roundid"
                    required
                    onChange={(e: any) => setRoundID(BigInt(e.target.value))}
                  />
                </InputGroup>
                <br />
                <InputGroup
                  className="mb-3"
                  style={{ width: "400px", marginLeft: "50px" }}
                >
                  <InputGroup.Text id="claimer">Claimer</InputGroup.Text>
                  <Form.Control
                    placeholder="Enter Claimer Address"
                    aria-label="Username"
                    aria-describedby="claimer"
                    required
                    onChange={(e: any) => setClaimer(e.target.value)}
                  />
                </InputGroup>
                <br />
                <InputGroup
                  className="mb-3"
                  style={{ width: "400px", marginLeft: "50px" }}
                >
                  <InputGroup.Text id="amount">Amount</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Enter amount to claim(In WEI)"
                    aria-label="Username"
                    aria-describedby="amount"
                    required
                    onChange={(e: any) => setAmount(BigInt(e.target.value))}
                  />
                </InputGroup>
              </div>
              <div className="my-5">
                <p>
                  Current Token price :{" "}
                  {formatBigIntForPrice(price.data ? price.data : BigInt(0))}$
                </p>
                <h6>
                  Your Token Balance :{" "}
                  {formatBigInt(
                    goverenceTokenBalance.data
                      ? goverenceTokenBalance.data
                      : BigInt(0),
                    18
                  )}
                </h6>
                <br />
                {account.status === "connected" ? (
                  <Button
                    variant="primary"
                    onClick={() => claimAirdrop()}
                    disabled={account.status !== "connected"}
                  >
                    Claim Airdrop
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => connect({ connector: connectors[0] })}
                  >
                    {status == "pending" ? `Connecting...` : `Connect Wallet`}
                  </Button>
                )}
              </div>
            </div>
            <div className="my-5">
              <div
                className="mb-5 my-5"
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
                  <h6 style={{ color: "grey" }}>Total Tokens in Airdrops</h6>
                  <h4>6 millions</h4>
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
                  <h6 style={{ color: "grey" }}>Tokens Remaining</h6>
                  <h4>
                    {formatBigInt(
                      remainingTokenInAirdrop.data
                        ? remainingTokenInAirdrop.data
                        : BigInt(0),
                      18
                    )}{" "}
                  </h4>
                </div>
                {/* // above two in boxes, all the stakingId are at the profile page */}
              </div>
              <div className="my-5">
                <br />
                <br />
                <PieChart
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
                />
                <p style={{ marginLeft: "250px", marginTop: "30px" }}>
                  Statistical data &rarr;
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
}
