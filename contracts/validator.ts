declare module "@ioc:Adonis/Core/Validator" {
  interface Rules {
    oneLowerCaseAtLeast(): Rule;
    oneUpperCaseAtLeast(): Rule;
    oneNumericAtLeast(): Rule;
  }
}
