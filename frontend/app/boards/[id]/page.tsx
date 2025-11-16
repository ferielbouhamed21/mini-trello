"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { api } from "@/lib/api";
import { Board, List, Card } from "@/types";

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<{ [listId: string]: Card[] }>({});
  const [loading, setLoading] = useState(true);

  // Modals
  const [showListModal, setShowListModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>("");

  // Form states
  const [listTitle, setListTitle] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardLabels, setCardLabels] = useState("");

  useEffect(() => {
    if (boardId) {
      loadBoardData();
    }
  }, [boardId]);

  const loadBoardData = async () => {
    try {
      const boardData = await api.getBoard(boardId);
      setBoard(boardData);

      // Fetch all lists for this board
      const listsData = await api.getListsByBoard(boardId);
      setLists(listsData);

      // Fetch cards for each list
      const cardsData: { [listId: string]: Card[] } = {};
      for (const list of listsData) {
        const listCards = await api.getCardsByList(list._id);
        cardsData[list._id] = listCards;
      }
      setCards(cardsData);
    } catch (error) {
      console.error("Failed to load board:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newList = await api.createList(boardId, {
        title: listTitle,
        position: lists.length + 1,
      });
      setLists([...lists, newList]);
      setCards({ ...cards, [newList._id]: [] });
      setListTitle("");
      setShowListModal(false);
    } catch (error) {
      console.error("Failed to create list:", error);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId) return;

    try {
      const listCards = cards[selectedListId] || [];
      const newCard = await api.createCard(selectedListId, {
        title: cardTitle,
        description: cardDescription,
        position: listCards.length + 1,
        labels: cardLabels ? cardLabels.split(",").map((l) => l.trim()) : [],
      });

      setCards({
        ...cards,
        [selectedListId]: [...listCards, newCard],
      });

      setCardTitle("");
      setCardDescription("");
      setCardLabels("");
      setShowCardModal(false);
      setSelectedListId("");
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!confirm("Delete this list and all its cards?")) return;
    try {
      await api.deleteList(listId);
      setLists(lists.filter((l) => l._id !== listId));
      const newCards = { ...cards };
      delete newCards[listId];
      setCards(newCards);
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const handleDeleteCard = async (cardId: string, listId: string) => {
    if (!confirm("Delete this card?")) return;
    try {
      await api.deleteCard(cardId);
      setCards({
        ...cards,
        [listId]: cards[listId].filter((c) => c._id !== cardId),
      });
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const openCardModal = (listId: string) => {
    setSelectedListId(listId);
    setShowCardModal(true);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;

    // Dropped outside the list
    if (!destination) return;

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Dragging lists
    if (type === "list") {
      const newLists = Array.from(lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      // Update positions
      const updatedLists = newLists.map((list, index) => ({
        ...list,
        position: index,
      }));

      setLists(updatedLists);

      // Update positions in backend
      try {
        await api.updateList(removed._id, { position: destination.index });
      } catch (error) {
        console.error("Failed to update list position:", error);
        setLists(lists); // Revert on error
      }
    }

    // Dragging cards
    if (type === "card") {
      const sourceListId = source.droppableId;
      const destListId = destination.droppableId;

      // Moving within the same list
      if (sourceListId === destListId) {
        const newCards = Array.from(cards[sourceListId]);
        const [removed] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, removed);

        setCards({
          ...cards,
          [sourceListId]: newCards,
        });

        // Update position in backend
        try {
          await api.updateCard(removed._id, { position: destination.index });
        } catch (error) {
          console.error("Failed to update card position:", error);
        }
      } else {
        // Moving to a different list
        const sourceCards = Array.from(cards[sourceListId]);
        const destCards = Array.from(cards[destListId] || []);
        const [removed] = sourceCards.splice(source.index, 1);
        destCards.splice(destination.index, 0, removed);

        setCards({
          ...cards,
          [sourceListId]: sourceCards,
          [destListId]: destCards,
        });

        // Move card in backend
        try {
          await api.moveCard(removed._id, {
            listId: destListId,
            boardId: boardId,
            position: destination.index,
          });
        } catch (error) {
          console.error("Failed to move card:", error);
          // Revert on error
          loadBoardData();
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Board not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/boards"
                className="text-indigo-600 hover:text-indigo-700 mb-3 inline-flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Boards
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {board.title}
              </h1>
              {board.description && (
                <p className="text-gray-600 mt-2 text-lg">
                  {board.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowListModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
              + Add List
            </button>
          </div>
        </div>
      </div>

      {/* Lists */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="container mx-auto px-6 py-8">
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                className="flex gap-6 overflow-x-auto pb-6"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lists.map((list, index) => (
                  <Draggable
                    key={list._id}
                    draggableId={list._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 w-80 shrink-0 shadow-lg border border-gray-200"
                      >
                        {/* List Header */}
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-xl text-gray-800 flex-1">
                            {list.title}
                          </h3>
                          <button
                            onClick={() => handleDeleteList(list._id)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-lg transition-all"
                          >
                            <svg
                              className="w-5 h-5 mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Cards */}
                        <Droppable droppableId={list._id} type="card">
                          {(provided) => (
                            <div
                              className="space-y-3 mb-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-1"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {(cards[list._id] || []).map(
                                (card, cardIndex) => (
                                  <Draggable
                                    key={card._id}
                                    draggableId={card._id}
                                    index={cardIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-move border border-gray-100 hover:border-indigo-200 group ${
                                          snapshot.isDragging
                                            ? "shadow-2xl rotate-2 scale-105 z-[9999] opacity-90"
                                            : ""
                                        }`}
                                        style={{
                                          ...provided.draggableProps.style,
                                          ...(snapshot.isDragging && {
                                            zIndex: 9999,
                                          }),
                                        }}
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {card.title}
                                          </h4>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteCard(
                                                card._id,
                                                list._id
                                              );
                                            }}
                                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 w-6 h-6 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                          >
                                            <svg
                                              className="w-4 h-4 mx-auto"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                        {card.description && (
                                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                            {card.description}
                                          </p>
                                        )}
                                        {card.labels &&
                                          card.labels.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                              {card.labels.map((label, idx) => (
                                                <span
                                                  key={idx}
                                                  className="text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full"
                                                >
                                                  {label}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        {/* Add Card Button */}
                        <button
                          onClick={() => openCardModal(list._id)}
                          className="w-full text-left text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl px-4 py-3 transition-all font-medium border-2 border-dashed border-gray-300 hover:border-indigo-300"
                        >
                          + Add Card
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {lists.length === 0 && (
                  <div className="text-center py-20 w-full">
                    <div className="inline-block p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-gray-500 text-xl font-medium">
                        No lists yet
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Add your first list to get started!
                      </p>
                    </div>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Create List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New List
            </h2>
            <form onSubmit={handleCreateList}>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  List Title *
                </label>
                <input
                  type="text"
                  value={listTitle}
                  onChange={(e) => setListTitle(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter list title..."
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Create List
                </button>
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Card
            </h2>
            <form onSubmit={handleCreateCard}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Title *
                </label>
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Enter card title..."
                  required
                  autoFocus
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Description
                </label>
                <textarea
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-gray-900"
                  placeholder="Add a description..."
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-semibold">
                  Labels
                </label>
                <input
                  type="text"
                  value={cardLabels}
                  onChange={(e) => setCardLabels(e.target.value)}
                  placeholder="urgent, backend, bug"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate labels with commas
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Create Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCardModal(false);
                    setSelectedListId("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
