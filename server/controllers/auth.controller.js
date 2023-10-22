const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const handlebars = require("handlebars");
const fs = require("fs");
const encodedToken = (data) => {
  return jwt.sign(
    {
      iss: "Hiep Nguyen",
      sub: data,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10s",
    }
  );
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const userExists = await User.exists({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userDoc = {
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
    };

    const hiepGa = await User.findOne({ email: "hiepga@gmail.com" });

    if (hiepGa) {
      userDoc.friends = [hiepGa._id];
    }

    // create user document and save in database
    const user = await User.create(userDoc);

    if (hiepGa) {
      hiepGa.friends = [...hiepGa.friends, user._id];
      await hiepGa.save();
    }
    // const qrCode = await createQrCode(token);
    return res.status(200).send("register successfully");
  } catch (error) {
    return res.status(500).send("Error occurred. Please try again", error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).send("Invalid credentials. Please try again");
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(400).send("Invalid credentials. Please try again");
    }

    // send new token
    const token = jwt.sign(
      {
        userId: user._id,
        email,
        username: user.username,
        active: user.active,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      userDetails: {
        _id: user._id,
        email: user.email,
        token: token,
        username: user.username,
        active: user.active,
      },
    });
  } catch (err) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    console.log(refreshToken);
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.JWT_SECRET, function (err, user) {
        if (err) {
          return res.status(404).json({
            message: "The user is not authentication",
          });
        }
        if (user) {
          const newAccessToken = encodedToken(user);
          return res.json({
            status: "OK",
            access_token: newAccessToken,
            user: user,
          });
        } else {
          return res.json({
            message: "The user is not authentication",
          });
        }
      });
    } else {
      return res.json({
        message: "The refreshToken is not valid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

const isJwtIdUsed = async (jti, userId) => {
  try {
    const check = await User.findOne({
      _id: userId,
      tokenResetPasswords: jti,
    });
    if (check) {
      await User.updateOne(
        { _id: userId, tokenResetPasswords: jti },
        {
          tokenResetPasswords: null,
        }
      );
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      // create transport object
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });
      const jwtSecret = process.env.SECRET_KEY;
      if (jwtSecret) {
        const jti = require("crypto").randomBytes(16).toString("hex"); // tạo JWT ID ngẫu nhiên
        const payload = {
          id: user._id,
          reset: true,
          jti: jti,
        };
        console.log(payload);
        const resetToken = jwt.sign(payload, jwtSecret, {
          expiresIn: "1h",
        });
        const resetLink = `<a href="http://${process.env.CLIENT_URL}/auth/reset-password/${resetToken}" style="display: inline-block;color: #fff; text-decoration: none; background-color:#007bff; border-radius:12px">Reset Password</a>`;

        const data = {
          name: user.username,
          link: resetLink,
        };

        const filePath = path.join(__dirname, "forgot-password.hbs");
        const source = fs.readFileSync(filePath, "utf8");
        const template = handlebars.compile(source);

        await transporter.sendMail({
          from: process.env.email,
          to: req.body.email,
          subject: "Password Reset",
          // text: ` click here to reset your password ${resetLink} token will expire in 3m`,
          html: template(data),
        });
        const addResetToken = await User.updateOne(
          { _id: user._id },
          { tokenResetPasswords: jti }
        );
        if (addResetToken) {
          res.status(200).json({ message: "Password reset email sent" });
        }
      } else {
        res.status(404).json({ message: "account not found" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json(error);
  }
};
const powerMod = (base, exponent, modulus) => {
  let result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }
  return result;
};
const resetPassword = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.accessToken, process.env.SECRET_KEY);
    const { pass } = req.body;
    const { id } = decoded;
    // encrypt password
    const encryptedPassword = await bcrypt.hash(pass, 10);
    const user = await User.updateOne(
      { _id: id },
      {
        password: encryptedPassword,
      }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

function generateRandom128BitNumber() {
  let randomNumber = BigInt(0);

  for (let i = 0; i < 128; i++) {
    // Tạo một bit ngẫu nhiên (0 hoặc 1)
    const randomBit = Math.random() < 0.5 ? BigInt(0) : BigInt(1);

    // Dịch trái số hiện tại và thêm bit ngẫu nhiên vào
    randomNumber = (randomNumber << BigInt(1)) | randomBit;
  }

  return randomNumber.toString();
}
const activeUser = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodeToken) {
      const user = await User.findOne({ _id: decodeToken.userId });
      if (user) {
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return res.status(400).send("Invalid credentials. Please try again");
        }
        const secretKey = generateRandom128BitNumber();
        const publicKey = powerMod(process.env.g, secretKey, process.env.p);
        const activeUser = await User.findOneAndUpdate(
          { _id: user._id },
          { active: true, publicKey: publicKey }
        );
        if (activeUser) {
          const token = jwt.sign(
            {
              userId: activeUser._id,
              email: activeUser.email,
              username: activeUser.username,
              active: true,
            },
            process.env.JWT_SECRET,
            {
              // expiresIn: "1d",
              expiresIn: "60d",
            }
          );
          return res.status(200).json({
            message: "Active user successfully",
            privateKey: secretKey,
            token: token,
          });
        }
        return res.status(500).send("Something went wrong. Please try again");
      }
      console.log("Something went wrong. Please try again");
      return res.status(500).send("Something went wrong. Please try again");
    }
    return res.status(400).send("Something went wrong. Please try again");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  forgotPassword,
  isJwtIdUsed,
  activeUser,
  resetPassword,
};
