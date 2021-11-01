import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import { ApiException } from "App/Exceptions/ApiExceptions";
import User from "App/Models/User";
import apiResponse from "App/Services/ApiResponse";
import UtilService from "App/Services/UtilService";
import { CreateUserValidator } from "App/Validators/UserValidator";

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {

    const username = request.input("username");
    const password = request.input("password");
    if (!username || !password) return new ApiException(400, 'username and password required');
    const token = await auth.use("api").attempt(username, password, {
      expiresIn: "1 days",
    });
    Logger.info({ user: auth.user?.id }, "User login successfully");
    return apiResponse(response, {
      user: {
        id: auth.user?.id,
        name: auth.user?.name,
        mobile: auth.user?.mobile,
        isAdmin: auth.user?.isAdmin,
      },
      token: token.toJSON()
    });
  }

  public async register({ request }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator);

    const user = new User();
    user.name = payload.name;
    user.mobile = payload.mobile;
    user.password = payload.password;
    user.isAdmin = 1;
    user.createdAt = UtilService.getUnixTimeNow();
    await user.save();
    Logger.info({ user: user.id }, "User register successfully");
  }
}