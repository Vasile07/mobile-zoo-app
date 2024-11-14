import { createAnimation, IonContent, IonIcon, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonListHeader, IonLoading } from "@ionic/react";
import axios from "axios";
import { act, useEffect, useReducer, useState } from "react";
import { eye, newspaper } from 'ionicons/icons';
import "./AnimalList.css";
import { useHistory } from 'react-router-dom';
import { getAllAnimalsApi, getAnimalsFromAPage, newWebSocket } from "../common/apiCalls";
import useProtector from "../hooks/useProtector";

interface ContainerProps { }

interface AnimalProperties {
    id: number,
    name: string,
    species: string,
    birthdate: string,
    isVaccinate: boolean,
    weight: number,
    image: string,
}

interface ActionProperties {
    type: string,
    newAnimal?: AnimalProperties,
    animals?: AnimalProperties[]
}

function imageAnimation() {
    const elements = document.querySelectorAll('.myImage'); // Select all elements with the .myImage class
    elements.forEach((el) => {
        const animation = createAnimation()
            .addElement(el)
            .duration(5000)
            .direction('alternate')
            .iterations(Infinity)
            .keyframes([
                { offset: 0, transform: 'rotate(0deg)', opacity: '1' },
                { offset: 0.5, transform: 'rotate(180deg)', opacity: '1' },
                { offset: 1, transform: 'rotate(360deg)', opacity: '1' }
            ]);
        animation.play();
    });
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

        case 'loading_more_entities':
            if (action.animals) {
                return [...state, ...action.animals];
            }
            return state;

        default:
            return state;
    }
}

const AnimalList: React.FC<ContainerProps> = () => {
    const [navigate] = useProtector();
    const [isLoading, setIsLoading] = useState(true);
    const [animals, dispatch] = useReducer(reducer, []);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const loadMore = async (event: any) => {

        if (isLoading || !hasMoreData) {
            event.target.complete();
            return;
        }

        setIsLoading(true);

        try {

            const res = await getAnimalsFromAPage(currentPage);

            if (res.data.length > 0) {
                dispatch({ type: 'loading_more_entities', animals: res.data });
                setCurrentPage(prevPage => prevPage + 1);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error("Error loading more animals:", error);
        } finally {
            setIsLoading(false);
            event.target.complete();
        }
    };

    useEffect(() => {
        const fetchAnimals = async (page: number) => {
            setIsLoading(true);
            try {
                const res = await getAnimalsFromAPage(page);

                if (res.data.length > 0) {
                    dispatch({ type: 'initialize', animals: res.data });
                } else {
                    setHasMoreData(false);
                }
            } catch (error) {
                console.error("Error fetching animals:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnimals(currentPage);
        setCurrentPage(currentPage + 1);
    }, [])

    useEffect(() => {
        imageAnimation()
    },[animals])


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            let closeWebSocket = newWebSocket((data) => {
                const { event, payload } = data;
                console.log(event)
                if (event === 'created') {
                    dispatch({ type: 'create_action', newAnimal: payload.animal }); // Use functional update
                }
            }, token);
            return () => {
                closeWebSocket();
            };
        }
    }, []);

    const handleSeeDetails = (animalId: number) => {
        navigate(`/animal/${animalId}`);
    }

    return (
        <IonContent>
            <IonList className="animal-list">
                <IonListHeader>
                    <IonLabel>Animals</IonLabel>
                </IonListHeader>
                {animals.map((animal: AnimalProperties) => {
                    return (
                        <IonItem key={animal.id}>
                            <IonIcon slot="start" icon={eye} color="#000" onClick={() => handleSeeDetails(animal.id)} />
                            <IonLabel>{animal.name}</IonLabel>
                            <IonImg
                                className="myImage"
                                src={`data:image/jpeg;base64,${animal.image}`}
                                slot="end"
                                style={{ height: "80px", width: "auto", margin: "10px" }}
                            />
                        </IonItem>


                    );
                })}
            </IonList>
            <IonInfiniteScroll onIonInfinite={loadMore}>
                <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more data..."></IonInfiniteScrollContent>
            </IonInfiniteScroll>
        </IonContent>
    );
}

export default AnimalList;
