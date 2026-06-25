export interface Lab {
  id: string;
  name: string;
  description: string;
  labType: string;
  capacity: number;
  location: string;
  _count?: {
    equipment: number;
    projects: number;
  };
  equipment?: Equipment[];
  projects?: Project[];
  facultyAdmin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface Equipment {
  id: string;
  labId: string;
  name: string;
  description: string;
  status: string;
  lab?: {
    id: string;
    name: string;
  };
}

export interface Project {
  id: string;
  labId: string;
  authorId: string;
  title: string;
  description: string;
  repoLink?: string;
  lab?: {
    id: string;
    name: string;
  };
  author?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  media?: {
    id: string;
    mediaType: string;
    url: string;
    caption?: string;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
