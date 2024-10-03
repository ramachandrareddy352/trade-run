"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { desktopOS, platforms, valueFormatter } from "../airdrop/webUsageStats";
import {
  MERKEL_AIRDROP_CONTRACT,
  GOVERENCE_TOKEN_CONTRACT,
  PRESALE_CONTRACT,
} from "../constants/contractAddress";
import { presaleAbi } from "@/abi/presaleAbi";
import { goverenceTokenAbi } from "@/abi/goverenceTokenAbi";
import {
  useAccount,
  useConnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import {
  formatBigInt,
  formatBigIntForPrice,
} from "../constants/formatBigIntValues";

export default function BuyTokens() {
  const account = useAccount();
  const { connectors, connect, status, error, isError } = useConnect();

  const [amount, setAmount] = useState<bigint>();
  const [collateral, setCollateral] = useState<String>();

  const {
    data: hash,
    writeContract,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();

  const claimAirdrop = async () => {
    if (amount && collateral && account.status === "connected") {
      writeContract({
        address: PRESALE_CONTRACT,
        abi: presaleAbi,
        functionName: "buyToken",
        args: [
          `0x${collateral}`,
          `0x${account.address}`,
          amount,
          BigInt(0),
          0,
          "0x12",
          "0x12",
        ],
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

  const tokenSolded = useReadContract({
    abi: presaleAbi,
    address: PRESALE_CONTRACT,
    functionName: "tokensSold",
    args: [],
  });

  const price = useReadContract({
    abi: presaleAbi,
    address: PRESALE_CONTRACT,
    functionName: "getCurrentPrice",
    args: [BigInt(amount ? amount : 0)],
  });

  const goverenceTokenBalance = useReadContract({
    abi: goverenceTokenAbi,
    address: GOVERENCE_TOKEN_CONTRACT,
    functionName: "balanceOf",
    args: [`0x${account.address}`],
  });

  const collateralInUSD =
    price.data && amount ? formatBigInt(price.data * amount, 18) : BigInt(0);

  const toPay = useReadContract({
    abi: presaleAbi,
    address: PRESALE_CONTRACT,
    functionName: "getCollateralAmount",
    args: [`0x${account.address}`, BigInt(collateralInUSD)],
  });

  const platform1 = [
    {
      label: "Tokens solded",
      value: Number(
        formatBigInt(tokenSolded.data ? tokenSolded.data : BigInt(0), 18)
      ),
    },
    {
      label: "Tokens UnSolded",
      value: Number(
        formatBigInt(
          tokenSolded.data
            ? BigInt(350000000000000000000000000) - tokenSolded.data
            : BigInt(0),
          18
        )
      ),
    },
  ];
  const platform2 = [
    {
      label: "Tokens solded",
      value: Number(
        formatBigInt(tokenSolded.data ? tokenSolded.data : BigInt(0), 18)
      ),
    },
    {
      label: "Tokens UnSolded",
      value: Number(
        formatBigInt(
          tokenSolded.data
            ? BigInt(350000000000000000000000000) - tokenSolded.data
            : BigInt(22),
          18
        )
      ),
    },
  ];
  const valueFormatter = (item: { value: number }) => `${item.value}`;
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

  return (
    <div>
      <div className="container">
        <div className="container">
          <br />
          <br />
          <br />
          <div className="container">
            <div
              className="container my-5"
              style={{
                width: "550px",
                height: "530px",
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
              <h2>BUY GOVERENCE TOKENS</h2>
              <p style={{ color: "grey" }}>
                0xeBec795c9c8bBD61FFc14A6662944748F299cAcf
              </p>
              <br />
              <div style={{ width: "400px", marginLeft: "60px" }}>
                <Form.Select
                  size="lg"
                  onChange={(e: any) => setCollateral(e.target.value)}
                  style={{ textAlign: "center" }}
                >
                  <option value="0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E">
                    USDC
                  </option>
                  <option value="0xc59E3633BAAC79493d908e63626716e204A45EdF">
                    LINK
                  </option>
                  <option value="0x694AA1769357215DE4FAC081bf1f309aDC325306">
                    WETH
                  </option>
                  <option value="0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43">
                    WBTC
                  </option>
                  <option value="0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E">
                    USDT
                  </option>
                  <option value="0x14866185B1962B63C3Ea9E03Bc1da838bab34C19">
                    DAI
                  </option>
                  <option value="0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E">
                    EUR
                  </option>
                  <option value="0x070bF128E88A4520b3EfA65AB1e4Eb6F0F9E6632">
                    FORTH
                  </option>
                </Form.Select>
                <br />
                <br />
                <InputGroup className="mb-3">
                  <InputGroup.Text id="amount">Amount</InputGroup.Text>
                  <Form.Control
                    type="number"
                    placeholder="Amount you want"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    onChange={(e: any) => setAmount(BigInt(e.target.value))}
                    required
                  />
                </InputGroup>
              </div>
              <div className="my-5">
                <p>
                  Current goverenec token price :
                  {formatBigIntForPrice(price.data ? price.data : BigInt(0))}$
                </p>
                <p>
                  Collateral you have to pay :{" "}
                  {formatBigInt(toPay.data ? toPay.data : BigInt(0), 18)} tokens
                </p>
                <p>
                  Total Balancce :{" "}
                  {formatBigInt(
                    goverenceTokenBalance.data
                      ? goverenceTokenBalance.data
                      : BigInt(0),
                    18
                  )}
                </p>
                <br />
                {account.status === "connected" ? (
                  <div className="d-flex justify-content-evenly">
                    <Button variant="primary">Buy with Approve</Button>
                    <Button variant="primary">Buy with Signature</Button>
                  </div>
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
          </div>

          <div className="mx-5">
            <div
              className=" mb-5 my-5"
              style={{
                display: "flex",
                alignContent: "space-evenly",
                marginTop: "30px",
              }}
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
                <h6>Total Tokens in PreSale</h6>
                <h4>350 millions</h4>
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
                <h6>Total Tokens Solded</h6>
                <h4>{tokenSolded.data ? tokenSolded.data : 0}</h4>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignContent: "space-evenly" }}>
            {/* chart for total solded and remaining only two parameters */}
            <div>
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
                    valueFormatter,
                  },
                ]}
                width={500}
                height={200}
              />
              {/* add the table label at top/below for two charts */}
            </div>
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
                    valueFormatter,
                  },
                ]}
                width={350}
                height={200}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
