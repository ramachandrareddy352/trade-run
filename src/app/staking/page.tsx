"use client";

import React, { useState } from "react";
import { Card, Button, Offcanvas, Form, InputGroup } from "react-bootstrap";
import { PieChart } from "@mui/x-charts/PieChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PRESALE_CONTRACT,
  STAKING_CONTRACT,
} from "../constants/contractAddress";
import { stakingAbi } from "@/abi/stakingAbi";
import { presaleAbi } from "@/abi/presaleAbi";
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

export default function Staking() {
  const account = useAccount();
  const { connectors, connect, status, error, isError } = useConnect();

  const [isFixed, setFixed] = useState(true);
  const [days, setDays] = useState<Number>(30);

  const {
    data: hash,
    writeContract,
    isError: writeIsError,
    error: writeError,
  } = useWriteContract();
  const { signTypedDataAsync } = useSignTypedData(); // To sign the typed data
  const [signature, setSignature] = useState<String>("");

  const [amount, setAmount] = useState<bigint>();
  const [stakingID, setStakingID] = useState<bigint>();
  const [lpToken, setLPToken] = useState<String>();
  const [receiver, setReceiver] = useState<String>();

  const handlePermitSign = async () => {
    const tokenAddress = lpToken;
    const spender = STAKING_CONTRACT;
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

  const fixedStakeWithSignature = async () => {
    if (amount && lpToken && account.status === "connected") {
      try {
        await handlePermitSign();

        const { v, r, s } = ethers.utils.splitSignature(`0x${signature}`);

        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "fixedStake",
          args: [
            `0x${lpToken}`,
            `0x${account.address}`,
            BigInt(amount ? amount : 0),
            Number(days) / 30 + 1,
            BigInt(UINT32_MAX),
            v,
            `0x${r}`,
            `0x${s}`,
          ],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const fixedStakeWithApprove = async () => {
    if (amount && lpToken && account.status === "connected") {
      try {
        writeContract({
          address: `0x${lpToken}`,
          abi: erc20PermitAbi,
          functionName: "approve",
          args: [`0x${STAKING_CONTRACT}`, BigInt(UINT256_MAX)],
        });
        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "fixedStake",
          args: [
            `0x${lpToken}`,
            `0x${account.address}`,
            BigInt(amount ? amount : 0),
            Number(days) / 30 + 1,
            BigInt(0),
            0,
            "0x00",
            "0x00",
          ],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const variableStakeWithSignature = async () => {
    if (amount && lpToken && account.status === "connected") {
      try {
        await handlePermitSign();

        const { v, r, s } = ethers.utils.splitSignature(`0x${signature}`);

        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "stake",
          args: [
            `0x${lpToken}`,
            BigInt(amount ? amount : 0),
            BigInt(UINT32_MAX),
            v,
            `0x${r}`,
            `0x${s}`,
          ],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const variableStakeWithApprove = async () => {
    if (amount && lpToken && account.status === "connected") {
      try {
        writeContract({
          address: `0x${lpToken}`,
          abi: erc20PermitAbi,
          functionName: "approve",
          args: [`0x${STAKING_CONTRACT}`, BigInt(UINT256_MAX)],
        });
        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "stake",
          args: [
            `0x${lpToken}`,
            BigInt(amount ? amount : 0),
            BigInt(0),
            0,
            "0x00",
            "0x00",
          ],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const fixedUnstake = async () => {
    if (stakingID && account.status === "connected") {
      try {
        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "unStakeFixed",
          args: [stakingID],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const variableUnstake = async () => {
    if (amount && lpToken && account.status === "connected") {
      try {
        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "unStake",
          args: [
            `0x${lpToken}`,
            `0x${account.address}`,
            BigInt(amount ? amount : 0),
          ],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const claimRewardTokens = async () => {
    if (amount && receiver && account.status === "connected") {
      try {
        writeContract({
          address: STAKING_CONTRACT,
          abi: stakingAbi,
          functionName: "claimRewards",
          args: [`0x${lpToken}`, `0x${receiver}`, BigInt(amount ? amount : 0)],
        });

        if (writeIsError) {
          toast.error(`Transaction unSuccessfully`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.success(`Transaction successfully completed`, {
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

  const claimedTokens = useReadContract({
    abi: stakingAbi,
    address: STAKING_CONTRACT,
    functionName: "claimedRewards",
    args: [`0x${account.address}`],
  });
  const pendingTokens = useReadContract({
    abi: stakingAbi,
    address: STAKING_CONTRACT,
    functionName: "pendingRewards",
    args: [`0x${account.address}`],
  });

  const price = useReadContract({
    abi: presaleAbi,
    address: PRESALE_CONTRACT,
    functionName: "getCurrentPrice",
    args: [BigInt(0)],
  });

  const totalClaimed = useReadContract({
    abi: stakingAbi,
    address: STAKING_CONTRACT,
    functionName: "totalRewarded",
    args: [],
  });

  const platform1 = [
    {
      label: "Claimed Tokens",
      value:
        Number(
          formatBigInt(totalClaimed.data ? totalClaimed.data : BigInt(0), 18)
        ) + 100,
    },
    {
      label: "UnClaimed Tokens",
      value: Number(
        formatBigInt(
          totalClaimed.data
            ? BigInt(200000000000000000000000000) - totalClaimed.data
            : BigInt(0),
          18
        ) + 45
      ),
    },
  ];
  const valueFormatter1 = (item: { value: number }) => `${item.value}`;

  return (
    <div className="container">
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
      <div>
        <div>
          <br />
          <br />
          <br />
          <div className="container">
            <Button variant="primary" onClick={() => setFixed(true)}>
              Fixed Staking
            </Button>
            <Button variant="primary" onClick={() => setFixed(false)}>
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
                <h1>Staking LP Tokens</h1>
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
                      onChange={(e: any) => {
                        setLPToken(e.target.value);
                      }}
                    />
                  </InputGroup>
                  <InputGroup
                    className="mb-3"
                    style={{ width: "370px", marginLeft: "50px" }}
                  >
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      type="Number"
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e: any) => {
                        setAmount(e.target.value);
                      }}
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
                    onClick={() => setDays(30)}
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
                    onClick={() => setDays(60)}
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
                    onClick={() => setDays(90)}
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
                    onClick={() => setDays(120)}
                  >
                    <span>120 DAYS</span>
                    <h6>14% APY</h6>
                  </Button>
                </div>
                <br />
                <p>
                  Current Token Price :{" "}
                  <b>
                    {price.data ? formatBigIntForPrice(price.data) : "N/A"}$
                  </b>
                </p>
                <div>
                  {account.status === "connected" ? (
                    <div className="d-flex justify-content-evenly">
                      <Button variant="primary" onClick={fixedStakeWithApprove}>
                        Stake with Approve
                      </Button>
                      <Button
                        variant="primary"
                        onClick={fixedStakeWithSignature}
                      >
                        Stake with Signature
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
                <br />
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
                      type="Number"
                      placeholder="Staking Id"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e: any) => {
                        setStakingID(e.target.value);
                      }}
                    />
                  </InputGroup>
                  <span>
                    Total Claimed Tokens :{" "}
                    <b>
                      {claimedTokens.data
                        ? formatBigInt(claimedTokens.data, 18)
                        : "N/A"}
                    </b>
                  </span>
                  <br />
                  <span>
                    Total Pending Tokens :{" "}
                    <b>
                      {pendingTokens.data
                        ? formatBigInt(pendingTokens.data, 18)
                        : "N/A"}
                    </b>
                  </span>
                  <br />
                  <br />
                  <div>
                    {account.status === "connected" ? (
                      <Button variant="primary" onClick={fixedUnstake}>
                        Unstake and Claim
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => connect({ connector: connectors[0] })}
                      >
                        {status == "pending"
                          ? `Connecting...`
                          : `Connect Wallet`}
                      </Button>
                    )}
                  </div>
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
                <h1>Staking LP Tokens</h1>
                <p style={{ color: "grey" }}>
                  0xeBec795c9c8bBD61FFc14A6662944748F299cAcf
                </p>
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
                      onChange={(e: any) => {
                        setLPToken(e.target.value);
                      }}
                      placeholder="LP Token Address"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                    />
                  </InputGroup>
                  <InputGroup style={{ width: "370px", marginLeft: "50px" }}>
                    <InputGroup.Text id="basic-addon1">Amount</InputGroup.Text>
                    <Form.Control
                      type="Number"
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e: any) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>
                <br />
                <div>
                  {account.status === "connected" ? (
                    <div className="d-flex justify-content-evenly">
                      <Button
                        variant="primary"
                        onClick={variableStakeWithApprove}
                      >
                        Stake with Approve
                      </Button>
                      <Button
                        variant="primary"
                        onClick={variableStakeWithSignature}
                      >
                        Stake with Signature
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
                <br />
                <h6>
                  Current Token Price :{" "}
                  <b>
                    {price.data ? formatBigIntForPrice(price.data) : "N/A"}$
                  </b>
                </h6>
                <div>
                  {account.status === "connected" ? (
                    <div className="d-flex justify-content-evenly">
                      <Button variant="primary" onClick={variableUnstake}>
                        UnStake
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
                      onChange={(e: any) => {
                        setReceiver(e.target.value);
                      }}
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
                      type="Number"
                      placeholder="Amount to stake"
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(e: any) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </InputGroup>
                  <div className="mb-3">
                    <span>
                      Total Claimed Tokens :{" "}
                      <b>
                        {claimedTokens.data
                          ? formatBigInt(claimedTokens.data, 18)
                          : "N/A"}
                      </b>
                    </span>
                    <br />
                    <span>
                      Total Pending Tokens :{" "}
                      <b>
                        {pendingTokens.data
                          ? formatBigInt(pendingTokens.data, 18)
                          : "N/A"}
                      </b>
                    </span>
                  </div>
                  <div>
                    {account.status === "connected" ? (
                      <div className="d-flex justify-content-evenly">
                        <Button variant="primary" onClick={claimRewardTokens}>
                          Claim Rewards
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => connect({ connector: connectors[0] })}
                      >
                        {status == "pending"
                          ? `Connecting...`
                          : `Connect Wallet`}
                      </Button>
                    )}
                  </div>
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
                <h4>
                  {totalClaimed.data
                    ? formatBigInt(totalClaimed.data, 18)
                    : "N/A"}
                </h4>
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
          </div>
        </div>
      </div>
    </div>
  );
}
