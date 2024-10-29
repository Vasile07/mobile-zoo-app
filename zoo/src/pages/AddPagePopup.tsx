import { IonModal, IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonInput, IonCheckbox } from '@ionic/react';
import { useState } from 'react';
import "./AddPagePopup.css";
import { addAnimalApi } from '../common/apiCalls';

interface AddPagePopupProps {
    onOpen: boolean;
    onClose: () => void;
}

const AddPagePopup: React.FC<AddPagePopupProps> = ({ onOpen, onClose }) => {
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [isVaccinate, setIsVaccinate] = useState(false);
    const [weight, setWeight] = useState(0);

    const handleAddAnimal = () => {
        addAnimalApi({name: name, species: species, birthdate: birthdate, isVaccinate: isVaccinate, weight: weight})
    }

    return (
        <IonModal isOpen={onOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Add New Animal</IonTitle>
                    <IonButton slot="end" onClick={onClose}>Close</IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className='addPageContainer'>
                <IonInput 
                    label="Name" 
                    value={name} 
                    onIonChange={(e: any) => setName(e.detail.value)} 
                    labelPlacement="floating" 
                    fill="outline" 
                    placeholder="Enter name" 
                />
                <IonInput 
                    label="Species" 
                    value={species} 
                    onIonChange={(e: any) => setSpecies(e.detail.value)} 
                    labelPlacement="floating" 
                    fill="outline" 
                    placeholder="Enter species" 
                />
                <IonInput 
                    label="Birthdate" 
                    value={birthdate} 
                    onIonChange={(e: any) => setBirthdate(e.detail.value)} 
                    labelPlacement="floating" 
                    fill="outline" 
                    placeholder="Enter birthdate" 
                />
                
                <IonCheckbox labelPlacement="start" value={isVaccinate} onIonChange={(e: any) => setIsVaccinate(e.detail.value)}>Is Vaccinate?</IonCheckbox>

        
                <IonInput 
                    label="Weight" 
                    value={weight} 
                    onIonChange={(e: any) => setWeight(e.detail.value)} 
                    labelPlacement="floating" 
                    fill="outline" 
                    placeholder="Enter weight" 
                />
                <IonButton onClick={handleAddAnimal}>Add Animal</IonButton>
            </IonContent>
            
        </IonModal>
    );
}

export default AddPagePopup;
