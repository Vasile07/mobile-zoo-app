import { IonCard, IonCardTitle, IonLabel, IonLoading, IonPage } from "@ionic/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import "./AnimalDetailsPage.css"

interface ContainerProps { }

interface AnimalProperties {
    id: number,
    name : string 
    species : string 
    birthdate : string
    isVaccinate : boolean
    weight : number
}

const AnimalDetailsPage: React.FC<ContainerProps> = () => {

    const { animalId } = useParams<{ animalId: string }>();

    const [animal, setAnimal] = useState<AnimalProperties>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnimalData = useCallback(() => {
        axios.get("http://localhost:3000/animals/" + animalId) // Corrected URL
            .then((res) => {
                setAnimal(res.data);
                console.log(res.data)
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false); // Stop loading in case of an error
            });
    }, [animalId]);

    useEffect(() => {
        fetchAnimalData();
    }, [fetchAnimalData]);

    return (
        <IonPage className="animal-page">
            <IonLoading isOpen={isLoading} message="Searching for animal..." spinner="bubbles"/>
            {animal != undefined && 
            <IonCard className="animal-card">
                <IonCardTitle>Animal: {animal.name}</IonCardTitle>
                <IonLabel>Species: {animal.species}</IonLabel>
                <div className="contentDiv">
                    <div>
                        <div>Weight</div>
                        <div>{animal.weight}</div>
                    </div>
                    <div>
                        <div>Age</div>
                        <div>{animal.birthdate}</div>
                    </div>
                </div>
                <div className="wild-caution-label">
                    <IonLabel>VACCINATE: {animal.isVaccinate ? "✅" : "❌"}</IonLabel>
                </div>
            </IonCard>
            }
        </IonPage>    
    );
}

export default AnimalDetailsPage;