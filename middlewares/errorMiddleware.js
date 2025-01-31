//error middleware ||next function
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    const defaultErrors = {
        statusCode: 500,
        message: err,
    };

    //missing filed error
    if (err.name === 'validationError') {
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(",");
    }

    //duplicate error
    if (err.code && err.code === 11000) {
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(err.keyValue)} field has to be unique`;
    }
    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};
export default errorMiddleware;
