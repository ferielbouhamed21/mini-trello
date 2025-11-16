import { api } from "../api";

// Mock fetch globally
global.fetch = jest.fn();

describe("API Client", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("Boards API", () => {
    it("should fetch all boards", async () => {
      const mockBoards = [
        {
          _id: "1",
          title: "Board 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          title: "Board 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBoards,
      } as Response);

      const boards = await api.getBoards();

      expect(boards).toEqual(mockBoards);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/boards");
    });

    it("should fetch a single board by id", async () => {
      const mockBoard = {
        _id: "1",
        title: "Board 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBoard,
      } as Response);

      const board = await api.getBoard("1");

      expect(board).toEqual(mockBoard);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/boards/1");
    });

    it("should create a new board", async () => {
      const newBoard = { title: "New Board" };
      const mockResponse = {
        _id: "1",
        ...newBoard,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const board = await api.createBoard(newBoard);

      expect(board).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBoard),
      });
    });

    it("should delete a board", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await api.deleteBoard("1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/boards/1", {
        method: "DELETE",
      });
    });
  });

  describe("Lists API", () => {
    it("should fetch lists by board id", async () => {
      const mockLists = [
        {
          _id: "1",
          boardId: "board1",
          title: "List 1",
          position: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          boardId: "board1",
          title: "List 2",
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLists,
      } as Response);

      const lists = await api.getListsByBoard("board1");

      expect(lists).toEqual(mockLists);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/boards/board1/lists"
      );
    });

    it("should create a new list", async () => {
      const newList = { title: "New List", position: 0 };
      const mockResponse = {
        _id: "1",
        boardId: "board1",
        ...newList,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const list = await api.createList("board1", newList);

      expect(list).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/boards/board1/lists",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newList),
        }
      );
    });

    it("should update a list", async () => {
      const updates = { title: "Updated List" };
      const mockResponse = {
        _id: "1",
        boardId: "board1",
        ...updates,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const list = await api.updateList("1", updates);

      expect(list).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/lists/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    });

    it("should delete a list", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await api.deleteList("1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/lists/1", {
        method: "DELETE",
      });
    });
  });

  describe("Cards API", () => {
    it("should fetch cards by list id", async () => {
      const mockCards = [
        {
          _id: "1",
          listId: "list1",
          boardId: "board1",
          title: "Card 1",
          position: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "2",
          listId: "list1",
          boardId: "board1",
          title: "Card 2",
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCards,
      } as Response);

      const cards = await api.getCardsByList("list1");

      expect(cards).toEqual(mockCards);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/lists/list1/cards"
      );
    });

    it("should create a new card", async () => {
      const newCard = {
        title: "New Card",
        description: "Description",
        position: 0,
        labels: ["urgent"],
      };
      const mockResponse = {
        _id: "1",
        listId: "list1",
        boardId: "board1",
        ...newCard,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const card = await api.createCard("list1", newCard);

      expect(card).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/lists/list1/cards",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCard),
        }
      );
    });

    it("should update a card", async () => {
      const updates = { title: "Updated Card" };
      const mockResponse = {
        _id: "1",
        listId: "list1",
        boardId: "board1",
        ...updates,
        position: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const card = await api.updateCard("1", updates);

      expect(card).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/cards/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    });

    it("should move a card to a different list", async () => {
      const moveData = { listId: "list2", boardId: "board1", position: 1 };
      const mockResponse = {
        _id: "1",
        ...moveData,
        title: "Card 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const card = await api.moveCard("1", moveData);

      expect(card).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3000/cards/1/move",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(moveData),
        }
      );
    });

    it("should delete a card", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      await api.deleteCard("1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3000/cards/1", {
        method: "DELETE",
      });
    });
  });

  describe("Error Handling", () => {
    it("should throw an error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: "Not Found",
      } as Response);

      await expect(api.getBoard("1")).rejects.toThrow("Failed to fetch");
    });
  });
});
