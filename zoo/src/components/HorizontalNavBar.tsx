import { IonButton, IonHeader, IonToolbar } from "@ionic/react";
import React from "react";

interface HorizontalNavBarProps {
  logout: () => void;
}

const HorizontalNavBar: React.FC<HorizontalNavBarProps> = ({ logout }) => {
    return (
        <IonHeader>
            <IonToolbar>
                <IonButton slot="end" fill="outline" onClick={logout}>Logout</IonButton>
            </IonToolbar>
        </IonHeader>
    );
};

export default HorizontalNavBar;
