//generic errorHandler

const errorHandler  = (err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        message: err.message || "Internal Server occured" 
    });
}

module.exports = {errorHandler}