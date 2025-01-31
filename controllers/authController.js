import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {

    const { name, email, password } = req.body;
    //validate
    //if (!name) {
    //  next("name is required!");
    // }
    //if (!email) {
    //  next("email is required!!");
    //}
    //if (!password) {
    //  next("please provide a valid password!");
    //}
    // const existingUser = await userModel.findOne({ email });
    // if (existingUser) {
    //   next("Email registered ,Please try new one!!");
    //}
    const user = await userModel.create({ name, email, password });
    //token
    const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: 'User created Successfully!!',
        user: {
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            location: user.location
        },
        token,
    });

};
export const loginController = async (req, res, next) => {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
        next('Please provide all fields');

    }
    //find user by email
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        next('Invalid user name or password');
    }
    //compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next('invalid Username or password');
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