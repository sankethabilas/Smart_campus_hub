import React, { useEffect, useState } from "react";
import ticketService from "../../services/ticketService";
import type { TicketResponseDTO } from "../../services/ticketService";
import attachmentService from "../../services/attachmentService";
import type { TicketAttachmentResponseDTO } from "../../services/attachmentService";

interface TicketDetailProps {
  ticketId: number;
  onBack?: () => void;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState<TicketResponseDTO | null>(null);
  const [attachments, setAttachments] = useState<TicketAttachmentResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const ticketData = await ticketService.getTicketById(ticketId);
      setTicket(ticketData);

      // Fetch attachments
      try {
        const attachmentData = await attachmentService.getAttachments(ticketId);
        setAttachments(attachmentData);
      } catch (attachmentError) {
        // If attachments fail, continue showing the ticket
        console.warn("Failed to load attachments:", attachmentError);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ticket details");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              ← Back
            </button>
          )}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-red-600 font-semibold">{error || "Ticket not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            ← Back
          </button>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Ticket #{ticket.id}</h1>
              <p className="text-gray-600">{ticket.title}</p>
            </div>
            <div className="flex gap-2">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status || "OPEN"}
              </span>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Status</p>
                <p className="text-gray-800">{ticket.status || "OPEN"}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Priority</p>
                <p className="text-gray-800">{ticket.priority}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Reported By</p>
                <p className="text-gray-800">User ID: {ticket.reportedById}</p>
              </div>

              {ticket.assignedToId && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Assigned To</p>
                  <p className="text-gray-800">User ID: {ticket.assignedToId}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Contact</p>
                <p className="text-gray-800">{ticket.contact}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Created</p>
                <p className="text-gray-800">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>

              {ticket.updatedAt && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Updated</p>
                  <p className="text-gray-800">{new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
              )}

              {ticket.resolvedAt && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Resolved</p>
                  <p className="text-gray-800">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                </div>
              )}

              {ticket.closedAt && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Closed</p>
                  <p className="text-gray-800">{new Date(ticket.closedAt).toLocaleString()}</p>
                </div>
              )}

              {ticket.locationId && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Location ID</p>
                  <p className="text-gray-800">{ticket.locationId}</p>
                </div>
              )}

              {ticket.assetId && (
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1">Asset ID</p>
                  <p className="text-gray-800">{ticket.assetId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.resolutionNotes && (
            <div className="border-t pt-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Resolution Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.resolutionNotes}</p>
            </div>
          )}

          {ticket.rejectionReason && (
            <div className="border-t pt-8 mb-8 bg-red-50 border-red-200 rounded p-4">
              <h2 className="text-2xl font-semibold text-red-800 mb-4">Rejection Reason</h2>
              <p className="text-red-700 whitespace-pre-wrap">{ticket.rejectionReason}</p>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attachments ({attachments.length})</h2>
              <div className="space-y-3">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">{attachment.fileName}</p>
                      <p className="text-sm text-gray-600">
                        Type: {attachment.fileType} • Uploaded by User {attachment.uploadedById} •{" "}
                        {new Date(attachment.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <a
                      href={attachment.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
