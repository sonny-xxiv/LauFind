import { createContext, useContext, useState, useEffect } from "react";
import supabase from "./config/supabaseClient";

const ItemsContext = createContext();

export const useItems = () => {
  return useContext(ItemsContext);
};

export const ItemsProvider = ({ children }) => {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  // Fetch lost items from Supabase on mount
  useEffect(() => {
    const fetchLostItems = async () => {
      const { data, error } = await supabase
        .from("lost_items")
        .select(
          "id:item_id, item_name, category, description, date_lost, location, image_url, status, created_at, user_id",
        )
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Failed to fetch lost items:", error.message);
      } else {
        // Map to match local usage
        setLostItems(
          (data || []).map((item) => ({
            id: item.id || item.item_id,
            itemName: item.item_name,
            category: item.category,
            description: item.description,
            dateLost: item.date_lost,
            location: item.location,
            image: item.image_url,
            status: item.status,
            createdAt: item.created_at,
            userId: item.user_id,
          })),
        );
      }
    };
    fetchLostItems();
  }, []);

  // Remove lostItems localStorage sync (now using Supabase)

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
