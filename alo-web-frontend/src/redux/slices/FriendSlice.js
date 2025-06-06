import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/APIClient";
import socket from "../../utils/socket"
const initialState = {
    friends: [],
    friend: null,
    error: null,
    friendsRequest: [],
    friendsRequestSent: [],
};

const getFriends = createAsyncThunk('FriendSlice/getFriends', async (_, { rejectWithValue }) => {
    const userLogin = JSON.parse(localStorage.getItem('userLogin'));
    const userId = userLogin.id.trim();
    try {
        const response = await axiosInstance.get('/api/friend/get-friends?userId=' + userId);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const unfriend = createAsyncThunk('FriendSlice/unfriend', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/unfriend', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const blockFriend = createAsyncThunk('FriendSlice/block-friend', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/block-friend', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const unblockFriend = createAsyncThunk('FriendSlice/unblock-friend', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/unblock-friend', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const sendFriendRequest = createAsyncThunk('FriendSlice/sendFriendRequest', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/send-friend-request', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const acceptFriendRequest = createAsyncThunk('FriendSlice/acceptFriendRequest', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/accept-friend-request', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const rejectFriendRequest = createAsyncThunk('FriendSlice/rejectFriendRequest', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/reject-friend-request', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const cancelFriendRequest = createAsyncThunk('FriendSlice/cancelFriendRequest', async (request, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post('/api/friend/cancel-friend', request);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const getFriendsRequest = createAsyncThunk('FriendSlice/getFriendsRequest', async (_, { rejectWithValue }) => {
    try {
        const userLogin = JSON.parse(localStorage.getItem('userLogin'));
        const response = await axiosInstance.get('/api/friend/get-friend-request?userId=' + userLogin.id);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const getFriendsRequestSent = createAsyncThunk('FriendSlice/getFriendsRequestSent', async (_, { rejectWithValue }) => {
    try {
        const userLogin = JSON.parse(localStorage.getItem('userLogin'));
        const response = await axiosInstance.get('/api/friend/get-friend-requests-sent?userId=' + userLogin.id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});

const getFriendByPhone = createAsyncThunk('FriendSlice/getFriendByPhone', async (phoneNumber, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get('api/friend/get-friend-by-phone-number?phoneNumber=' + phoneNumber);

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi gọi API");
    }
});


const FriendSlice = createSlice({
    name: 'FriendSlice',
    initialState: initialState,
    reducers: {
        setFriendsRequest: (state, action) => {
            state.friendsRequest = action.payload;
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
        addFriend: (state, action) => {
            state.friends.push(action.payload);
        },
        addFriendsRequest: (state, action) => {
            state.friendsRequest.push(action.payload);
        },
        removeFriend: (state, action) => {
            const { userId, friendId } = action.payload;
            state.friends = state.friends.filter(
                (f) => !(f.userId === userId && f.friendId === friendId) &&
                    !(f.userId === friendId && f.friendId === userId)
            );
        },
        removeFriendRequest: (state, action) => {
            const { userId, friendId } = action.payload;
            state.friendsRequest = state.friendsRequest.filter(
                (f) => !(f.userId === userId && f.friendId === friendId)
            );
        },
        cancelFriendRequestSent: (state, action) => {
            const { userId, friendId } = action.payload;
            state.friendsRequestSent = state.friendsRequestSent.filter(
                (f) => !(f.userId === userId && f.friendId === friendId)
            );
        },
        addFriendRequestSent: (state, action) => {
            state.friendsRequestSent.push(action.payload);
        },
        updateFriend: (state, action) => {
            const { userId, friendId, status } = action.payload;
            const friendIndex = state.friends.findIndex(
                (f) => f.userId === userId && f.friendId === friendId
            );
            if (friendIndex !== -1) {
                state.friends[friendIndex].status = status;
            }
        } 
    },
    extraReducers: (builder) => {

        // getFriends
        builder.addCase(getFriends.pending, (state) => {
            state.friends = [];
        });
        builder.addCase(getFriends.fulfilled, (state, action) => {
            state.friends = action.payload.data;
        });
        builder.addCase(getFriends.rejected, (state, action) => {
            state.friends = [];
        });

        // send friend request
        builder.addCase(sendFriendRequest.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(sendFriendRequest.rejected, (state, action) => {
            state.friend = null;
        });

        // accept friend request
        builder.addCase(acceptFriendRequest.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(acceptFriendRequest.rejected, (state, action) => {
            state.friend = null;
        });

        // reject friend request
        builder.addCase(rejectFriendRequest.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(rejectFriendRequest.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(rejectFriendRequest.rejected, (state, action) => {
            state.friend = null;
        });

        // unfriend
        builder.addCase(unfriend.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(unfriend.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(unfriend.rejected, (state, action) => {
            state.friend = null;
        });

        // blockFriend
        builder.addCase(blockFriend.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(blockFriend.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(blockFriend.rejected, (state, action) => {
            state.friend = null;
        });

        // unblockFriend
        builder.addCase(unblockFriend.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(unblockFriend.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(unblockFriend.rejected, (state, action) => {
            state.friend = null;
        });

        // cancelFriendRequest
        builder.addCase(cancelFriendRequest.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(cancelFriendRequest.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(cancelFriendRequest.rejected, (state, action) => {
            state.friend = null;
        });

        // getFriendsRequest
        builder.addCase(getFriendsRequest.pending, (state) => {
            state.friendsRequest = [];
        });
        builder.addCase(getFriendsRequest.fulfilled, (state, action) => {
            state.friendsRequest = action.payload.data;
        });
        builder.addCase(getFriendsRequest.rejected, (state, action) => {
            state.friendsRequest = [];
        });

        // getFriendsRequestSent
        builder.addCase(getFriendsRequestSent.pending, (state) => {
            state.friendsRequestSent = [];
        });
        builder.addCase(getFriendsRequestSent.fulfilled, (state, action) => {
            state.friendsRequestSent = action.payload.data;
        });
        builder.addCase(getFriendsRequestSent.rejected, (state, action) => {
            state.friendsRequestSent = [];
        });

        // getFriendByPhone
        builder.addCase(getFriendByPhone.pending, (state) => {
            state.friend = null;
        });
        builder.addCase(getFriendByPhone.fulfilled, (state, action) => {
            state.friend = action.payload.data;
        });
        builder.addCase(getFriendByPhone.rejected, (state, action) => {
            state.friend = null;
        });

    }
});

export const { setFriendsRequest, updateFriend, setFriends, addFriend, removeFriend, removeFriendRequest, addFriendsRequest, cancelFriendRequestSent, addFriendRequestSent } = FriendSlice.actions;
export { getFriends, unfriend, blockFriend, sendFriendRequest, acceptFriendRequest, cancelFriendRequest, rejectFriendRequest, getFriendsRequest, unblockFriend, getFriendByPhone, getFriendsRequestSent };
export default FriendSlice.reducer;