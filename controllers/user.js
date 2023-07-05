const { HrUser, RoleType } = require("../models");
const bcrypt = require("bcryptjs");
const auth = require("../utils/token");
const {
  getResponse,
  getUserIDByBearerToken,
} = require("../utils/valueHelpers");
const { DEVELOPER } = require("../utils/constants");

//util
const getToken = (user) => {
  const { username, user_id } = user;
  return auth.issueToken({
    username,
    user_id,
  });
};

// Admin Endpoints
async function updateAdminPassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (newPassword.trim() === "") {
      const resp = getResponse({}, 400, "Password is required");
      return res.send(resp);
    }
    const token = req.header("authorization").split("Bearer ");
    const userID = getUserIDByBearerToken(token[1]);
    const user = await HrUser.findByPk(userID);

    if (!user) {
      const resp = getResponse({}, 400, "No user found");
      return res.send(resp);
    }

    bcrypt
      .compare(oldPassword, user.password)
      .then(async (isPasswordCorrect) => {
        if (!isPasswordCorrect) {
          const resp = getResponse({}, 400, "Invalid old password");
          return res.send(resp);
        }

        const PasswordHash = await bcrypt.hash(newPassword, 12);
        const admin = await HrUser.update(
          { password: PasswordHash },
          {
            where: {
              user_id: userID,
            },
          }
        );

        if (admin) {
          const resp = getResponse({}, 200, "Password updated successfully");
          return res.send(resp);
        } else {
          const resp = getResponse({}, 400, "Unable to update information");
          return res.send(resp);
        }
      });
  } catch (error) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function updateAdminInfo(req, res) {
  try {
    const { email, first_name, last_name } = req.body;
    const token = req.header("authorization").split("Bearer ");
    const userID = getUserIDByBearerToken(token[1]);

    const admin = await HrUser.update(
      { email, first_name, last_name },
      {
        where: {
          user_id: userID,
        },
      }
    );

    if (admin) {
      const resp = getResponse(
        { email, first_name, last_name },
        200,
        "Information updated successfully"
      );
      return res.send(resp);
    } else {
      const resp = getResponse(
        { updated: false },
        400,
        "Unable to update information"
      );
      return res.send(resp);
    }
  } catch (error) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await HrUser.findAll();

    if (!users.length) {
      return res.send("No user found");
    }

    return res.send(users);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function addUser(req, res) {
  try {
    const { username, password, first_name, last_name, role } = req.body;

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      !role
    ) {
      return res.send("Please provide complete data.");
    }

    const user = await HrUser.findOne({ where: { username } });

    if (user) {
      return res.send("User with this username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const addUser = await HrUser.create({
      username,
      first_name,
      last_name,
      role,
      password: hashedPassword,
      created_by: "HR",
    });

    const {
      username: primaryUsername,
      first_name: fName,
      last_name: lName,
    } = addUser;

    const data = {
      username: primaryUsername,
      fullName: fName + " " + lName,
    };

    return res.send(data);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function portalLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const resp = getResponse(null, 401, "Email or Password is missing.");
      return res.status(200).send(resp);
    }

    const user = await HrUser.findOne({ where: { username } });

    if (!user) {
      const resp = getResponse(
        null,
        404,
        "User with this username does not exist."
      );
      return res.status(200).send(resp);
    }

    if (user.role === DEVELOPER) {
      const resp = getResponse(
        null,
        401,
        "Developers are not allowed to use this portal"
      );
      return res.status(200).send(resp);
    }

    if (!user.is_active || user.is_deleted) {
      const resp = getResponse(
        {},
        401,
        "You are no longer part of the organization."
      );
      return res.send(resp);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const resp = getResponse(null, 401, "Password is incorrect.");
      return res.status(200).send(resp);
    }

    const role = await RoleType.findByPk(user.role);
    const token = getToken(user);

    const data = {
      username: user.username,
      name: user.first_name + " " + user.last_name,
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user.user_id,
      email: user.email,
      token,
      role: role.name,
      createdAt: user.createdAt,
    };

    const resp = getResponse(data, 200, "User logged in");
    res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

async function mobileLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const resp = getResponse(null, 401, "Email or Password is missing.");
      return res.status(401).send(resp);
    }

    const user = await HrUser.findOne({ where: { username } });

    if (!user) {
      const resp = getResponse(
        null,
        404,
        "User with this username does not exist."
      );
      return res.status(404).send(resp);
    }

    if (user.role !== DEVELOPER) {
      const resp = getResponse(
        null,
        401,
        "Only developers can login to the application."
      );
      return res.status(401).send(resp);
    }

    if (!user.is_active || user.is_deleted) {
      const resp = getResponse(
        {},
        401,
        "You are no longer part of the organization."
      );
      return res.send(resp);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const resp = getResponse(null, 401, "Password is incorrect.");
      return res.status(401).send(resp);
    }

    const role = await RoleType.findByPk(user.role);
    const token = getToken(user);

    const data = {
      username: user.username,
      name: user.first_name + " " + user.last_name,
      user_id: user.user_id,
      employee_id: user.employee_id,
      token,
      role: role.name,
      createdAt: user.createdAt,
    };

    const resp = getResponse(data, 200, "User logged in");
    res.status(200).send(resp);
  } catch (err) {
    const resp = getResponse(null, 400, err);
    res.send(resp);
  }
}

module.exports = {
  getAllUsers,
  addUser,
  portalLogin,
  mobileLogin,
  updateAdminPassword,
  updateAdminInfo,
};
