import slugify from "slugify";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import productModal from "../models/productModal.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  const { userName, email, password, role, number } = req.body;

  let status = "pending";

  try {
    //validations
    if (!userName) {
      return res.send({ message: "UserName is Required" });
    }
    if (!number) {
      return res.send({ message: "Number  is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    //check user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already register please login",
      });
    }

    if (role === "superadmin") {
      status = "approved";
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      userName,
      number,
      email,
      password: hashedPassword,
      role,
      status,
    }).save();

    res.status(200).send({
      success: true,
      message: `${user.role} Registered successfully`,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration ",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email, password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "This  Email is not registered" });
    }

    // Validate password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error logging in", error });
  }
};

//createuserController
export const createUserController = async (req, res) => {
  try {
    const { name, password, number,price } = req.body;
    console.log(req.body);

    let productPictures = [];
    const { productPicture } = req.files;

    if (productPicture && productPicture.length > 0) {
      productPictures = productPicture.map((file) => {
        return { img: file.filename };
      });
    }

    //validations
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!password) {
      return res.send({ message: "Quantity is required  " });
    }
    if (!number) {
      return res.send({ message: "Description is Required" });
    }
    if (!productPicture || productPicture.length === 0) {
      return res.send({ message: "At least one image is required" });
    }
    if (!price) {
      return res.send({ message: "price is Required" });
    }

    const existingProduct = await productModal.findOne({ name });
    console.log("existing product", existingProduct);
    if (existingProduct) {
      return res.status(200).send({
        success: false,
        message: "This product name already exists",
        data: existingProduct,
      });
    }

    // Save new product
    const user = await new productModal({
      name,
      slug: slugify(name),
      productPictures,
      description: number,
      quantity: password,
      price
    }).save();

    res.status(200).send({
      success: true,
      message: "Product Created Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//getUserController
export const getUserController = async (req, res) => {
  try {
    const users = await productModal.find({});

    res.status(200).send({
      success: true,
      message: "All Users",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting  users",
      error,
    });
  }
};

//getSingleUserController
export const getSingleUserController = async (req, res) => {
  try {
    const user = await productModal.findOne({ slug: req.params.slug });
    console.log(user);

    res.status(200).send({
      success: true,
      message: "Error in getting single User",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error getting single user",
    });
  }
};

//updateUserController

export const updateUserController = async (req, res) => {
  try {
    const { name, email, password, number,price } = req.body;

    let productPictures = [];
    const { productPicture } = req.files;

    if (productPicture && productPicture.length > 0) {
      productPictures = productPicture.map((file) => {
        return { img: file.filename };
      });
    }

    //validations
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!password) {
      return res.send({ message: "Quantity is required  " });
    }
    if (!number) {
      return res.send({ message: "Description is Required" });
    }
    if (!productPicture || productPicture.length === 0) {
      return res.send({ message: "At least one image is required" });
    }
    if (!price) {
      return res.send({ message: "price is Required" });
    }

    const users = await productModal.findByIdAndUpdate(
      req.params.pid,
      {
        name: name,
        slug: slugify(name),
        description: number,
        quantity: password,
        productPictures,
        price:price
      },
      { new: true }
    );
    await users.save();
    res.status(200).send({
      success: true,
      message: "users Updated Successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Error in user Updation",
      error,
    });
  }
};

//deleteUserController

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    await productModal.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting Porduct",
      error,
    });
  }
};
