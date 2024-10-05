import { IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading } from "@ionic/react";
import axios from "axios";
import { act, useEffect, useReducer, useState } from "react";
import { eye, newspaper } from 'ionicons/icons';
import "./AnimalList.css";
import { useHistory } from 'react-router-dom';
import { newWebSocket } from "../common/apiCalls";

interface ContainerProps { }

interface AnimalProperties {
    id: number,
    name: string,
    species: string,
    birthdate: string,
    isWild: boolean,
    weight: number
}

interface ActionProperties{
    type: string,
    newAnimal? : AnimalProperties,
    animals? : AnimalProperties[]
}

function reducer(state: AnimalProperties[], action: ActionProperties): AnimalProperties[] {
    switch (action.type) {
      case 'create_action':
        if (action.newAnimal) {
          return [...state, action.newAnimal];
        }
        return state;
  
      case 'initialize':
        if (action.animals) {
          return action.animals;
        }
        return state;
  
      default:
        return state;
    }
  }

const AnimalList: React.FC<ContainerProps> = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [animals, dispatch] = useReducer(reducer, []);
    // const [animals, setAnimals] = useState<AnimalProperties[]>([]);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await axios.get("http://localhost:3000/animals");
                dispatch({type: 'initialize', animals: res.data});
            } catch (error) {
                console.error("Error fetching animals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    useEffect(() => {
        let closeWebSocket = newWebSocket((data) => {
            const { event, payload } = data;
            console.log(event)
            if (event === 'created') {
                dispatch({type: 'create_action', newAnimal: payload.animal}); // Use functional update
            }
        });
        return () => {
            closeWebSocket();
        };
    }, []);

    const handleSeeDetails = (animalId: number) => {
        history.push(`/animal/${animalId}`);
    }

    return (
        <div>
            <IonLoading isOpen={isLoading} message="Loading..." spinner="bubbles" />
            <IonList className="animal-list">
                <IonListHeader>
                    <IonLabel>Animals</IonLabel>
                </IonListHeader>
                {animals.map((animal: AnimalProperties) => {
                    return (
                        <IonItem key={animal.id}>
                            <IonIcon slot="start" icon={eye} color="#000" onClick={() => handleSeeDetails(animal.id)} />
                            <IonLabel>{animal.name}</IonLabel>
                        </IonItem>
                    );
                })}
            </IonList>
        </div>
    );
}

export default AnimalList;
