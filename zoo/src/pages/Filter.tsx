import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSelect, IonSelectOption } from "@ionic/react"
import TabBar from "../components/TabBar"
import "./Home.css"
import HorizontalNavBar from "../components/HorizontalNavBar"
import { useEffect, useState } from "react"
import axiosInstance from "../common/axiosInstance"


interface AnimalProperties {
    id: number,
    name: string,
    species: string,
    birthdate: string,
    isVaccinate: boolean,
    weight: number
}

const FilterPage: React.FC = () => {

    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [animals, setAnimals] = useState<AnimalProperties[]>([])
    const [species, setSpecies] = useState<string[]>([])


    useEffect(() => {

        const fetschingSpecies = () => {
            axiosInstance.get("/species")
            .then((response) => {
                console.log(response);
                setSpecies(response.data.map((obj : any) => obj.species));
            })
            .catch((error) => {
                console.log("Error at fetching species " + error);
            })
        }

        fetschingSpecies();
    }, [])

    useEffect(() => {
        const fetschingAnimals = () => {
            axiosInstance.get("/animals/filter/species="+filter)
            .then((response) => {
                console.log(response);
                setAnimals(response.data);
            })
            .catch((error) => {
                console.log("Error at fetching species " + error);
            })
        }

        fetschingAnimals();

    }, [filter])

    return (
        <IonPage className='home-page'>
            <HorizontalNavBar />
            <IonLabel className='welcome-label'>Filter animals</IonLabel>
            <IonContent>
                <IonSelect value={filter} placeholder="Species" onIonChange={e => setFilter(e.detail.value)} >
                    {species.map(s => <IonSelectOption key={s} value={s}>{s}</IonSelectOption>)}
                </IonSelect>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Animals</IonLabel>
                    </IonListHeader>
                    {animals.map((animal: AnimalProperties) => {
                        return (
                            <IonItem key={animal.id}>
                                {/* <IonIcon slot="start" icon={eye} color="#000" onClick={() => handleSeeDetails(animal.id)} /> */}
                                <IonLabel>{animal.name}</IonLabel>
                            </IonItem>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default FilterPage;