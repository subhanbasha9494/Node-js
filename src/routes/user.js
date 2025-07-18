const express = require('express');
const { use } = require('./request');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName about skills";

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
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUserId._id, status: "interested" },
                { fromUserId: loggedInUserId._id, status: "interested" },
            ],
        });
        
        console.log("Connection requests found:", connectionRequests.length);
        
        // Collect user IDs to fetch
        const userIds = connectionRequests.map(row => {
            if (row.fromUserId.toString() === loggedInUserId._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        
        // Fetch complete user details
        const users = await User.find({ _id: { $in: userIds } })
            .select(USER_SAFE_DATA);
            
        res.json({ data: users });
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const  loggedInUserId = req.user;

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

        const users = await User.find({ _id: { $ne: loggedInUserId._id } })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
