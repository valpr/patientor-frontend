import { State } from "./state";
import { Patient, Diagnosis, Entry } from "../types";


export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "ADD_ENTRY";
    payload: {
      entry: Entry;
      id: string;
    };
  }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  }
  | {
    type: "UPDATE_PATIENT";
    payload: Patient;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return{
        ...state,
        diagnosis:{
          ...action.payload.reduce((memo,diag) => ({...memo, [diag.code]: diag}),{}
          )
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_ENTRY":
      const patientToChange = state.patients[action.payload.id];
      const changedPatient = {
          ...patientToChange,
          entries: patientToChange.entries.concat(action.payload.entry)
      };
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: changedPatient
        }
      };
    default:
      return state;
  }
};


export const setPatientList = (patientList: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload: patientList,
  };
};

export const setDiagnosisList = (diagnosisList: Diagnosis[]): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload: diagnosisList,
  };
};

export const addPatient = (patient: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload: patient
  };
};

export const updateEntry = (entry: Entry, id: string): Action => {
  return{
    type: "ADD_ENTRY",
    payload: {
      entry: entry,
      id: id
    }
  };

};

export const updatePatient =  (patient: Patient): Action => {
  return {
    type: "UPDATE_PATIENT",
    payload: patient
  };
};
