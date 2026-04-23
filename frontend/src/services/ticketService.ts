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
}

export default new TicketService();
