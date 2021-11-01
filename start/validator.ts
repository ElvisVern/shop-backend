import { validator } from "@ioc:Adonis/Core/Validator";

// 至少包含一个大写字母
validator.rule("oneUpperCaseAtLeast", (value, _, options) => {
  const regex = new RegExp("(?=.*[A-Z])");
  if (!regex.test(value)) {
    options.errorReporter.report(
      options.pointer,
      "oneUpperCaseAtLeast",
      "至少需要包含一个大写字母",
      options.arrayExpressionPointer
    );
  }
});

// 至少需要包含一个数字
validator.rule("oneNumericAtLeast", (value, _, options) => {
  const regex = new RegExp("(?=.*[0-9])");
  if (!regex.test(value)) {
    options.errorReporter.report(
      options.pointer,
      "oneNumericAtLeast",
      "至少需要包含一个数字",
      options.arrayExpressionPointer
    );
  }
});