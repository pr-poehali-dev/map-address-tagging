import { Address } from '@/types/address';

export const sampleAddresses: Address[] = [
  { id: '1', title: 'Офис «Центральный»', address: 'ул. Тверская, 1', city: 'Москва', category: 'Офис', lat: 55.7568, lng: 37.6155, status: 'geocoded', createdAt: '2024-01-10' },
  { id: '2', title: 'Склад №1', address: 'ул. Складочная, 14', city: 'Москва', category: 'Склад', lat: 55.8020, lng: 37.5890, status: 'geocoded', createdAt: '2024-01-15' },
  { id: '3', title: 'Магазин «Арбат»', address: 'Арбат, 23', city: 'Москва', category: 'Магазин', lat: 55.7493, lng: 37.5883, status: 'geocoded', createdAt: '2024-01-20' },
  { id: '4', title: 'Офис «Нева»', address: 'Невский пр., 56', city: 'Санкт-Петербург', category: 'Офис', lat: 59.9342, lng: 30.3351, status: 'geocoded', createdAt: '2024-02-05' },
  { id: '5', title: 'Склад №2', address: 'пр. Обуховской обороны, 120', city: 'Санкт-Петербург', category: 'Склад', lat: 59.8891, lng: 30.4521, status: 'geocoded', createdAt: '2024-02-10' },
  { id: '6', title: 'Торговый центр', address: 'ул. Вайнера, 9', city: 'Екатеринбург', category: 'Магазин', lat: 56.8355, lng: 60.6070, status: 'geocoded', createdAt: '2024-02-18' },
  { id: '7', title: 'Офис «Казань»', address: 'ул. Баумана, 45', city: 'Казань', category: 'Офис', lat: 55.7887, lng: 49.1221, status: 'geocoded', createdAt: '2024-03-01' },
  { id: '8', title: 'Точка выдачи', address: 'пр. Ленина, 34', city: 'Новосибирск', category: 'Склад', lat: 54.9894, lng: 82.8975, status: 'geocoded', createdAt: '2024-03-12' },
  { id: '9', title: 'Представительство', address: 'ул. Большая Садовая, 5', city: 'Ростов-на-Дону', category: 'Офис', lat: 47.2357, lng: 39.7015, status: 'geocoded', createdAt: '2024-03-20' },
  { id: '10', title: 'Новый адрес', address: 'ул. Неизвестная, 99', city: 'Уфа', category: 'Магазин', lat: null, lng: null, status: 'pending', note: 'Требует геокодирования', createdAt: '2024-04-01' },
];
