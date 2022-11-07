function LoginPage(props) {
  const { formType } = props;
  return (
    <main>
      <h1>{formType === "sign-up" ? "Sign Up a New Account" : "Sign In"}</h1>
    </main>
  );
}

export default LoginPage;
