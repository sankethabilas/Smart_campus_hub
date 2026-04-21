import axiosInstance from './axiosConfig';

export interface TicketAttachmentResponseDTO {
  id: number;
  ticketId: number;
  fileName: string;
  filePath: string;
  fileType: string;
  uploadedById: number;
  uploadedAt: string;
}

class AttachmentService {
  /**
   * Upload an attachment to a ticket
   */
  async uploadAttachment(
    ticketId: number,
    userId: number,
    file: File
  ): Promise<TicketAttachmentResponseDTO> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<TicketAttachmentResponseDTO>(
        `/tickets/${ticketId}/attachments`,
        formData,
        {
          params: {
            userId,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to upload attachment: ${error.message}`);
      }
      throw new Error('Failed to upload attachment: Unknown error');
    }
  }

  /**
   * Get all attachments for a ticket
   */
  async getAttachments(ticketId: number): Promise<TicketAttachmentResponseDTO[]> {
    try {
      const response = await axiosInstance.get<TicketAttachmentResponseDTO[]>(
        `/tickets/${ticketId}/attachments`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch attachments: ${error.message}`);
      }
      throw new Error('Failed to fetch attachments: Unknown error');
    }
  }
}

export default new AttachmentService();
