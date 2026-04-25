import axiosInstance from './axiosConfig';

export interface TicketRequestDTO {
  reportedById: number;
  assetId?: number;
  locationId?: number;
  priority: string;
  title: string;
  description: string;
  contact: string;
}

export interface TicketResponseDTO {
  id: number;
  reportedById: number;
  assetId?: number;
  locationId?: number;
  assignedToId?: number;
  priority: string;
  title: string;
  description: string;
  contact: string;
  status: string;
  resolutionNotes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface TicketStatusUpdateDTO {
  status: string;
}

export interface TicketAssignDTO {
  technicianId: number;
}

export interface TicketUpdateDTO {
  title?: string;
  description?: string;
  contact?: string;
  priority?: string;
  assetId?: number;
  locationId?: number;
}

class TicketService {
  /**
   * Get all tickets
   */
  async getAllTickets(): Promise<TicketResponseDTO[]> {
    try {
      const response = await axiosInstance.get<TicketResponseDTO[]>('/tickets');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch tickets: ${error}`);
    }
  }

  /**
   * Get ticket by ID
   */
  async getTicketById(ticketId: number): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.get<TicketResponseDTO>(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ticket: ${error}`);
    }
  }

  /**
   * Create a new ticket
   */
  async createTicket(ticketData: TicketRequestDTO): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.post<TicketResponseDTO>('/tickets', ticketData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create ticket: ${error.message}`);
      }
      throw new Error('Failed to create ticket: Unknown error');
    }
  }

  /**
   * Assign technician to ticket
   */
  async assignTechnician(ticketId: number, assignedToId: number): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}/assign`,
        { technicianId: assignedToId }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to assign ticket: ${error.message}`);
      }
      throw new Error('Failed to assign ticket: Unknown error');
    }
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(ticketId: number, status: string): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}/status`,
        { status }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update status: ${error.message}`);
      }
      throw new Error('Failed to update status: Unknown error');
    }
  }

  /**
   * Resolve ticket with notes
   */
  async resolveTicket(ticketId: number, resolutionNotes: string): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}/resolve`,
        { resolutionNotes }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to resolve ticket: ${error.message}`);
      }
      throw new Error('Failed to resolve ticket: Unknown error');
    }
  }

  /**
   * Close ticket
   */
  async closeTicket(ticketId: number): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}/close`
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to close ticket: ${error.message}`);
      }
      throw new Error('Failed to close ticket: Unknown error');
    }
  }

  /**
   * Reject ticket
   */
  async rejectTicket(ticketId: number, rejectionReason: string): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}/reject`,
        { rejectionReason }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to reject ticket: ${error.message}`);
      }
      throw new Error('Failed to reject ticket: Unknown error');
    }
  }

  /**
   * Update ticket
   */
  async updateTicket(ticketId: number, ticketData: TicketUpdateDTO): Promise<TicketResponseDTO> {
    try {
      const response = await axiosInstance.put<TicketResponseDTO>(
        `/tickets/${ticketId}`,
        ticketData
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update ticket: ${error.message}`);
      }
      throw new Error('Failed to update ticket: Unknown error');
    }
  }

  /**
   * Delete ticket
   */
  async deleteTicket(ticketId: number): Promise<void> {
    try {
      await axiosInstance.delete(`/tickets/${ticketId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete ticket: ${error.message}`);
      }
      throw new Error('Failed to delete ticket: Unknown error');
    }
  }
}

export default new TicketService();
