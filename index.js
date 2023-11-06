import express from "express";
import cors from "cors";

// Set up express app
const app = new express();

// Set up middleware
app.use(cors());

// Health-check route
app.get("/health", function(req,res){
    res.sendStatus(200);
});

// Import routers
import bookReviewRouter from "./routers/book-review.mjs"; 
// Set up BookReview service endpoints
app.use("/bookreviews", bookReviewRouter);

app.use("*", function(req,res){
    res.send("Available endpoints:</br>/health</br>/bookreviews");
})

// Get port
const PORT = process.env.PORT || 3000;

// Start listening on app
app.listen(PORT, () => {
    console.log(`Backend listening on port: ${PORT}`);
});