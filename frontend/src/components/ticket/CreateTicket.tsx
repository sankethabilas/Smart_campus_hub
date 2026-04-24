import React, { useState } from "react";
import ticketService from "../../services/ticketService";
import type { TicketResponseDTO } from "../../services/ticketService";
import attachmentService from "../../services/attachmentService";

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
}

const CreateTicket: React.FC<CreateTicketProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    priority: "Medium",
    contact: "",
    reportedById: 1, // Default user ID - should come from auth context
    locationId: undefined,
    assetId: undefined,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<TicketResponseDTO | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "reportedById" || name === "locationId" || name === "assetId" 
        ? (value ? parseInt(value, 10) : undefined)
        : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check if more than 3 files are selected
      if (files.length > 3) {
        setFileError("Maximum 3 attachments allowed per ticket. Please select up to 3 files.");
        setSelectedFiles([]);
        e.target.value = ""; // Reset the input
        return;
      }

      // Check if all files are images
      const invalidFiles = files.filter(
        (file) => !file.type.startsWith("image/")
      );
      
      if (invalidFiles.length > 0) {
        setFileError(`Only image files are allowed. ${invalidFiles.length} file(s) rejected.`);
        setSelectedFiles([]);
        e.target.value = ""; // Reset the input
        return;
      }

      setSelectedFiles(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Create the ticket
      const newTicket = await ticketService.createTicket(formData);
      setCreatedTicket(newTicket);
      setSubmitted(true);

      // Upload attachments if any
      if (selectedFiles.length > 0) {
        try {
          for (const file of selectedFiles) {
            await attachmentService.uploadAttachment(newTicket.id, formData.reportedById, file);
          }
          setSuccessMessage(`Ticket created successfully with ${selectedFiles.length} attachment(s)!`);
        } catch (attachmentError) {
          // Ticket was created but attachment upload failed
          setError(
            `Ticket created but failed to upload some attachments: ${attachmentError instanceof Error ? attachmentError.message : "Unknown error"}`
          );
        }
      } else {
        setSuccessMessage("Ticket created successfully!");
      }

      // Reset form after a delay
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          contact: "",
          reportedById: 1,
          locationId: undefined,
          assetId: undefined,
        });
        setSelectedFiles([]);
        setSubmitted(false);
        setCreatedTicket(null);
        setFileError(null);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the ticket");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Create Support Ticket</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ticket Details</h2>

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

            {submitted && (
              <div className="mb-6 p-4 rounded-lg bg-blue-100 text-blue-800 border border-blue-300 font-medium">
                ✓ Ticket created! Ticket ID: {createdTicket?.id}
              </div>
            )}

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
                  rows={5}
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

                <div>
                  <label htmlFor="reportedById" className="block text-sm font-semibold text-gray-700 mb-2">
                    Reported By User ID *
                  </label>
                  <input
                    type="number"
                    id="reportedById"
                    name="reportedById"
                    value={formData.reportedById}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="locationId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location ID (optional)
                  </label>
                  <input
                    type="number"
                    id="locationId"
                    name="locationId"
                    value={formData.locationId || ""}
                    onChange={handleChange}
                    placeholder="Location ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="assetId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Asset ID *
                  </label>
                  <input
                    type="number"
                    id="assetId"
                    name="assetId"
                    value={formData.assetId || ""}
                    onChange={handleChange}
                    required
                    placeholder="Asset ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  placeholder="Email or phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ticket Preview</h3>

              {formData.title ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Title</p>
                    <p className="text-gray-800 font-medium">{formData.title}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Priority</p>
                    <p className="text-gray-800">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          formData.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : formData.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {formData.priority}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">User ID</p>
                    <p className="text-gray-800">{formData.reportedById}</p>
                  </div>

                  {formData.locationId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Location ID</p>
                      <p className="text-gray-800">{formData.locationId}</p>
                    </div>
                  )}

                  {formData.assetId && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Asset ID</p>
                      <p className="text-gray-800">{formData.assetId}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                    <p className="text-gray-800">{formData.contact || "Not specified"}</p>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">Attachments</p>
                      <p className="text-gray-800">{selectedFiles.length} file(s)</p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Description</p>
                    <p className="text-gray-700 text-sm">{formData.description || "No description"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Fill in the form to see ticket preview</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setCurrentPage("technician-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            📊 Technician Dashboard
          </button>
          <button
            onClick={() => setCurrentPage("ticket-admin")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            ⚙️ Ticket Administration
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
