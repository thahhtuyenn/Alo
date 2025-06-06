import Toast, { ToastPosition } from "react-native-toast-message"
import { GlobalStyles } from "../presentation/styles/GlobalStyles"


export const showToast = (type, position, title, content) => {
    Toast.show({
        type: type,
        position: position,
        text1: title,
        text2: content,
        visibilityTime: 4000, // Thời gian hiển thị toast (ms)
        autoHide: true, // Tự động ẩn toast sau thời gian trên
        topOffset: 30, // Khoảng cách từ cạnh trên
        bottomOffset: 40, // Khoảng cách từ cạnh dưới,
        text1Style: [GlobalStyles.textStyle, { fontWeight: 'bold' }],
        text2Style: [GlobalStyles.textStyle, {}],
    })
}
export  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Tách tổ hợp ký tự Unicode
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };
export const getFriend = (conversation, userId) => {
    const friend = conversation.members.find(member => member.id === userId);
    return friend;
}

export const getGroupImageDefaut = () => {
    return [
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/1_family.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/2_family.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/3_family.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/4_work.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/5_work.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/6_work.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/7_friends.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/8_friends.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/9_friends.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/10_school.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/11_school.jpg",
        "https://my-alo-bucket.s3.us-east-1.amazonaws.com/Image+Group/12_school.jpg"

    ]
}
export const getUserRoleAndPermissions = (conversation, userId) => {
    const roleInfo = conversation.roles.find(role => role.userIds.includes(userId));
    if (!roleInfo) {
        return {
            role: null,
            permissions: {}
        };
    }
    return {
        role: roleInfo.role,
        permissions: roleInfo.permissions
    };
}