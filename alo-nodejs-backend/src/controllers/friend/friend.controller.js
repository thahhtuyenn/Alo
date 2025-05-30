const friendService = require('../../services/friend.service');
const userService = require('../../services/user.service');
const conversationService = require('../../services/conversation.service');
exports.sendFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
            contentRequest: req.body.contentRequest,
            status: 0, // 0: pending, 1: accepted, 2: reject,
            requestDate: Date.now(),
        }
        // Kiểm tra friendId có tồn tại không
        const user = await userService.getUserById(request.friendId);
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: "Người dùng không tồn tại.",
                data: null
            });
        }
        // Kiểm tra đã gửi yêu cầu kết bạn chưa
        const friend = await friendService.getFriend(request);

        if (friend?.status === 0) {
            return res.status(400).json({
                status: 400,
                message: "Đã gửi yêu cầu kết bạn.",
                data: null
            });
        }

        const friendRequest = await friendService.friendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu kết bạn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Yêu cầu kết bạn đã được gửi."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.acceptFriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu kết bạn không hợp lệ.",
                data: null
            });
        }

        // kiểm tra đã tạo conversation chưa
        const conversation = await conversationService.getConversationByMembers([request.userId, request.friendId]);
        if (conversation) {
            return res.json({
                status: 200,
                data: friendRequest,
                message: "Đã chấp nhận yêu cầu kết bạn."
            });
        }

        const user = await userService.getUserById(request.userId);
        const friend = await userService.getUserById(request.friendId);

        await conversationService.createConversation({
            memberUserIds: [user.id, friend.id],
            createdBy: request.userId,
            isGroup: false,
            isCalling: false
        });

        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã chấp nhận yêu cầu kết bạn."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.rejectFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.rejectFriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu kết bạn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã từ chối yêu cầu kết bạn."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.unfriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.unfriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu hủy kết bạn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã hủy kết bạn."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.blockFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.blockFriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu chặn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã chặn bạn thành công."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.unblockFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.unblockFriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu mở chặn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã mở chặn bạn thành công."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.cancelFriendRequest = async (req, res) => {
    try {
        const request = {
            userId: req.body.userId,
            friendId: req.body.friendId,
        }
        const friendRequest = await friendService.cancelFriendRequest(request);
        if (!friendRequest) {
            return res.status(400).json({
                status: 400,
                message: "Yêu cầu hủy lời mời kết bạn không hợp lệ.",
                data: null
            });
        }
        return res.json({
            status: 200,
            data: friendRequest,
            message: "Đã hủy lời mời kết bạn."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.getFriendRequests = async (req, res) => {
    try {
        const userId = req.query.userId;
        const friendRequests = await friendService.getFriendRequests(userId);
        return res.json({
            status: 200,
            data: friendRequests,
            message: "Danh sách yêu cầu kết bạn."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.getFriendRequestsSent = async (req, res) => {
    try {
        const userId = req.query.userId;
        const friendRequestsSent = await friendService.getFriendRequestsSent(userId);
        return res.json({
            status: 200,
            data: friendRequestsSent,
            message: "Danh sách yêu cầu kết bạn đã gửi."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.getFriends = async (req, res) => {
    try {
        const userId = req.query.userId;
        const friends = await friendService.getFriends(userId);
        
        return res.json({
            status: 200,
            data: friends,
            message: "Danh sách bạn bè."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}

exports.getFriendByPhoneNumber = async (req, res) => {
    try {

        // Lấy Authorization từ header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const params = {
            phoneNumber: req.query.phoneNumber,
            userId: userService.getUserIdFromToken(token)
        }
        console.log("params", params);

        const friend = await friendService.getFriendByPhoneNumber(params);
        return res.json({
            status: 200,
            data: friend,
            message: "Thông tin người dùng."
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
            data: null
        });
    }
}