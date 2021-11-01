import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class CreateUserValidator {
  constructor(private ctx: HttpContextContract) { }

  /**
   * Defining a schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The mobile must be of data type string, formatted as a valid
   *    mobile. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.mobile(),
   *       rules.unique({ table: 'users', column: 'mobile' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.minLength(3),
      rules.maxLength(20),
    ]),
    mobile: schema.string({ trim: true, escape: true }, [
      rules.required(),
      rules.mobile(),
    ]),
    password: schema.string({ trim: true, escape: true }, this.passwordRules()),
  })

  /**
   * The `schema` first gets compiled to a reusable function and then that compiled
   * function validates the data at runtime.
   *
   * Since, compiling the schema is an expensive operation, you must always cache it by
   * defining a unique cache key. The simplest way is to use the current request route
   * key, which is a combination of the route pattern and HTTP method.
   */
  public cacheKey = this.ctx.routeKey

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   */
  public messages = {
    'name.required': 'You must enter the name of the user.',
    'name.string': 'The value entered for the user name is not valid.',
    'mobile.required': 'You must enter the mobile of the user.',
    'mobile.string': 'The value entered for the user mobile is not valid.',
    'password.required': 'You must enter the password.',
    'password.string': 'The value of the password entered is not valid.',
  }

  private passwordRules() {
    const passwordRules = [
      rules.minLength(6),
      rules.maxLength(20),
      rules.oneUpperCaseAtLeast(),
      rules.oneNumericAtLeast()
    ];
    return passwordRules;
  }
}

