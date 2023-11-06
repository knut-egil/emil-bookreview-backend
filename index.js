import express from "express";

// Set up express app
const app = new express();

// Health-check route
app.get("/health", function(req,res){
    res.sendStatus(200);
});

// Import routers
import bookReviewRouter from "./routers/book-review"; 
// Set up BookReview service endpoints
app.use("/bookreviews", bookReviewRouter);

// Get port
const PORT = process.env.PORT || 3000;

// Start listening on app
app.listen(PORT, () => {
    console.log(`Backend listening on port: ${PORT}`);
});