import { Router} from "express";
import BookReviewService from "../services/book-review";

// New express router
const router = new Router();

// Set up "/all" route
router.get("all", async function (req,res) {
    // Get book reviews using the BookReviews service
    const bookReviews = await BookReviewService.getBookReviews();

    // Return the book reviews
    res.json(bookReviews);
});

export default router;