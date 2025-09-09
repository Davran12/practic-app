import { useState } from "react";
import styles from "./Auth.module.scss";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";

export function Auth() {
  const [hasAccount, setHasAccount] = useState(true);

  return (
    <div className={styles.authPage}>
      {hasAccount ? (
        <SignIn setHasAccount={setHasAccount} />
      ) : (
        <SignUp setHasAccount={setHasAccount} />
      )}
    </div>
  );
}
