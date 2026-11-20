import { Router } from "express";
import { bookController } from "./book.controller.js";

const bookRouter = Router();

bookRouter.get("/", bookController.findAll);
bookRouter.get("/:id", bookController.findById);
bookRouter.post("/", bookController.create);
bookRouter.put("/:id", bookController.update);
bookRouter.patch("/:id/status", bookController.changeStatus);
bookRouter.delete("/:id", bookController.delete);

export default bookRouter;
