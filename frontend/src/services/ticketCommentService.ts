import axiosInstance from './axiosConfig';

export interface TicketCommentRequestDTO {
    ticketId?: number;
    commentedById: number;
    comment: string;
}

export interface TicketCommentResponseDTO {
    id: number;
    ticketId: number;
    commentedById: number;
    commentedByName: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

class TicketCommentService {
    /**
     * Create a new comment
     */
    async createComment(ticketId: number, commentData: TicketCommentRequestDTO): Promise<TicketCommentResponseDTO> {
        try {
            const response = await axiosInstance.post<TicketCommentResponseDTO>(
                `/tickets/${ticketId}/comments`,
                commentData
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create comment');
        }
    }

    /**
     * Get all comments for a ticket
     */
    async getTicketComments(ticketId: number): Promise<TicketCommentResponseDTO[]> {
        try {
            const response = await axiosInstance.get<TicketCommentResponseDTO[]>(`/tickets/${ticketId}/comments`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch comments');
        }
    }

    /**
     * Update a comment
     */
    async updateComment(ticketId: number, commentId: number, commentData: TicketCommentRequestDTO, userId: number): Promise<TicketCommentResponseDTO> {
        try {
            const response = await axiosInstance.put<TicketCommentResponseDTO>(
                `/tickets/${ticketId}/comments/${commentId}?userId=${userId}`,
                commentData
            );
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update comment');
        }
    }

    /**
     * Delete a comment
     */
    async deleteComment(ticketId: number, commentId: number, userId: number): Promise<void> {
        try {
            await axiosInstance.delete(`/tickets/${ticketId}/comments/${commentId}?userId=${userId}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete comment');
        }
    }
}

export default new TicketCommentService();
