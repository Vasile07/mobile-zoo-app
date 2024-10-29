import { IonFab, IonFabButton, IonIcon, IonLabel, IonPage } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useState } from 'react';
import AnimalList from '../components/AnimalList';
import AddPagePopup from './AddPagePopup';
import './Home.css';
import TabBar from '../components/TabBar';

const AnimalListPage: React.FC = () => {
  const [addWindowIsOpen, setAddWindowIsOpen] = useState(false);
  
  const handleAddAnimal = () => {
    setAddWindowIsOpen(true); // Open the modal
  };

  const closeAddModal = () => {
    setAddWindowIsOpen(false); // Close the modal
  };

  return (
    <IonPage className='home-page'>
      <IonLabel className='welcome-label'>WELCOME TO THE ZOO</IonLabel>
      <AnimalList />
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={handleAddAnimal}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      <TabBar/>
      <AddPagePopup onOpen={addWindowIsOpen} onClose={closeAddModal}/>
    </IonPage>
  );
};

export default AnimalListPage;
