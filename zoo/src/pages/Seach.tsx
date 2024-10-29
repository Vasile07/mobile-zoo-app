import { IonContent, IonItem, IonLabel, IonList, IonPage, IonSearchbar } from "@ionic/react"
import TabBar from "../components/TabBar"
import "./Home.css"
import { useEffect, useState } from "react";
import axiosInstance from "../common/axiosInstance";

interface AnimalProperties {
    id: number,
    name: string,
    species: string,
    birthdate: string,
    isVaccinate: boolean,
    weight: number
}

const SearchPage: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [animals, setAnimals] = useState<AnimalProperties[]>([]);

    useEffect(() => {
        const fetschingAnimals = () => {
            axiosInstance.get("/search")
            .then((response) => {
                console.log(response);
                setAnimals(response.data);
            })
            .catch((error) => {
                console.log("Error at fetching species " + error);
            })
        }

        fetschingAnimals();

    }, [])

    return (
        <IonPage className='home-page'>
            <IonLabel className='welcome-label'>Search animal</IonLabel>
            <IonContent>
                <IonSearchbar
                    value={name}
                    debounce={1000}
                    onIonInput={e => setName(e.detail.value!)} />

                <IonList>
                    {animals
                        .filter(animal => animal.name.indexOf(name) >= 0 || name === "")
                        .map(animal => <IonItem key={animal.id}>{animal.name}</IonItem>)}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default SearchPage;