import React, {
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
  useEffect,
} from "react";

import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
  type UseRiveParameters,
  type RiveState,
  type StateMachineInput,
} from "@rive-app/react-canvas";

import styles from "./styles.module.css";

const STATE_MACHINE_NAME = "Login Machine";
const LOGIN_PASSWORD = "teddy";
const LOGIN_TEXT = "Login";

const LoginFormComponent = (riveProps: UseRiveParameters = {}) => {
  const { rive: riveInstance, RiveComponent }: RiveState = useRive({
    src: "images/login-teddy.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    ...riveProps,
  });
  const [userValue, setUserValue] = useState("");
  const [passValue, setPassValue] = useState("");
  const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
  const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT);
  const inputRef = useRef(null);

  const isCheckingInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isChecking"
  );
  const numLookInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "numLook"
  );
  const trigSuccessInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigSuccess"
  );
  const trigFailInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "trigFail"
  );
  const isHandsUpInput: StateMachineInput | null = useStateMachineInput(
    riveInstance,
    STATE_MACHINE_NAME,
    "isHandsUp"
  );

  // Divide the input width by the max value the state machine looks for in numLook.
  // This gets us a multiplier we can apply for each character typed in the input
  // to help Teddy track progress along the input line
  useEffect(() => {
    if (inputRef?.current && !inputLookMultiplier) {
      setInputLookMultiplier(
        (inputRef.current as HTMLInputElement).offsetWidth / 100
      );
    }
  }, [inputRef]);

  // As the user types in the username box, update the numLook value to let Teddy know
  // where to look to according to the state machine
  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setUserValue(newVal);
    if (!isCheckingInput!.value) {
      isCheckingInput!.value = true;
    }
    const numChars = newVal.length;
    numLookInput!.value = numChars * inputLookMultiplier;
  };

  // Start Teddy looking in the correct spot along the username input
  const onUsernameFocus = () => {
    isCheckingInput!.value = true;
    if (numLookInput!.value !== userValue.length * inputLookMultiplier) {
      numLookInput!.value = userValue.length * inputLookMultiplier;
    }
  };

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const onSubmit = (e: SyntheticEvent) => {
    setLoginButtonText("Checking...");
    setTimeout(() => {
      setLoginButtonText(LOGIN_TEXT);
      passValue === LOGIN_PASSWORD
        ? trigSuccessInput!.fire()
        : trigFailInput!.fire();
    }, 1500);
    e.preventDefault();
    return false;
  };

  return (
    <div className={styles.login_form_component_root}>
      <div className={styles.login_form_wrapper}>
        <div className={styles.rive_wrapper}>
          <RiveComponent className={styles.rive_container} />
        </div>
        <div className={styles.form_container}>
          <form onSubmit={onSubmit}>
            <label className={styles.form_container_label}>
              <input
                type="text"
                className={styles.form_container_input}
                name="username"
                placeholder="Username"
                onFocus={onUsernameFocus}
                value={userValue}
                onChange={onUsernameChange}
                onBlur={() => (isCheckingInput!.value = false)}
                ref={inputRef}
              />
            </label>
            <label className={styles.form_container_label}>
              <input
                type="password"
                className={styles.form_container_input}
                name="password"
                placeholder="Password (shh.. it's 'teddy')"
                autoComplete="use teddy"
                value={passValue}
                onFocus={() => (isHandsUpInput!.value = true)}
                onBlur={() => (isHandsUpInput!.value = false)}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPassValue(e.target.value)
                }
              />
            </label>
            <button className={styles.login_btn}>{loginButtonText}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginFormComponent;
