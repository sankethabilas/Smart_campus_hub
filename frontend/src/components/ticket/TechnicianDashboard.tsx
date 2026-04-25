import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import userService from "../../services/userService";
import type { TicketResponseDTO } from "../../services/ticketService";
import type { UserDto } from "../../services/userService";

interface TechnicianDashboardProps {
  setCurrentPage: (page: string) => void;
}

const TechnicianDashboard: React.FC<TechnicianDashboardProps> = () => {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [technician, setTechnician] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseDTO | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPriority, setFilterPriority] = useState("ALL");

  // ✅ TECHNICIAN UPDATE FORM STATES
  const [updateStatus, setUpdateStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch technician and their tickets on component mount
  useEffect(() => {
    fetchTechnicianAndTickets();
  }, []);

  const fetchTechnicianAndTickets = async () => {
    setLoading(true);
    setError(null);
    setSelectedTicket(null);

    try {
      // ✅ Get all technicians instead of /users/{id}
      const technicians = await userService.getTechnicians();

      // ✅ Pick technician with ID 2
      const technicianData = technicians.find(t => t.id === 2);

      if (!technicianData) {
        throw new Error("Technician not found");
      }

      setTechnician(technicianData);

      // ✅ Fetch tickets
      const allTickets = await ticketService.getAllTickets();

      console.log("ALL TICKETS:", allTickets); // DEBUG
      console.log("TECH ID:", technicianData.id); // DEBUG

      // ✅ SAFE FILTER (handles number/string issues)
      const assignedTickets = allTickets.filter(
        ticket => Number(ticket.assignedToId) === Number(technicianData.id)
      );

      console.log("ASSIGNED TICKETS:", assignedTickets); // DEBUG

      setTickets(assignedTickets);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch technician or tickets");
    } finally {
      setLoading(false);
    }
  };

  // ✅ TECHNICIAN: Handle ticket selection with form reset
  const handleSelectTicket = (ticket: TicketResponseDTO) => {
    setSelectedTicket(ticket);
    setUpdateStatus(ticket.status);
    setResolutionNotes(ticket.resolutionNotes || "");
    setSuccessMessage(null);
  };

  // ✅ TECHNICIAN: Update ticket status and resolution notes
  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setError(null);
    setSuccessMessage(null);

    try {
      // ✅ TECHNICIAN RESPONSIBILITIES: Mark IN_PROGRESS or RESOLVED with notes only

      // Mark as IN_PROGRESS when starting work
      if (updateStatus === "IN_PROGRESS" && updateStatus !== selectedTicket.status) {
        await ticketService.updateTicketStatus(
          selectedTicket.id,
          updateStatus
        );
      }

      // Mark as RESOLVED with resolution notes (Technician job)
      if (updateStatus === "RESOLVED" && resolutionNotes) {
        await ticketService.resolveTicket(
          selectedTicket.id,
          resolutionNotes
        );
      }

      // ✅ FETCH FRESH COPY TO SYNC ALL FIELDS
      const freshTicket = await ticketService.getTicketById(selectedTicket.id);

      setSuccessMessage(`Ticket #${selectedTicket.id} updated successfully!`);
      
      // Update ticket in list
      setTickets(
        tickets.map((t) => (t.id === freshTicket.id ? freshTicket : t))
      );

      // Reset after 2 seconds
      setTimeout(() => {
        setSelectedTicket(null);
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket");
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const statusMatch = filterStatus === "ALL" || ticket.status === filterStatus;
      const priorityMatch = filterPriority === "ALL" || ticket.priority === filterPriority;
      return statusMatch && priorityMatch;
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

  const filteredTickets = getFilteredTickets();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Technician Updates</h1>
          {technician ? (
            <p className="text-gray-600">
              Tickets assigned to {technician.name} (ID: {technician.id})
            </p>
          ) : loading ? (
            <p className="text-gray-600">Loading technician information...</p>
          ) : (
            <p className="text-gray-600">Unable to load technician information</p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
            ✗ {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tickets List */}
            <div className="lg:col-span-2">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500 text-lg">
                    {tickets.length === 0
                      ? "No tickets assigned to you yet."
                      : "No tickets match the selected filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`p-6 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out ${
                        selectedTicket?.id === ticket.id
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-white hover:shadow-lg hover:border-blue-300 border border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            #{ticket.id} - {ticket.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Created: {new Date(ticket.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm line-clamp-2">
                        {ticket.description}
                      </p>
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
                    <div className="bg-green-50 border border-green-300 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-green-800">
                        🧑‍🔧 TECHNICIAN PANEL - Update Status & Add Notes
                      </p>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Ticket #{selectedTicket.id}
                    </h3>

                    {successMessage && (
                      <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 text-sm">
                        ✓ {successMessage}
                      </div>
                    )}

                    <div className="space-y-3 mb-6 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Title</p>
                        <p className="text-gray-800 text-sm">{selectedTicket.title}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Current Status</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            selectedTicket.status
                          )}`}
                        >
                          {selectedTicket.status}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Priority</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            selectedTicket.priority
                          )}`}
                        >
                          {selectedTicket.priority}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                        <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateTicket} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                          Update Status *
                        </label>
                        <select
                          value={updateStatus}
                          onChange={(e) => setUpdateStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                          <option value="OPEN">Open (No Action)</option>
                          <option value="IN_PROGRESS">In Progress (Start Work)</option>
                          <option value="RESOLVED">Resolved (Complete Work)</option>
                        </select>
                      </div>

                      {updateStatus === "RESOLVED" && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                            Resolution Notes *
                          </label>
                          <textarea
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Describe what you did to fix the issue..."
                            rows={4}
                            className="w-full px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                          ></textarea>
                          <p className="text-xs text-gray-500 mt-1">
                            ℹ️ Required when marking ticket as RESOLVED
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={updateStatus === "OPEN"}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition duration-300 text-sm"
                      >
                        Update Ticket
                      </button>

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
                  <div className="text-center py-8">
                    <p className="text-gray-500">Select a ticket to update</p>
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

export default TechnicianDashboard;
