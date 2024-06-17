import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/authController.js";
import ratelimit from "express-rate-limit";

// IP Limiter
const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//Router Object
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - lastName
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *        name:
 *          type: string
 *          description: User Name
 *        lastName:
 *          type: string
 *          description: User Last Name
 *        email:
 *          type: string
 *          description: User Email Address
 *        password:
 *          type: string
 *          description: User Password Should Be Greater Than 6 Character
 *        location:
 *          type: string
 *          description: User Location City Or Country
 *      example:
 *        id: SFNIENFSENFNK343
 *        name: John
 *        lastName: Doe
 *        email: johndoe@gmail.com
 *        password: test@12345
 *        location: mumbai
 */

/**
 *  @swagger
 *  tags:
 *    name: Auth
 *    description: authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: Register New User
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: User Created Successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        500:
 *          description: Internal Server Error
 */

// Routes
// Register || POST
router.post("/register", limiter, registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *    summary: Login Page
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Login Successfull
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      500:
 *        description: Something Went Wrong
 */

// Login || Post
router.post("/login", limiter, loginController);

export default router;
