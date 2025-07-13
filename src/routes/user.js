const express = require('express');
const { use } = require('./request');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUserId._id,
            status: "interested"
            //}).populate("fromUserId", ["firstName", "lastName"]);
        }).populate("fromUserId", USER_SAFE_DATA);
        console.log(connectionRequest);
        res.json({
            message: "Data fetched Successfully",
            data: connectionRequest
        });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUserId._id, status: "accepted" },
                { fromUserId: loggedInUserId._id, status: "accepted" },
            ],
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA);
        console.log(connectionRequest);
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUserId._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUserId._id }, { toUserId: loggedInUserId._id }],
        }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUserId._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
