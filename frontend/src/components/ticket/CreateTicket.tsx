import React, { useState } from "react";

interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  resourceLocation: string;
  createdBy: string;
  preferredContactInfo: string;
}

const CreateTicket: React.FC = () => {
  const [formData, setFormData] = useState<TicketFormData>({
    title: "",
    description: "",
    category: "IT",
    priority: "Medium",
    resourceLocation: "",
    createdBy: "",
    preferredContactInfo: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        title: "",
        description: "",
        category: "IT",
        priority: "Medium",
        resourceLocation: "",
        createdBy: "",
        preferredContactInfo: "",
      });
      setSubmitted(false);
    }, 3000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Create Support Ticket</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ticket Details</h2>

            {submitted && (
              <div className="mb-6 p-4 rounded-lg bg-green-100 text-green-800 border border-green-300 font-medium">
                ✓ Ticket preview ready! Backend integration coming soon.
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
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="IT">IT</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label htmlFor="resourceLocation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Resource/Location *
                </label>
                <input
                  type="text"
                  id="resourceLocation"
                  name="resourceLocation"
                  value={formData.resourceLocation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Lab A, Room 101"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="createdBy" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="createdBy"
                  name="createdBy"
                  value={formData.createdBy}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="preferredContactInfo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Contact Info *
                </label>
                <input
                  type="text"
                  id="preferredContactInfo"
                  name="preferredContactInfo"
                  value={formData.preferredContactInfo}
                  onChange={handleChange}
                  required
                  placeholder="Email or phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out"
              >
                Preview Ticket
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
                    <p className="text-xs font-semibold text-gray-500 uppercase">Category</p>
                    <p className="text-gray-800">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {formData.category}
                      </span>
                    </p>
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
                    <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                    <p className="text-gray-800">{formData.resourceLocation || "Not specified"}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Reported By</p>
                    <p className="text-gray-800">{formData.createdBy || "Not specified"}</p>
                  </div>

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
      </div>
    </div>
  );
};

export default CreateTicket;
