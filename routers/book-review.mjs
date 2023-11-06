import { Router} from "express";
import BookReviewService from "../services/book-review.mjs";

// New express router
const router = new Router();

// Set up "/all" route
router.get("/all", async function (req, res) {
    // Parse "useCache" query param
    const useCache = !(["false","0"].some(v=>v==req.query?.cache?.toLowerCase())) || true;

    try {
        // Get book reviews using the BookReviews service
        const bookReviews = await BookReviewService.getBookReviews(useCache);

        // Return the book reviews
        res.json(bookReviews);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({
            error: `${err?.stack || err.toString()}`
        });
    }
});

// Start bookreviews refresh/fetch task
const bookReviewsTask = {
    promise: null,
    result: null,
    startTimestamp: null,
    finishTimestamp: null
};
function promiseState(p) {
    if (p == null)
        return "not started";
    const t = {};
    return Promise.race([p, t])
        .then(v => (v === t)? "pending" : "fulfilled", () => "rejected");
}

// Get bookReviews refresh task status
router.get("/refresh", async function (req, res) {
    // Check current promise state
    const taskState = await promiseState(bookReviewsTask.promise);

    // Return
    res.json({
        state: taskState,
        task: {
            ...bookReviewsTask
        }
    })
});
// Start bookReviews refresh task
router.put("/refresh", async function (req, res) {
    const taskState = await promiseState(bookReviewsTask.promise);
    if (taskState == "pending") {
        return res.status(409)
        .json({
            success: false,
            state: taskState,
            message: "Existing refresh task is pending."
        });
    }

    // Initiate BookReviewService.getBookReviews
    const getBookReviewsPromise = BookReviewService.getBookReviews(false);;
    bookReviewsTask.promise = getBookReviewsPromise;
    bookReviewsTask.result = null;
    bookReviewsTask.startTimestamp = Date.now();
    bookReviewsTask.finishTimestamp = null;

    // Set finish timestamp on finally
    getBookReviewsPromise.then((data) => {
        bookReviewsTask.result = {
            data: data
        }
    }).catch((err) => {
        bookReviewsTask.result = {
            error: err?.stack || err.toString()
        }
    }).finally(() => {
        bookReviewsTask.finishTimestamp = Date.now();
    });

    // Return status or something
    res.json({
        success: true,
        state: taskState,
        message: "Refresh task started."
    });
});

router.use("*", function (req, res) {
    res.send("Available endpoints:</br>/all");
});

export default router;