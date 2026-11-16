import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import AuthContent from "../components/auth/AuthContent";
import {
  createUser as createUserRequest,
  login as loginRequest,
} from "../utils/authDataService";
import { authActions } from "../store/authSlice";

function SignupScreen() {
  const dispatch = useDispatch();

  async function signupHandler({ login, password }) {
    try {
      const signUpResponse = await createUserRequest(login, password);

      if (signUpResponse.status === 200) {
        const response = await loginRequest(login, password);

        if (response.status === 200 && response.data?.accessToken) {
          dispatch(
            authActions.authenticate({
              login,
              token: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            }),
          );
        } else {
          Alert.alert("Login failed", "Invalid credentials. Please try again.");
        }
      } else {
        Alert.alert("Signup failed", "Could not create the account.");
      }
    } catch (error) {
      Alert.alert("Signup failed", "Could not create the account.");
    }
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
