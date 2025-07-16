import { create } from "zustand";

const useDummyDataStore = create((set) => ({
  Friends: [
    { id: 1, name: "Aarav Mehta", status: "Online", isFriend: true },
    { id: 2, name: "Saanvi Sharma", status: "Offline", isFriend: true },
    { id: 3, name: "Ishaan Verma", status: "Online", isRequest: true },
    { id: 4, name: "Diya Patel", status: "Offline", isRequest: true },
    { id: 5, name: "Raj Kapoor", status: "Online", isFriend: false },
    { id: 6, name: "Gaurav Shukla", status: "Online", isFriend: true },
    { id: 7, name: "Manisha Sharma", status: "Offline", isFriend: true },
    { id: 8, name: "Sulekha Pandey", status: "Online", isRequest: true },
    { id: 9, name: "Paknaj Kapoor", status: "Offline", isRequest: true },
    { id: 10, name: "Sunil Kapoor", status: "Online", isFriend: false },
  ],
}));

export default useDummyDataStore;
