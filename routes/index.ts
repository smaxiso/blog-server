import express from "express";
const router = express.Router();



router.route("/add").post(userAuthController.registerEmployee);
router.route("/update").post(userAuthController.registerEmployee);
router.route("/delete").post(userAuthController.registerEmployee);
router.route("/get/all").get(userAuthController.registerEmployee);
router.route("/get/:id").get(userAuthController.registerEmployee);


export default router;