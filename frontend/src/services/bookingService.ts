import axiosInstance from "./axiosConfig";

export interface BookingRequest {
    assetId: number;
    bookingDate: string; // YYYY-MM-DD
    startTime: string;   // HH:mm:ss
    endTime: string;     // HH:mm:ss
    purpose: string;
    headcount: number;
}

export interface BookingResponse {
    id: number;
    assetId: number;
    assetName: string;
    assetType: string;
    requestedById: number;
    requestedByName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    purpose: string;
    headcount: number;
    status: string;
    reviewReason: string;
    createdAt: string;
}

export const bookingService = {
    createBooking: async (request: BookingRequest): Promise<BookingResponse> => {
        const response = await axiosInstance.post<BookingResponse>("/bookings", request);
        return response.data;
    },

    getMyBookings: async (): Promise<BookingResponse[]> => {
        const response = await axiosInstance.get<BookingResponse[]>("/bookings/my");
        return response.data;
    },

    getAllBookings: async (): Promise<BookingResponse[]> => {
        const response = await axiosInstance.get<BookingResponse[]>("/bookings");
        return response.data;
    },

    approveBooking: async (id: number): Promise<BookingResponse> => {
        const response = await axiosInstance.put<BookingResponse>(`/bookings/${id}/approve`);
        return response.data;
    },

    rejectBooking: async (id: number, reason: string): Promise<BookingResponse> => {
        const response = await axiosInstance.put<BookingResponse>(`/bookings/${id}/reject`, { reviewReason: reason });
        return response.data;
    },

    cancelBooking: async (id: number): Promise<BookingResponse> => {
        const response = await axiosInstance.put<BookingResponse>(`/bookings/${id}/cancel`);
        return response.data;
    }
};
