//Interface de departamento
export interface Department {
  _id?: string;
  name: string;
  description: string;
  members?: Member[];
}

//Interface de miembro
export interface Member {
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  superiorId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  subordinateIds: {
    _id: string;
    name: string;
    email: string;
  }[];
}