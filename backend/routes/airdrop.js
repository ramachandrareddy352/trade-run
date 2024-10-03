const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Airdrop = require("../models/Airdrop");

// http://127.0.0.1:5000/api/airdrop/createAirdrop

router.post(
  "/createAirdrop",
  [
    body("round", "Invalid roundID").isInt({ min: 1 }),
    body("root", "Invalid Root hash").isLength({
      min: 66,
      max: 66,
    }),
    body("transactionHash", "Invalid Transaction hash").isLength({
      min: 66,
      max: 66,
    }),
    body("totalTokens", "Invalid token amount").isInt({ min: 1 }),
    body("startTime", "Invalid startTime").isInt({ min: 1 }),
    body("endTime", "Invalid endTime").isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      if (req.body.startTime >= req.body.endTime) {
        return res.status(400).json({
          success: success,
          error: "Invalid timings given",
        });
      }

      const airdrop = await Airdrop.create({
        round: req.body.round,
        root: req.body.root,
        transactionHash: req.body.transactionHash,
        totalTokens: req.body.totalTokens,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });

      success = true;
      res.json({ success: success, airdrop: airdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updateAirdropRoot",
  [
    body("round", "Invalid roundID").isInt({ min: 1 }),
    body("root", "Invalid Root hash").isLength({
      min: 66,
      max: 66,
    }),
    body("totalTokens", "Invalid token amount").isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      let airdrop = await Airdrop.findOne({
        round: req.body.round,
      });

      if (!airdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      let updatedData = {};
      updatedData.root = req.body.root;
      updatedData.totalTokens = req.body.totalTokens;

      airdrop = await Airdrop.findOneAndUpdate(
        { round: req.body.round },
        { $set: updatedData },
        { new: true }
      );

      success = true;
      res.json({ success: success, airdrop: airdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.put(
  "/updateAirdropTime",
  [
    body("round", "Invalid roundID").isInt({ min: 1 }),
    body("startTime", "Invalid Start Time").isInt({ min: 1 }),
    body("endTime", "Invalid End Time").isInt({ min: 1 }),
    body("isPaused"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    if (req.body.startTime >= req.body.endTime) {
      return res
        .status(400)
        .json({ success: success, error: "Invalid Start Time" });
    }

    try {
      let airdrop = await Airdrop.findOne({
        round: req.body.round,
      });

      if (!airdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      let updatedData = {};
      updatedData.startTime = req.body.startTime;
      updatedData.endTime = req.body.endTime;
      updatedData.isPaused = req.body.isPaused;

      airdrop = await Airdrop.findOneAndUpdate(
        { round: req.body.round },
        { $set: updatedData },
        { new: true }
      );

      success = true;
      res.json({ success: success, airdrop: airdrop });
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
  [
    body("round", "Invalid roundID").isInt({ min: 1 }),
    body("claimedTokens", "Invalid Claimed Tokens").isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success = false;

    if (!errors.isEmpty()) {
      return res.status(400).json({ success: success, error: errors.array() });
    }

    try {
      let airdrop = await Airdrop.findOne({
        round: req.body.round,
      });

      if (!airdrop) {
        return res
          .status(400)
          .json({ success: success, error: "Airdrop not found" });
      }

      if (
        req.body.claimedTokens + airdrop.claimedTokens >
        airdrop.totalTokens
      ) {
        return res
          .status(400)
          .json({ success: success, error: "Invalid Start Time" });
      }

      let updatedData = {};
      updatedData.claimedTokens =
        airdrop.claimedTokens + req.body.claimedTokens;

      airdrop = await Airdrop.findOneAndUpdate(
        { round: req.body.round },
        { $set: updatedData },
        { new: true }
      );

      success = true;
      res.json({ success: success, airdrop: airdrop });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .send({ success: success, error: "Internal Server Error" });
    }
  }
);

router.get("/getAirdrop", [body("round")], async (req, res) => {
  let success = false;

  try {
    const airdrop = await Airdrop.findOne({
      round: req.body.round,
    });

    if (!airdrop) {
      return res
        .status(400)
        .json({ success: success, error: "Airdrop not found" });
    }

    success = true;
    res.json({ success: success, airdrop: airdrop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: success, error: "Internal Server Error" });
  }
});

router.get("/getAllAirdrops", [], async (req, res) => {
  let success = false;

  try {
    const airdrop = await Airdrop.find({});
    success = true;
    res.json({ success: success, airdrop: airdrop });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ success: success, error: "Internal Server Error" });
  }
});

module.exports = router;
