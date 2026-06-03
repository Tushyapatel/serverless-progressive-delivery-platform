const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const dynamoClient = require("../config/dynamodb");

const docClient =
  DynamoDBDocumentClient.from(dynamoClient);

const registerUser = async (
  email,
  password,
  role = "USER"
) => {

  const existingUsers =
    await docClient.send(
      new ScanCommand({
        TableName: "deployment-users",
      })
    );

  const userExists =
    existingUsers.Items?.find(
      (user) => user.email === email
    );

  if (userExists) {
    throw new Error(
      "User already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user = {
    userId: crypto.randomUUID(),
    email,
    password: hashedPassword,
    role,
    createdAt:
      new Date().toISOString(),
  };

  await docClient.send(
    new PutCommand({
      TableName: "deployment-users",
      Item: user,
    })
  );

  return {
    message:
      "User registered successfully",
  };
};

const loginUser = async (
  email,
  password
) => {

  const users =
    await docClient.send(
      new ScanCommand({
        TableName: "deployment-users",
      })
    );

  const user =
    users.Items?.find(
      (u) => u.email === email
    );

  if (!user) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid credentials"
    );
  }

  const token = jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    "super-secret-key",
    {
      expiresIn: "1h",
    }
  );

  return {
    message: "Login successful",
    token,
    role: user.role,
  };
};

module.exports = {
  registerUser,
  loginUser,
};