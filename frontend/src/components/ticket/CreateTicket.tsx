import React, { useState, useEffect } from "react";
import { fetchCurrentUser } from "../../services/authService";
import ticketService from "../../services/ticketService";
import type { TicketResponseDTO, TicketUpdateDTO } from "../../services/ticketService";
import attachmentService from "../../services/attachmentService";
import type { TicketAttachmentResponseDTO } from "../../services/attachmentService";
import ticketCommentService from "../../services/ticketCommentService";
import type { TicketCommentResponseDTO } from "../../services/ticketCommentService";
import { assetService } from "../../services/assetService";
import type { Asset } from "../../services/assetService";

interface CreateTicketProps {
  setCurrentPage: (page: string) => void;
}

interface TicketFormData {
  title: string;
  description: string;
  priority: string;
  contact: string;
  reportedById: number;
  locationId?: number;
  assetId?: number;
  comment?: string;
}

interface EditingTicket {
  id: number;
  data: TicketUpdateDTO;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    priority: "Medium",
    contact: "",
    reportedById: 0, // Will be set after fetching user
    locationId: undefined,
    assetId: undefined,
  });

  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);

  // On mount, fetch current user, locations, and assets
  useEffect(() => {
    async function initData() {
      try {
        const user = await fetchCurrentUser();
        setFormData(prev => ({ ...prev, reportedById: user.id }));
        
        const locs = await assetService.fetchLocations();
        setLocations(locs);
        
        const asts = await assetService.fetchAllAssets();
        setAssets(asts);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    }
    initData();
    // eslint-disable-next-line
  }, []);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [_submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [_createdTicket, setCreatedTicket] = useState<TicketResponseDTO | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  // Tickets list state
  const [userTickets, setUserTickets] = useState<TicketResponseDTO[]>([]);
  const [_allTickets, setAllTickets] = useState<TicketResponseDTO[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketAttachments, setTicketAttachments] = useState<{ [key: number]: TicketAttachmentResponseDTO[] }>({});
  const [ticketComments, setTicketComments] = useState<{ [key: number]: TicketCommentResponseDTO[] }>({});
  const [newCommentText, setNewCommentText] = useState<{ [key: number]: string }>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [editingTicket, setEditingTicket] = useState<EditingTicket | null>(null);
  const [editErrors, setEditErrors] = useState<{ [key: number]: string | null }>({});
  const [expandedTickets, setExpandedTickets] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [_attachmentErrors, setAttachmentErrors] = useState<{ [key: number]: string | null }>({});

  // Fetch user's tickets on component mount and when user ID changes
  useEffect(() => {
    fetchUserTickets();
  }, [formData.reportedById]);

  const fetchUserTickets = async () => {
    setLoadingTickets(true);
    try {
      const allTicketsData = await ticketService.getAllTickets();
      setAllTickets(allTicketsData);
      
      // Filter tickets by current user
      const userTicketsData = allTicketsData.filter(
        (ticket) => ticket.reportedById === formData.reportedById
      );
      setUserTickets(userTicketsData);
      
      // Fetch attachments and comments for each ticket
      for (const ticket of userTicketsData) {
        try {
          const attachments = await attachmentService.getAttachments(ticket.id);
          setTicketAttachments((prev) => ({
            ...prev,
            [ticket.id]: attachments,
          }));

          const comments = await ticketCommentService.getTicketComments(ticket.id);
          setTicketComments((prev) => ({
            ...prev,
            [ticket.id]: comments,
          }));
        } catch (err) {
          console.error(`Failed to fetch extra data for ticket ${ticket.id}:`, err);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "reportedById" || name === "locationId" || name === "assetId"
          ? value
            ? parseInt(value, 10)
            : undefined
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (files.length > 3) {
        setFileError("Maximum 3 attachments allowed per ticket. Please select up to 3 files.");
        setSelectedFiles([]);
        e.target.value = "";
        return;
      }

      const invalidFiles = files.filter((file) => !file.type.startsWith("image/"));

      if (invalidFiles.length > 0) {
        setFileError(`Only image files are allowed. ${invalidFiles.length} file(s) rejected.`);
        setSelectedFiles([]);
        e.target.value = "";
        return;
      }

      setSelectedFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^0\d{9}$/.test(formData.contact)) {
      setError("Contact number must be exactly 10 digits and start with 0.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.title.length < 5 || !/^[A-Za-z\s]+$/.test(formData.title)) {
      setError("Title must contain at least 5 letters and no numbers or symbols.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { comment, ...ticketPayload } = formData;
      const newTicket = await ticketService.createTicket(ticketPayload);
      setCreatedTicket(newTicket);
      setSubmitted(true);

      if (comment && comment.trim()) {
        try {
          await ticketCommentService.createComment(newTicket.id, {
            commentedById: formData.reportedById,
            comment: comment.trim()
          });
        } catch (commentErr) {
          console.error("Failed to add initial comment", commentErr);
        }
      }

      if (selectedFiles.length > 0) {
        try {
          for (const file of selectedFiles) {
            await attachmentService.uploadAttachment(newTicket.id, formData.reportedById, file);
          }
          setSuccessMessage(`Ticket created successfully with ${selectedFiles.length} attachment(s)!`);
        } catch (attachmentError) {
          setError(
            `Ticket created but failed to upload some attachments: ${
              attachmentError instanceof Error ? attachmentError.message : "Unknown error"
            }`
          );
        }
      } else {
        setSuccessMessage("Ticket created successfully!");
      }

      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          contact: "",
          reportedById: formData.reportedById,
          locationId: undefined,
          assetId: undefined,
          comment: "",
        });
        setSelectedFiles([]);
        setSubmitted(false);
        setCreatedTicket(null);
        setFileError(null);
        fetchUserTickets();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the ticket");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTicket = (ticket: TicketResponseDTO) => {
    setEditingTicket({
      id: ticket.id,
      data: {
        title: ticket.title,
        description: ticket.description,
        contact: ticket.contact,
        priority: ticket.priority,
        assetId: ticket.assetId,
        locationId: ticket.locationId,
      },
    });
    setEditErrors((prev) => ({
      ...prev,
      [ticket.id]: null,
    }));
  };

  const handleUpdateTicket = async (ticketId: number) => {
    if (!editingTicket || editingTicket.id !== ticketId) return;

    if (editingTicket.data.title && (editingTicket.data.title.length < 5 || !/^[A-Za-z\s]+$/.test(editingTicket.data.title))) {
      setEditErrors((prev) => ({
        ...prev,
        [ticketId]: "Title must contain at least 5 letters and no numbers or symbols.",
      }));
      return;
    }

    if (editingTicket.data.contact && !/^0\d{9}$/.test(editingTicket.data.contact)) {
      setEditErrors((prev) => ({
        ...prev,
        [ticketId]: "Contact number must be exactly 10 digits and start with 0.",
      }));
      return;
    }

    try {
      const updatedTicket = await ticketService.updateTicket(ticketId, editingTicket.data);
      setUserTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updatedTicket : t))
      );
      setEditingTicket(null);
      setSuccessMessage("Ticket updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update ticket";
      setEditErrors((prev) => ({
        ...prev,
        [ticketId]: errorMsg,
      }));
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    setDeletingId(ticketId);
    try {
      await ticketService.deleteTicket(ticketId);
      setUserTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setTicketAttachments((prev) => {
        const newState = { ...prev };
        delete newState[ticketId];
        return newState;
      });
      setSuccessMessage("Ticket deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ticket");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAttachment = async (ticketId: number, attachmentId: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;

    try {
      await attachmentService.deleteAttachment(ticketId, attachmentId);
      setTicketAttachments((prev) => ({
        ...prev,
        [ticketId]: (prev[ticketId] || []).filter((a) => a.id !== attachmentId),
      }));
      setSuccessMessage("Attachment deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete attachment";
      setAttachmentErrors((prev) => ({
        ...prev,
        [ticketId]: errorMsg,
      }));
    }
  };

  const handleCreateComment = async (ticketId: number) => {
    const text = newCommentText[ticketId];
    if (!text || !text.trim()) return;

    try {
      const comment = await ticketCommentService.createComment(ticketId, {
        commentedById: formData.reportedById,
        comment: text.trim()
      });
      setTicketComments((prev) => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), comment]
      }));
      setNewCommentText((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleEditComment = (commentId: number, currentText: string) => {
    setEditingCommentId(commentId);
    setEditCommentText(currentText);
  };

  const handleSaveEditComment = async (ticketId: number, commentId: number) => {
    if (!editCommentText.trim()) return;
    
    try {
      const updated = await ticketCommentService.updateComment(ticketId, commentId, {
        commentedById: formData.reportedById,
        comment: editCommentText.trim()
      }, formData.reportedById);
      
      setTicketComments((prev) => ({
        ...prev,
        [ticketId]: prev[ticketId].map(c => c.id === commentId ? updated : c)
      }));
      setEditingCommentId(null);
      setEditCommentText("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  const handleDeleteComment = async (ticketId: number, commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await ticketCommentService.deleteComment(ticketId, commentId, formData.reportedById);
      setTicketComments((prev) => ({
        ...prev,
        [ticketId]: prev[ticketId].filter(c => c.id !== commentId)
      }));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const toggleExpandTicket = (ticketId: number) => {
    setExpandedTickets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canEditTicket = (ticket: TicketResponseDTO) => {
    return ticket.status === "OPEN" && !ticket.assignedToId;
  };

  const canDeleteTicket = (ticket: TicketResponseDTO) => {
    return ticket.status === "OPEN" || ticket.status === "REJECTED";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Support Ticket System</h1>
        <p className="text-gray-600 mb-8">Create new tickets and manage your existing ones</p>

        {/* Global Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300 font-medium">
            ✗ {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-300 font-medium">
            ✓ {successMessage}
          </div>
        )}

        {/* Create Ticket Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🎫</span> Create New Ticket
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Detailed description of the problem"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* User ID is now set automatically from logged-in user */}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="locationId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (optional)
                  </label>
                  <select
                    id="locationId"
                    name="locationId"
                    value={formData.locationId || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="assetId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset *
                  </label>
                  <select
                    id="assetId"
                    name="assetId"
                    value={formData.assetId || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an asset</option>
                    {assets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Contact Info *
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0712345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
                  Initial Comment (optional)
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any additional comments..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <div>
                <label htmlFor="attachments" className="block text-sm font-semibold text-gray-700 mb-2">
                  Attachments - Images Only (optional, max 3)
                </label>
                <input
                  type="file"
                  id="attachments"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {fileError && (
                  <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm font-semibold text-red-800">⚠ {fileError}</p>
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 mb-2">Selected files ({selectedFiles.length}/3):</p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-semibold py-3 rounded-lg transition duration-300 ease-in-out ${
                  loading
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Creating Ticket..." : "Create Ticket"}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Ticket Preview</h3>

              {formData.title ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Title</p>
                    <p className="text-gray-800 font-medium">{formData.title}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Priority</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        formData.priority
                      )}`}
                    >
                      {formData.priority}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">User ID</p>
                    <p className="text-gray-800">{formData.reportedById}</p>
                  </div>

                  {formData.assetId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Asset ID</p>
                      <p className="text-gray-800">{formData.assetId}</p>
                    </div>
                  )}

                  {formData.locationId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Location ID</p>
                      <p className="text-gray-800">{formData.locationId}</p>
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Attachments</p>
                      <p className="text-gray-800">{selectedFiles.length} file(s)</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-gray-700 text-xs">{formData.description || "No description"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Fill in the form to see ticket preview</p>
              )}
            </div>
          </div>
        </div>

        {/* User Tickets Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📝</span> Your Tickets (User ID: {formData.reportedById})
          </h2>

          {loadingTickets ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-600">Loading tickets...</div>
            </div>
          ) : userTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tickets created yet. Create one above to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">#{ticket.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        {ticket.assignedToId && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                            👷 Assigned
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-700">{ticket.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    </div>
                    <button
                      onClick={() => toggleExpandTicket(ticket.id)}
                      className="ml-4 text-gray-500 hover:text-gray-700 text-xl"
                    >
                      {expandedTickets.has(ticket.id) ? "▼" : "▶"}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedTickets.has(ticket.id) && (
                    <div className="border-t pt-4 space-y-4">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                          <p className="text-gray-700">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Updated</p>
                          <p className="text-gray-700">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                          <p className="text-gray-700">{ticket.contact}</p>
                        </div>
                        {ticket.assetId && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase">Asset ID</p>
                            <p className="text-gray-700">{ticket.assetId}</p>
                          </div>
                        )}
                      </div>

                      {/* Status-specific details */}
                      {ticket.resolutionNotes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Resolution Notes</p>
                          <p className="text-gray-700 text-sm">{ticket.resolutionNotes}</p>
                        </div>
                      )}

                      {ticket.rejectionReason && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Rejection Reason</p>
                          <p className="text-gray-700 text-sm">{ticket.rejectionReason}</p>
                        </div>
                      )}

                      {/* Attachments Section */}
                      {ticketAttachments[ticket.id] && ticketAttachments[ticket.id].length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">📎 Attachments ({ticketAttachments[ticket.id].length})</p>
                          <div className="space-y-2">
                            {ticketAttachments[ticket.id].map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                                <div className="flex-1 min-w-0">
                                  <a href={attachment.filePath} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    <p className="text-sm font-medium text-blue-600 truncate">{attachment.fileName}</p>
                                  </a>
                                  <p className="text-xs text-gray-500">{new Date(attachment.uploadedAt).toLocaleDateString()}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteAttachment(ticket.id, attachment.id)}
                                  className="ml-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded border border-red-200 text-xs font-medium transition"
                                >
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      <div className="pt-4 border-t">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">💬 Comments</p>
                        <div className="space-y-3 mb-4">
                          {(ticketComments[ticket.id] || []).map((comment) => (
                            <div key={comment.id} className="bg-white p-3 rounded shadow-sm border border-gray-200">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-gray-800">{comment.commentedByName}</span>
                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                              </div>
                              
                              {editingCommentId === comment.id ? (
                                <div className="mt-2">
                                  <textarea
                                    value={editCommentText}
                                    onChange={(e) => setEditCommentText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                                    rows={2}
                                  />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleSaveEditComment(ticket.id, comment.id)} className="px-3 py-1 bg-green-600 text-white text-xs rounded">Save</button>
                                    <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 bg-gray-400 text-white text-xs rounded">Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                              )}
                              
                              {comment.commentedById === formData.reportedById && editingCommentId !== comment.id && (
                                <div className="flex gap-3 mt-2">
                                  <button onClick={() => handleEditComment(comment.id, comment.comment)} className="text-xs text-blue-600 hover:underline">Edit</button>
                                  <button onClick={() => handleDeleteComment(ticket.id, comment.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                                </div>
                              )}
                            </div>
                          ))}
                          {(ticketComments[ticket.id] || []).length === 0 && (
                            <p className="text-xs text-gray-500 italic">No comments yet.</p>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add a comment..."
                            value={newCommentText[ticket.id] || ""}
                            onChange={(e) => setNewCommentText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                          <button 
                            onClick={() => handleCreateComment(ticket.id)}
                            disabled={!newCommentText[ticket.id]?.trim()}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded disabled:bg-blue-300 transition"
                          >
                            Post
                          </button>
                        </div>
                      </div>

                      {/* Edit Section */}
                      {editingTicket?.id === ticket.id ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                          <p className="font-semibold text-blue-900">Edit Ticket</p>
                          <input
                            type="text"
                            value={editingTicket.data.title || ""}
                            onChange={(e) =>
                              setEditingTicket({
                                ...editingTicket,
                                data: { ...editingTicket.data, title: e.target.value },
                              })
                            }
                            placeholder="Title"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <textarea
                            value={editingTicket.data.description || ""}
                            onChange={(e) =>
                              setEditingTicket({
                                ...editingTicket,
                                data: { ...editingTicket.data, description: e.target.value },
                              })
                            }
                            placeholder="Description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={editingTicket.data.contact || ""}
                            onChange={(e) =>
                              setEditingTicket({
                                ...editingTicket,
                                data: { ...editingTicket.data, contact: e.target.value },
                              })
                            }
                            placeholder="Contact"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                          <select
                            value={editingTicket.data.priority || ""}
                            onChange={(e) =>
                              setEditingTicket({
                                ...editingTicket,
                                data: { ...editingTicket.data, priority: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>

                          {editErrors[ticket.id] && (
                            <p className="text-red-600 text-xs">{editErrors[ticket.id]}</p>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateTicket(ticket.id)}
                              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-sm transition"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingTicket(null)}
                              className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded text-sm transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Action Buttons */
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {canEditTicket(ticket) && (
                            <button
                              onClick={() => handleEditTicket(ticket)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm transition"
                            >
                              ✏️ Edit
                            </button>
                          )}

                          {canDeleteTicket(ticket) && (
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              disabled={deletingId === ticket.id}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-sm transition disabled:bg-red-400"
                            >
                              {deletingId === ticket.id ? "Deleting..." : "🗑️ Delete"}
                            </button>
                          )}

                          {!canEditTicket(ticket) && !canDeleteTicket(ticket) && (
                            <span className="text-gray-500 text-sm italic">No actions available for this ticket</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateTicket;
