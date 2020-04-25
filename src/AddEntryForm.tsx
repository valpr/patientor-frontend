import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, EntrySelectField, EntryOption, DiagnosisSelection, NumberField } from "./AddPatientModal/FormField";
import {  FormValues } from "./types";
import { useStateValue } from "./state";
//omit id when submitting new patient




interface Props {
    onSubmit: (values: FormValues) => void;
}
// my thinking on multiple types of entries
//upon choosing a type, render another partial form with relevant fields
const entryOptions: EntryOption[] = [
    {value: "HealthCheck", label: "Health Checkup"},
    {value: "Hospital", label: "Hospital Visit"},
    {value: "OccupationalHealthcare", label: "Occupational Healthcare"}
];
//add diagnosis codes


export const AddEntryForm: React.FC<Props> = ({onSubmit}) => {
    const [{ diagnosis }] = useStateValue();

    return (
        
        <Formik
          initialValues={{
            date:"",
            type: entryOptions[0]["value"],
            specialist: "",
            diagnosisCodes:[],
            description:"",
            employerName:"",
            healthCheckRating:0,
            discharge:{
                start: "",
                criteria: ""
            },
            sickLeave:{
                startDate:"",
                endDate:""
            },
          }}
          onSubmit={onSubmit}
          validate={values => {
            const requiredError = "Field is required";
            const errors: { [field: string]: string } = {};
            if (!values.date) {
              errors.date = requiredError;
            }
            if (!values.specialist) {
              errors.specialist = requiredError;
            }
            if (!values.description) {
              errors.description = requiredError;
            }
            if (values.type === "HealthCheck"){
                if (!values.healthCheckRating){
                    errors.healthCheckRating =  requiredError;
                }
            }else if (values.type ==="OccupationalHealthcare"){
                if (!values.employerName){
                    errors.employerName = requiredError;
                }
            }
            else if (values.type === "Hospital"){
                if (!values.discharge){
                    if (!values.discharge || !values.discharge["start"] ||!values.discharge["criteria"] ){
                        errors.discharge = requiredError;
                    }
                }
            }
            return errors;
          }}
        >
          {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
            return (
              <Form className="form ui">
                <Field
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  name="date"
                  component={TextField}
                />
                <Field
                  label="Specialist"
                  placeholder="Specialist"
                  name="specialist"
                  component={TextField}
                />
                <Field
                  label="Description"
                  placeholder="Description"
                  name="description"
                  component={TextField}
                />

                <DiagnosisSelection 
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    diagnoses= {Object.values(diagnosis)}
                />

                <EntrySelectField
                  label="type"
                  name="type"
                  options={entryOptions}
                />
                {values.type === "HealthCheck" ?
                <Field label="healthCheckRating" name="healthCheckRating" component={NumberField}
                min={0}
                max={3}
                /> : values.type === "OccupationalHealthcare" ?
                <React.Fragment>
                <Field
                  label="Employer"
                  placeholder="Employer"
                  name="employerName"
                  component={TextField}
                />
                <Field
                label="Sick Leave Start Date  (optional)"
                placeholder="Sick Leave Start Date"
                name="startDate"
                component={TextField}/>
                <Field
                label="Sick Leave End Date  (optional)"
                placeholder="Sick Leave End Date"
                name="endDate"
                component={TextField}/>
                </React.Fragment>
                 :
                <React.Fragment>
                    <Field
                    label="Discharge Date"
                    placeholder="YYYY-MM-DD"
                    name="start"
                    component={TextField}
                    />
                    <Field
                    label="Criteria"
                    placeholder="Criteria"
                    name="criteria"
                    component={TextField}
                    />
                </React.Fragment>
                }

                <Grid>
                  {/* <Grid.Column floated="left" width={5}>
                    <Button type="button" onClick={onCancel} color="red">
                      Cancel
                    </Button>
                  </Grid.Column> */}
                  <Grid.Column floated="right" width={5}>
                    <Button
                      type="submit"
                      floated="right"
                      color="green"
                      disabled={!dirty || !isValid}
                    >
                      Add
                    </Button>
                  </Grid.Column>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      );
};

export default AddEntryForm;