export interface Lift {
  _id?: string;
  cl?: string;
  driver: {
    name?: string;
    email?: string;
    username: string;
    contact?: string;
    driverRating?: number;
  };
  car: {
    cc: string;
    brand?: string;
    model?: string;
    year?: number;
    color?: string;
    plate?: string;
  };
  startPoint: {
    district: string;
    municipality: string;
    parish: string;
  };
  endPoint: {
    district: string;
    municipality: string;
    parish: string;
  };
  schedule: Date | null;
  price: number;
  providedSeats: number;
  applications?:
    | [
        {
          ca?: string;
          passenger?: {
            name?: string;
            username?: string;
            email?: string;
            contact?: string;
            passengerRating?: number;
          };
          status: string;
          receivedPassengerRating?: number;
        },
      ]
    | [];
  occupiedSeats?: number;
  status?: string;
  receivedDriverRatings?: number[];
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}
