import axios from "axios";
import axiosInstance from "./axiosInstance";
import { useIonToast } from "@ionic/react";

const baseUrl = `ws://localhost:3000`;

export const newWebSocket = (onMessageReceived: (data: any,) => void, token: string) => {
  const ws = new WebSocket(baseUrl)
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
  };
  ws.onclose = () => {
  };
  ws.onerror = error => {
  };
  ws.onmessage = messageEvent => {
    console.log(messageEvent.data)
    onMessageReceived(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}

export const getAllAnimalsApi = () => axiosInstance.get("/animals");

export const getAnimalsFromAPage = (page_number: number) => axiosInstance.get(`/animals/page_number=${page_number}`);

interface AnimalAddProperties {
  name: string,
  species: string,
  birthdate: string,
  isVaccinate: boolean,
  weight: number,
}

export const addAnimalApi = (animal: AnimalAddProperties) => {
  if (window.navigator.onLine == false) {
    alert(`${animal.name} was not saved`);
    const createdAnimals = localStorage.getItem('created');
    if (!createdAnimals) {
      localStorage.setItem('created', JSON.stringify([animal]));
    } else {
      const animals = JSON.parse(createdAnimals);
      localStorage.setItem('created', JSON.stringify([...animals, animal]));
    }
  }
  else {
    axiosInstance
      .post("/animals", animal)
    .then((response) => {
      // Animal successfully sent
    })
    .catch((error) => {
      if (error.message === "Network Error") {
        alert(`${animal.name} was not saved`);
        const createdAnimals = localStorage.getItem('created');
        if (!createdAnimals) {
          localStorage.setItem('created', JSON.stringify([animal]));
        } else {
          const animals = JSON.parse(createdAnimals);
          localStorage.setItem('created', JSON.stringify([...animals, animal]));
        }
      }
    });
  }
};