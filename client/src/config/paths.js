const paths = {
  signIn: "/signin",
  signUp: "/signup",
  resetPassword: "/reset-password",

  customers: "/customers",
  bills: "/customers/:customerId/bills",

  settings: {
    baseUrl: "/settings/*",
    profile: "profile",
    config: "config",
  },
};

export default paths;
