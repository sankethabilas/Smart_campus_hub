import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import type { TicketResponseDTO } from "../../services/ticketService";

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<TicketResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponseDTO | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Support Tickets</h1>
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300">
            ✗ {error}
          </div>
        )}

        {loading && !tickets.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading tickets...</div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No tickets found. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">#{ticket.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{ticket.title}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status || "OPEN"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicket(ticket);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {selectedTicket && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Ticket Details</h2>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">ID</p>
                    <p className="text-gray-800">{selectedTicket.id}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Title</p>
                    <p className="text-gray-800 font-medium">{selectedTicket.title}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                    <p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status || "OPEN"}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Priority</p>
                    <p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Reported By</p>
                    <p className="text-gray-800">User ID: {selectedTicket.reportedById}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                    <p className="text-gray-800">{selectedTicket.contact}</p>
                  </div>

                  {selectedTicket.locationId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Location ID</p>
                      <p className="text-gray-800">{selectedTicket.locationId}</p>
                    </div>
                  )}

                  {selectedTicket.assetId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Asset ID</p>
                      <p className="text-gray-800">{selectedTicket.assetId}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Created</p>
                    <p className="text-gray-800">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                  </div>

                  {selectedTicket.updatedAt && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Updated</p>
                      <p className="text-gray-800">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-gray-700 text-sm">{selectedTicket.description}</p>
                  </div>

                  {selectedTicket.resolutionNotes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Resolution Notes</p>
                      <p className="text-gray-700 text-sm">{selectedTicket.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
