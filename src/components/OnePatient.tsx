import React from 'react';
import { Divider, Container, Header, Icon, Segment } from "semantic-ui-react";
import {
    useParams
} from "react-router-dom";
import axios from 'axios';
import { apiBaseUrl } from "../constants";
import { Patient, FormValues, Diagnosis, Entry, HealthCheckEntry, HealthCheckRating, OccupationalHealthcareEntry, HospitalEntry } from '../types';
import { useStateValue } from "../state";
import { updatePatient, setDiagnosisList, updateEntry } from '../state/reducer';
import AddEntryForm from '../AddEntryForm';





const OnePatient: React.FC = () => {
    const [error, setError] = React.useState<string | undefined>();
    const { id } = useParams<{id: string}>();
    const [{ patients, diagnosis }, dispatch] = useStateValue();

    const switchGender = () => {
        switch(patients[id].gender){
                case "male":
                return (
                    <Icon name={"mars"}/>
                );            
                case "female":
                return (
                    <Icon name={"venus"}/>
                );            
                default:
                return (
                    <Icon name={"genderless"}/>
                );
        }
    };

    const validateEntry = (formValues: FormValues   ): Entry | undefined => {
        switch (formValues.type){
            case "HealthCheck":
                if (formValues.healthCheckRating){
                    return {
                        id: "dummy",
                        date: formValues.date,
                        type: formValues.type,
                        specialist: formValues.specialist,
                        description: formValues.description,
                        diagnosisCodes:formValues.diagnosisCodes,
                        healthCheckRating: formValues.healthCheckRating,
                    };
                }
            break;
            case "Hospital":
                if (formValues.discharge){
                    return {
                        id: "dummy",
                        date: formValues.date,
                        type: formValues.type,
                        specialist: formValues.specialist,
                        description: formValues.description,
                        diagnosisCodes:formValues.diagnosisCodes,
                        discharge: {
                            date: formValues.discharge.start,
                            criteria: formValues.discharge.criteria,
                        },  
                    };
                }
                break;
            case "OccupationalHealthcare":
                if (formValues.employerName && formValues.sickLeave){
                    return {
                        id: "dummy",
                        date: formValues.date,
                        type: formValues.type,
                        specialist: formValues.specialist,
                        description: formValues.description,
                        diagnosisCodes:formValues.diagnosisCodes,
                        employerName: formValues.employerName,
                        sickLeave: {
                            startDate: formValues.sickLeave.startDate,
                            endDate: formValues.sickLeave.endDate
                        }
                    };
                }
                else if (formValues.employerName){
                    return {
                        id: "dummy",
                        date: formValues.date,
                        type: formValues.type,
                        specialist: formValues.specialist,
                        description: formValues.description,
                        diagnosisCodes:formValues.diagnosisCodes,
                        employerName: formValues.employerName,
                    };
                }
        }
    };

    const addNewEntry = async (newEntry: FormValues) => {
        const validatedEntry = validateEntry(newEntry);
        try{
            console.log(newEntry);
            if (validatedEntry){
                const {data: newData} = await axios.post(`${apiBaseUrl}/patients/${id}/entries`, validatedEntry);
                dispatch(updateEntry(newData, id));
            }


        }
        catch (error) {
            setError(error);
            setTimeout(()=>setError(''),5000);
        }

        
    };


    const getNewPatient = async () => {
        try{
            const {data: newPatient} = await axios.get<void|Patient>(`${apiBaseUrl}/patients/${id}`);
            if (newPatient){
                dispatch(updatePatient(newPatient));
            }
        }
        catch (error) {
            setError(error);
            setTimeout(()=>setError(''),5000);
        }
    };

    const getDiagnosisData = async () => {
        const {data: newData} = await axios.get<void|Diagnosis[]>(`${apiBaseUrl}/diagnosis`);
        if (newData){
            dispatch(setDiagnosisList(newData));
        }
    };


    if (!patients[id] || !patients[id].ssn){
        try{
            getNewPatient();
            return (
            <div> unable to find id </div>
            );
        } catch (error) {
            return (
                <div>
                    id not found
                </div>
            );
        }

    }
    const length = Object.keys(diagnosis).length;
    if (diagnosis.constructor === Object && length === 0){
        getDiagnosisData();
        return (
            <div>
                getting diagnosis data
            </div>
        );
    }
    const icon = switchGender();


    return(
        <div>
            <Header as="h1">{patients[id].name} {icon}</Header> 
            
            <Container>
                <p>ssn: {patients[id].ssn}</p>
                
                <p>
                occupation:{patients[id].occupation} 
                    </p>
                <Divider/>
                <Header as="h3">Entries:</Header>
                {patients[id].entries.map((entry)=> {            
                    return(
                        
                    <React.Fragment key={`${patients[id].ssn}+${entry.date}`}>
                        <EntryDetails entry={entry}/>
                        <ul>
                    {entry.diagnosisCodes?.map((code)=> <li key={code}>{code} {diagnosis[code].name}</li>) }
                        </ul>
                    </React.Fragment>
                    );
                })}
            {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
            <AddEntryForm onSubmit={addNewEntry}/>
            </Container>
        </div>
    );
};

const assertNever = (value: never): never => {
    throw new Error(
        `unhandled entry type: ${JSON.stringify(value)}`
    );
};
const SwitchHealthScore: React.FC<{score: HealthCheckRating}> = ({score}) => {
    switch (score){
        case 0:
            return <Icon color="green" name="heart"/>;
        case 1:
            return <Icon color="yellow" name="heart"/>;
        case 2:
            return <Icon color="red" name="heart"/>;
        default:
            return <Icon color="grey" name="heart"/>;

    }
};

const HealthCheck: React.FC<{entry: HealthCheckEntry}> = ({ entry }) => {
    return (
        <Segment>
            <Header as={"h2"}>{entry.date} <Icon name="doctor"></Icon></Header>
            <p>{entry.description}</p>
            <SwitchHealthScore score={entry.healthCheckRating}/>
        </Segment>
    );
};

const Hospital: React.FC<{entry: HospitalEntry}> = ({ entry }) => {
    return (
        <Segment>
            <Header as={"h2"}>{entry.date} <Icon name="medkit"></Icon></Header>
            <p>{entry.description}</p>

        </Segment>
    );
};

const Occupational: React.FC<{entry: OccupationalHealthcareEntry}> = ({ entry }) => {
    return (
        <Segment>
            <Header as={"h2"}>{entry.date} <Icon name="stethoscope"></Icon> </Header>
            <p>{entry.description}</p>
            <Icon/>
        </Segment>
    );
};

const EntryDetails: React.FC<{entry: Entry}> = ({ entry }) => {
    switch (entry.type){
        case "HealthCheck":
            return <HealthCheck entry ={entry}/>;
        case "Hospital":
            return <Hospital entry={entry}/>;
        case "OccupationalHealthcare":
            return <Occupational entry={entry}/>;
        default:
            return assertNever(entry);
    }
};


export default OnePatient;