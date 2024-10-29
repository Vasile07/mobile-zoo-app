import { IonContent, IonPage } from "@ionic/react"
import LoginForm from "../components/LoginForm"
import "./LoginPage.css"

const LoginPage: React.FC = () => {
    return (
        <IonPage className="login-page">
            <LoginForm/>
        </IonPage>
    )
}

export default LoginPage;