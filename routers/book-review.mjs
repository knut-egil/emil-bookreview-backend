import { Router} from "express";
import BookReviewService from "../services/book-review.mjs";

// New express router
const router = new Router();

// Set up "/all" route
router.get("/all", async function (req,res) {
    // Parse "useCache" query param
    const useCache = (["true","1"].some(v=>v==req.query?.cache?.toLowerCase())) || true;

    // Get book reviews using the BookReviews service
    const bookReviews = await BookReviewService.getBookReviews(useCache);

    // Return the book reviews
    res.json(bookReviews);
});

router.use("*", function (req,res){
    res.send("Available endpoints:</br>/all");
})

export default router;