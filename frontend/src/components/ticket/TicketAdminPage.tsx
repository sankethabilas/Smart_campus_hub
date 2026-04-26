import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";
import attachmentService from "../../services/attachmentService";
import type { TicketResponseDTO } from "../../services/ticketService";
import type { TicketAttachmentResponseDTO } from "../../services/attachmentService";
import type { UserDto } from "../../services/userService";

const TicketAdminPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [technicians, setTechnicians] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseDTO | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [attachments, setAttachments] = useState<TicketAttachmentResponseDTO[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);

  // Form states for updating ticket
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateAssignee, setUpdateAssignee] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTickets();
    fetchTechnicians();
  }, []);

  const fetchAllTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const data = await userService.getTechnicians();
      setTechnicians(data);
    } catch (err) {
      console.error("Failed to fetch technicians:", err);
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const statusMatch = filterStatus === "ALL" || ticket.status === filterStatus;
      const priorityMatch = filterPriority === "ALL" || ticket.priority === filterPriority;
      const searchMatch =
        searchQuery === "" ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.id.toString().includes(searchQuery);
      return statusMatch && priorityMatch && searchMatch;
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectTicket = async (ticket: TicketResponseDTO) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setUpdateAssignee(ticket.assignedToId?.toString() || "");
    setRejectionReason(ticket.rejectionReason || "");
    setSuccessMessage(null);
    
    // Fetch attachments for selected ticket
    setLoadingAttachments(true);
    try {
      const ticketAttachments = await attachmentService.getAttachments(ticket.id);
      setAttachments(ticketAttachments);
    } catch (err) {
      console.error("Failed to fetch attachments:", err);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setError(null);
    setSuccessMessage(null);

    try {
      // ✅ ADMIN RESPONSIBILITIES: Assign, Reject, Close only

      // Assign technician if changed
      if (updateAssignee && updateAssignee !== (selectedTicket.assignedToId?.toString() || "")) {
        await ticketService.assignTechnician(
          selectedTicket.id,
          Number(updateAssignee)
        );
      }

      // Reject ticket if status is REJECTED (Admin only)
      if (updateStatus === "REJECTED" && rejectionReason) {
        await ticketService.rejectTicket(
          selectedTicket.id,
          rejectionReason
        );
      }

      // Close ticket if status is CLOSED (Admin only - after technician resolves)
      if (updateStatus === "CLOSED") {
        await ticketService.closeTicket(selectedTicket.id);
      }

      // ✅ FETCH FRESH COPY OF TICKET FROM BACKEND TO ENSURE ALL FIELDS ARE SYNCED
      const freshTicket = await ticketService.getTicketById(selectedTicket.id);

      setSuccessMessage(`Ticket #${selectedTicket.id} updated successfully!`);
      
      // Update the ticket in the list with fresh data
      setTickets(
        tickets.map((t) => (t.id === freshTicket.id ? freshTicket : t))
      );

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedTicket(null);
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket");
    }
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ticket Administration</h1>
        <p className="text-gray-600 mb-8">Manage all support tickets and assignments</p>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Tickets
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, title, or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
            ✗ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">No tickets found.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`p-5 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out ${
                        selectedTicket?.id === ticket.id
                          ? "bg-purple-50 border-2 border-purple-500"
                          : "bg-white hover:shadow-lg border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-800">
                            #{ticket.id} - {ticket.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                        {ticket.assignedToId && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-800">
                            Assigned to #{ticket.assignedToId}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Update Ticket Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                {selectedTicket ? (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Edit Ticket #{selectedTicket.id}
                    </h3>

                    {successMessage && (
                      <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 text-sm">
                        ✓ {successMessage}
                      </div>
                    )}

                    <form onSubmit={handleUpdateTicket} className="space-y-4">
                      <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-blue-800">
                          👨‍💼 ADMIN PANEL - Assign & Manage Tickets
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={selectedTicket.title}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Status
                        </label>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-300">
                          Current: <span className="font-semibold">{selectedTicket.status}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          ℹ️ Status updates are managed by technicians. You can REJECT or CLOSE tickets.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Assign to Technician *
                        </label>
                        <select
                          value={updateAssignee}
                          onChange={(e) => setUpdateAssignee(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Select a technician</option>
                          {technicians.map((tech) => (
                            <option key={tech.id} value={tech.id.toString()}>
                              {tech.name} (ID: {tech.id}) - {tech.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Priority
                        </label>
                        <input
                          type="text"
                          value={selectedTicket.priority}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Action on Ticket
                        </label>
                        <select
                          value={updateStatus}
                          onChange={(e) => setUpdateStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="">Select action...</option>
                          <option value="REJECTED">Reject (Invalid Ticket)</option>
                          <option value="CLOSED">Close (After Resolved)</option>
                        </select>
                      </div>

                      {updateStatus === "REJECTED" && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                            Rejection Reason *
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Why is this ticket being rejected?"
                            rows={3}
                            className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm resize-none"
                          ></textarea>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Reporter Contact
                        </label>
                        <input
                          type="text"
                          value={selectedTicket.contact}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                        />
                      </div>

                      {selectedTicket.resolutionNotes && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                            Resolution Notes (Technician)
                          </label>
                          <textarea
                            value={selectedTicket.resolutionNotes}
                            disabled
                            rows={3}
                            className="w-full px-3 py-2 border border-green-300 rounded bg-green-50 text-gray-600 cursor-not-allowed text-sm resize-none"
                          ></textarea>
                        </div>
                      )}

                      {/* Attachments Section */}
                      {!loadingAttachments && attachments.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                            📎 Attachments ({attachments.length})
                          </label>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {attachments.map((attachment) => (
                              <div key={attachment.id} className="bg-gray-50 p-2 rounded border border-gray-200">
                                <a href={attachment.filePath} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                  <p className="text-xs font-medium text-blue-600">{attachment.fileName}</p>
                                </a>
                                <p className="text-xs text-gray-500">{new Date(attachment.uploadedAt).toLocaleDateString()}</p>
                                {attachment.filePath && (
                                  <img
                                    src={attachment.filePath}
                                    alt={attachment.fileName}
                                    className="mt-2 max-w-full h-auto rounded border border-gray-300 cursor-pointer hover:opacity-90"
                                    onClick={() => window.open(attachment.filePath, "_blank")}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t pt-4">
                        <button
                          type="submit"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition duration-300 text-sm"
                        >
                          Update Ticket
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedTicket(null)}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-300 text-sm"
                      >
                        Close
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Select a ticket to edit</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketAdminPage;
