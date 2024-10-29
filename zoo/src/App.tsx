import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonContent, IonLoading, IonPage, IonRouterOutlet, IonTabs, setupIonicReact, useIonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { useState, useEffect } from 'react';
import { Network } from "@capacitor/network";

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';
import AnimalDetailsPage from './pages/AnimalDetailsPage';
import LoginPage from './pages/LoginPage';
import useProtector from './hooks/useProtector'; // Import the hook
import HorizontalNavBar from './components/HorizontalNavBar';
import { addAnimalApi } from './common/apiCalls';
import SearchPage from './pages/Seach';
import FilterPage from './pages/Filter';
import TabBar from './components/TabBar';
import { PrivateRoute } from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthProvider';

setupIonicReact();

const ProtectedRoute: React.FC<{ path: string; component: React.FC<any> }> = ({ path, component: Component }) => {
  const [navigate] = useProtector();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const resolvedPath = window.location.pathname; // Get the current path including params (e.g., /animal/1)
      await navigate(resolvedPath); // Pass the resolved path to the protector
      setIsLoading(false); // Set loading to false after validation
    };
    validate();
  }, [path, navigate]);

  if (isLoading) {
    return <IonLoading />; // Show loading indicator while the token is being validated
  }

  return (
    <IonPage>
      <HorizontalNavBar /> {/* Include the navbar */}
      <IonContent>
        <Route exact path={path} component={Component} />
      </IonContent>
    </IonPage>
  );
};

const App: React.FC = () => {
  const [present, dismiss] = useIonToast();

  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  const showToast = () => {
    present({
      message: isOnline ? "You are online" : "You are offline",
      duration: 2000,
      position: 'bottom',
      color: isOnline ? "success" : "warning"
    });
  };

  const updateOnlineStatus = () => {
    setIsOnline(window.navigator.onLine);
  };

  const sendLocalItemsToTheServer = async () => {
    const createdAnimals = localStorage.getItem('created');
    if (createdAnimals != null) {
      const animals = JSON.parse(createdAnimals);
      localStorage.removeItem('created');

      await Promise.all(
        animals.map(async (animal: any) => {
          await addAnimalApi(animal);
        })
      );

    }
  };

  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    showToast();
    sendLocalItemsToTheServer()

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline]); // Adding isOnline to dependencies to show the toast when status changes

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
          <AuthProvider>
            <PrivateRoute path="/home" component={Home} exact={true}/>
            <PrivateRoute path="/animal/:animalId" component={AnimalDetailsPage} exact={true}/>
            <PrivateRoute path="/search" component={SearchPage} exact={true}/>
            <PrivateRoute path="/filter" component={FilterPage} exact={true}/>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            </AuthProvider>
          </IonRouterOutlet>
          <TabBar/>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
export default App;
