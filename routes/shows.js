const router = require("express").Router();
const showsController = require("../controllers/shows.controller");

router.route("/").post(showsController.newShow);

router.route("/search/:title/count").get(showsController.searchByTitleCount);
router.route("/search/:title/:page(\\d+)").get(showsController.searchByTitlePaged);

router
  .route("/:id")
  .get(showsController.getOne)
  .put(showsController.updateOne);

module.exports = router;
