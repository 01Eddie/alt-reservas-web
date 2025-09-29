export interface ReservationList {
    id: number;
    date: string;
    hour: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    roomId: number;
    user: {
        id: number;
        name: string;
        email: string;
        password: string;
        createdAt: string;
        updatedAt: string;
        status: string;
    };
    room: availableRoom;
}

export interface availableRoom {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReservationPayload {
    date: string;
    hour: number;
    roomId: number;
    userId: number;
}

export interface CreateReservationResponse {
    // message: string;
    // reservation: ReservationList;
    id: number;
    date: string;
    hour: number;
    createdAt: string;
    updatedAt: string;
    userId: number;
    roomId: number;
}