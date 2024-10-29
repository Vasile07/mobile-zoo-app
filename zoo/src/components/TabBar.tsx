import { IonButton, IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton, IonToolbar } from "@ionic/react";
import { homeOutline, filterCircleOutline, searchCircleOutline } from 'ionicons/icons';
import useProtector from "../hooks/useProtector";
import { useHistory } from "react-router";

const TabBar: React.FC = () => {
    const history = useHistory();
    return (
        <IonFooter slot="bottom">
            <IonToolbar>
                <IonButton onClick={() => history.push("/home")}>
                    <IonIcon icon={homeOutline} />
                </IonButton>
                <IonButton onClick={() => history.push("/filter")}>
                    <IonIcon icon={filterCircleOutline} />
                </IonButton>
                <IonButton onClick={() => history.push("/search")}>
                    <IonIcon icon={searchCircleOutline} />
                </IonButton>
            </IonToolbar>
        </IonFooter>
    );
};

export default TabBar;
