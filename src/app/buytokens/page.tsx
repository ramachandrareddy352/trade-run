"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GOVERENCE_TOKEN_CONTRACT,
  PRESALE_CONTRACT,
} from "../constants/contractAddress";
import { presaleAbi } from "@/abi/presaleAbi";
import { goverenceTokenAbi } from "@/abi/goverenceTokenAbi";
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
import { ethers } from "ethers";

export default function BuyTokens() {
  const account = useAccount();
  const blockNumber = useBlock();
  const { connectors, connect, status, error, isError } = useConnect();

  const [amount, setAmount] = useState<bigint>();
  const [collateral, setCollateral] = useState<String>();
  const [claimer, setClaimer] = useState<String>();

  const {
    data: hash,
    writeContract,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData(); // To sign the typed data
  const [signature, setSignature] = useState<String>("");

  const handlePermitSign = async () => {
    const tokenAddress = collateral;
    const spender = PRESALE_CONTRACT;
    const nonce = useReadContract({
      abi: erc20PermitAbi,
      address: `0x${tokenAddress}`,
      functionName: "nonces",
      args: [`0x${account.address}`],
    });
    const deadline = UINT32_MAX;

    // Create the domain for EIP-712
    const domain = {
      name: useReadContract({
        abi: erc20MetadataAbi,
        address: `0x${tokenAddress}`,
        functionName: "name",
        args: [],
      }),
      version: "1",
      chainId: 11155111, // Mainnet or the chain ID you're working on
      verifyingContract: `0x${tokenAddress}`,
    };

    // Create the message (permit)
    const value = {
      owner: account.address,
      spender: spender,
      value: UINT256_MAX, // Number of tokens to approve
      nonce: nonce,
      deadline: deadline,
    };

    // The type of the permit (EIP-712 typed data structure)
    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    try {
      // Sign the typed data (EIP-712 permit)
      const signature = await signTypedDataAsync({
        domain,
        types,
        value,
      });
      console.log("Signature:", signature);
      setSignature(signature);

      // Now you can use this `signature` to submit it on-chain to the contract
    } catch (error) {
      console.error("Error signing permit:", error);
    }
  };

  const buyTokensWithSignature = async () => {
    if (amount && collateral && account.status === "connected") {
      try {
        await handlePermitSign();

        const { v, r, s } = ethers.utils.splitSignature(`0x${signature}`);

        writeContract({
          address: PRESALE_CONTRACT,
          abi: presaleAbi,
          functionName: "buyToken",
          args: [
            `0x${collateral}`,
            `0x${claimer}`,
            BigInt(amount ? amount : 0),
            BigInt(UINT32_MAX),
            v,
            `0x${r}`,
            `0x${s}`,
          ],
        });

        toast.success(`Goverence Tokens bought successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Failed to sign the transaction`, {
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

  const buyTokensWithApprove = async () => {
    if (amount && collateral && account.status === "connected") {
      try {
        writeContract({
          address: `0x${collateral}`,
          abi: erc20PermitAbi,
          functionName: "approve",
          args: [`0x${PRESALE_CONTRACT}`, BigInt(UINT256_MAX)],
        });
        writeContract({
          address: PRESALE_CONTRACT,
          abi: presaleAbi,
          functionName: "buyToken",
          args: [
            `0x${collateral}`,
            `0x${claimer}`,
            BigInt(amount ? amount : 0),
            BigInt(0),
            0,
            "0x00",
            "0x00",
          ],
        });

        toast.success(`Goverence Tokens bought successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Failed to sign the transaction`, {
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

  const [balanceInUSD, setBalanceInUSD] = useState<BigInt[]>([]);
  const tokens = ["WETH", "WBTC", "LINK", "USDC", "USDT", "DAI"];
  let totalBalance: bigint = BigInt(0);

  const platform1 = [
    {
      label: "Tokens solded",
      value:
        Number(
          formatBigInt(tokenSolded.data ? tokenSolded.data : BigInt(0), 18)
        ) + 22,
    },
    {
      label: "Tokens UnSolded",
      value:
        Number(
          formatBigInt(
            tokenSolded.data
              ? BigInt(350000000000000000000000000) - tokenSolded.data
              : BigInt(0),
            18
          )
        ) + 35,
    },
  ];
  const platform2 = [
    {
      label: "WETH",
      value: Number(balanceInUSD[0]),
    },
    {
      label: "WBTC",
      value: Number(balanceInUSD[1]),
    },
    {
      label: "LINK",
      value: Number(balanceInUSD[2]),
    },
    {
      label: "USDC",
      value: Number(balanceInUSD[3]),
    },
    {
      label: "USDT",
      value: Number(balanceInUSD[4]),
    },
    {
      label: "DAI",
      value: Number(balanceInUSD[5]),
    },
  ];
  const valueFormatter1 = (item: { value: number }) => `${item.value}`;
  // const valueFormatter2 = (item: { value: number }) =>
  //   `$${formatBigInt(BigInt(item.value), 8)}`;
  const valueFormatter2 = (item: { value: number }) => `$${item.value}`;

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

    async function fetchBalances() {
      const balances = await Promise.all(
        tokens.map(async (token) => {
          const balance = useReadContract({
            abi: presaleAbi,
            address: PRESALE_CONTRACT,
            functionName: "userBalance",
            args: [`0x${account.address}`, `0x${token}`],
          });
          totalBalance += BigInt(balance.data ? balance.data : 0);
          return BigInt(balance.data ? balance.data : 0);
        })
      );
      setBalanceInUSD(balances);
    }

    fetchBalances();
  }, [isError, error, account.address]);

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
      <div className="container">
        <div className="container">
          <br />
          <br />
          <br />
          <div className="container">
            <div
              className="container my-5"
              style={{
                width: "500px",
                height: "570px",
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
              <div style={{ width: "400px", marginLeft: "40px" }}>
                <Form.Select
                  size="lg"
                  onChange={(e: any) => setCollateral(e.target.value)}
                  style={{ textAlign: "center" }}
                >
                  <option value="A2F78ab2355fe2f984D808B5CeE7FD0A93D5270E">
                    USDC
                  </option>
                  <option value="c59E3633BAAC79493d908e63626716e204A45EdF">
                    LINK
                  </option>
                  <option value="694AA1769357215DE4FAC081bf1f309aDC325306">
                    WETH
                  </option>
                  <option value="1b44F3514812d835EB1BDB0acB33d3fA3351Ee43">
                    WBTC
                  </option>
                  <option value="A2F78ab2355fe2f984D808B5CeE7FD0A93D5270E">
                    USDT
                  </option>
                  <option value="14866185B1962B63C3Ea9E03Bc1da838bab34C19">
                    DAI
                  </option>
                </Form.Select>
                <br />
                <br />
                <InputGroup
                  className="mb-3"
                  style={{ width: "400px", marginLeft: "0px" }}
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
              <div className="mt-4" style={{ lineHeight: "33px" }}>
                <span>
                  Current goverenec token price :
                  <b>
                    {formatBigIntForPrice(price.data ? price.data : BigInt(0))}$
                  </b>
                </span>
                <br />
                <span>
                  Collateral you have to pay :{" "}
                  <b>
                    {formatBigInt(toPay.data ? toPay.data : BigInt(0), 18)}{" "}
                    tokens
                  </b>
                </span>
                <br />
                <span>
                  Total Balancce :{" "}
                  <b>
                    {formatBigInt(
                      goverenceTokenBalance.data
                        ? goverenceTokenBalance.data
                        : BigInt(0),
                      18
                    )}
                  </b>
                </span>
                <br />
                <br />
                {account.status === "connected" ? (
                  <div className="d-flex justify-content-evenly">
                    <Button variant="primary" onClick={buyTokensWithApprove}>
                      Buy with Approve
                    </Button>
                    <Button variant="primary" onClick={buyTokensWithSignature}>
                      Buy with Signature
                    </Button>
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

          <div className="ml-5">
            <div
              className="mb-5 my-5"
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
                    valueFormatter: valueFormatter1,
                  },
                ]}
                width={500}
                height={200}
              />
            </div>
            {/* add the table label at top/below for two charts */}

            {totalBalance == BigInt(0) ? (
              <div>
                <h4>Nothing to show</h4>
              </div>
            ) : (
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
                  width={350}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
