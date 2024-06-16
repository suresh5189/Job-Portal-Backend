import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;
  // validate
  if (!name) {
    next("Name Is Required");
  }
  if (!email) {
    next("Email Is Required");
  }
  if (!password) {
    next("Password Is Required And Greater Than 6 Character");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next("Email Already Register Please Login");
  }
  const user = await userModel.create({ name, email, password });
  // Token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  // validation
  if (!email || !password) {
    next("Please Provide All Fields");
  }

  // Find User By Email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    next("Invalid Username Or Password");
  }
  // Compare Password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    next("Invalid Username Or Password");
  }
  user.password = undefined;
  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
