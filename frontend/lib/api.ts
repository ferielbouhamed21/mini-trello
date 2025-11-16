const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = {
  // Boards
  getBoards: async () => {
    const res = await fetch(`${API_BASE_URL}/boards`);
    if (!res.ok) throw new Error("Failed to fetch boards");
    return res.json();
  },

  getBoard: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/boards/${id}`);
    if (!res.ok) throw new Error("Failed to fetch board");
    return res.json();
  },

  createBoard: async (data: { title: string; description?: string }) => {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create board");
    return res.json();
  },

  updateBoard: async (
    id: string,
    data: { title?: string; description?: string }
  ) => {
    const res = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update board");
    return res.json();
  },

  deleteBoard: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/boards/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete board");
  },

  // Lists
  getListsByBoard: async (boardId: string) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/lists`);
    if (!res.ok) throw new Error("Failed to fetch lists");
    return res.json();
  },

  createList: async (
    boardId: string,
    data: { title: string; position: number }
  ) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}/lists`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create list");
    return res.json();
  },

  updateList: async (
    id: string,
    data: { title?: string; position?: number }
  ) => {
    const res = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update list");
    return res.json();
  },

  deleteList: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete list");
  },

  // Cards
  getCardsByList: async (listId: string) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}/cards`);
    if (!res.ok) throw new Error("Failed to fetch cards");
    return res.json();
  },

  createCard: async (
    listId: string,
    data: {
      title: string;
      description?: string;
      position: number;
      labels?: string[];
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/lists/${listId}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create card");
    return res.json();
  },

  updateCard: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      labels?: string[];
      position?: number;
    }
  ) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update card");
    return res.json();
  },

  moveCard: async (
    id: string,
    data: { listId: string; boardId: string; position: number }
  ) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}/move`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to move card");
    return res.json();
  },

  deleteCard: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete card");
  },
};
