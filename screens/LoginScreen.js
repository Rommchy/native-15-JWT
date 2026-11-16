import { Alert } from "react-native";
import AuthContent from "../components/auth/AuthContent";
import { authActions } from "../store/authSlice";
import { login as loginRequest } from "../utils/authDataService";
import { useDispatch } from "react-redux";

function LoginScreen() {
  const dispatch = useDispatch();
  async function loginHandler({ login, password }) {
    try {
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
    } catch (error) {
      Alert.alert("Login failed", "Invalid credentials. Please try again.");
    }
  }

  return <AuthContent isLogin={true} onAuthenticate={loginHandler} />;
}

export default LoginScreen;
