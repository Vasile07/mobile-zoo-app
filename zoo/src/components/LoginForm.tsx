import { IonButton, IonInput, useIonToast } from "@ionic/react";
import { useCallback, useContext, useEffect, useState } from "react";
import "./LoginForm.css";
import { AuthContext } from "../auth/AuthProvider";
import { RouteComponentProps, useHistory } from "react-router";

interface LoginState {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const [present, dismiss] = useIonToast();
  const history = useHistory();
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { email, password } = state;
  const handlePasswordChange = useCallback((e: any) => setState({
    ...state,
    password: e.detail.value || ''
  }), [state]);
  const handleEmailChange = useCallback((e: any) => setState({
    ...state,
    email: e.detail.value || ''
  }), [state]);

  const showErrorToast = (message: string) => {
    console.log(message)
    present({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: "danger"
    });
  };

  const onLoginClick = () => {
    login?.(email, password);
  }

  useEffect(() => {
    if (isAuthenticated) {
      history.push('/');
    }
  }, [isAuthenticated]);

  return (
    <div className="login-input-form">
      <IonInput label="Email" value={email} onIonChange={handleEmailChange} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
      <IonInput label="Password" value={password} onIonChange={handlePasswordChange} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
      <IonButton className="login-button" onClick={onLoginClick}>Login</IonButton>
    </div>
  )
}

export default LoginForm;