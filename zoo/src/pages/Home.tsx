import { IonContent, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import AnimalList from '../components/AnimalList';

const Home: React.FC = () => {
  return (
    <IonPage className='home-page'>
      <IonLabel className='welcome-label'>WELCOME TO THE ZOO</IonLabel>
      <AnimalList />
    </IonPage>
  );
};

export default Home;
