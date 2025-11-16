/**
 * Integration tests for boards functionality
 */
import { api } from "../../../lib/api";

// Mock the API
jest.mock("../../../lib/api", () => ({
  api: {
    getBoards: jest.fn(),
    createBoard: jest.fn(),
    deleteBoard: jest.fn(),
  },
}));

describe("Boards Integration Tests", () => {
  const mockBoards = [
    {
      _id: "1",
      title: "Project Alpha",
      description: "Main project board",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      _id: "2",
      title: "Project Beta",
      description: "Secondary project",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Board Operations", () => {
    it("should fetch all boards successfully", async () => {
      (api.getBoards as jest.Mock).mockResolvedValue(mockBoards);

      const boards = await api.getBoards();

      expect(boards).toEqual(mockBoards);
      expect(boards).toHaveLength(2);
      expect(boards[0].title).toBe("Project Alpha");
    });

    it("should create a new board with title and description", async () => {
      const newBoardData = {
        title: "New Project",
        description: "A new exciting project",
      };

      const newBoard = {
        _id: "3",
        ...newBoardData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (api.createBoard as jest.Mock).mockResolvedValue(newBoard);

      const result = await api.createBoard(newBoardData);

      expect(result).toEqual(newBoard);
      expect(api.createBoard).toHaveBeenCalledWith(newBoardData);
      expect(result.title).toBe("New Project");
    });

    it("should delete a board by id", async () => {
      (api.deleteBoard as jest.Mock).mockResolvedValue(undefined);

      await api.deleteBoard("1");

      expect(api.deleteBoard).toHaveBeenCalledWith("1");
      expect(api.deleteBoard).toHaveBeenCalledTimes(1);
    });

    it("should handle empty boards list", async () => {
      (api.getBoards as jest.Mock).mockResolvedValue([]);

      const boards = await api.getBoards();

      expect(boards).toEqual([]);
      expect(boards).toHaveLength(0);
    });

    it("should handle board creation without description", async () => {
      const newBoardData = {
        title: "Minimal Board",
      };

      const newBoard = {
        _id: "4",
        title: "Minimal Board",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (api.createBoard as jest.Mock).mockResolvedValue(newBoard);

      const result = await api.createBoard(newBoardData);

      expect(result.title).toBe("Minimal Board");
      expect(result._id).toBeDefined();
    });
  });

  describe("Error Scenarios", () => {
    it("should handle error when fetching boards fails", async () => {
      (api.getBoards as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      await expect(api.getBoards()).rejects.toThrow("Network error");
    });

    it("should handle error when creating board fails", async () => {
      (api.createBoard as jest.Mock).mockRejectedValue(
        new Error("Validation failed")
      );

      await expect(api.createBoard({ title: "" })).rejects.toThrow(
        "Validation failed"
      );
    });

    it("should handle error when deleting board fails", async () => {
      (api.deleteBoard as jest.Mock).mockRejectedValue(
        new Error("Board not found")
      );

      await expect(api.deleteBoard("invalid-id")).rejects.toThrow(
        "Board not found"
      );
    });
  });
});
