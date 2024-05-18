export const ErrorHandler = (res , error)=>{
    if (error.code === 11000) {
        // Handle duplicate key error
        res.status(400).json({ success: false, msg: "Duplicate . This is already exists." });
    } else if (error.name === 'ValidationError') {
        // Handle validation errors
        const messages = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ success: false, msg: messages.join(', ') });
    } else if (error.name === 'CastError') {
        // Handle casting errors (e.g., invalid ObjectId format)
        res.status(400).json({ success: false, msg: "Invalid data format." });
    } else {
        // Handle other errors
        res.status(500).json({ success: false, msg: "Server error. Please try again later." });
    }
}