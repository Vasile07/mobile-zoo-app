import { createAnimation, IonButton, IonCard, IonCardTitle, IonCheckbox, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import "./AnimalDetailsPage.css"

import { createOutline, saveOutline, cameraOutline } from 'ionicons/icons';
import { useCamera } from "../hooks/useCamera";
import { usePhotos } from "../hooks/usePhotos";
import axiosInstance from "../common/axiosInstance";
import { useFiles } from "../hooks/useFiles";
import { useMyLocation } from "../hooks/useMyLocation";
import MyMap from "../components/MyMap";
import { Position } from "@capacitor/geolocation";

interface ContainerProps { }

interface AnimalProperties {
    id: number,
    name: string,
    species: string,
    birthdate: string,
    isVaccinate: boolean,
    weight: number,
    image: string,
    latitude: number,
    longitude: number,
}




function imageAnimation() {
    const el = document.querySelector('.myImage');
    if (el) {
        const animation = createAnimation()
            .addElement(el)
            .duration(3000)
            .iterations(1)
            .keyframes([
                { offset: 0, transform: 'translateY(-100%)', opacity: '0' },
                { offset: 1, transform: 'translateY(0)', opacity: '1' },
            ]);
        animation.play();
    }
}
const customEnterAnimation = (baseEl: HTMLElement) => {
    const backdropAnimation = createAnimation()
        .addElement(baseEl.querySelector("ion-backdrop")!)
        .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

    const wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelector(".loading-wrapper")!)
        .keyframes([
            { offset: 0, transform: "translateX(-100%) translateY(0)", opacity: "0" }, 
            { offset: 0.3, transform: "translateX(30%) translateY(-50px)", opacity: "1" }, 
            { offset: 0.6, transform: "translateX(10%) translateY(-20px)", opacity: "1" },
            { offset: 1, transform: "translateX(0) translateY(0)", opacity: "1" }        
        ]);

    return createAnimation()
        .addElement(baseEl)
        .duration(800) // Total duration of the animation
        .easing("ease-in-out") // Easing function for smooth effect
        .addAnimation([backdropAnimation, wrapperAnimation]);
};

const AnimalDetailsPage: React.FC<ContainerProps> = () => {

    
    const myLocation = useMyLocation();
    const [coords, setCoords] = useState<{latitude: number, longitude: number} | null>(null);

    useEffect(() => {
        if (myLocation.position?.coords) {
          setCoords(myLocation.position.coords);
        }
      }, [myLocation.position]);

    const { takePhoto } = usePhotos();

    const { downloadImage } = useFiles();

    const { animalId } = useParams<{ animalId: string }>();

    const [animal, setAnimal] = useState<AnimalProperties | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isEditable, setIsEditable] = useState(false);

    const fetchAnimalData = useCallback(() => {
        axios.get("http://localhost:3000/animals/" + animalId) // Corrected URL
            .then((res) => {
                setAnimal(res.data);
                if(res.data.latitude && res.data.longitude)
                    setCoords({latitude: res.data.latitude, longitude: res.data.longitude})
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

    useEffect(() => {
        if (animal) {
            imageAnimation(); // Call the animation function when animal is loaded
        }
    }, [animal]);

    const onLabelChanged = (label: keyof AnimalProperties, value: any) => {
        setAnimal(prevAnimal => {
            if (prevAnimal) {
                return {
                    ...prevAnimal,
                    [label]: value,
                };
            }
            return null; // or handle how you want to deal with null state
        });
    };

    const handleEditSave = () => {
        if (isEditable) {
            axiosInstance.put(`http://localhost:3000/animals/update/${animal?.id}`,{...animal, latitude: coords?.latitude, longitude: coords?.longitude})
            .then((response)=> {

            })
            .catch((error) => {
                console.log(error);
            })
        }
        setIsEditable(!isEditable);
    }

    const handleTakePhoto = () => {
        takePhoto().then((data) => {
            console.log(data);
            onLabelChanged("image",data.base64String);
        });
    }

    return (
        <IonPage className="animal-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Animal Page</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonLoading isOpen={isLoading} message="Searching for animal..." enterAnimation={customEnterAnimation} />
            {animal &&

                <IonContent>

                    {animal.image && (
                        <IonImg
                            className="myImage"
                            src={`data:image/jpeg;base64,${animal.image}`}
                            alt="Captured"
                            style={{
                                width: '25%',
                                height: 'auto',
                                position: 'absolute', // Use absolute positioning if needed
                                top: '0px',
                                right: '0px',
                            }}
                            onClick={() => downloadImage(`data:image/jpeg;base64,${animal.image}`)}
                        />
                    )}

                    {
                       coords && (
                        <MyMap 
                            isEditable={isEditable}
                          lat={coords.latitude}
                          lng={coords.longitude}
                          onMapClick={(e) => {
                            console.log("Map clicked at:", e);
                            if(isEditable)
                                setCoords({ latitude: e.latitude, longitude: e.longitude });
                          }}
                          onMarkerClick={(e) => {
                            
                            console.log("Marker clicked at:", e);
                            if(isEditable)
                                setCoords({ latitude: e.latitude, longitude: e.longitude });
                          }}
                        />
                      )
                    }
                    <IonInput disabled={!isEditable} style={{ marginTop: "20px" }} label="Name" value={animal.name} onIonChange={(e: any) => onLabelChanged("name", e.detail.value)} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
                    <IonInput disabled={!isEditable} style={{ marginTop: "20px" }} label="Species" value={animal.species} onIonChange={(e: any) => onLabelChanged("species", e.detail.value)} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
                    <IonInput disabled={!isEditable} style={{ marginTop: "20px" }} label="Birthdate" value={animal.birthdate.split('T')[0]} onIonChange={(e: any) => onLabelChanged("birthdate", e.detail.value)} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
                    <IonCheckbox disabled={!isEditable} color="dark" style={{ marginTop: "20px", marginLeft: "50px", color: "#000" }} value={animal.isVaccinate} onIonChange={(e: any) => onLabelChanged("isVaccinate", e.detail.value)} labelPlacement="start">Is Vaccinate</IonCheckbox>
                    <IonInput disabled={!isEditable} style={{ marginTop: "20px" }} label="Weight" value={animal.weight} onIonChange={(e: any) => onLabelChanged("weight", e.detail.value)} labelPlacement="floating" fill="outline" placeholder="Enter text" className="input-field"></IonInput>
                </IonContent>
            }

            <IonFab vertical="bottom" horizontal="end">
                <IonFabButton onClick={handleEditSave}>
                    <IonIcon icon={isEditable ? saveOutline : createOutline} />
                </IonFabButton>
            </IonFab>
            {
                isEditable &&
                <IonFab vertical="bottom" horizontal="start">
                    <IonFabButton onClick={handleTakePhoto} >
                        <IonIcon icon={cameraOutline} />
                    </IonFabButton>
                </IonFab>
            }

        </IonPage>
    );

}

export default AnimalDetailsPage;