// ChatHeader.jsx
import React, { useEffect, useState } from 'react';
import PinComponentWeb from './PinComponent';
import { useSelector } from 'react-redux';
import { getFriend } from '../../utils/AppUtils';
import { useDispatch } from 'react-redux';
import { setCalling, setIsVideoCallOpen, setIsVoiceCallOpen } from '../../redux/slices/CallSlice';
import VideoCallModal from '../call/VideoCallModel';
const ChatHeader = ({
  lastLogout,
  getLastLoginMessage,
  isFriendOnline,
  scrollToMessage,
  search,
  setSearch
}) => {
  const [timeDisplay, setTimeDisplay] = useState('Chưa truy cập');

  // Cập nhật timeDisplay mỗi phút dựa trên lastLogout
  useEffect(() => {
    const updateTimeDisplay = () => {
      setTimeDisplay(getLastLoginMessage(lastLogout));
    };

    // Gọi lần đầu
    updateTimeDisplay();

    // Cập nhật mỗi phút
    const intervalId = setInterval(updateTimeDisplay, 60 * 1000);

    // Cleanup interval
    return () => clearInterval(intervalId);
  }, [lastLogout]);

  const conversation = useSelector((state) => state.conversation.conversation);
  const userLogin = useSelector((state) => state.user.userLogin);


  const friend = getFriend(conversation, conversation.memberUserIds.find((item) => item !== userLogin.id))


  // HANDLER CALLL
  const isVideoCallOpen = useSelector((state) => state.call.isVideoCallOpen);
  const isVoiceCallOpen = useSelector((state) => state.call.isVoiceCallOpen);

  const dispatch = useDispatch();
  const handlerVideoCall = () => {
    dispatch(setIsVideoCallOpen(true))
    dispatch(setIsVoiceCallOpen(false))
    dispatch(setCalling(false))
  }
  const handlerVoiceCall = () => {
    dispatch(setIsVideoCallOpen(true))
    dispatch(setIsVoiceCallOpen(false))
    dispatch(setCalling(false))
  }
  return (

    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="p-4 flex items-center">
        {
          !conversation.isGroup ? (
            <img
              src={
                friend.avatarLink ||
                'https://my-alo-bucket.s3.amazonaws.com/1742401840267-OIP%20%282%29.jpg'
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-2"
            />
          ) : (
            <img
              src={
                conversation.avatar ||
                'https://my-alo-bucket.s3.amazonaws.com/1742401840267-OIP%20%282%29.jpg'
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full mr-2"
            />
          )
        }
        <div>
          {
            !conversation.isGroup ? (
              <p className="font-semibold">{friend.fullName}</p>
            ) : (
              <p className="font-semibold">{conversation.name}</p>
            )
          }
          <p className="text-sm text-gray-500">
            {!conversation.isGroup && (isFriendOnline(conversation.memberUserIds.find((v) => v !== userLogin.id))
              ? 'Đang hoạt động'
              : timeDisplay)}
          </p>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => {
              handlerVideoCall();
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className={`p-2 hover:bg-gray-100 rounded-full ${search ? "bg-blue-400" : ""}`} onClick={() => setSearch(!search)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0a7.5 7.5 0 1 0-1.15 1.15L21 21z"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Danh sách ghim */}
      {conversation.pineds && conversation.pineds.length > 0 && (
        <PinComponentWeb
          conversation={conversation}
          pins={conversation.pineds}
          scrollToMessage={scrollToMessage}
        />
      )}

      
    </div>
  );
};

export default ChatHeader;