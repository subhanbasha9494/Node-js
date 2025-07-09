
const express = require("express");
const requestRouter = express.Router();


const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid Status" });
        }

        //If there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });
        if (existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!" });
        }



        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        //  below line is used to save connection in DB
        const data = await connectionRequest.save();
        res.json({
            message: "Connection Request Sent Successfully",
            data: data
        })
    } catch (err) {
        res.status(400).send("ERROR:" + err.message)
    }
});

module.exports = requestRouter;