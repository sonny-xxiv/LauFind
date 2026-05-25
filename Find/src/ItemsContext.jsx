import { createContext, useContext, useState, useEffect } from "react";

const ItemsContext = createContext();

export const useItems = () => {
  return useContext(ItemsContext);
};

export const ItemsProvider = ({ children }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  // Load items from localStorage on mount
  useEffect(() => {
    const savedLostItems = localStorage.getItem("lostItems");
    const savedFoundItems = localStorage.getItem("foundItems");

    if (savedLostItems) {
      try {
        setLostItems(JSON.parse(savedLostItems));
      } catch (e) {
        console.error("Failed to parse lost items:", e);
      }
    }

    if (savedFoundItems) {
      try {
        setFoundItems(JSON.parse(savedFoundItems));
      } catch (e) {
        console.error("Failed to parse found items:", e);
      }
    }
  }, []);

  // Save lost items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lostItems", JSON.stringify(lostItems));
  }, [lostItems]);

  // Save found items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("foundItems", JSON.stringify(foundItems));
  }, [foundItems]);

  const addLostItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
      createdAt: new Date().toISOString(),
    };
    setLostItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const addFoundItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
      createdAt: new Date().toISOString(),
    };
    setFoundItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const getLostItemById = (id) => {
    return lostItems.find((item) => item.id === parseInt(id));
  };

  const getFoundItemById = (id) => {
    return foundItems.find((item) => item.id === parseInt(id));
  };

  return (
    <ItemsContext.Provider
      value={{
        lostItems,
        foundItems,
        addLostItem,
        addFoundItem,
        getLostItemById,
        getFoundItemById,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};
