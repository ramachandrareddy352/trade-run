const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Airdrop = require("../models/Airdrop");
const UserAirdrop = require("../models/UserAirdrop");

// http://127.0.0.1:5000/api/airdrop/createAirdrop

router.post(
  "/createUserAirdrop",
  [
    body("round", "Invalid roundID").isInt({ min: 1 }),
    body("root", "Invalid Root hash").isLength({
      min: 66,
      max: 66,
    }),
    body("user", "Invalid user address").isLength({
      min: 42,
      max: 42,
    }),
    body("amount", "Invalid token amount").isInt({ min: 1 }),
    body("proofs"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      const airdrop = await Airdrop.findOne({
        round: req.body.round,
      });
      if (!airdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      const userAirdrop = await UserAirdrop.create({
        round: req.body.round,
        root: req.body.root,
        user: req.body.user,
        amount: req.body.amount,
        proofs: req.body.proofs,
      });

      success = true;
      res.json({ success: success, userAirdrop: userAirdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.put(
  "/claimAirdrop",
  [
    body("round"),
    body("user"),
    body("transactionHash", "Invalid Transaction Hash").isLength({
      min: 66,
      max: 66,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      let userAirdrop = await UserAirdrop.findOne({
        round: req.body.round,
        user: req.body.user,
      });

      if (!userAirdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      let updatedData = {};
      updatedData.transactionHash = req.body.transactionHash;

      userAirdrop = await UserAirdrop.findOneAndUpdate(
        { round: req.body.round, user: req.body.user },
        { $set: updatedData },
        { new: true }
      );

      success = true;
      res.json({ success: success, userAirdrop: userAirdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updateAirdropTokens",
  [body("round"), body("user"), body("amount"), body("proofs")],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      let userAirdrop = await UserAirdrop.findOne({
        round: req.body.round,
        user: req.body.user,
      });

      if (!userAirdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      let updatedData = {};
      updatedData.amount = req.body.amount;
      updatedData.proofs = req.body.proofs;

      userAirdrop = await UserAirdrop.findOneAndUpdate(
        { round: req.body.round },
        { $set: updatedData },
        { new: true }
      );

      success = true;
      res.json({ success: success, userAirdrop: userAirdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.delete("/deleteAllAirdrops", [body("round")], async (req, res) => {
  const errors = validationResult(req);
  let success = false;

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: success, error: errors.array() });
  }

  try {
    const airdrop = await Airdrop.findOne({
      round: req.body.round,
    });
    if (airdrop) {
      return res.status(400).json({ success: success, error: "Airdrop Exist" });
    }

    const userAirdrop = await UserAirdrop.deleteMany({
      round: req.body.round,
    });

    success = true;
    res.json({ success: success, userAirdrop: userAirdrop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: success, error: "Internal Server Error" });
  }
});

router.delete(
  "/deleteUserAirdrop",
  [body("round"), body("user")],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      const userAirdrop = await UserAirdrop.findOneAndDelete({
        round: req.body.round,
        user: req.body.user,
      });

      if (!userAirdrop) {
        return res
          .status(404)
          .json({ success: success, error: "User Airdrop not found" });
      }

      success = true;
      res.json({ success: success, userAirdrop: userAirdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.get(
  "/getUserAirdrop",
  [body("round"), body("user")],
  async (req, res) => {
    let success = false;

    try {
      const userAirdrop = await UserAirdrop.findOne({
        round: req.body.round,
        user: req.body.user,
      });

      if (!userAirdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      success = true;
      res.json({ success: success, userAirdrop: userAirdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.get("/getAllUserAirdrop", [body("user")], async (req, res) => {
  let success = false;

  try {
    const userAirdrop = await UserAirdrop.findOne({
      user: req.body.user,
    });

    if (!userAirdrop) {
      return res
        .status(400)
        .json({ success: success, error: "Airdrop not found" });
    }

    success = true;
    res.json({ success: success, userAirdrop: userAirdrop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: success, error: "Internal Server Error" });
  }
});

module.exports = router;
