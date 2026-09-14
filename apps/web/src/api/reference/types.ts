export interface ReferenceCity {
  id: string;
  name: string;
}

export interface ReferenceClinic {
  id: string;
  cityId: string;
  name: string;
}

export interface ReferenceSpecialty {
  id: string;
  name: string;
}

export interface ReferenceListResponse<T> {
  items: T[];
}
