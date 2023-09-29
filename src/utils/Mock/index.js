import Mock from "mockjs";
// 模拟的用户数据
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];
Mock.mock("/mockTest/system/auth/login", "post", (data) => {
  const { username, password } = JSON.parse(data.body);
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return {
      code: 200,
      message: "登录成功",
      data: user,
    };
  } else {
    return {
      code: 401,
      message: "用户名或密码错误",
    };
  }
});
// 模拟注册接口
Mock.mock("/mockTest/system/auth/register", "post", (data) => {
  debugger;
  const { username, password } = JSON.parse(data.body);

  if (users.some((u) => u.username === username)) {
    return {
      code: 400,
      message: "用户名已被使用",
    };
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
  };

  users.push(newUser);

  return {
    code: 200,
    message: "注册成功",
    data: newUser,
  };
});
Mock.mock(
  /\/mockTest\/system\/auth\/refresh-token\?refreshToken=/,
  "post",
  (options) => {
    debugger;
    // 从options.url中获取刷新令牌参数
    const queryParams = options.url.split("?")[1];
    const params = new URLSearchParams(queryParams);
    const refreshToken = params.get("refreshToken");

    // 在这里进行你的模拟逻辑或返回
    // 例如：模拟刷新令牌的返回
    return {
      success: true,
      message: "Token refreshed successfully",
      newToken: "newAccessTokenValue",
    };
  }
);
Mock.mock("/mockTest/getData", "get", (data) => {
  return users;
});
